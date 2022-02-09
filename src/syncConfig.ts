import { IConfig } from "./interfaces/config.interface";
import { IFileEntry } from "./interfaces/fileEntry.interface";
import chalk from "chalk";
import { EntryInfo } from "readdirp";
import { writeFileSync } from "fs";

function syncConfig(config: IConfig, filesOnDisk: IFileEntry[]) {
  // sync the config and files on disk
  const filesPathOnDisk = filesOnDisk.map((file) => file.fullPath);
  const filesPathInConfig = config.blogConfig.pageMeta.map((meta) => meta.pathOnDisk);
  const filesOnDiskAndNotInConfig = filesPathOnDisk.filter(
    (path) => !filesPathInConfig.includes(path)
  );
  const filesInConfigAndNotOnDisk = filesPathInConfig.filter(
    (path) => !filesPathOnDisk.includes(path)
  );

  // add files that are on disk but not in config
  if (filesOnDiskAndNotInConfig.length > 0) {
    console.log(
      chalk.yellow(
        `The are ${filesOnDiskAndNotInConfig.length} files on disk that are not in the config`
      )
    );
    for (const file of filesOnDiskAndNotInConfig) {
      console.log(chalk.yellow(`Adding ${file} to config`));
      config.blogConfig.pageMeta.push({
        template: "blogPost.hbs",
        pathOnDisk: file,
        virtual: false,
      });
    }
    writeFileSync(config.configPath, JSON.stringify(config.blogConfig, null, 2));
  }

  // remove files that have been removed from disk but are still in the config
  // only do this if we are building multiple files (all of them)
  if (filesInConfigAndNotOnDisk.length > 0) {
    console.log(
      chalk.yellow(
        `The are ${filesInConfigAndNotOnDisk.length} files in the config that are not on the disk`
      )
    );
    for (const file of filesInConfigAndNotOnDisk) {
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
