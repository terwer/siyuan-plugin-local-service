module.exports = {
  dependencies: {
    core: [
      {
        name: "zhi-infra",
        version: "0.15.1",
        libpath: "libs/zhi-infra/index.cjs",
        baseType: "ThisPlugin",
        format: "cjs",
        importType: "require",
        runAs: ["Siyuan_RendererWindow"],
        initParams: ["[thisPluginBasePath]", true],
        order: 1,
      },
      {
        name: "package-downloader",
        alias: "pd",
        version: "0.0.1",
        libpath: "services/package-downloader/index.cjs",
        baseType: "ThisPlugin",
        format: "cjs",
        importType: "require",
        runAs: ["Siyuan_RendererWindow"],
        initParams: [],
        order: 2,
      },
    ],
    server: [
      {
        name: "python-hello",
        version: "0.0.1",
        libpath: "services/python-hello/hello.py",
        baseType: "ThisPlugin",
        format: "py",
        importType: "python",
        runAs: ["Siyuan_RendererWindow"],
        initParams: [],
        order: 3,
      },
    ],
    web: [],
    vendor: [],
  },
}
