[中文](README_zh_CN.md)

# siyuan-plugin-local-service

<img src="./icon.png" width="160" height="160" alt="icon">

a plugin for connecting siyuan-note with local services

> View all commands: 'windos.zhi'

## Recent Updates

* Commands are now unified under `window.zhi`.

```bash
> zhi
{
  app: 
    pd: {downloadAndExtractPackage},
  cmd: CustomCmd {},
  device: class,
  if: class InvokeFactory,
  logger: (n2, $2, p) => {...},
  npm: NpmPackageManager {...},
  pd: PackageDownloader {...},
  sc: ServiceManager {...}
  status: {deviceInited: true, cmdInited: true, infraInited: true},
}
```

* Unnecessary `node_modules` dependencies have been removed.

* Added Node download and npm dependency installation via `zhi.npm.checkAndInitNode()`.

* Added a service manager and mount it to `zhi.sc`

```
zhi.sc.findAll()
zhi.sc.findByServiceName(serviceName)
zhi.sc.startAll()
zhi.sc.startMany(services)
zhi.sc.stopAll()
zhi.sc.startByServiceName(serviceName)
zhi.sc.stopByServiceName(serviceName)
```

* Add a service package downloader and mount it to `zhi.app.pd`

```js
await zhi.app.pd.downloadAndExtractPackage(
  "https://ghproxy.com/https://github.com/terwer/siyuan-plugin-publisher/releases/download/v1.17.3/package.zip",
  "/Users/terwer/Downloads"
)
```

- Add service call factory InvokeFactory and mount to `zhi.if`

```js
const nodeInvoke = zhi.if.createInvoke("node")
const args = [
  "https://ghproxy.com/https://github.com/terwer/siyuan-plugin-publisher/releases/download/v1.17.3/package.zip",
  "/Users/terwer/Downloads",
]
await nodeInvoke.invoke("package-downloader", "services/package-downloader/downloadAndExtractPackage.cjs", args)
```

```js
// python invokde
const pythonInvode = zhi.if.createInvoke("python")
const args = []
await pythonInvode.invoke("python-hello", "services/python-hello/hello.py", args)
```

## Command List

* Download and install Node

```js
await zhi.npm.checkAndInitNode()
```

Initialization process:

```js
await zhi.npm.checkAndInitNode()
// [zhi] [2023-10-21 14:42:36] [INFO] [npm-package-manager] Node environment doesn't exist, preparing to install Node...
// Executing command: [thisPluginBasePath]/setup.cjs, args => v18.18.2, [appSiyuancommunityFolder]/node, options => {cwd: '[appSiyuancommunityFolder]/node', silent: true}
// Command execution log has been saved to the file => /Users/terwer/electron-command-log.txt
// [zhi] [2023-10-21 14:42:42] [INFO] [npm-package-manager] Node installation successful! 😄
// [zhi] [2023-10-21 14:42:42] [INFO] [package-helper] Dependencies updated successfully at [appSiyuancommunityFolder]/workspace/test/package.json
// [zhi] [2023-10-21 14:42:42] [INFO] [npm-package-manager] Detected deps.json change. Will install node_module once if needed, please wait...
// [zhi] [2023-10-21 14:42:42] [INFO] [npm-package-manager] npmCmd options => {cwd: '[appSiyuancommunityFolder]/workspace/test', env: {…}}
// [zhi] [2023-10-21 14:42:50] [INFO] [npm-package-manager] All node_module installed successfully
// [zhi] [2023-10-21 14:42:50] [INFO] [npm-package-manager] Package hash updated successfully
true
```

If already initialized, it's ignored:

```js
await zhi.npm.checkAndInitNode()
// [zhi] [2023-10-21 14:48:16] [INFO] [npm-package-manager] Node already installed, ignore
// [zhi] [2023-10-21 14:48:16] [INFO] [package-helper] deps.json hasn't changed since the last update, skip
true
```

* Test Node and npm

Test `node`:

```js
await zhi.npm.nodeCmd("-v")
// 'v18.18.2'
await zhi.npm.nodeVersion()
// 'v18.18.2'
await zhi.npm.electronNpmVersion()
// '18.15.0'
await zhi.npm.systemNpmVersion()
// 'v18.16.0'
```

Or:

```js
const path = require("path")
const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
await zhi.npm.nodeCmd(`${thisPluginBasePath}/hello.js`)
// 'Hello, World!'
```

Test `npm`:

```js
await zhi.npm.npmCmd("-v")
// '9.8.1'
await zhi.npm.npmVersion()
// '9.8.1'
```

* Other Commands

Install a dependency:

```js
// Cannot require if not installed
require("vue")
// node:internal/modules/cjs/loader:1085 Uncaught Error: Cannot find module 'vue'
```

Install:

```js
await zhi.npm.npmInstall("vue")
```

Install and require:

```js
const vue = await zhi.npm.requireInstall("vue")
```

Use Electron's built-in Node to execute commands:

```js
const path = require("path")
const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
// Point to the .js file you want to run
const command = `${thisPluginBasePath}/hello.js`
const args = []
const cwd = undefined
const result = await zhi.cmd.executeCommandWithBundledNodeAsync(command, args, cwd)
```

Use locally installed Node to execute commands:

```js
const path = require("path")
const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
await zhi.npm.nodeCmd(`${thisPluginBasePath}/hello.js`)
```

Use the system's Node to execute commands:

```js
const path = require("path")
const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
// Point to the .js file you want to run
const command = `${thisPluginBasePath}/hello.js`
const args = []
const options = undefined
await zhi.cmd.executeCommand("node", [`${command}`], options)
```

Use the system's Python to execute commands:

```js
await zhi.cmd.executeCommand("python", ["-V"])
// 'Python 3.11.4'
```

* Service command

```js
await zhi.pd.downloadAndExtractPackage("https://ghproxy.com/https://github.com/terwer/siyuan-plugin-publisher/releases/download/v1.17.3/package.zip")
await zhi.pd.downloadAndExtractPackage(
    "https://ghproxy.com/https://github.com/terwer/siyuan-plugin-publisher/releases/download/v1.17.3/package.zip",
    "/Users/terwer/Downloads"
)
```

or

```js
const path = require("path")
const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
const command = `${thisPluginBasePath}/services/package-downloader/index.cjs`
await zhi.npm.nodeCmd(command)
```

or factory mode call

```js
const nodeInvoke = zhi.if.createInvoke("node")
const args = [
  "https://ghproxy.com/https://github.com/terwer/siyuan-plugin-publisher/releases/download/v1.17.3/package.zip",
  "/Users/terwer/Downloads",
]
await nodeInvoke.invoke("package-downloader", "services/package-downloader/downloadAndExtractPackage.cjs", args)
```

```js
// python invokde
const pythonInvode = zhi.if.createInvoke("python")
const args = []
await pythonInvode.invoke("python-hello", "services/python-hello/hello.py", args)
```
