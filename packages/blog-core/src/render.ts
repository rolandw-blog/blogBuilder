// import { getTemplate } from "./getTemplate.js";
import { IConfig } from "@rolandwarburton/blog-common";
import { IPageMetaSaturated } from "@rolandwarburton/blog-common";
import Handlebars from "handlebars";
import { parse, resolve } from "path";
import { readFileSync } from "fs";

class Render {
  public templates: { [index: string]: string };
  public partials: { [index: string]: string };
  public helpers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: (...args: any) => any;
  };
  constructor(config: IConfig) {
    const getTemplate = (templateName: string) =>
      readFileSync(resolve(config.templates, templateName), "utf8");
    this.templates = {
      "home.hbs": getTemplate("home.hbs"),
      "blogPost.hbs": getTemplate("blogPost.hbs"),
      "menu.hbs": getTemplate("menu.hbs"),
      "about.hbs": getTemplate("about.hbs")
    };

    this.partials = {
      header: getTemplate("./partials/header.hbs"),
      frontMatter: getTemplate("./partials/frontMatter.hbs"),
      navigation: getTemplate("./partials/navigation.hbs")
    };

    this.helpers = {
      nameFromPath: (name) => {
        return parse(name).name;
      },
      urlFromPath: (pathOnDisk) => {
        return pathOnDisk.replace(config.blogConfig.root, "").replace(/\.md/, "");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getPaginationSeg: (index: number, context: any) => {
        let result = "/";
        for (let i = 0; i <= index; i++) {
          result += context.data.root.pagination[i] + "/";
        }
        return result.replace(/\/$/, "");
      },
      getUrlOrigin: (name: string) => new URL(name).origin,
      getLastChange: (changes: { hash: string; date: string }[]) =>
        changes[0] ? new Date(changes[0].date).toString().slice(0, 15) : "nothing here",
      getFirstChange: (changes: { hash: string; date: string }[]) =>
        changes[changes.length - 1]
          ? new Date(changes[changes.length - 1].date).toString().slice(0, 15)
          : "nothing here"
    };

    // register partials
    for (const partialName of Object.keys(this.partials))
      Handlebars.registerPartial(partialName, this.partials[partialName]);

    // register helpers
    for (const helper of Object.keys(this.helpers))
      Handlebars.registerHelper(helper, this.helpers[helper]);
  }

  public render(template: IPageMetaSaturated): string {
    const templater = Handlebars.compile(this.templates[template.template]);
    return templater(template);
  }
}

export { Render };
