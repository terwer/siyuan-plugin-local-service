[English](README.md)

# 本地服务

一个连接思源笔记与本地服务的思源笔记插件

1.0.0 已有功能

* [X] 开发者工具控制台执行命令

  ```js
  await npmManager.npmVersion()
  // '9.5.1\n'
  ```

  ```js
  require("cross-spawn")
  // ƒ spawn(command, args, options) {
  ```

  ```js
  require("vue")
  // node:internal/modules/cjs/loader:1085 Uncaught Error: Cannot find module 'vue'
  ```

  ```js
  await npmManager.requireInstall("vue")
  // {TransitionGroup: {…}, compile: ƒ, Transition: ƒ, VueElement: ƒ, createApp: ƒ, …}
  ```

  ```js
  await zhiCmd.getElectronNodeVersion()
  // '18.15.0'
  ```

  ```js
  // [工作空间]
  const workspaceDir = window.siyuan.config.system.workspaceDir
  const basePath = `${workspaceDir}/data/plugins/siyuan-plugin-local-service`
  // 指向您要运行的.js文件
  const command = `${basePath}/hello.js`
  const args = []
  const cwd = undefined
  const result = await zhiCmd.executeCommandWithBundledNodeAsync(command, args, cwd)
  if (result.status) {
    console.log("命令执行成功！😄")
  } else {
    console.error("命令执行失败😭: ", result.msg)
  }
  // 正在执行命令：C:\Users\Terwer\Documents\mydocs\SiyuanWorkspace\test/data/plugins/siyuan-plugin-local-service/hello.js,args=>, options=> {cwd: 'C:\\Program Files\\SiYuan', silent: true}
  // C:\Users\Terwer\Documents\mydocs\SiyuanWorkspace\test\data\plugins\siyuan-plugin-local-service\core\zhi-cmd\index.cjs:482 命令执行日志已保存到文件 => C:\Users\Terwer\electron-command-log.txt
  // VM484:10 命令执行成功！😄
  ```

  ```js
  await zhiCmd.getSystemNodeVersion()
  // 'v18.16.0'
  ```

  ```js
  // [工作空间]
  const workspaceDir = window.siyuan.config.system.workspaceDir
  const basePath = `${workspaceDir}/data/plugins/siyuan-plugin-local-service`
  // 指向您要运行的.js文件
  const command = `${basePath}/hello.js`
  const args = []
  const cwd = undefined
  await zhiCmd.executeCommand("node", [`${command}`], cwd)
  // 'Hello, World!'
  ```

  ```js
  await zhiCmd.executeCommand("python", ["-V"])
  //'Python 3.11.3'
  ```

## 功能特性-TODO

可实现如下功能：

1. 随着思源笔记的启动使用 Electron 内置 Node 自动启动 Node 应用，关闭思源笔记时自动关闭 Node 服务。前置依赖：无。

   使用案例： next.js
2. npm 包安装。前置依赖：本地系统安装好 Node>=18 并且正确配置环境变量。

   可用的 npm 包地址：

   ```bash
   Available zhi node_modules path1 => [工作空间]/node_modules
   Available zhi node_modules path2 => [zhiNpmPath]/node_modules Available zhi node_modules
   path3 => [zhiAppNpmPath]/node_modules 

   备注：
   Mac上 [zhiAppNpmPath]=/Users/[Mac用户名]/Library/Application Support/siyuancommunity
   Windows上 [zhiAppNpmPath]=[用户目录]/siyuancommunity，即：C:\\Users\\Terwer\\AppData\\Roaming\\siyuancommunity
   Linux上 [zhiAppNpmPath]=[用户目录]/siyuancommunity
   ```
   在上面的 npm 的路径下的 npm 可以直接在思源笔记控制台 require 使用。 甚至可以在 require 的时候按需自动安装。

   ```js
   // 假设在上述目录中vue包已经存在
    require("vue")
    // 加上vue包不存在，先安装后require。安装目录是  [zhiAppNpmPath]
    requireInstall("vue")
   ```
3. 执行 shell 命令。前置依赖：本地系统安装好 Node>=18 并且正确配置环境变量。

    1. 随着思源笔记的启动使用本地系统的 Node 自动启动 Node 应用，关闭思源笔记时自动关闭 Node 服务

       使用案例：Nuxt、nocodb
    2. 随着思源笔记的启动调用 java 命令启动 java 服务，关闭思源笔记时自动关闭 java 服务。

       使用案例：Halo
    3. 随着思源笔记的启动调用 docker 命令启动 docker 服务，关闭思源笔记时自动关闭 docker 服务。

       使用案例：nocodb、memos、WordPress、Halo