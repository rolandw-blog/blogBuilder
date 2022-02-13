import { IConfig } from "@rolandwarburton/blog-common";
import { parse } from "path";
import chalk from "chalk";
import { IPageMeta } from "@rolandwarburton/blog-common";
import { marked } from "marked";
import { readFileSync } from "fs";
import { getFrontMatter } from "./frontMatter.js";
import { remark } from "remark";
import { traverseNodes } from "./traverseNodes.js";
import { Link } from "mdast";
import { buildReferences } from "./buildReferences.js";
import { execSync } from "child_process";

// TODO split this into somethign more managable
/* eslint-disable-next-line max-lines-per-function*/
function saturate(config: IConfig, file: IPageMeta, rootGroup: IPageMeta[]) {
  // the directory as an absolute path (but relative to the blog config root)
  const relRootDir = parse(file.pathOnDisk.substring(config.blogConfig.root.length)).dir;
  const pageLoc = relRootDir + `/${parse(file.pathOnDisk).name}.html`;

  const pagination = pageLoc
    .split("/")
    .filter((x) => x)
    .map((x) => x.replace(/ /g, "_").toLocaleLowerCase());
  pagination.pop();
  pagination.push(parse(file.pathOnDisk).name.toLocaleLowerCase().replace(/ /g, "_"));

  const styles = [];
  // const scripts = [];
  switch (file.template) {
    case "blogPost.hbs":
      styles.push("/css/blogPost.css");
  }

  // href
  const href = `${config.protocol}://${config.baseUrl}/${pagination.join("/").replace(/ /g, "_")}`;

  // page name
  const name = parse(file.pathOnDisk).name;

  // parent
  const parent = "/" + pagination.slice(0, pagination.length - 1).join("/");

  // source
  const sourceUrl = `${config.sourceBaseUrl}/${name}.md`;

  // changes
  const changes = JSON.parse(
    execSync(
      `echo [ $(git log --pretty=format:'{"hash":"%H","date":"%aD"}' -- ${file.pathOnDisk} | sed 's/$/,/' | head -c -1) ]`,
      {
        cwd: parse(file.pathOnDisk).dir,
        encoding: "utf8",
        stdio: "pipe"
      }
    )
  );

  // neightboring pages
  const pageIndex = rootGroup.findIndex((x) => x.pathOnDisk === file.pathOnDisk);
  const next = rootGroup[pageIndex + 1];
  const prev = rootGroup[pageIndex - 1];
  const neighbors = {
    next: next || undefined,
    prev: prev || undefined
  };

  // siblings
  const siblings = [...rootGroup];
  siblings.splice(pageIndex, 1);

  // front matter (will be defined once/if it is parsed)
  let frontMatter = {};

  let content = "";
  try {
    if (!file.virtual) {
      // read the file
      const mdContent = readFileSync(file.pathOnDisk, "utf8");
      // parse the front matter
      const { frontMatter: matter, markdown } = getFrontMatter(mdContent);
      frontMatter = matter || {};
      // parse the markdown for further processing
      const ast = remark().parse(markdown);
      // traverse the markdown ast and replace the .md links with .html links for local use
      const fileReferenceLinks: Link[] = [];
      traverseNodes<Link>({
        node: ast,
        nodeOfType: "link",
        cb: (node) => {
          fileReferenceLinks.push(node);
          node.url = node.url.replace(/md$/, "html");
        }
      });
      // get the reference table as a markdown string
      const referenceTable = buildReferences(config, file.pathOnDisk, fileReferenceLinks);
      // render the markdown content
      const markdownContent = remark().stringify(ast) + "\n" + referenceTable;
      // append the reference table
      // parse it to html
      content = marked.parse(markdownContent);
      // const dom = new JSDOM(content);
      // dom.window.document.querySelectorAll("pre code").forEach((block) => {
      //   return hljs.highlightElement(block as HTMLElement);
      // });
      // content = dom.window.document.querySelector("")?.outerHTML || "";
      // console.log(content);
    }
  } catch (err) {
    console.log(chalk.red(`Error parsing ${file.pathOnDisk}`));
  }

  return {
    ...file,
    pagination,
    href,
    name,
    parent,
    sourceUrl,
    neighbors,
    siblings,
    content,
    styles,
    frontMatter,
    changes
  };
}

export { saturate };
