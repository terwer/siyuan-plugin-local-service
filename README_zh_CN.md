[English](README.md)

# 本地服务

一个连接思源笔记与本地服务的思源笔记插件

## 最近更新

* [X] 命令统一挂载到 `window.zhi`，其他命令

## 下载并且安装Node

```js
await zhi.npm.checkAndInitNode()
```

## 测试node和npm

```js
// node
await zhi.npm.nodeCmd("-v")
await zhi.npm.nodeVersion()

// npm
await zhi.npm.npmCmd("-v")
await zhi.npm.npmVersion()
```


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
  const options = undefined
  await zhiCmd.executeCommand("node", [`${command}`], options)
  // 'Hello, World!'
  ```

  ```js
  await zhiCmd.executeCommand("python", ["-V"])
  //'Python 3.11.3'
  ```