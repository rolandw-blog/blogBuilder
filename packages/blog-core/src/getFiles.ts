import readdirp from "readdirp";
import { IConfig } from "@rolandwarburton/blog-common";
import { statSync } from "fs";
import { parse } from "path";
import { IFileEntry } from "@rolandwarburton/blog-common";

async function getFiles(config: IConfig): Promise<IFileEntry[]> {
  let files = [];
  files.push(
    ...(await readdirp.promise(config.blogConfig.root, {
      depth: 99,
      alwaysStat: false,
      fileFilter: ["!README*", "*.md"],
    }))
  );

  const realFiles = files.map((file) => {
    return {
      path: file.path,
      fullPath: file.fullPath,
    } as IFileEntry;
  });
  return [...realFiles];
}

export { getFiles };
