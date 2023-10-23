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
  private logger: any

  constructor(options: { app: App; id: string; name: string; i18n: IObject }) {
    super(options)

    this.logger = simpleLogger("index", "local-service", isDev)
  }

  async onload() {
    // 加载服务，使用异步来做
    const that = this
    this.logger.info("local service is initializing ...")
    this.loadServices()
      .then(() => {
        that.logger.info("local service has been completed init😊")
      })
      .catch((e) => {
        that.logger.error("the initiation of local service has encountered an error😭", e)
      })
  }

  onunload() {
    const win = SiyuanDevice.siyuanWindow()
    win.npmManager = undefined
    win.zhiCmd = undefined
    this.logger.info("local services have been deactivated.")
  }

  //===================
  // private function
  //===================
  /**
   * 加载服务
   */
  private async loadServices() {
    const localService = new LocalService(DeviceDetection.getDevice())
    await localService.init()
  }
}
