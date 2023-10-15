module.exports = {
  dependencies: {
    core: [
      // /**
      //  * 加载基础设施
      //  */
      // private async loadInfra() {
      //   const basePath = getAppBase()
      //   const infraDir = SiyuanDevice.joinPath("libs", "zhi-infra", "index.cjs")
      //   const initZhiInfra = requirePluginLib(infraDir).default
      //   const zhiNpmPath = SiyuanDevice.joinPath(dataDir, basePath, "libs", "zhi-infra", "deps", "npm")
      //   // 是否修复环境变量
      //   await initZhiInfra(zhiNpmPath, false)
      // }
      //
      // /**
      //  * 加载命令工具
      //  */
      // private loadCmd() {
      //   const cmdDir = SiyuanDevice.joinPath("libs", "zhi-cmd", "index.cjs")
      //   const initZhiCmd = requirePluginLib(cmdDir).default
      //   initZhiCmd()
      // }
      // {
      //   libpath: "core/zhi-infra/index.cjs",
      //   baseType: "ThisPlugin",
      //   format: "cjs",
      //   importType: "import",
      //   runAs: ["Siyuan_MainWindow", "Siyuan_Browser"],
      //   initParams: ["[zhiAppNpmPath]", false],
      //   order: 1,
      // },
      // {
      //   libpath: "core/zhi-cmd/index.cjs",
      //   baseType: "ThisPlugin",
      //   format: "cjs",
      //   importType: "import",
      //   runAs: ["Siyuan_MainWindow", "Siyuan_Browser"],
      //   initParams: ["[zhiAppNpmPath]", false],
      //   order: 1,
      // },
    ],
    server: [],
    web: [],
    vendor: [],
  },
}
