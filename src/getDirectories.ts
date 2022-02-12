import readdirp from "readdirp";
import { IConfig } from "./interfaces/config.interface";
import { statSync, lstat } from "fs";
import { promisify } from "util";
import { parse } from "path";
// const stat = promisify(statSync);

async function getDirectories(config: IConfig) {
  if (config.buildSinglePage) {
    // find and return the one file
    const parent = parse(config.file).dir;
    return await readdirp.promise(parent, {
      depth: 0,
      alwaysStat: true,
      type: "directories",
      directoryFilter: ["!.git", "!media", "!assets"],
    });
  } else {
    // find and return all markdown files
    return await readdirp.promise(config.blogConfig.root, {
      depth: 99,
      alwaysStat: true,
      type: "directories",
      directoryFilter: ["!.git", "!media", "!assets"],
    });
  }
}

export { getDirectories };
