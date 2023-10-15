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
import Bootstrap from "../core/bootstrap"
import { requirePluginLib } from "../utils/utils"
import { StrUtil } from "zhi-common"

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
   * 样式最低支持版本
   * @private
   */
  private readonly SUPPORTED_THEME_VERSION = "2.7.6"

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
        this.runAs !== DeviceTypeEnum.DeviceType_Siyuan_Widget
      ) {
        this.logger.warn(
          `local service can only run as ${DeviceTypeEnum.DeviceType_Siyuan_MainWin} or ${DeviceTypeEnum.DeviceType_Siyuan_Widget}`
        )
        return
      }

      // 检测内核版本
      const kernelVersion = SiyuanDevice.siyuanWindow().siyuan.config.system.kernelVersion
      const versionPath = SiyuanDevice.joinPath("libs", "zhi-common-version", "index.cjs")
      const { VersionUtil } = requirePluginLib(versionPath)
      if (VersionUtil.lesser(kernelVersion, this.SUPPORTED_THEME_VERSION)) {
        const errMsg = StrUtil.f(
          "Your siyuan-note kernel version {0} is not supported by zhi theme, style will look weird, you must install siyuan-note {1}+ to use zhi-theme",
          kernelVersion,
          this.SUPPORTED_THEME_VERSION
        )
        this.logger.error(errMsg)
        this.kernelApi.pushErrMsg({
          msg: errMsg,
        })
        return
      }

      // 初始化第三方依赖
      // import
      //   browser     esm path: "/[libpath]"
      //   electron    esm path: "/[libpath]"
      //   custom-path X
      //
      // require
      //   browser     X
      //   electron    cjs path: "[abspath][libpath]"
      //   custom-path require-hacker
      const dynamicImports = await Bootstrap.start()
      for (const item of dynamicImports) {
        // 类型校验
        if (item.format !== "esm" && item.format !== "cjs" && item.format !== "js") {
          this.logger.warn("Only esm, cjs supported, skip this lib!", item.libpath)
          continue
        }

        // 运行环境校验
        if (!item.runAs.includes(this.runAs)) {
          this.logger.debug(
            `I'm sorry because current runtime is ${this.runAs}, while lib's define runtime is ${item.runAs}`
          )
          this.logger.warn(`This lib can only run at ${item.runAs}, will skip!Lib is=>${item.libpath}`)
          continue
        }

        this.logger.info(`Loading modules form zhi => ${item.libpath}`)
        let lib
        if (item.importType == "import") {
          lib = await SiyuanDevice.importJs(item.libpath, item.baseType)
          this.logger.debug(`Importing lib ${item.libpath} with basePath of ${item.baseType} ...`)
        } else {
          lib = SiyuanDevice.requireLib(item.libpath, false, item.baseType)
          this.logger.debug(`Requiring lib ${item.libpath} with basePath of ${item.baseType} ...`)
        }
        // 如果有初始化方法，进行初始化
        if (lib) {
          const libObj = lib
          this.logger.debug(`Current ${item.importType} lib ${item.libpath} Obj=>`, typeof libObj)
          if (typeof libObj == "function") {
            await libObj()
            this.logger.info(`Inited ${item.libpath} with default function`)
          } else {
            if (libObj.init) {
              const res = await libObj.init()
              if (res) {
                this.logger.info(`Detected output from ${item.importType} lib ${item.libpath}=>`, res)
              }
              this.logger.info(`Inited ${item.libpath} with init function`)
            } else {
              if (libObj.default) {
                const res = await libObj.default()
                if (res) {
                  this.logger.info(`Detected output from ${item.importType} lib ${item.libpath}=>`, res)
                }
                this.logger.info(`Inited ${item.libpath} with default function`)
              }
              this.logger.info(`No init method for ${item.importType} ${item.libpath}`)
            }
          }
        } else {
          this.logger.debug(`Lib entry is not a function => ${item.importType} ${item.libpath}`, lib)
        }
        this.logger.info(`Success ${item.importType} ${item.libpath}`)
      }
      this.logger.info("local service inited")
      this.hello(this.runAs)
    } catch (e) {
      // const errMsg = "local service load error=>" + e
      // this.kernelApi.pushErrMsg({
      //   msg: errMsg,
      // })
      throw e
    }
  }

  //===================
  // private function
  //===================
  private hello(from: string): void {
    this.logger.info(
      `Hello, this is local service plugin v${pkg.version}, ${pkg.description} by ${pkg.author}! You are from ${from}`
    )
  }
}

export { LocalService }
