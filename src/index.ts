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

import { App, IObject, Plugin } from "siyuan"
import { simpleLogger } from "zhi-lib-base"

import "../index.styl"
import { isDev } from "./Constants"
import { DeviceDetection, SiyuanDevice } from "zhi-device"
import { LocalService } from "./service/localService"

export default class ImporterPlugin extends Plugin {
  private logger

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)

    this.logger = simpleLogger("index", "local-service", isDev)
  }

  async onload() {
    if (!SiyuanDevice.isInSiyuanNewWin() && !SiyuanDevice.isInSiyuanWidget()) {
      console.warn("系统工具插件仅PC客户端可用")
      return
    }
    // 同步记载基础设施
    await this.loadInfra()
    this.loadCmd()
    // 加载服务。这里使用异步来做
    const that = this
    this.loadServices()
      .then(() => {
        that.logger.info("本地服务已正常启动😄")
      })
      .catch((e) => {
        that.logger.info("本地服务服务启动异常😭")
        throw e
      })
    this.logger.info("local service loaded")
  }

  onunload() {
    const win = SiyuanDevice.siyuanWindow()
    win.npmManager = undefined
    win.zhiCmd = undefined
    this.logger.info("local service unloaded")
  }

  //===================
  // private function
  //===================
  private async loadInfra() {
    const win = SiyuanDevice.siyuanWindow()
    const workspaceDir = win?.siyuan.config.system.workspaceDir
    const path = win.require("path")
    const basePath = path.join("data", "plugins", "siyuan-plugin-local-service")
    const infraDir = path.join("libs", "zhi-infra", "index.cjs")
    const initZhiInfra = win.require(path.join(workspaceDir, basePath, infraDir)).default
    const zhiNpmPath = path.join(workspaceDir, basePath, "libs", "zhi-infra", "deps", "npm")
    // 是否修复环境变量
    await initZhiInfra(zhiNpmPath, false)
  }

  private loadCmd() {
    const win = SiyuanDevice.siyuanWindow()
    const workspaceDir = win?.siyuan.config.system.workspaceDir
    const path = win.require("path")
    const basePath = path.join("data", "plugins", "siyuan-plugin-local-service")
    const cmdDir = path.join("libs", "zhi-cmd", "index.cjs")
    const initZhiCmd = win.require(path.join(workspaceDir, basePath, cmdDir)).default
    initZhiCmd()
  }

  private async loadServices() {
    const localService = new LocalService(DeviceDetection.getDevice())
    await localService.init()
  }
}
