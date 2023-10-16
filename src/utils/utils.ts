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

import { SiyuanDevice } from "zhi-device"
import pkg from "./../../package.json"

/**
 * 获取插件路径
 */
export const getAppBase = () => {
  const win = SiyuanDevice.siyuanWindow()
  const path = win.require("path")
  const basePath = path.join("plugins", pkg.name)
  return basePath
}

/**
 * 加载插件依赖
 *
 * @param path - 相对路径
 */
export const requirePluginLib = (path: string) => {
  const basePath = getAppBase()
  const fullpath = SiyuanDevice.joinPath(basePath, path)
  return SiyuanDevice.requireDataLib(fullpath)
}

/**
 * 异步读取 json
 *
 * @param jsonFile
 */
export const importPluginLib = async (jsonFile: string) => {
  const win = SiyuanDevice.siyuanWindow()
  const path = win.require("path")
  const pluginBase = path.join("/", "plugins", pkg.name)
  const { default: data } = await import(SiyuanDevice.joinPath(pluginBase, jsonFile))
  return data
}
