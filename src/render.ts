import { getTemplate } from "./getTemplate.js";
import { IConfig } from "./interfaces/config.interface.js";
import { IPageMetaSaturated } from "./interfaces/pageMetaSaturated.interface.js";
import Handlebars from "handlebars";
import { parse } from "path";

class Render {
  public templates: { [index: string]: string };
  public partials: { [index: string]: string };
  public helpers: {
    [index: string]: (name: string) => string;
  };
  constructor(config: IConfig) {
    this.templates = {
      "home.hbs": getTemplate(config, "home.hbs"),
      "blogPost.hbs": getTemplate(config, "blogPost.hbs"),
      "menu.hbs": getTemplate(config, "menu.hbs"),
      "about.hbs": getTemplate(config, "about.hbs"),
    };

    this.partials = {
      header: getTemplate(config, "./partials/header.hbs"),
    };

    this.helpers = {
      nameFromPath: (name) => {
        return parse(name).name;
      },
    };

    for (const partialName of Object.keys(this.partials)) {
      Handlebars.registerPartial(partialName, this.partials[partialName]);
    }

    for (const helper of Object.keys(this.helpers)) {
      Handlebars.registerHelper(helper, this.helpers[helper]);
    }
  }

  public render(template: IPageMetaSaturated): string {
    const templater = Handlebars.compile(this.templates[template.template]);
    return templater(template);
  }
}

export { Render };
