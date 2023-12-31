module.exports = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://terwer.space/app-schema.json",
  type: "object",
  properties: {
    dependencies: {
      type: "object",
      properties: {
        core: {
          type: "array",
          items: {
            type: "object",
            properties: {
              libpath: {
                type: "string",
              },
              baseType: {
                type: "string",
              },
              format: {
                type: "string",
              },
              importType: {
                type: "string",
              },
              runAs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["libpath", "baseType", "format", "importType", "runAs"],
          },
        },
        server: {
          type: "array",
          items: {
            type: "object",
            properties: {
              libpath: {
                type: "string",
              },
              baseType: {
                type: "string",
              },
              format: {
                type: "string",
              },
              importType: {
                type: "string",
              },
              runAs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["libpath", "baseType", "format", "importType", "runAs"],
          },
        },
        web: {
          type: "array",
          items: {
            type: "object",
            properties: {
              libpath: {
                type: "string",
              },
              baseType: {
                type: "string",
              },
              format: {
                type: "string",
              },
              importType: {
                type: "string",
              },
              runAs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["libpath", "baseType", "format", "importType", "runAs"],
          },
        },
        vendor: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              enabled: {
                type: "boolean",
              },
            },
            required: ["name", "enabled"],
          },
        },
      },
      required: ["core", "server", "web", "vendor"],
    },
  },
  required: ["dependencies"],
}
