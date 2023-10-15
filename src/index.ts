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

import {App, IObject, Plugin} from "siyuan"
import {simpleLogger} from "zhi-lib-base"

import "../index.styl"
import {isDev} from "./Constants"
import {SiyuanDevice} from "zhi-device"

export default class ImporterPlugin extends Plugin {
  private logger

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)

    this.logger = simpleLogger("index", "demo", isDev)
  }

  async onload() {
    if (!SiyuanDevice.isInSiyuanNewWin() && !SiyuanDevice.isInSiyuanWidget()) {
      console.warn("系统工具插件仅PC客户端可用")
      return
    }
    await this.loadInfra()
    this.loadCmd()
    this.logger.info("local service loaded")
  }

  onunload() {
    this.logger.info("system tool unloaded")
  }

  //===================
  // private function
  //===================
  private async loadInfra() {
    // const siyuanWindow = SiyuanDevice.siyuanWindow()
    // const siyuanRequire = siyuanWindow.require
    // const workspaceDir = siyuanWindow?.siyuan.config.system.workspaceDir
    // const path = siyuanRequire("path")
    // const infraDir = path.join("libs", "zhi-infra", "index.cjs")
    // const toolDir = path.join("data", "plugins", "siyuan-plugin-system-tool")
    // const initZhiInfra = siyuanRequire(path.join(workspaceDir, toolDir, infraDir)).default
    // const zhiNpmPath = path.join(workspaceDir, toolDir, "deps", "npm")
    // await initZhiInfra(zhiNpmPath)
  }

  private async loadCmd() {}
}
