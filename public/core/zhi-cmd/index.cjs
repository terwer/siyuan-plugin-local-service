"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// ../zhi-device/dist/index.js
var P = Object.defineProperty;
var g = (a, e, t) => e in a ? P(a, e, { enumerable: true, configurable: true, writable: true, value: t }) : a[e] = t;
var r = (a, e, t) => (g(a, typeof e != "symbol" ? e + "" : e, t), t);
var p = class {
  /**
   * 检测是否运行在Chrome插件中
   */
  static isInChromeExtension() {
    return p.isInBrowser ? window.location.href.indexOf("chrome-extension://") > -1 : false;
  }
  /**
   * 复制网页内容到剪贴板
   *
   * @param text - 待复制的文本
   */
  static async copyToClipboardInBrowser(e) {
    if (navigator && navigator.clipboard)
      await navigator.clipboard.writeText(e);
    else {
      const t = document.createElement("input");
      t.style.position = "fixed", t.style.opacity = "0", t.value = e, document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t);
    }
  }
};
var n = p;
r(n, "isNode", typeof process < "u" && process.versions != null && process.versions.node != null), /**
* 是否在浏览器环境
*/
r(n, "isInBrowser", typeof window < "u" && typeof document < "u"), /**
* 浏览器路径分隔符
*/
r(n, "BrowserSeparator", "/"), /**
* 是否是Electron环境
*/
r(n, "isElectron", () => typeof process < "u" && process.versions != null && process.versions.electron != null), /**
* 是否有Node环境，目前包括 Electron 和 Node
*/
r(n, "hasNodeEnv", () => p.isElectron() || p.isNode), /**
* 通用的从 url 中获取获取参数的方法，优先获取查询参数，然后获取 hash 参数与
*
* @param key - 参数
* @author terwer
* @version 0.9.0
* @since 0.0.1
*/
r(n, "getQueryParam", (e) => {
  if (!p.isInBrowser)
    return "";
  const t = window.location.href, i = t.indexOf("?");
  if (i !== -1) {
    const o = t.indexOf("#", i), w2 = o !== -1 ? t.substring(i + 1, o) : t.substring(i + 1), m = new URLSearchParams(w2).get(e);
    if (m)
      return m;
  }
  const s = t.indexOf("#");
  if (s !== -1) {
    const o = t.substring(s + 1), l = new URLSearchParams(o).get(e);
    if (l)
      return l;
  }
  return "";
}), /**
* 替换 URL 的参数
* 思路：
* 1. 使用了 URLSearchParams 对象来解析和构建 URL 查询参数。
*
* 2. 在处理包含 hash 片段的 URL 时使用了 split 函数将 URL 分成两部分：基本 URL 和 hash 片段。
*
* 3. 然后，再次使用 split 函数将基本 URL 分成两部分：路径和查询参数。
*
* 4. 将查询参数转换为 URLSearchParams 对象，然后设置指定的参数名和值。
*
* 5. 最后，使用 toString 函数将查询参数转换为字符串，并将其与路径组合成新的基本 URL。如果 URL 包含 hash 片段，则将其添加到新的基本 URL 中。
*
* @param url - 链接地址
* @param paramName - 参数名
* @param paramValue - 参数值
*/
r(n, "replaceUrlParam", (e, t, i) => {
  i == null && (i = "");
  const s = new RegExp("\\b(" + t + "=).*?(&|#|$)");
  if (e.search(s) >= 0)
    return e.replace(s, "$1" + i + "$2");
  const [o, w2] = e.split("#"), [l, m] = o.split("?"), y = new URLSearchParams(m);
  y.set(t, i);
  const f = y.toString(), b = l + (f ? "?" + f : "");
  return w2 ? b + "#" + w2 : b;
}), /**
* 设置url参数
*
* @param urlstring - url
* @param key - key
* @param value - value
*/
r(n, "setUrlParameter", (e, t, i) => {
  if (e.includes(t))
    return p.replaceUrlParam(e, t, i);
  const s = e.split("#");
  let o = s[0];
  const w2 = s[1];
  return o.includes("?") ? o += `&${t}=${i}` : o += `?${t}=${i}`, w2 && (o += "#" + w2), o;
}), /**
* 重新加载指定tab
*
* @param tabname - tabname
* @param t - 延迟时间
*/
r(n, "reloadTabPage", (e, t) => {
  setTimeout(function() {
    if (p.isInBrowser) {
      const i = window.location.href;
      window.location.href = p.setUrlParameter(i, "tab", e);
    }
  }, t ?? 200);
}), /**
* 刷新当前tab页面
*
* @param t - 延迟时间
*/
r(n, "reloadPage", (e) => {
  setTimeout(function() {
    p.isInBrowser && window.location.reload();
  }, e ?? 200);
}), /**
* 刷新当前tab页面
*
* @param msg - 消息提示
* @param cb - 回调
* @param t - 延迟时间
*/
r(n, "reloadPageWithMessageCallback", (e, t, i) => {
  t && t(e), setTimeout(function() {
    p.isInBrowser && window.location.reload();
  }, i ?? 200);
});
var h = /* @__PURE__ */ ((a) => (a.BasePathType_Appearance = "Appearance", a.BasePathType_Data = "Data", a.BasePathType_Themes = "Themes", a.BasePathType_ZhiTheme = "ZhiTheme", a.BasePathType_None = "None", a))(h || {});
var c = class {
  /**
   * 检测是否运行在思源打开的浏览器中
   */
  static isInSiyuanBrowser() {
    return n.isInBrowser ? typeof window.siyuan < "u" && typeof window.Lute < "u" : false;
  }
  /**
   * 思源笔记 window 对象
   */
  static siyuanWindow() {
    let e;
    return this.isInSiyuanWidget() ? e = parent.window : this.isInSiyuanNewWin() || this.isInSiyuanBrowser() || typeof window < "u" ? e = window : e = void 0, e;
  }
  // =========================
  // require end
  // =========================
  // =========================
  // import start
  // =========================
  /**
   * 引入json
   *
   * @param jsPath - js相对路径全路径
   * @param type - 类型
   */
  static async importJs(e, t) {
    let i = e;
    switch (t) {
      case h.BasePathType_Appearance:
        i = this.browserJoinPath(this.siyuanAppearanceRelativePath(), e);
        break;
      case h.BasePathType_Data:
        i = this.browserJoinPath(this.siyuanDataRelativePath(), e);
        break;
      case h.BasePathType_Themes:
        i = this.browserJoinPath(this.siyuanThemeRelativePath(), e);
        break;
      case h.BasePathType_ZhiTheme:
        i = this.browserJoinPath(this.zhiThemeRelativePath(), e);
        break;
      default:
        throw new Error("type must be provided");
    }
    const { default: s } = await import(
      /* @vite-ignore */
      i
    );
    return s;
  }
  /**
   * 引入json
   *
   * @param jsonPath - json相对路径全路径
   * @param type - 类型
   */
  // public static async importJson(jsonPath: string, type: BasePathTypeEnum) {
  //   let fullJsonPath = jsonPath
  //   switch (type) {
  //     case BasePathTypeEnum.BasePathType_Appearance:
  //       fullJsonPath = this.browserJoinPath(this.siyuanAppearanceRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Data:
  //       fullJsonPath = this.browserJoinPath(this.siyuanDataRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_Themes:
  //       fullJsonPath = this.browserJoinPath(this.siyuanThemeRelativePath(), jsonPath)
  //       break
  //     case BasePathTypeEnum.BasePathType_ZhiTheme:
  //       fullJsonPath = this.browserJoinPath(this.zhiThemeRelativePath(), jsonPath)
  //       break
  //     default:
  //       throw new Error("type must be provided")
  //   }
  //
  //   const { default: data } = await import(/* @vite-ignore */ fullJsonPath, { assert: { type: "json" } })
  //   return data
  // }
  /**
   * 引入 json - 以 data 为基本路径
   *
   * @param jsonPath - 相对于 data 的相对路径
   */
  // public static async importDataJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Data)
  // }
  /**
   * 引入 json - 以 appearance 为基本路径
   *
   * @param jsonPath - 相对于 appearance 的相对路径
   */
  // public static async importAppearanceJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Appearance)
  // }
  /**
   * 引入 json - 以 themes 为基本路径
   *
   * @param jsonPath - 相对于 themes 的相对路径
   */
  // public static async importThemesJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_Themes)
  // }
  /**
   * 引入 zhi 主题的 json - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsonPath - 相对于 zhi 主题根路径的相对路径
   */
  // public static async importZhiThemeJson(jsonPath: string) {
  //   return await this.importJson(jsonPath, BasePathTypeEnum.BasePathType_ZhiTheme)
  // }
  /**
   * 引入 zhi 主题的 js - 以 zhi 主题 的根路径为基本路径
   *
   * @param jsPath - 相对于 zhi 主题根路径的相对路径
   */
  static async importZhiThemeJs(e) {
    return await this.importJs(e, h.BasePathType_ZhiTheme);
  }
  // =========================
  // import start
  // =========================
  /**
   * 路径拼接
   *
   * @param paths - 路径数组
   */
  static joinPath(...e) {
    if (n.hasNodeEnv()) {
      const t = this.requireLib("path");
      if (t)
        return t.join(...e);
    }
    return this.browserJoinPath(...e);
  }
  static browserJoinPath(...e) {
    return e.join(n.BrowserSeparator);
  }
  /**
   * 思源笔记 conf 目录
   */
  static siyuanConfPath() {
    const e = this.siyuanWindow();
    if (!e)
      throw new Error("Not in siyuan env");
    return e.siyuan.config.system.confDir;
  }
  /**
   * 思源笔记 data 目录
   */
  static siyuanDataPath() {
    const e = this.siyuanWindow();
    if (!e)
      throw new Error("Not in siyuan env");
    return e.siyuan.config.system.dataDir;
  }
  /**
   * 思源笔记 data 目录-相对路径
   */
  static siyuanDataRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return "";
  }
  /**
   * 思源笔记 appearance 目录
   */
  static siyuanAppearancePath() {
    return this.joinPath(this.siyuanConfPath(), "appearance");
  }
  /**
   * 思源笔记 appearance 目录-相对路径
   */
  static siyuanAppearanceRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance");
  }
  /**
   * 思源笔记 themes 目录-绝对路径
   *
   * 注意: 如果是非 electron 和 Node 环境，这里返回的是浏览器的路径，不是物理路径
   * 如果使用物理路径，请调用 siyuanAppearancePath 或者 siyuanDataPath
   *
   * @author terwer
   * @since 0.1.0
   */
  static siyuanThemePath() {
    if (n.hasNodeEnv())
      return this.joinPath(this.siyuanAppearancePath(), "themes");
    {
      const e = this.siyuanWindow();
      if (!e)
        throw new Error("Not in siyuan env");
      return this.joinPath(e.location.origin, "appearance", "themes");
    }
  }
  /**
   * 思源笔记 themes 目录-相对路径
   */
  static siyuanThemeRelativePath() {
    if (!this.siyuanWindow())
      throw new Error("Not in siyuan env");
    return this.browserJoinPath("", "appearance", "themes");
  }
  /**
   * zhi 主题目录 - 绝对路径
   */
  static zhiThemePath() {
    return this.joinPath(this.siyuanThemePath(), "zhi");
  }
  /**
   * zhi 主题目录 - 相对路径
   */
  static zhiThemeRelativePath() {
    return this.browserJoinPath(this.siyuanThemeRelativePath(), "zhi");
  }
};
var u = c;
r(u, "isInSiyuanWidget", () => n.isInBrowser ? typeof window.parent.process < "u" && window.parent.process.versions != null && window.parent.process.versions.electron != null : false), /**
* 思源笔记新窗口
*
* @author terwer
* @version 0.1.0
* @since 0.0.1
*/
r(u, "isInSiyuanNewWin", () => typeof window < "u" && window.process && window.process.type === "renderer"), // =========================
// require start
// =========================
/**
 * 引入依赖
 *
 * @param libpath - 依赖全路径
 * @param abs - 可选，是否使用觉得路径，默认是 true ， 启用之后 type参数无效
 * @param type - 可选，以谁的基本路径为准
 */
r(u, "requireLib", (e, t = true, i = h.BasePathType_None) => {
  if (!n.hasNodeEnv())
    throw new Error("require ony works on node env");
  let s = e;
  if (!t)
    switch (i) {
      case h.BasePathType_Appearance:
        s = c.joinPath(c.siyuanAppearancePath(), e);
        break;
      case h.BasePathType_Data:
        s = c.joinPath(c.siyuanDataPath(), e);
        break;
      case h.BasePathType_Themes:
        s = c.joinPath(c.siyuanAppearancePath(), "themes", e);
        break;
      case h.BasePathType_ZhiTheme:
        s = c.joinPath(c.siyuanAppearancePath(), "themes", "zhi", e);
        break;
      default:
        throw new Error("type must be provided when not use absolute path");
    }
  const o = c.siyuanWindow();
  if (!o)
    return require(s);
  if (typeof o.require < "u")
    return o.require(s);
}), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 appearance 的相对路径
*/
r(u, "requireAppearanceLib", (e) => c.requireLib(e, false, h.BasePathType_Appearance)), /**
* 引入依赖，以 data 的基本路径为准
*
* @param libpath - 相对于 data 的相对路径
*/
r(u, "requireDataLib", (e) => c.requireLib(e, false, h.BasePathType_Data)), /**
* 引入依赖，以 theme 的基本路径为准
*
* @param libpath - 相对于 theme 的相对路径
*/
r(u, "requireThemesLib", (e) => c.requireLib(e, false, h.BasePathType_Themes)), /**
* 引入依赖，以 ZhiTheme 的基本路径为准
*
* @param libpath - 相对于 ZhiTheme 的相对路径
*/
r(u, "requireZhiThemeLib", (e) => c.requireLib(e, false, h.BasePathType_ZhiTheme));

// src/lib/customCmd.ts
var CustomCmd = class {
  /**
   * 使用 Electron 自带的 node 运行命令
   *
   * https://github.com/UniBO-PRISMLab/wam/issues/26#issuecomment-1456204046
   * https://github.com/nodejs/help/issues/3885
   * https://github.com/npm/pacote
   *
   * 示例：
   * ```
   * await customCmd.executeCommandWithBundledNode("./node_modules/.bin/next", ["-v"], "/Users/terwer/Downloads/n")
   * ```
   *
   * @param command - 命令
   * @param args - 参数
   * @param cwd - 运行目录，默认 process.cwd
   */
  async executeCommandWithBundledNodeAsync(command, args = [], cwd) {
    const siyuanRequire = u.siyuanWindow()?.require ?? require;
    const process2 = u.siyuanWindow()?.process ?? global.process;
    const { fork } = siyuanRequire("child_process");
    const fs = siyuanRequire("fs");
    const path = siyuanRequire("path");
    return new Promise((resolve) => {
      const options = {
        cwd: cwd ?? process2.cwd(),
        silent: true
      };
      console.log(`\u6B63\u5728\u6267\u884C\u547D\u4EE4\uFF1A${command},args=>${args}, options=>`, options);
      const child = fork(command, args, options);
      const logFilePath = path.join(process2.env.HOME, "Downloads", "electron-command-log.txt");
      console.log(`\u547D\u4EE4\u6267\u884C\u65E5\u5FD7\u5DF2\u4FDD\u5B58\u5230\u6587\u4EF6 => ${logFilePath}`);
      const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
      child.stdout.pipe(logStream);
      child.stderr.pipe(logStream);
      child.on("error", (err) => {
        resolve({
          status: false,
          code: -1,
          msg: err.message
        });
      });
      child.on("exit", (code) => {
        if (code === 0) {
          resolve({
            status: true,
            code,
            msg: "\u5B50\u8FDB\u7A0B\u8FD0\u884C\u6210\u529F"
          });
        } else {
          const errorMessage = `\u5B50\u8FDB\u7A0B\u5F02\u5E38\u9000\u51FA\u{1F612}\uFF0C\u9000\u51FA\u7801: ${code}`;
          resolve({
            status: false,
            code,
            msg: errorMessage
          });
        }
      });
    });
  }
  // /**
  //  * 自定义执行系统命令
  //  *
  //  * 示例：
  //  * ```
  //  * await customCmd.executeCommand("./node_modules/.bin/nuxt", ["preview"], { shell: true, cwd: '/Users/terwer/Downloads/nu' })
  //  * await customCmd.executeCommand("node", ["./server/index.mjs"], { cwd: '/Users/terwer/Downloads/nu' })
  //  * ```
  //  *
  //  * @param command - 命令
  //  * @param args - 参数
  //  * @param options - 选项
  //  */
  // public async executeCommand(command: string, args: string[], options = {}) {
  //   const { exec } = SiyuanDevice.requireLib("child_process")
  //   const fullCommand = `${command} ${args.join(" ")}`
  //   return new Promise((resolve, reject) => {
  //     exec(fullCommand, options, (err: any, stdout: any) => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(stdout.trim())
  //       }
  //     })
  //   })
  // }
  //
  // /**
  //  * 自定义执行系统命令
  //  *
  //  * 示例：
  //  * ```
  //  * await customCmd.executeCommand("./node_modules/.bin/nuxt", ["preview"], { shell: true, cwd: '/Users/terwer/Downloads/nu' })
  //  * await customCmd.executeCommand("node", ["./server/index.mjs"], { cwd: '/Users/terwer/Downloads/nu' })
  //  * ```
  //  *
  //  * @param command - 命令
  //  * @param args - 参数
  //  * @param options - 选项
  //  */
  // public async executeCommandWithSpawn(command: string, args?: string[], options = {}) {
  //   const { spawn } = SiyuanDevice.requireLib("child_process")
  //   return new Promise((resolve, reject) => {
  //     const child = spawn(command, args, options)
  //     let output = "" // 保存输出结果的变量
  //     let error = "" // 保存错误信息的变量
  //
  //     // 监听子进程的 stdout、stderr 输出
  //     child.stdout.on("data", (data: any) => {
  //       output += data.toString()
  //     })
  //     child.stderr.on("data", (data: any) => {
  //       error += data.toString()
  //     })
  //
  //     // 监听子进程的退出事件
  //     child.on("close", (code: number) => {
  //       if (code === 0) {
  //         resolve(output)
  //       } else {
  //         const errorMsg = `Command "${command}" failed with exit code ${code}. ${error}`
  //         reject(new Error(errorMsg))
  //       }
  //     })
  //   })
  // }
  //
  // /**
  //  * 获取系统的 Node 版本
  //  */
  // public async getSystemNodeVersion() {
  //   return await this.executeCommand("node", ["-v"], { shell: true })
  // }
  /**
   * 获取 Electron 的 Node 版本
   */
  async getElectronNodeVersion() {
    return u.siyuanWindow().process.versions.node;
  }
};

// ../zhi-lib-base/dist/index.js
var w = (r2, i, p2) => {
  const s = i ?? "zhi", $ = (t) => {
    const e = t.getFullYear(), o = String(t.getMonth() + 1).padStart(2, "0"), n2 = String(t.getDate()).padStart(2, "0"), S = String(t.getHours()).padStart(2, "0"), d = String(t.getMinutes()).padStart(2, "0"), u2 = String(t.getSeconds()).padStart(2, "0");
    return `${e}-${o}-${n2} ${S}:${d}:${u2}`;
  }, c2 = (t, e) => {
    const o = $(/* @__PURE__ */ new Date()), n2 = typeof e == "boolean" ? String(e) : e;
    n2 ? console.log(`[${s}] [${o}] [DEBUG] [${r2}] ${t}`, n2) : console.log(`[${s}] [${o}] [DEBUG] [${r2}] ${t}`);
  }, l = (t, e) => {
    const o = $(/* @__PURE__ */ new Date()), n2 = typeof e == "boolean" ? String(e) : e;
    n2 ? console.info(`[${s}] [${o}] [INFO] [${r2}] ${t}`, n2) : console.info(`[${s}] [${o}] [INFO] [${r2}] ${t}`);
  }, f = (t, e) => {
    const o = $(/* @__PURE__ */ new Date()), n2 = typeof e == "boolean" ? String(e) : e;
    n2 ? console.warn(`[${s}] [${o}] [WARN] [${r2}] ${t}`, n2) : console.warn(`[${s}] [${o}] [WARN] [${r2}] ${t}`);
  }, g2 = (t, e) => {
    const o = $(/* @__PURE__ */ new Date());
    e ? console.error(`[${s}] [${o}] [ERROR] [${r2}] ${t.toString()}`, e) : console.error(`[${s}] [${o}] [ERROR] [${r2}] ${t.toString()}`);
  };
  return {
    debug: (t, e) => {
      p2 && (e ? c2(t, e) : c2(t));
    },
    info: (t, e) => {
      e ? l(t, e) : l(t);
    },
    warn: (t, e) => {
      e ? f(t, e) : f(t);
    },
    error: (t, e) => {
      e ? g2(t, e) : g2(t);
    }
  };
};

// src/index.ts
var init = () => {
  const logger = w("zhi-cmd", "zhi", true);
  const win = u.siyuanWindow();
  if (!win.zhiCmdInited) {
    const customCmd = new CustomCmd();
    win.zhiCmd = customCmd;
    logger.info("zhiCmd mounted");
    win.zhiCmdInited = true;
    logger.info("zhi cmd inited");
  } else {
    logger.info("zhi cmd is already inited.skip");
  }
  return win.zhiCmd;
};
var src_default = init;
