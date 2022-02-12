import { IConfig } from "./interfaces/config.interface.js";
import { getFiles } from "./getFiles.js";
import { parse, resolve } from "path";
import chalk from "chalk";
import { syncConfig } from "./syncConfig.js";
import { IPageMeta } from "./interfaces/pageMeta.interface.js";
import { getDirectories } from "./getDirectories.js";
import { IPageMetaSaturated } from "./interfaces/pageMetaSaturated.interface.js";
import { Render } from "./render.js";
import { marked } from "marked";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { getFrontMatter } from "./frontMatter.js";
import { remark } from "remark";
import { traverseNodes } from "./traverseNodes.js";
import { Link } from "mdast";
import { buildReferences } from "./buildReferences.js";
import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import { execSync } from "child_process";

function compare(a: IPageMeta, b: IPageMeta): -1 | 0 | 1 {
  if (a.template === "menu.hbs" || a.virtual) return -1;
  else if (b.template === "menu.hbs" || b.virtual) return 1;
  else if (parse(a.pathOnDisk).name < parse(b.pathOnDisk).name) return -1;
  else if (parse(a.pathOnDisk).name > parse(b.pathOnDisk).name) return 1;

  return 0;
}

function saturate(config: IConfig, file: IPageMeta, rootGroup: IPageMeta[]): IPageMetaSaturated {
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
        stdio: "pipe",
      }
    )
  );

  // neightboring pages
  const pageIndex = rootGroup.findIndex((x) => x.pathOnDisk === file.pathOnDisk);
  const next = rootGroup[pageIndex + 1];
  const prev = rootGroup[pageIndex - 1];
  const neighbors = {
    next: next || undefined,
    prev: prev || undefined,
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
        },
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
    changes,
  };
}

async function main(config: IConfig) {
  console.log("getting files");
  const files = await getFiles(config);
  const directories = await getDirectories(config);

  // sync the disk with the config meta and vice versa
  syncConfig(config, files);

  // add the directories as virtual files
  const virtualMenuPages: IPageMeta[] = directories.map((dir) => {
    return {
      template: "menu.hbs",
      pathOnDisk: dir.fullPath + "/index.md",
      virtual: true,
    };
  });
  // add the virtual pages from the config file
  const virtualConfigPages: IPageMeta[] = config.blogConfig.virtualPageMeta;
  config.blogConfig.pageMeta = [
    ...config.blogConfig.pageMeta,
    ...virtualMenuPages,
    ...virtualConfigPages,
  ];

  // do a quick sanity check to see if the blogs root is set correctly
  if (!RegExp(`${config.blogConfig.root}`).test(files[0].fullPath)) {
    console.log(chalk.red(`Error: It looks like your root in config.json is not set corectly.`));
    console.log(chalk.red(`Make sure the root path so it is a parent of your markdown files.`));
    throw new Error("Root path is not set correctly");
  }

  // group each file into its directory
  const fileGroups: { [index: string]: IPageMeta[] } = {};

  // where we will store tempaltes
  const templates = [];

  console.log("grouping files");
  config.blogConfig.pageMeta.forEach((file) => {
    const parsedPath = parse(resolve(file.pathOnDisk));
    fileGroups[parsedPath.dir] = [...(fileGroups[parsedPath.dir] || []), file];
  });

  if (config.buildSinglePage) {
    // where this file is
    const localFileDir = parse(config.file).dir;
    // the files group (siblings)
    const localRootGroup = fileGroups[localFileDir];
    localRootGroup.sort(compare);
    // this file among its siblings
    const target = localRootGroup.find((x) => x.pathOnDisk === resolve(config.file));
    if (!target) {
      throw new Error("Could not find target file in the local root group");
    }
    templates.push(saturate(config, target, localRootGroup));
  } else {
    // for each group
    for (let i = 0; i < Object.keys(fileGroups).length; i++) {
      // the group name we are working on
      const group = Object.keys(fileGroups)[i];
      // the files group (siblings)
      const localRootGroup = fileGroups[group];
      for (let j = 0; j < localRootGroup.length; j++) {
        const target = localRootGroup[j];
        if (!target) {
          throw new Error("Could not find target file in the local root group");
        }
        templates.push(saturate(config, target, localRootGroup));
      }
    }
  }

  // {
  //     "template": "blogPost.hbs",
  //     "pathOnDisk": "/home/roland/knowledge/tech/Backing Up MongoDB.md",
  //     "virtual": false,
  //     "pagination": [
  //         "tech",
  //         "backing_up_mongodb"
  //     ],
  //     "href": "http://localhost/tech/backing_up_mongodb",
  //     "name": "Backing Up MongoDB",
  //     "parent": "/tech",
  //     "sourceUrl": "https://github.com/rolandwarburton/knowledge/Backing Up MongoDB.md",
  //     "neighbors": {
  //         "next": {
  //             "template": "blogPost.hbs",
  //             "pathOnDisk": "/home/roland/knowledge/tech/Grimoire.md",
  //             "virtual": false
  //         }
  //     },
  //     "siblings": [
  //         {
  //             "template": "blogPost.hbs",
  //             "pathOnDisk": "/home/roland/knowledge/tech/Grimoire.md",
  //             "virtual": false
  //         },
  //         {
  //             "template": "blogPost.hbs",
  //             "pathOnDisk": "/home/roland/knowledge/tech/certbot.md",
  //             "virtual": false
  //         },
  //         {
  //             "template": "blogPost.hbs",
  //             "pathOnDisk": "/home/roland/knowledge/tech/dockerode.md",
  //             "virtual": false
  //         },
  //         {
  //             "template": "menu.hbs",
  //             "pathOnDisk": "/home/roland/knowledge/tech/index.md",
  //             "virtual": true
  //         }
  //     ]
  // }
  const render = new Render(config);
  for (const template of templates) {
    console.log(`rendering ${template.name}`);
    const urlPath = new URL(template.href).pathname.substring(1) + "/index.html";

    // TODO figure out why i need to replace /index/index.html
    // resolve the output + the url path
    // also replace duplicate index's (not sure why this happens yet)
    const fileOutputPath = resolve(config.output, urlPath).replace(
      /\/index\/index.html/,
      "/index.html"
    );
    try {
      mkdirSync(parse(fileOutputPath).dir, { recursive: true });
    } catch (err) {}
    // render the html
    const html = render.render(template);

    // hljs styles
    const dom = new JSDOM(html);
    dom.window.document
      .querySelectorAll("pre code")
      .forEach((block) => hljs.highlightElement(block as HTMLElement));

    // write the file with the serialized html
    writeFile(fileOutputPath, dom.serialize());
  }

  // create directories for styles and scripts
  if (!existsSync(resolve(config.output, "css"))) {
    mkdirSync(resolve(config.output, "css"));
  }

  if (!existsSync(resolve(config.output, "scripts"))) {
    mkdirSync(resolve(config.output, "scripts"));
  }

  // bundle styles
  // ! this is out of scope
  // for (const file of readdirSync(config.styles)) {
  //   console.log(file);
  //   copyFileSync(resolve(config.styles, file), resolve(config.output, "css", file));
  // }
}
export { main };
