import { IConfig } from "./interfaces/config.interface";
import { IFileEntry } from "./interfaces/fileEntry.interface";
import chalk from "chalk";
import { EntryInfo } from "readdirp";
import { writeFileSync } from "fs";

function syncMetaPages(config: IConfig, filesOnDisk: IFileEntry[], directories: EntryInfo[]) {
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
}

// function syncVirtualPages(config: IConfig, filesOnDisk: EntryInfo[], directories: EntryInfo[]) {
//   const virtualDirectories: IPageMeta[] = directories.map((dir) => {
//     return {
//       template: "menu.hbs",
//       pathOnDisk: dir.fullPath + "/index.md",
//     };
//   });

//   const virtualFiles = [...virtualDirectories.map((dir) => dir.pathOnDisk)];
//   const filesPathInConfig = config.blogConfig.virtualPageMeta.map((meta) => meta.pathOnDisk);

//   const filesOnDiskAndNotInConfig = virtualFiles.filter(
//     (path) => !filesPathInConfig.includes(path)
//   );
//   const filesInConfigAndNotOnDisk = filesPathInConfig.filter(
//     (path) => !virtualFiles.includes(path)
//   );
//   // virtual files can be any file with the virtual flag set to true in the config
//   // virtual files are decided at runtime because they dont actually exist as markdown files
//   // examples of virtual files are:
//   // - directories: should be handled as menu pages
//   // - meta pages: should be handled as meta pages
//   // - custom pages: should be handled as custom pages (define a new template for 1 off pages)
//   // const virtualFilesOnDisk: IPageMeta[] = directories.map((dir) => {
//   //   return { template: "menu.hbs", pathOnDisk: dir.fullPath + "/index.md", virtual: true };
//   // });
//   // const homePage: IPageMeta = {
//   //   template: "home.hbs",
//   //   pathOnDisk: config.blogConfig.root + "/index.md",
//   // };
//   // const virtualFilesInConfig = config.blogConfig.virtualPageMeta.filter((f) => f.virtual);

//   // add files that are on disk but not in config
//   if (filesOnDiskAndNotInConfig.length > 0) {
//     console.log(
//       chalk.yellow(
//         `The are ${filesOnDiskAndNotInConfig.length} files on disk that are not in the config`
//       )
//     );
//     for (const file of filesOnDiskAndNotInConfig) {
//       console.log(chalk.yellow(`Adding ${file} to config`));
//       config.blogConfig.virtualPageMeta.push({
//         template: "blogPost.hbs",
//         pathOnDisk: file,
//       });
//     }
//     writeFileSync(config.configPath, JSON.stringify(config.blogConfig, null, 2));
//   }

//   // remove files that have been removed from disk but are still in the config
//   // only do this if we are building multiple files (all of them)
//   if (filesInConfigAndNotOnDisk.length > 0 && !config.buildSinglePage) {
//     console.log(
//       chalk.yellow(
//         `The are ${filesInConfigAndNotOnDisk.length} files in the config that are not on the disk`
//       )
//     );
//     for (const file of filesInConfigAndNotOnDisk) {
//       console.log(chalk.yellow(`Removing ${file} from config`));
//       config.blogConfig.virtualPageMeta = config.blogConfig.virtualPageMeta.filter(
//         (meta) => meta.pathOnDisk !== file
//       );
//     }
//     writeFileSync(config.configPath, JSON.stringify(config.blogConfig, null, 2));
//   }
// }

// TODO add menu groups as files as well
function syncConfig(config: IConfig, filesOnDisk: IFileEntry[], directories: EntryInfo[]) {
  // sync the config and files on disk
  // const filesPathOnDisk = filesOnDisk.map((file) => file.fullPath);
  syncMetaPages(config, filesOnDisk, directories);
  // syncVirtualPages(config, filesOnDisk, directories);

  console.log(chalk.cyan("Config meta and files are in sync"));
}

export { syncConfig };
