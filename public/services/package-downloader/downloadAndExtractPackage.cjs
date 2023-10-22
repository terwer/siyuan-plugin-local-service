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
  const fs = require("fs")
  const path = require("path")
  const zhiCodeNpmPath = process.argv.length >= 3 ? process.argv[2] : process.cwd()
  const zhiCodeNodeModulesPath = path.join(zhiCodeNpmPath, "node_modules")
  const libpath = path.join(zhiCodeNodeModulesPath, moduleName)
  if (fs.existsSync(libpath)) {
    console.log("require cached local lib =>", libpath)
  } else {
    // console.log(`${moduleName} npt found, will install from npm =>`, libpath)
    // console.log(`${moduleName} npt found,installed success.`)
    throw new Error(
      `package ${moduleName} not installed, please ,please install packages with await zhi.npm.checkAndInitNode()`
    )
  }
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

const fs = require("fs")
const { pipeline } = require("stream")
const crypto = require("crypto")
const unzipper = requireLocalNpm("unzipper")

/**
 * 从提供的URL下载和提取软件包
 *
 * @param downloadUrl - 要从中下载软件包的URL
 * @param extractPath - 解压目录
 */
const downloadAndExtractPackage = async (downloadUrl, extractPath) => {
  try {
    // 确保解压目录存在
    if (!fs.existsSync(extractPath)) {
      await fs.promises.mkdir(extractPath, { recursive: true })
    }

    // 生成downloadUrl的哈希值
    const hash = crypto.createHash("md5").update(downloadUrl).digest("hex")

    // 检查是否已经存在对应哈希值的软件包
    const packagePath = `${extractPath}/${hash}.zip`

    if (
      await fs.promises
        .access(packagePath)
        .then(() => false)
        .catch(() => true)
    ) {
      // 使用 fetch 下载软件包
      const response = await fetch(downloadUrl)

      if (response.status !== 200) {
        throw new Error("Failed to fetch the archive. Code => " + response.status)
      }

      // 使用 pipeline 处理流，将 response.body 写入文件
      await new Promise((resolve, reject) => {
        const fileWriteStream = fs.createWriteStream(packagePath)
        pipeline(response.body, fileWriteStream, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })

      // 解压下载的软件包
      await new Promise((resolve, reject) => {
        pipeline(fs.createReadStream(packagePath), unzipper.Extract({ path: extractPath }), (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })

      logger.info("Package downloaded and extracted successfully.")
      return "success"
    } else {
      logger.info("Package already exists. Skipping download.")
      return "skipped"
    }
  } catch (e) {
    logger.error(`Error downloading or extracting the package: ${e}`)
    return "error\001" + e.toString()
  }
}

;(async () => {
  logger.info("downloadAndExtractPackage.cjs =>", process.argv)
  const downloadUrl = process.argv.length >= 4 ? process.argv[3] : process.cwd()
  const extractPath = process.argv.length >= 5 ? process.argv[4] : process.cwd()
  const result = await downloadAndExtractPackage(downloadUrl, extractPath)
  logger.info("\001", result)
})()
