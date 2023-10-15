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
import { SiyuanDevice } from "zhi-device"
import { simpleLogger } from "zhi-lib-base"
import { isDev } from "../Constants"
import { getAppBase, requirePluginLib } from "../utils/utils"

/**
 * zhi主题统一生命周期管理
 *
 * @author terwer
 * @version 0.1.0
 * @since 0.1.0
 */
class Lifecycle {
  private readonly logger
  private APP_JSON_SCHEMA = "app-schema.js"
  private APP_JSON = "app.js"

  constructor() {
    this.logger = simpleLogger("lifecycle", "local-service", isDev)
  }

  /**
   * 加载依赖，核心加载顺序按照下面描述的顺序加载，内部的加载顺序由 order 字段决定，
   * 所有依赖定义在服务根目录的 `service.json`
   *
   * ```
   * 加载顺序如下：
   * 1 核心模块
   * 2 后端模块
   * 3 前端模块
   * 4 第三方库
   * ```
   */
  public async load() {
    const allImports = <DependencyItem[]>[]

    // json-schema 校验

    // json读取
    const basePath = getAppBase()
    const jsonValidatePath = SiyuanDevice.joinPath("libs", "zhi-common-json-validate", "index.cjs")
    const { JsonValidateUtil } = requirePluginLib(jsonValidatePath)

    const appJson = requirePluginLib(this.APP_JSON)
    const appSchemaJson = requirePluginLib(this.APP_JSON_SCHEMA)
    this.logger.debug("appJson =>", appJson)
    this.logger.debug("appSchemaJson =>", appSchemaJson)
    const valiResult = JsonValidateUtil.validateObjectSchema(appSchemaJson, appJson)
    if (!valiResult.valid) {
      throw new Error(
        `${this.APP_JSON} is not valid, error msg: ${valiResult.error ?? "None"}, please check ${this.APP_JSON_SCHEMA}`
      )
    } else {
      this.logger.info(`Success, ${this.APP_JSON} is ok`)
    }

    // 解析json
    // 核心模块
    const cores = appJson.dependencies.core
    const coreModuleImports = await this.loadCoreModules(cores)
    // 后端模块
    const servers = appJson.dependencies.server
    const backendImports = await this.loadBackendModules(servers)
    // 前端模块
    const webs = appJson.dependencies.web
    const frontendImports = await this.loadFrontendModules(webs)
    // 第三方组件
    const vendors = appJson.dependencies.vendor
    const vendorImports = await this.loadVendors(vendors)

    return allImports.concat(coreModuleImports).concat(backendImports).concat(frontendImports).concat(vendorImports)
  }

  /**
   * 加载核心模块
   *
   * @private
   */
  private async loadCoreModules(deps: object[]): Promise<DependencyItem[]> {
    const coreModulesImports: DependencyItem[] = deps.map((dep: object) => {
      const dependency = new DependencyItem()
      dependency.fromJson(dep)
      return dependency
    })

    this.logger.info(`Registered ${coreModulesImports.length} Core modules`)
    return coreModulesImports
  }

  /**
   * 加载后端模块
   *
   * @private
   */
  private async loadBackendModules(deps: object[]): Promise<DependencyItem[]> {
    const backendModulesImports: DependencyItem[] = deps.map((dep: object) => {
      const dependency = new DependencyItem()
      dependency.fromJson(dep)
      return dependency
    })

    this.logger.info(`Registered ${backendModulesImports.length} Backend modules`)
    return backendModulesImports
  }

  /**
   * 加载前端模块
   *
   * @private
   */
  private async loadFrontendModules(deps: object[]): Promise<DependencyItem[]> {
    const frontendModulesImports: DependencyItem[] = deps.map((dep: object) => {
      const dependency = new DependencyItem()
      dependency.fromJson(dep)
      return dependency
    })

    this.logger.info(`Registered ${frontendModulesImports.length} Frontend modules`)
    return frontendModulesImports
  }

  /**
   * 加载第三方库
   *
   * @private
   */
  private async loadVendors(deps: object[]): Promise<DependencyItem[]> {
    const vendorImports: DependencyItem[] = deps.map((dep: object) => {
      const dependency = new DependencyItem()
      dependency.fromJson(dep)
      return dependency
    })

    this.logger.info(`Registered ${vendorImports.length} Vendors`)
    return vendorImports
  }
}

export default Lifecycle
