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
import { getAppBase } from "../utils/utils"
import { dataDir, isDev } from "../Constants"
import { ILogger, simpleLogger } from "zhi-lib-base"
import Bootstrap from "../core/bootstrap"
import { StrUtil } from "zhi-common"
import InvokeUtils from "./invoke/invokeUtils"
import InvokeFactory from "./invoke/invokeFactory"

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
    if (
      item.format !== "cjs" &&
      item.format !== "esm" &&
      item.format !== "js" &&
      item.format !== "py" &&
      item.format !== "java" &&
      item.format !== "go" &&
      item.format !== "php" &&
      item.format !== "cs" &&
      item.format !== "rust" &&
      item.format !== "c" &&
      item.format !== "cpp"
    ) {
      this.logger.warn(`format ${item.format} not supported, skip this lib!`, item.libpath)
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
    let result: any
    switch (item.importType) {
      case "import": {
        if (item.baseType === BasePathTypeEnum.BasePathType_ThisPlugin) {
          lib = InvokeUtils.importPluginLib(item.libpath)
        } else {
          lib = await SiyuanDevice.importJs(item.libpath, item.baseType)
        }
        // 挂载服务
        if (!StrUtil.isEmptyString(item.alias)) {
          this.mountByName(item.alias, lib)
        }
        this.logger.debug(`Importing lib ${item.libpath} with basePath of ${item.baseType} ...`)
        break
      }
      case "require": {
        if (item.baseType === BasePathTypeEnum.BasePathType_ThisPlugin) {
          lib = InvokeUtils.requirePluginLib(item.libpath)
        } else {
          lib = SiyuanDevice.requireLib(item.libpath, item.baseType)
        }
        // 挂载服务
        if (!StrUtil.isEmptyString(item.alias)) {
          this.mountByName(item.alias, lib)
        }
        this.logger.debug(`Requiring lib ${item.libpath} with basePath of ${item.baseType} ...`)
        break
      }
      case "node": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      case "python": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      case "java": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      case "go": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      case "php": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      case "csharp": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      case "rust": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      case "c": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      case "cpp": {
        const invoke = InvokeFactory.createInvoke(item.importType)
        invoke.invoke(item.name, item.libpath, item.initParams)
        break
      }
      default:
        throw new Error(`invoke type ${item.importType} not supported`)
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
      this.logger.debug(`Lib ${item.name} run as background service`)
    }
    this.logger.info(`Success invoke [${item.name}] as [${item.importType}] service`)
  }

  /**
   * 停止单个服务
   *
   * @param item
   */
  private async stop(item: DependencyItem): Promise<void> {}

  /**
   * 挂载某个服务
   *
   * @param alias
   * @param lib
   */
  private mountByName(alias: string, lib: any) {
    const win = SiyuanDevice.siyuanWindow()
    win.zhi.app = win.zhi.app ?? {}
    const mt = win.zhi.app[alias]

    if (!mt) {
      SiyuanDevice.siyuanWindow().zhi.app[alias] = lib
      this.logger.info(`dynamic mount zhi.app.${alias} to window`)
    }
  }
}

export default ServiceManager
