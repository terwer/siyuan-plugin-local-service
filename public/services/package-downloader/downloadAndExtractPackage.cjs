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

// constants start
const PRODUCTION_MODE = true
// constants end

// requireLocalNpm start
const requireLocalNpm = (moduleName) => {
  console.log("current node version =>", process.versions.node)
  const path = require("path")
  const zhiCodeNpmPath = process.argv.length >= 3 ? process.argv[2] : process.cwd()
  const zhiCodeNodeModulesPath = path.join(zhiCodeNpmPath, "node_modules")
  const libpath = path.join(zhiCodeNodeModulesPath, moduleName)
  console.log("require local lib =>", libpath)
  return require(`${libpath}`)
}
// requireLocalNpm end

// logger start
if (PRODUCTION_MODE) {
  const originalConsoleLog = console.log
  console.log = () => {}
  console.info = (str, data) => {
    if (str === "\001") {
      originalConsoleLog(data)
    }
  }
  console.warn = () => {}
  console.error = () => {}
}
const logger = console
// logger end

/**
 * 从提供的URL下载和提取软件包
 *
 * @param downloadUrl - 要从中下载软件包的URL
 */
const downloadAndExtractPackage = async (downloadUrl) => {
  try {
    // 使用 pacote 下载和提取软件包
    const pacote = requireLocalNpm("pacote")
    const result = await pacote.tarball(downloadUrl)
    logger.info("Package downloaded and extracted successfully.")
    return result
  } catch (e) {
    logger.error(`Error downloading or extracting the package: ${error}`)
    throw e
  }
}

;(async () => {
  logger.info("downloadAndExtractPackage.cjs =>", process.argv)
  const downloadUrl = process.argv.length >= 4 ? process.argv[3] : process.cwd()
  const result = await downloadAndExtractPackage(downloadUrl)
  logger.info("\001", result)
})()
