[中文](README_zh_CN.md)

# siyuan-plugin-local-service

A plugin for connecting SiYuan notes with local services.

v1.0.0 - Current Features

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

## Features - TODO

The following features can be implemented:

1. Automatically start a Node application with Electron when SiYuan notes are launched and shut down the Node service when SiYuan notes are closed. Prerequisite: None.

   Use case: Next.js
2. npm package installation. Prerequisite: Local system with Node>=18 installed and environment variables configured correctly.

   Available npm package paths:

   ```bash
   Available zhi node_modules path1 => [Workspace]/node_modules
   Available zhi node_modules path2 => [zhiNpmPath]/node_modules Available zhi node_modules
   path3 => [zhiAppNpmPath]/node_modules 

   Note:
   On Mac, [zhiAppNpmPath]=/Users/[MacUsername]/Library/Application Support/siyuancommunity
   On Windows, [zhiAppNpmPath]=[UserProfile]/siyuancommunity, i.e., C:\\Users\\Terwer\\AppData\\Roaming\\siyuancommunity
   On Linux, [zhiAppNpmPath]=[UserProfile]/siyuancommunity
   ```
   The npm in the paths above can be required directly in the SiYuan notes console. It can even be automatically installed on-demand during require.

   ```js
   // Assuming the vue package is already present in the above directory
    require("vue")
    // If the vue package is missing, install it first and then require. Installation directory is [zhiAppNpmPath]
    requireInstall("vue")
   ```
3. Execute shell commands. Prerequisite: Local system with Node>=18 installed and environment variables configured correctly.

    1. Automatically start a Node application with the local system when SiYuan notes are launched and shut down the Node service when SiYuan notes are closed.

       Use case: Nuxt, nocodb
    2. Call the java command to start a Java service when SiYuan notes are launched and shut down the Java service when SiYuan notes are closed.

       Use case: Halo
    3. Call the docker command to start a Docker service when SiYuan notes are launched and shut down the Docker service when SiYuan notes are closed.

       Use case: nocodb, memos, WordPress, Halo