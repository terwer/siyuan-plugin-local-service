/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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
import dependencyItem from "../models/dependencyItem"
import { BasePathTypeEnum, DeviceTypeEnum, SiyuanDevice } from "zhi-device"
import { getAppBase, getThisPluginName, importPluginLib, requirePluginLib } from "../utils/utils"
import { dataDir, isDev } from "../Constants"
import { ILogger, simpleLogger } from "zhi-lib-base"
import Bootstrap from "../core/bootstrap"

/**
 * 服务管理器，用于启动和停止多个服务
 *
 * @author terwer
 * @since 1.2.0
 */
class ServiceManager {
  private logger: ILogger
  private readonly runAs: DeviceTypeEnum

  /**
   * 创建一个服务管理器实例
   *
   * @param runAs - 运行环境
   */
  constructor(runAs: DeviceTypeEnum) {
    this.logger = simpleLogger("service-manager", "local-service", isDev)
    this.runAs = runAs
  }

  /**
   * 查找所有的服务
   */
  public async findAll(): Promise<DependencyItem[]> {
    return await Bootstrap.start()
  }

  /**
   * 查找某个服务
   *
   * @param serviceName - 要查找的服务名称
   */
  public async findByServiceName(serviceName: string): Promise<DependencyItem> {
    return {} as DependencyItem
  }

  /**
   * 启动所有的服务
   */
  public async startAll(): Promise<void> {
    const dynamicImports = await this.findAll()
    await this.startMany(dynamicImports)
  }

  /**
   * 启动多个服务
   *
   * @param services - 服务列表
   */
  public async startMany(services: dependencyItem[]): Promise<void> {
    const isEnvReady = await this.checkEnv()
    if (!isEnvReady) {
      this.logger.warn("Environment is not ready, please init env with `await zhi.npm.checkAndInitNode()")
      return
    }

    // 启动多个服务
    // import
    //   browser     esm path: "/[libpath]"
    //   electron    esm path: "/[libpath]"
    //   custom-path X
    //
    // require
    //   browser     X
    //   electron    cjs path: "[abspath][libpath]"
    //   custom-path require-hacker
    this.logger.info("====================================================================")
    this.logger.info(`local service plugin detected (${services.length}) services =>`, services)
    this.logger.info("====================================================================")
    for (const item of services) {
      await this.start(item)
    }
  }

  /**
   * 停止所有的服务
   *
   * @returns {Promise<void>} - 当所有服务都成功停止时，返回一个空的 Promise
   */
  public async stopAll(): Promise<void> {
    const isEnvReady = await this.checkEnv()
    if (!isEnvReady) {
      this.logger.warn("Environment is not ready, please init env with `await zhi.npm.checkAndInitNode()")
      return
    }
  }

  /**
   * 根据服务名启动单个服务
   *
   * @param serviceName - 要启动的服务名称
   * @returns {Promise<void>} - 当服务成功启动时，返回一个空的 Promise
   */
  public async startByServiceName(serviceName: string): Promise<void> {
    const isEnvReady = await this.checkEnv()
    if (!isEnvReady) {
      this.logger.warn("Environment is not ready, please init env with `await zhi.npm.checkAndInitNode()")
      return
    }
  }

  /**
   * 根据服务名停止单个服务
   * @param serviceName - 要停止的服务名称
   * @returns {Promise<void>} - 当服务成功停止时，返回一个空的 Promise
   */
  public async stopByServiceName(serviceName: string): Promise<void> {
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

  /**
   * 启动单个服务
   *
   * @param item
   */
  private async start(item: DependencyItem): Promise<void> {
    await this.startWithBundledNode(item)
  }

  /**
   * 使用 Electron 自带的 Node 启动单个服务
   *
   * @param item
   */
  private async startWithBundledNode(item: DependencyItem): Promise<void> {
    // 类型校验
    if (item.format !== "esm" && item.format !== "cjs" && item.format !== "js") {
      this.logger.warn("Only esm, cjs supported, skip this lib!", item.libpath)
      return
    }

    // 运行环境校验
    if (!item.runAs.includes(this.runAs)) {
      this.logger.debug(
        `I'm sorry because current runtime is ${this.runAs}, while lib's define runtime is ${item.runAs}`
      )
      this.logger.warn(`This lib can only run at ${item.runAs}, will skip!Lib is=>${item.libpath}`)
      return
    }

    this.logger.info(`Loading modules form locale service => ${item.libpath}`)
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

  /**
   * 停止单个服务
   *
   * @param item
   */
  private async stop(item: DependencyItem): Promise<void> {}
}

export default ServiceManager
