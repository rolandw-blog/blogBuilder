import { IConfig } from "./interfaces/config.interface";
import { readFileSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";

function getTemplate(config: IConfig, templateName: string): string {
  return readFileSync(resolve(config.templates, templateName), "utf8");
}

export { getTemplate };
