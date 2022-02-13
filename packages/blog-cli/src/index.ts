/* eslint-disable no-process-exit */
/* eslint-disable complexity */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import main from "@rolandwarburton/blog-core";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import Ajv from "ajv";
import chalk from "chalk";
import { IConfig } from "@rolandwarburton/blog-common";
import { schema } from "./schema";

const ajv = new Ajv();

/* eslint-disable-next-line @typescript-eslint/no-explicit-any, max-lines-per-function */
async function cli(processArgs: any) {
  const args = yargs(hideBin(processArgs))
    .strict()
    .option("file", {
      alias: "f",
      describe: "Path to individual file to rebuild. Use config.json root to build whole blog.",
      type: "string"
    })
    .option("output", {
      alias: "o",
      describe: "path to output directory",
      type: "string",
      default: "./output"
    })
    .option("config", {
      alias: "c",
      describe: "path to config file",
      type: "string",
      default: "./config.json"
    })
    .option("templates", {
      alias: "t",
      describe: "path to templates directory",
      type: "string",
      default: "./src/templates"
    })
    .option("styles", {
      alias: "s",
      describe: "path to load styles directory",
      type: "string",
      default: "./public/styles/css"
    })
    .option("protocol", {
      describe: "http or https protocol",
      type: "string",
      default: "http"
    })
    .option("baseUrl", {
      describe: "base url for the site",
      type: "string",
      default: "localhost"
    })
    .option("sourceBaseUrl", {
      describe: "base url for the git repo (if using remote for page storage)",
      type: "string",
      default: "https://github.com/rolandwarburton/knowledge"
    });
  const argv = await args.argv;

  // construct the config
  let config: Partial<IConfig> = {};

  if (argv.output) {
    if (!existsSync(resolve(argv.output))) {
      try {
        mkdirSync(resolve(argv.output));
        config = { ...config, output: resolve(argv.output) };
      } catch (err) {
        console.log(chalk.red(`Error creating output directory: ${err}`));
      }
    } else {
      config = { ...config, output: resolve(argv.output) };
    }
  }

  if (argv.templates && existsSync(resolve(argv.templates))) {
    config = { ...config, templates: resolve(argv.templates) };
  }

  if (argv.styles && existsSync(resolve(argv.styles))) {
    config = { ...config, styles: argv.styles };
  }

  if (argv.config && existsSync(resolve(argv.config))) {
    // this is for the blog config with meta data etc
    try {
      config = {
        ...config,
        configPath: resolve(argv.config),
        blogConfig: JSON.parse(readFileSync(resolve(argv.config), "utf-8"))
      };
      if (config.blogConfig?.root && !existsSync(config.blogConfig?.root)) {
        console.log(chalk.red(`Error: ${config.blogConfig?.root} does not exist`));
        process.exit(1);
      }
    } catch (err) {
      console.log(chalk.red(`Error reading config file: ${err}`));
      process.exit(1);
    }
  }

  if (config.blogConfig && argv.file) {
    const virtualFilePath = resolve(config.blogConfig.root, argv.file);
    const isVirtual = config.blogConfig.virtualPageMeta.find(
      (x) => x.pathOnDisk === virtualFilePath
    );
    if (isVirtual) {
      config = {
        ...config,
        file: isVirtual.pathOnDisk,
        buildSinglePage: true,
        targetingVirtualFile: true
      };
    } else if (existsSync(resolve(argv.file))) {
      config = {
        ...config,
        file: resolve(argv.file),
        buildSinglePage: true,
        targetingVirtualFile: false
      };
    } else {
      // we were expecting a real file but it doesn't exist
      console.log(chalk.red(`Error: file ${argv.file} does not exist`));
      process.exit(1);
    }
  } else {
    // we were not expecting a file and can continue as normal
    config = { ...config, buildSinglePage: false, targetingVirtualFile: false };
  }

  if (argv.protocol) {
    config = { ...config, protocol: argv.protocol };
  }

  if (argv.baseUrl) {
    config = { ...config, baseUrl: argv.baseUrl };
  }

  if (argv.sourceBaseUrl) {
    config = { ...config, sourceBaseUrl: argv.sourceBaseUrl };
  }

  // validate the config
  console.log(config);
  const validate = ajv.compile(schema);
  if (validate(config)) {
    await main(config as IConfig);
  } else {
    console.error(chalk.red(`Invalid config: ${JSON.stringify(validate.errors, null, 2)}`));
    process.exit(1);
  }
}

export { cli };
