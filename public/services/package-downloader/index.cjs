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

/**
 * 从提供的URL下载和提取软件包
 *
 * @param downloadUrl - 要从中下载软件包的URL
 * @param extractPath - 解压路径，默认为 app 服务目录
 */
const downloadAndExtractPackage = async (downloadUrl, extractPath) => {
  const logger = window.zhi.logger("index", "package-downloader", false)

  const coreServiceName = "package-downloader"
  const entry = "services/package-downloader/downloadAndExtractPackage.cjs"
  const oargs = [downloadUrl, extractPath ?? window.zhi.device.appServiceFolder()]
  const nodeInvoke = window.zhi.if.createInvoke("node")
  const result = await nodeInvoke.invoke(coreServiceName, entry, oargs)
  if (zhi.common.StrUtil.isEmptyString(result)) {
    logger.warn("result is empty")
  } else {
    if (result.startsWith("success")) {
      logger.info("downloadAndExtractPackage success😄")
    } else if (result.startsWith("skipped")) {
      logger.info("package already downloaded, skipped🤔")
    } else {
      if (result.startsWith("error\\001")) {
        logger.error(result.split("\\001")[1])
      } else {
        logger.error("unknown error =>", result)
      }
    }
  }
}

module.exports = {
  downloadAndExtractPackage,
}
