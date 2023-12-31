module.exports = {
  dependencies: {
    core: [
      {
        libpath: "core/plugin-system/plugin.js",
        baseType: "ZhiTheme",
        format: "esm",
        importType: "import",
        runAs: ["Siyuan_MainWindow", "Siyuan_Browser"],
        order: 1,
      },
      {
        libpath: "core/plugin-system/zhi-plugin-loader.js",
        baseType: "ZhiTheme",
        format: "esm",
        importType: "import",
        runAs: ["Siyuan_MainWindow", "Siyuan_Browser"],
        order: 2,
      },
    ],
    server: [
      {
        libpath: "server/electron/index.js",
        baseType: "ZhiTheme",
        format: "esm",
        importType: "import",
        runAs: ["Siyuan_MainWindow"],
        order: 3,
      },
      {
        libpath: "server/cmd/index.js",
        baseType: "ZhiTheme",
        format: "esm",
        importType: "import",
        runAs: ["Siyuan_MainWindow"],
        order: 4,
      },
      {
        libpath: "server/infra/index.js",
        baseType: "ZhiTheme",
        format: "esm",
        importType: "import",
        runAs: ["Siyuan_MainWindow"],
        order: 5,
      },
      {
        libpath: "server/custom/start.js",
        baseType: "ZhiTheme",
        format: "esm",
        importType: "import",
        runAs: ["Siyuan_MainWindow"],
        order: 6,
      },
    ],
    web: [],
    vendor: [],
  },
  blog: {
    server: {
      post: "3333",
    },
  },
}
