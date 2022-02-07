import readdirp from "readdirp";
import { IConfig } from "./interfaces/config.interface";
import { statSync } from "fs";
import { parse } from "path";

interface IFileEntry {
  path: string;
  fullPath: string;
}

async function getFiles(config: IConfig): Promise<IFileEntry[]> {
  let isFile = false;
  let parent = "";
  let files = [];
  if (config.targetingVirtualFile) {
    isFile = true;
  } else {
    const isFile = config.file ? statSync(config.file).isFile() : false;
  }

  if (isFile && config.buildSinglePage) {
    // find and return the one file
    parent = parse(config.file).dir;
    files.push(
      ...(await readdirp.promise(parent, {
        depth: 99,
        alwaysStat: false,
        fileFilter: ["!README*", "*.md"],
      }))
    );
  } else {
    // find and return all markdown files
    parent = config.blogConfig.root;
    files.push(
      ...(await readdirp.promise(parent, {
        depth: 99,
        alwaysStat: false,
        fileFilter: ["!README*", "*.md"],
      }))
    );
  }

  const realFiles = files.map((file) => {
    return {
      path: file.path,
      fullPath: file.fullPath,
    } as IFileEntry;
  });
  return [...realFiles];
}

export { getFiles };
