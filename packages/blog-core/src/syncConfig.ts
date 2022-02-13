import { IConfig } from "@rolandwarburton/blog-common";
import { IFileEntry } from "@rolandwarburton/blog-common";
import chalk from "chalk";
import { writeFileSync } from "fs";

// sync the config and files on disk
function syncConfig(config: IConfig, filesOnDisk: IFileEntry[]) {
  const filesPathOnDisk = filesOnDisk.map((file) => file.fullPath);
  const filesPathInConfig = config.blogConfig.pageMeta.map((meta) => meta.pathOnDisk);

  // files on the disk and not in the config
  const dskNotCfg = filesPathOnDisk.filter((path) => !filesPathInConfig.includes(path));

  // files in the config and not on the disk
  const cfgNotDsk = filesPathInConfig.filter((path) => !filesPathOnDisk.includes(path));

  // add files that are on disk but not in config
  if (dskNotCfg.length > 0) {
    console.log(chalk.yellow(`${dskNotCfg.length} files on disk that are not in config`));
    for (const file of dskNotCfg) {
      console.log(chalk.yellow(`Adding ${file} to config`));
      config.blogConfig.pageMeta.push({
        template: "blogPost.hbs",
        pathOnDisk: file,
        virtual: false,
        build: true,
      });
    }
    writeFileSync(config.configPath, JSON.stringify(config.blogConfig, null, 2));
  }

  // remove files that have been removed from disk but are still in the config
  // only do this if we are building multiple files (all of them)
  if (cfgNotDsk.length > 0) {
    console.log(chalk.yellow(`${cfgNotDsk.length} files in the config that are not on  disk`));
    for (const file of cfgNotDsk) {
      console.log(chalk.yellow(`Removing ${file} from config`));
      config.blogConfig.pageMeta = config.blogConfig.pageMeta.filter(
        (meta) => meta.pathOnDisk !== file
      );
    }
    writeFileSync(config.configPath, JSON.stringify(config.blogConfig, null, 2));
  }

  console.log(chalk.cyan("Config meta and files are in sync"));
}

export { syncConfig };
