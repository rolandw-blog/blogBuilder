import { IPageMeta } from "./pageMeta.interface";

interface IPageMetaSaturated extends IPageMeta {
  pagination: string[];
  href: string;
  name: string;
  parent: string;
  sourceUrl: string;
  siblings: IPageMeta[];
  content: string;
  styles: string[];
  // scripts: string[];
  frontMatter: { [key: string]: unknown };
  changes: { hash: string; date: string };
  neighbors: {
    next?: IPageMeta;
    prev?: IPageMeta;
  };
}

export { IPageMetaSaturated };
