[中文](README_zh_CN.md)

# siyuan-plugin-local-service

A plugin for connecting SiYuan notes with local services.

v1.0.0 Features

* [X] Developer tool console commands

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
  // [Workspace]
  const workspaceDir = window.siyuan.config.system.workspaceDir
  const basePath = `${workspaceDir}/data/plugins/siyuan-plugin-local-service`
  // Point to the .js file you want to run
  const command = `${basePath}/hello.js`
  const args = []
  const cwd = undefined
  const result = await zhiCmd.executeCommandWithBundledNodeAsync(command, args, cwd)
  if (result.status) {
    console.log("Command executed successfully! 😄")
  } else {
    console.error("Command execution failed 😭: ", result.msg)
  }
  // Executing command: C:\Users\Terwer\Documents\mydocs\SiyuanWorkspace\test/data/plugins/siyuan-plugin-local-service/hello.js, args=>, options=> {cwd: 'C:\\Program Files\\SiYuan', silent: true}
  // C:\Users\Terwer\Documents\mydocs\SiyuanWorkspace\test/data/plugins/siyuan-plugin-local-service/core/zhi-cmd/index.cjs:482 Command execution log saved to file => C:\Users\Terwer\electron-command-log.txt
  // Command executed successfully! 😄
  ```

  ```js
  await zhiCmd.getSystemNodeVersion()
  // 'v18.16.0'
  ```

  ```js
  // [Workspace]
  const workspaceDir = window.siyuan.config.system.workspaceDir
  const basePath = `${workspaceDir}/data/plugins/siyuan-plugin-local-service`
  // Point to the .js file you want to run
  const command = `${basePath}/hello.js`
  const args = []
  const cwd = undefined
  await zhiCmd.executeCommand("node", [`${command}`], cwd)
  // 'Hello, World!'
  ```

  ```js
  await zhiCmd.executeCommand("python", ["-V"])
  // 'Python 3.11.3'
  ```