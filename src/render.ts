import { getTemplate } from "./getTemplate";
import { IConfig } from "./interfaces/config.interface";
import { IPageMetaSaturated } from "./interfaces/pageMetaSaturated.interface";
import Handlebars from "handlebars";

class Render {
  public templates: { [index: string]: string };
  public partials: { [index: string]: string };
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

    for (const partialName of Object.keys(this.partials)) {
      Handlebars.registerPartial(partialName, this.partials[partialName]);
    }
  }

  public render(template: IPageMetaSaturated): string {
    const templater = Handlebars.compile(this.templates[template.template]);
    return templater(template);
  }
}

export { Render };
