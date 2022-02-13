import { JSONSchemaType } from "ajv";
import { IConfig } from "@rolandwarburton/blog-common";

const schema: JSONSchemaType<IConfig> = {
  type: "object",
  properties: {
    file: { type: "string" },
    output: { type: "string" },
    templates: { type: "string" },
    styles: { type: "string" },
    configPath: { type: "string" },
    buildSinglePage: { type: "boolean" },
    protocol: { type: "string" },
    baseUrl: { type: "string" },
    sourceBaseUrl: { type: "string" },
    targetingVirtualFile: { type: "boolean" },
    // sourceBaseUrl: { type: "uri" },
    blogConfig: {
      type: "object",
      required: ["version", "root"],
      properties: {
        version: { type: "number" },
        root: { type: "string" },
        virtualPageMeta: {
          type: "array",
          items: {
            type: "object",
            required: ["template"],
            properties: {
              template: { type: "string" },
              pathOnDisk: { type: "string" },
              virtual: { type: "boolean" },
              build: { type: "boolean" }
            }
          }
        },
        pageMeta: {
          type: "array",
          items: {
            type: "object",
            required: ["template"],
            properties: {
              template: { type: "string" },
              pathOnDisk: { type: "string" },
              virtual: { type: "boolean" },
              build: { type: "boolean" }
            }
          }
        }
      }
    }
  },
  required: [
    "sourceBaseUrl",
    "protocol",
    "baseUrl",
    "output",
    "templates",
    "configPath",
    "blogConfig",
    "buildSinglePage",
    "targetingVirtualFile",
    "styles"
  ],
  // when one single file is passed, buildSinglePage should be true
  oneOf: [
    {
      properties: {
        file: { type: "string" },
        buildSinglePage: { type: "boolean", oneOf: [true] }
      }
    },
    {
      properties: {
        file: { type: "null" },
        buildSinglePage: { type: "boolean", oneOf: [false] }
      }
    }
  ],
  additionalProperties: false
};

export { schema };
