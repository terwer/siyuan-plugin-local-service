[English](README.md)

# 本地服务

<img src="./icon.png" width="160" height="160" alt="icon">

一个连接思源笔记与本地服务的思源笔记插件

## 新手快速体验 -【下版本实现】

```js
await zhi.npm.checkAndInitNode()
await zhi.store.getPackage("python-hello")
await zhi.store.getPackage("local-service-chatgpt")
await zhi.store.getPackage("local-service-nocodb")
zhi.sc.stopAll()
zhi.sc.startAll()
```

打开浏览器访问，或者设置 url 到 webapp 插件

```
http://localhost:3000
http://localhost:8080
```

## 最近更新

- 命令统一挂载到 `window.zhi`

  ```bash
  > zhi
  {
  app:
    pd: {downloadAndExtractPackage},
  cmd: CustomCmd {},
  common: {StrUtil: ƒ, JsonUtil: ƒ, DateUtil: ƒ},
  device: class,
  if: class InvokeFactory,
  logger: (n2, $2, p) => {...},
  npm: NpmPackageManager {...},
  sc: ServiceManager {...}
  status: {serviceInited: true, deviceInited: true, cmdInited: true, infraInited: true}
  }
  ```

- 移除不必要的 `node_modules` 依赖
- 新增 Node 下载以及 npm 依赖安装到 `zhi.npm.checkAndInitNode()`
- 新增服务管理器，并挂载到 `zhi.sc`

```
zhi.sc.findAll()
zhi.sc.findByServiceName(serviceName)
zhi.sc.startAll()
zhi.sc.startMany(services)
zhi.sc.stopAll()
zhi.sc.startByServiceName(serviceName)
zhi.sc.stopByServiceName(serviceName)
```

- 新增服务包下载器，并挂载到 `zhi.app.pd`

```js
await zhi.app.pd.downloadAndExtractPackage(
  "https://ghproxy.com/https://github.com/terwer/siyuan-plugin-publisher/releases/download/v1.17.3/package.zip",
  "/Users/terwer/Downloads"
)
```

- 新增服务调用工厂 InvokeFactory ，并挂载到 `zhi.if`

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

## 命令列表

- 下载并且安装 Node

  ```js
  await zhi.npm.checkAndInitNode()
  ```

  初始化过程如下：

  ```js
  await zhi.npm.checkAndInitNode()
  // [zhi] [2023-10-21 14:42:36] [INFO] [npm-package-manager] Node环境不存在，准备安装Node...
  // 正在执行命令：[thisPluginBasePath]/setup.cjs,args=>v18.18.2,[appSiyuancommunityFolder]/node, options=> {cwd: '[appSiyuancommunityFolder]/node', silent: true}
  // 命令执行日志已保存到文件 => /Users/terwer/electron-command-log.txt
  // [zhi] [2023-10-21 14:42:42] [INFO] [npm-package-manager] Node安装成功！😄
  // [zhi] [2023-10-21 14:42:42] [INFO] [package-helper] dependencies updated successfully at [appSiyuancommunityFolder]/workspace/test/package.json
  // [zhi] [2023-10-21 14:42:42] [INFO] [npm-package-manager] Detected deps.json change.Will install node_module once if needed, please wait...
  // [zhi] [2023-10-21 14:42:42] [INFO] [npm-package-manager] npmCmd options => {cwd: '[appSiyuancommunityFolder]/workspace/test', env: {…}}
  // [zhi] [2023-10-21 14:42:50] [INFO] [npm-package-manager] All node_module installed successfully
  // [zhi] [2023-10-21 14:42:50] [INFO] [npm-package-manager] Package hash updated successfully
  true
  ```

  如果已经初始化，则忽略

  ```js
  await zhi.npm.checkAndInitNode()
  // [zhi] [2023-10-21 14:48:16] [INFO] [npm-package-manager] Node already installed, ignore
  // [zhi] [2023-10-21 14:48:16] [INFO] [package-helper] deps.json hasn't changed since last update, skip
  true
  ```

- 测试 node 和 npm

  测试 `node`

  ```js
  await zhi.npm.nodeCmd("-v")
  // 'v18.18.2'
  await zhi.npm.nodeVersion()
  // 'v18.18.2'
  await zhi.npm.electronNpmVersion()
  // '18.15.0'
  await zhi.npm.systemNpmVersion()
  // 'v18.16.0'

  // 或者
  const path = require("path")
  const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
  await zhi.npm.nodeCmd(`${thisPluginBasePath}/hello.js`)
  // 'Hello, World!'
  ```

  测试 `npm`

  ```js
  await zhi.npm.npmCmd("-v")
  // '9.8.1'
  await zhi.npm.npmVersion()
  // '9.8.1'
  ```

- 其他命令

  安装某个依赖

  ```js
  // 未安装的情况无法依赖
  require("vue")
  // node:internal/modules/cjs/loader:1085 Uncaught Error: Cannot find module 'vue'
  ```

  ```js
  // 安装
  await zhi.npm.npmInstall("vue")
  ```

  ```js
  // 安装并依赖
  const vue = await zhi.npm.requireInstall("vue")
  // {TransitionGroup: {…}, compile: ƒ, Transition: ƒ, VueElement: ƒ, createApp: ƒ, …}
  ```

  使用 Electron 自带的 Node 执行命令

  ```js
  const path = require("path")
  const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
  // 指向您要运行的.js文件
  const command = `${thisPluginBasePath}/hello.js`
  const args = []
  const cwd = undefined
  const result = await zhi.cmd.executeCommandWithBundledNodeAsync(command, args, cwd)
  if (result.status) {
    console.log("命令执行成功！😄")
  } else {
    console.error("命令执行失败😭: ", result.msg)
  }
  // 正在执行命令：/Users/terwer/Documents/mydocs/SiYuanWorkspace/test/data/plugins/siyuan-plugin-local-service/hello.js,args=>, options=> {cwd: '/', silent: true}
  // /Users/terwer/Documents/mydocs/SiYuanWorkspace/test/data/plugins/siyuan-plugin-local-service/libs/zhi-infra/index.cjs:5490 命令执行日志已保存到文件 => /Users/terwer/electron-command-log.txt
  // VM1211:9 命令执行成功！😄
  ```

  使用本地服务安装的 Node 执行命令：

  ```js
  const path = require("path")
  const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
  await zhi.npm.nodeCmd(`${thisPluginBasePath}/hello.js`)
  // 'Hello, World!'
  ```

  使用系统的 Node 执行命令

  ```js
  const path = require("path")
  const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
  // 指向您要运行的.js文件
  const command = `${thisPluginBasePath}/hello.js`
  const args = []
  const options = undefined
  await zhi.cmd.executeCommand("node", [`${command}`], options)
  // 'Hello, World!'
  ```

  使用系统的 Python 执行命令

  ```js
  await zhi.cmd.executeCommand("python", ["-V"])
  //'Python 3.11.4'
  ```

- 服务命令

```js
await zhi.app.pd.downloadAndExtractPackage(
  "https://ghproxy.com/https://github.com/terwer/siyuan-plugin-publisher/releases/download/v1.17.3/package.zip"
)
await zhi.app.pd.downloadAndExtractPackage(
  "https://ghproxy.com/https://github.com/terwer/siyuan-plugin-publisher/releases/download/v1.17.3/package.zip",
  "/Users/terwer/Downloads"
)
```

或者

```js
const path = require("path")
const thisPluginBasePath = path.join(window.siyuan.config.system.dataDir, "plugins", "siyuan-plugin-local-service")
const command = `${thisPluginBasePath}/services/package-downloader/index.cjs`
await zhi.npm.nodeCmd(command)
```

或者工厂方式调用

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

## 服务参数解释

```js
const initParams = ["[thisPluginBasePath]", true]

const initParams = [
  "PORT=8888",
  "NC_DB=sqlite3:///?database[eq][siyuanDataDir]/storage/services/[thisServiceName]/noco.db",
]
```

可用占位符

- `[thisPluginBasePath]` - 本地服务插件根目录，例如：/Users/terwer/Documents/mydocs/SiYuanWorkspace/test/data/plugins/siyuan-plugin-local-service

- `[eq]` - "=" 符号

- `[siyuanDataDir]` - 思源笔记数据目录，例如：/Users/terwer/Documents/mydocs/SiYuanWorkspace/test/data

- `[thisServiceBasePath]` - 当前服务的根目录，例如：/Users/terwer/Library/Application Support/siyuancommunity/workspace/test/apps/local-service-nocodb

- `[thisServiceName]` - 当前服务的根目录，例如：local-service-nocodb

例子

```js
const nodeInvoke = zhi.if.createInvoke("node")
const args = [
  "PORT=8888",
  "NC_DB=sqlite3:///?database[eq][siyuanDataDir]/storage/services/[thisServiceName]/noco.db",
]
await nodeInvoke.invoke("local-service-nocodb", "local-service-nocodb/index.js", args)
```

