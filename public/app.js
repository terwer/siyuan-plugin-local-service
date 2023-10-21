module.exports = {
  dependencies: {
    core: [
      {
        libpath: "libs/zhi-infra/index.cjs",
        baseType: "ThisPlugin",
        format: "cjs",
        importType: "require",
        runAs: ["Siyuan_RendererWindow"],
        initParams: ["[thisPluginBasePath]", true],
        order: 1,
      },
    ],
    server: [],
    web: [],
    vendor: [],
  },
}
