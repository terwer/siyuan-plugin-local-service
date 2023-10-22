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

import IInvoke from "./IInvoke"
import { InvokeType } from "../../utils/utils"

/**
 * 表示用于执行不同编程语言服务的基础类
 *
 * @author terwer
 * @since 1.2.0
 */
class InvokeBase implements IInvoke {
  private readonly invokeType: InvokeType

  /**
   * 构造一个新的 InvokeBase 实例
   *
   * @param invokeType - 服务的编程语言类型
   */
  constructor(invokeType: InvokeType) {
    this.invokeType = invokeType
  }

  /**
   * 执行指定编程语言服务的方法
   *
   * @param serviceName - 服务名称
   * @param entry - 入口点
   * @param args - 参数数组
   * @returns 执行结果
   */
  public async invoke(serviceName: string, entry: string, args: any[]): Promise<any> {
    // 记录执行日志
    console.log(`Service ${serviceName} 调用 ${this.invokeType} 方法，入口点为 ${entry}`)
    // 返回执行结果
    return {}
  }
}

export default InvokeBase
