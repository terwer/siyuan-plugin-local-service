module.exports = {
  dependencies: {
    core: [
      {
        libpath: "libs/zhi-infra/index.cjs",
        baseType: "ThisPlugin",
        format: "cjs",
        importType: "require",
        runAs: ["Siyuan_RendererWindow"],
        initParams: ["[thisPluginBasePath]/libs/zhi-infra/deps/npm", false],
        order: 1,
      },
    ],
    server: [
      // {
      //   libpath: "server/chatgpt-next-web/server.js",
      //   baseType: "ThisPlugin",
      //   format: "js",
      //   importType: "require",
      //   runAs: ["Siyuan_RendererWindow"],
      //   initParams: [],
      //   order: 3,
      // },
      // {
      //   libpath: "/Users/terwer/Documents/mydocs/github-repos/nocodb-siyuan/index.js",
      //   baseType: "ThisPlugin",
      //   format: "js",
      //   importType: "require",
      //   runAs: ["Siyuan_RendererWindow"],
      //   initParams: [],
      //   order: 4,
      // },
    ],
    web: [],
    vendor: [],
  },
}
