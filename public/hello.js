/**
 * 可以使用下面的命令检测 node 是否暗转成功
 *
 * ```
 * await zhi.npm.nodeCmd("-v")
 * ```
 *
 * 或者
 * ```
 * const path = require("path")
 * const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
 * await zhi.npm.nodeCmd("${thisPluginBasePath}/hello.js")
 * ```
 */
class Hello {}

console.log("Hello, World!")
