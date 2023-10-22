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

import { getAppBase, getThisPluginName } from "../../utils/utils"
import { SiyuanDevice } from "zhi-device"
import { APP_JSON, isDev } from "../../Constants"
import DependencyItem from "../../models/dependencyItem"
import { simpleLogger } from "zhi-lib-base"

/**
 * 该模块提供了用于执行特定操作的工具函数
 *
 * @author terwer
 * @since 1.2.0
 */
class InvokeUtils {
  private static logger = simpleLogger("invoke-utils", "local-service", isDev)

  /**
   * 加载插件依赖
   *
   * @param path - 相对路径
   */
  public static requirePluginLib(path: string) {
    const basePath = getAppBase()
    const fullpath = SiyuanDevice.joinPath(basePath, path)
    return SiyuanDevice.requireDataLib(fullpath)
  }

  /**
   * 异步读取 json
   *
   * @param jsonFile
   */
  public static async importPluginLib(jsonFile: string) {
    const win = SiyuanDevice.siyuanWindow()
    const path = win.require("path")
    const pluginBase = path.join("/", "plugins", getThisPluginName())
    const { default: data } = await import(SiyuanDevice.joinPath(pluginBase, jsonFile))
    return data
  }

  /**
   * 获取完整的命令路径
   *
   * @param serviceName 服务名称
   * @param entry 入口
   */
  public static async getCommand(serviceName: string, entry?: string) {
    const path = SiyuanDevice.requireNpm("path")

    // 根据 serviceName 查询 app.js 中的定义
    const appJson = this.requirePluginLib(APP_JSON)
    // 解析json
    // 核心模块
    const cores = appJson.dependencies.core
    // 后端模块
    const servers = appJson.dependencies.server
    // 前端模块
    const webs = appJson.dependencies.web
    // 第三方组件
    const vendors = appJson.dependencies.vendor
    const allImports = [].concat(cores).concat(servers).concat(webs).concat(vendors)

    const current = allImports.find((x: DependencyItem) => {
      return x.name === serviceName
    })
    const command = path.join(SiyuanDevice.getRequirePath(entry, current.baseType, getThisPluginName()), entry)
    return command
  }
}

export default InvokeUtils
