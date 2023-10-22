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

import InvokeBase from "../invokeBase"
import { ILogger, simpleLogger } from "zhi-lib-base"
import { isDev } from "../../../Constants"
import InvokeUtils from "../invokeUtils"
import { SiyuanDevice } from "zhi-device"

/**
 * `NodeInvoke` 类扩展自 `InvokeBase`，提供对 Node 服务的调用功能
 *
 * @author terwer
 * @since 1.2.0
 */
class NodeInvoke extends InvokeBase {
  private logger: ILogger

  constructor() {
    super("node")
    this.logger = simpleLogger("node-invoke", "local-service", isDev)
  }

  /**
   * 异步调用指定的服务
   *
   * @param serviceName - 要调用的服务名称
   * @param entry - 服务的入口点
   * @param args - 调用服务时传递的参数
   * @returns 返回服务调用的结果
   */
  public async invoke(serviceName: string, entry: string, args: any[]): Promise<any> {
    this.logger.debug("serviceName=>", serviceName)
    this.logger.debug("entry=>", entry)
    this.logger.debug("args=>", args)
    const command = await InvokeUtils.getCommand(serviceName, entry)
    this.logger.info(`😄准备从以下路径执行 Node 脚本 => ${command}🤔`)
    return await SiyuanDevice.siyuanWindow().zhi.npm.nodeCmd(command, args)
  }
}

export default NodeInvoke
