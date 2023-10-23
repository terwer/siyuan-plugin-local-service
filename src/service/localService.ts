/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { DeviceTypeEnum, SiyuanDevice } from "zhi-device"
import { simpleLogger } from "zhi-lib-base"
import { isDev } from "../Constants"
import KernelApi from "../api/kernel-api"
import pkg from "../../package.json"
import { DateUtil, JsonUtil, StrUtil } from "zhi-common"
import ServiceManager from "./serviceManager"
import InvokeFactory from "./invoke/invokeFactory"
import InvokeUtils from "./invoke/invokeUtils"

/**
 * 本地服务通用类
 *
 * @public
 * @author terwer
 * @since 0.1.0
 */
class LocalService {
  private logger
  private readonly kernelApi

  private readonly runAs

  /**
   * 内核最低支持版本
   * @private
   */
  private readonly SUPPORTED_KERNEL_VERSION = "2.8.1"

  /**
   * 本地服务初始化
   *
   * @param runAs - 运行模式
   */
  constructor(runAs: DeviceTypeEnum) {
    this.logger = simpleLogger("local-service", "local-service", isDev)
    this.kernelApi = new KernelApi()

    this.runAs = runAs ?? DeviceTypeEnum.DeviceType_Node
  }

  /**
   * 主流程加载
   */
  public async init(): Promise<void> {
    try {
      this.logger.info(`local service runAs ${this.runAs}`)

      // 平台检测
      if (
        this.runAs !== DeviceTypeEnum.DeviceType_Siyuan_MainWin &&
        this.runAs !== DeviceTypeEnum.DeviceType_Siyuan_RendererWin &&
        this.runAs !== DeviceTypeEnum.DeviceType_Siyuan_Widget
      ) {
        this.logger.warn(
          `local service can only run as ${DeviceTypeEnum.DeviceType_Siyuan_MainWin}, ${DeviceTypeEnum.DeviceType_Siyuan_RendererWin} or ${DeviceTypeEnum.DeviceType_Siyuan_Widget}`
        )
        return
      }

      // 检测内核版本
      const kernelVersion = SiyuanDevice.siyuanWindow().siyuan.config.system.kernelVersion
      const versionPath = SiyuanDevice.joinPath("libs", "zhi-common-version", "index.cjs")
      const { VersionUtil } = InvokeUtils.requirePluginLib(versionPath)
      if (VersionUtil.lesser(kernelVersion, this.SUPPORTED_KERNEL_VERSION)) {
        const errMsg = StrUtil.f(
          "Your siyuan-note kernel version {0} is not supported by local service, style will look weird, you must install siyuan-note {1}+ to use local service plugin",
          kernelVersion,
          this.SUPPORTED_KERNEL_VERSION
        )
        this.logger.error(errMsg)
        await this.kernelApi.pushErrMsg({
          msg: errMsg,
        })
        return
      }

      // win
      const win = SiyuanDevice.siyuanWindow()
      win.zhi = win.zhi ?? {}
      win.zhi.status = win.zhi.status ?? {}

      //  init only once
      if (win.zhi.status.serviceInited) {
        this.logger.warn("local service already inited.skip")
        return
      }

      // 启动服务，后续可配置为是否启动时自动启动服务
      const serviceManager = new ServiceManager(this.runAs)
      // mount sc as serviceManager
      win.zhi.sc = serviceManager

      // mount if as invokeFactory
      win.zhi.if = InvokeFactory

      // mount common
      win.zhi.common = win.zhi.common ?? {}
      win.zhi.common.StrUtil = StrUtil
      win.zhi.common.JsonUtil = JsonUtil
      win.zhi.common.DateUtil = DateUtil

      // mount logger
      win.zhi.logger = simpleLogger

      win.zhi.status.serviceInited = true
      this.logger.info("local service inited😎")

      // 启动服务
      this.logger.info("..................................................................")
      this.logger.info("Try starting services defined in app.js, please wait...")
      this.logger.info("..................................................................")
      await serviceManager.startAll()
      this.hello(this.runAs)
    } catch (e) {
      this.logger.error("Unable to start some services from local service😭 =>", e)
    }
  }

  //===================
  // private function
  //===================
  private hello(from: string): void {
    this.logger.info(`local service v${pkg.version} started success😄`)
  }
}

export { LocalService }
