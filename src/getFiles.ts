import readdirp from "readdirp";
import { IConfig } from "./interfaces/config.interface";
import { statSync } from "fs";
import { parse } from "path";
import { IFileEntry } from "./interfaces/fileEntry.interface";

async function getFiles(config: IConfig): Promise<IFileEntry[]> {
  let isFile = false;
  let parent = "";
  let files = [];
  if (config.targetingVirtualFile) {
    isFile = true;
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
