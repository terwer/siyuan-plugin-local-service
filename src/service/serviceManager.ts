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

import DependencyItem from "../models/dependencyItem"
import { BasePathTypeEnum, DeviceTypeEnum, SiyuanDevice } from "zhi-device"
import { getAppBase, importPluginLib, requirePluginLib } from "../utils/utils"
import { dataDir, isDev } from "../Constants"
import { ILogger, simpleLogger } from "zhi-lib-base"

/**
 * 服务管理器，用于启动和停止多个服务
 *
 * @author terwer
 * @since 1.2.0
 */
class ServiceManager {
  private logger: ILogger
  private readonly runAs: DeviceTypeEnum
  private readonly dynamicImports: DependencyItem[]

  /**
   * 创建一个服务管理器实例
   *
   * @param runAs - 运行环境
   * @param dynamicImports - 动态导入的依赖项数组
   */
  constructor(runAs: DeviceTypeEnum, dynamicImports: DependencyItem[]) {
    this.logger = simpleLogger("service-manager", "local-service", isDev)
    this.dynamicImports = dynamicImports
  }

  /**
   * 启动所有的依赖项
   *
   * @returns {Promise<void>} - 当所有依赖项都成功启动时，返回一个空的 Promise
   */
  public async startAll(): Promise<void> {
    const isEnvReady = await this.checkEnv()
    if (!isEnvReady) {
      this.logger.warn("Environment is not ready, please init env with `await zhi.npm.checkAndInitNode()")
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
    this.logger.info("==================================================")
    this.logger.info("local service detected all imports =>", this.dynamicImports)
    this.logger.info("==================================================")
    for (const item of this.dynamicImports) {
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
      let lib: any
      if (item.importType == "import") {
        if (item.baseType === BasePathTypeEnum.BasePathType_ThisPlugin) {
          lib = importPluginLib(item.libpath)
        } else {
          lib = await SiyuanDevice.importJs(item.libpath, item.baseType)
        }
        this.logger.debug(`Importing lib ${item.libpath} with basePath of ${item.baseType} ...`)
      } else {
        if (item.baseType === BasePathTypeEnum.BasePathType_ThisPlugin) {
          lib = requirePluginLib(item.libpath)
        } else {
          lib = SiyuanDevice.requireLib(item.libpath, item.baseType)
        }
        this.logger.debug(`Requiring lib ${item.libpath} with basePath of ${item.baseType} ...`)
      }
      // 如果有初始化方法，进行初始化
      if (lib) {
        const libObj = lib
        this.logger.debug(`Current ${item.importType} lib ${item.libpath} Obj=>`, typeof libObj)
        // 参数替换
        item.initParams = item.initParams.map((x: any) => {
          if (typeof x === "string") {
            const basePath = getAppBase()
            const absBasePath = SiyuanDevice.joinPath(dataDir, basePath)
            return x.replace(/\[thisPluginBasePath\]/g, absBasePath)
          } else {
            return x
          }
        })
        if (typeof libObj == "function") {
          await libObj(item.initParams)
          this.logger.info(`Inited ${item.libpath} with function, params=>`, item.initParams)
        } else {
          if (libObj.main) {
            const res = await libObj.main(item.initParams)
            if (res) {
              this.logger.info(`Detected output from ${item.importType} lib ${item.libpath}=>`, res)
            }
            this.logger.info(`Inited ${item.libpath} with init function, params=>`, item.initParams)
          } else {
            this.logger.info(`No init method for ${item.importType} ${item.libpath}, try default`)
            if (libObj.default) {
              const res = await libObj.default(item.initParams)
              if (res) {
                this.logger.info(`Detected output from ${item.importType} lib ${item.libpath}=>`, res)
              }
              this.logger.info(`Inited ${item.libpath} with default function, params=>`, item.initParams)
            }
          }
        }
      } else {
        this.logger.debug(`Lib entry is not a function => ${item.importType} ${item.libpath}`, lib)
      }
      this.logger.info(`Success ${item.importType} ${item.libpath}`)
    }
  }

  /**
   * 停止所有的依赖项
   *
   * @returns {Promise<void>} - 当所有依赖项都成功停止时，返回一个空的 Promise
   */
  public async stopAll(): Promise<void> {
    const isEnvReady = await this.checkEnv()
    if (!isEnvReady) {
      this.logger.warn("Environment is not ready, please init env with `await zhi.npm.checkAndInitNode()")
      return
    }
  }

  /**
   * 启动单个依赖项
   *
   * @param importName - 要启动的依赖项名称
   * @returns {Promise<void>} - 当依赖项成功启动时，返回一个空的 Promise
   */
  public async start(importName: string): Promise<void> {
    const isEnvReady = await this.checkEnv()
    if (!isEnvReady) {
      this.logger.warn("Environment is not ready, please init env with `await zhi.npm.checkAndInitNode()")
      return
    }
  }

  /**
   * 停止单个依赖项
   * @param importName - 要停止的依赖项名称
   * @returns {Promise<void>} - 当依赖项成功停止时，返回一个空的 Promise
   */
  public async stop(importName: string): Promise<void> {
    const isEnvReady = await this.checkEnv()
    if (!isEnvReady) {
      this.logger.warn("Environment is not ready, please init env with `await zhi.npm.checkAndInitNode()")
      return
    }
  }

  //===================
  // private function
  //===================
  /**
   * 检测是否有Node.js环境并且其他环境变量是否正确
   *
   * @returns 一个Promise，如果Node.js环境存在且其他环境变量正确，则解析为true，否则解析为false
   */
  private async checkEnv(): Promise<boolean> {
    return true
  }
}

export default ServiceManager
