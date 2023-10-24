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
import { getAppBase } from "./utils"
import { SiyuanDevice } from "zhi-device"
import { dataDir } from "../Constants"

/**
 * 实用工具类，用于解析环境变量和参数
 *
 * @remarks
 * 该工具类提供了用于解析环境变量和参数的功能。
 *
 * @example
 * const env = EnvUtils.parseArgs(process.argv, "myServiceName");
 *
 * @public
 */
class EnvUtils {
  /**
   * 解析参数数组，提取环境变量和当前工作目录
   *
   * @param {string[]} args - 包含参数和环境变量的数组
   * @param serviceName - 服务名
   * @returns {Object} - 解析结果，包括当前工作目录和环境变量对象
   * @public
   */
  public static parseArgs(
    args: string[],
    serviceName: string
  ): {
    /**
     * 当前工作目录
     */
    cwd: string | undefined
    /**
     * 环境变量对象
     */
    env: { [key: string]: any }
    /**
     * 剩余参数
     */
    oargs: string[]
  } {
    let cwd: string | undefined
    const env: { [key: string]: any } = {}
    const oargs: string[] = []

    for (const arg of args) {
      // 提取参数
      if (typeof arg === "string" && arg.includes("=")) {
        const [key, rawValue] = arg.split("=")
        // 替换环境变量
        const value = this.replaceEnvParameters(rawValue, serviceName)

        if (key === "CWD") {
          cwd = value
        } else {
          env[key] = value
        }
      } else {
        // 替换环境变量
        const rawValue = arg
        const value = this.replaceEnvParameters(rawValue, serviceName)
        oargs.push(value)
      }
    }

    return { cwd, env, oargs }
  }

  //===================
  // private function
  //===================
  /**
   * 替换环境参数并返回新字符串
   *
   * @param param - 要替换环境参数的字符串
   * @param serviceName - 服务名
   * @public
   */
  private static replaceEnvParameters(param: any, serviceName: string): string {
    // 非字符串不处理
    if (typeof param !== "string") {
      return param
    }

    let newParam = param

    // 替换 [thisPluginBasePath] 为应用基础路径
    const absBasePath = SiyuanDevice.joinPath(dataDir, getAppBase())
    newParam = newParam.replace(/\[thisPluginBasePath]/g, absBasePath)

    // 替换 [eq] 为等号
    newParam = newParam.replace(/\[eq]/g, "=")

    // [siyuanDataDir]
    newParam = newParam.replace(/\[siyuanDataDir]/g, dataDir)

    // [thisServiceBasePath]
    newParam = newParam.replace(
      /\[thisServiceBasePath]/g,
      SiyuanDevice.joinPath(SiyuanDevice.appServiceFolder(), serviceName)
    )

    // [thisServiceName]
    newParam = newParam.replace(/\[thisServiceName]/g, serviceName)

    return newParam
  }
}

export default EnvUtils
