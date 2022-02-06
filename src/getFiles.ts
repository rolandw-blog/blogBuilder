import readdirp from "readdirp";
import { IConfig } from "./interfaces/config.interface";
import { statSync, lstat } from "fs";
import { promisify } from "util";
import { parse } from "path";
// const stat = promisify(statSync);
const fileFilter = (file: readdirp.EntryInfo) => {
  if (RegExp(/^README.*/).test(file.basename)) {
    return false;
  } else {
    return true;
  }
};

async function getFiles(config: IConfig) {
  const isFile = config.file ? statSync(config.file).isFile() : false;
  if (isFile && config.buildSinglePage) {
    // find and return the one file
    const parent = parse(config.file).dir;
    return await readdirp.promise(parent, {
      depth: 99,
      alwaysStat: true,
      // fileFilter: fileFilter,
      fileFilter: ["!README*", "*.md"],
      // fileFilter: [filter, "!README"],
    });
  } else {
    // find and return all markdown files
    return await readdirp.promise(config.blogConfig.root, {
      depth: 99,
      alwaysStat: true,
      fileFilter: ["!README*", "*.md"],
    });
  }
}

export { getFiles };
