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

import { InvokeType } from "../../utils/utils"
import IInvoke from "./IInvoke"
import InvokeBase from "./invokeBase"
import NodeInvoke from "./impl/nodeInvoke"
import PythonInvoke from "./impl/PythonIvoke"

/**
 * InvokeFactory 类是一个工厂类，用于创建调用对象
 *
 * @author terwer
 * @since 1.2.0
 */
class InvokeFactory {
  /**
   * 创建一个调用对象
   *
   * @param invokeType - 调用的类型
   * @returns - 返回创建的调用对象
   * @throws  - 如果传入的 invokeType 不支持则抛出错误
   */
  public static createInvoke(invokeType: InvokeType): IInvoke {
    switch (invokeType) {
      case "require":
        throw new Error("bundled service no need invoke")
      case "import":
        throw new Error("bundled service no need invoke")
      case "node":
        return new NodeInvoke()
      case "python":
        return new PythonInvoke()
      default:
        // 对于不支持的类型，抛出异常
        throw new Error(
          `invoke type ${invokeType} not supported, please create invoke implementation and add to InvokeFactory`
        )
    }
  }
}

export default InvokeFactory
