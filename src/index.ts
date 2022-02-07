import { IConfig } from "./interfaces/config.interface";
import { getFiles } from "./getFiles";
import { parse, resolve } from "path";
import chalk from "chalk";
import { syncConfig } from "./syncConfig";
import { IPageMeta } from "./interfaces/pageMeta.interface";
import { getDirectories } from "./getDirectories";
import { IPageMetaSaturated } from "./interfaces/pageMetaSaturated.interface";
import { Render } from "./render";

function compare(a: IPageMeta, b: IPageMeta): -1 | 0 | 1 {
  const afileName = parse(a.pathOnDisk).name;
  const bfileName = parse(b.pathOnDisk).name;
  if (a.template === "menu.hbs" || a.virtual) {
    return -1;
  } else if (b.template === "menu.hbs" || b.virtual) {
    return 1;
  } else if (afileName < bfileName) {
    return -1;
  } else if (afileName > bfileName) {
    return 1;
  }
  return 0;
}

function saturate(
  config: IConfig,
  file: IPageMeta,
  rootGroup: IPageMeta[],
  // fileGroups: { [index: string]: IPageMeta[] },
  target: IPageMeta
): IPageMetaSaturated {
  const lengthOfRoot = config.blogConfig.root.length;
  const pageLocation =
    parse(file.pathOnDisk.substring(lengthOfRoot)).dir + `/${parse(file.pathOnDisk).name}.html`;

  const pagination = pageLocation
    .split("/")
    .filter((x) => x)
    .map((x) => x.replace(/ /g, "_").toLocaleLowerCase());
  pagination.pop();
  pagination.push(parse(file.pathOnDisk).name.toLocaleLowerCase().replace(/ /g, "_"));

  // href
  const href = `${config.protocol}://${config.baseUrl}/${pagination.join("/").replace(/ /g, "_")}`;

  // page name
  const name = parse(file.pathOnDisk).name;

  // parent
  const parent = "/" + pagination.slice(0, pagination.length - 1).join("/");

  // source
  const sourceUrl = `${config.sourceBaseUrl}/${name}.md`;

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

  return { ...file, pagination, href, name, parent, sourceUrl, neighbors, siblings };
}

async function main(config: IConfig) {
  console.log("getting files");
  const files = await getFiles(config);
  const directories = await getDirectories(config);

  // sync the disk with the config meta and vice versa
  syncConfig(config, files, directories);

  // add the virtual files to the meta array
  const virtualMenuPages: IPageMeta[] = directories.map((dir) => {
    return {
      template: "menu.hbs",
      pathOnDisk: dir.fullPath + "/index.md",
      virtual: true,
    };
  });
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
    templates.push(saturate(config, target, localRootGroup, target));
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
        templates.push(saturate(config, target, localRootGroup, target));
      }
    }
  }

  console.log("rendering");
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
    const html = render.render(template);
    debugger
    console.log(html);
  }
}
export { main };
