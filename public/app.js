module.exports = {
  dependencies: {
    core: [
      {
        libpath: "core/zhi-infra/index.cjs",
        baseType: "ThisPlugin",
        format: "cjs",
        importType: "require",
        runAs: ["Siyuan_RendererWindow"],
        initParams: ["[basePath]/core/zhi-infra/deps/npm", true],
        order: 1,
      },
      {
        libpath: "core/zhi-cmd/index.cjs",
        baseType: "ThisPlugin",
        format: "cjs",
        importType: "require",
        runAs: ["Siyuan_RendererWindow"],
        initParams: [],
        order: 2,
      },
    ],
    server: [],
    web: [],
    vendor: [],
  },
}
