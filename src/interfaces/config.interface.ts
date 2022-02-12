import { IPageMeta } from "./pageMeta.interface";

interface IConfig {
  file: string;
  output: string;
  templates: string;
  styles: string;
  configPath: string;
  protocol: string;
  baseUrl: string;
  buildSinglePage: boolean;
  targetingVirtualFile: boolean;
  sourceBaseUrl: string;
  blogConfig: {
    version: number;
    root: string;
    pageMeta: IPageMeta[];
    virtualPageMeta: IPageMeta[];
  };
}

export { IConfig };
