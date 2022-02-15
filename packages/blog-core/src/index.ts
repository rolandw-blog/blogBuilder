import { IConfig } from "@rolandwarburton/blog-common";
import { getFiles } from "./getFiles.js";
import { parse, resolve } from "path";
import chalk from "chalk";
import { syncConfig } from "./syncConfig.js";
import { IPageMeta } from "@rolandwarburton/blog-common";
import { getDirectories } from "./getDirectories.js";
import { Render } from "./render.js";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { JSDOM } from "jsdom";
import hljs from "highlight.js";
import { none } from "./languages/none.js";
import { saturate } from "./saturate.js";

// this also aliases to "output"
hljs.registerLanguage("none", none);

function compare(a: IPageMeta, b: IPageMeta): -1 | 0 | 1 {
  if (a.template === "menu.hbs" || a.virtual) return -1;
  else if (b.template === "menu.hbs" || b.virtual) return 1;
  else if (parse(a.pathOnDisk).name < parse(b.pathOnDisk).name) return -1;
  else if (parse(a.pathOnDisk).name > parse(b.pathOnDisk).name) return 1;

  return 0;
}

// TODO split this into something more managable
/* eslint-disable-next-line complexity, max-lines-per-function*/
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
      pathOnDisk: dir.fullPath,
      virtual: true,
      build: true
    };
  });

  // add the virtual pages from the config file
  const virtualConfigPages: IPageMeta[] = config.blogConfig.virtualPageMeta;
  config.blogConfig.pageMeta = [
    ...config.blogConfig.pageMeta,
    ...virtualMenuPages,
    ...virtualConfigPages
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
    // only add the file if its allowed to be built (IE not hidden)
    if (file.build) {
      // parse the path on the disk so we can get the directory
      const dir = parse(file.pathOnDisk).dir;

      // in a map we place the old files and append the new file
      fileGroups[dir] = [...(fileGroups[dir] || []), file];
      //                                 |            |
      //                             old files     new file
    }
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
    mkdirSync(parse(fileOutputPath).dir, { recursive: true });
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
export default main;
