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
import { ILogger, simpleLogger } from "zhi-lib-base"
import { isDev } from "../Constants"
import { getAppBase, requireCoreService } from "../utils/utils"

/**
 * 实用程序类，用于下载和提取软件包
 */
class PackageDownloader {
  private logger: ILogger

  constructor() {
    this.logger = simpleLogger("package-downloader", "local-service", isDev)
  }

  /**
   * 从提供的URL下载和提取软件包
   *
   * @param downloadUrl - 要从中下载软件包的URL
   * @returns 一个Promise，在软件包下载和提取完成时解析
   */
  public async downloadAndExtractPackage(downloadUrl: string): Promise<void> {
    try {
      const coreServiceName = "package-downloader"
      const entry = "downloadAndExtractPackage.cjs"
      const oargs = [downloadUrl]
      const result = await requireCoreService(coreServiceName, entry, oargs)
      this.logger.info("downloadAndExtractPackage result =>", result)
    } catch (e) {
      throw e
    }
  }
}

export default PackageDownloader
