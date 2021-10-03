import ITemplateData from "../../../interfaces/template.interface";
import path from "node:path";
import IPage from "../../../interfaces/page.interface";
import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";

const generate = (fileName: string) => {
	const ext = path.parse(fileName).ext;
	switch (ext) {
		case ".css":
			return `<link rel="stylesheet" type="text/css" href="/${fileName}" id="style-${fileName}"/>`;
		case ".js":
			return `<script src="/${fileName}"></script>`;
		default:
			return "";
	}
};

const getScripts = (template: string) => {
	const scripts = [];
	switch (template) {
		case "blogPost.ejs":
		case "menu.ejs":
			scripts.push(generate("gist.js"));
			break;
		case "home.ejs":
			scripts.push(generate("index.js"));
			break;
		case "template.ejs":
			scripts.push(generate("gist.js"));
			break;
		default:
			break;
	}
	return scripts;
};

const getHeaders = (template: string) => {
	const styles = [];
	switch (template) {
		case "blogPost.ejs":
			styles.push(generate("tiny_light.css"));
			styles.push(generate("an-old-hope.css"));
			break;
		case "home.ejs":
			styles.push(generate("solarized.css"));
			break;
		case "menu.ejs":
			// styles.push(generate("menu.css"));
			styles.push(generate("tiny_dark.css"));
			break;
		case "about.ejs":
			styles.push(generate("dark.css"));
			break;
		case "template.ejs":
			styles.push(generate("light.css"));
			break;
		default:
			break;
	}
	return styles;
};

// function stylesAndScripts(templateData: ITemplateData): Promise<Partial<ITemplateData>> {
// 	return new Promise((resolve) => {
// 		const styles = getHeaders((templateData.page as IPage).meta.template);
// 		const scripts = getScripts((templateData.page as IPage).meta.template);
// 		resolve({ styles, scripts });
// 	});
// }

class BuildStepstylesAndScripts implements IPageTemplaterBuildStep {
	build(templateData: Partial<ITemplateData>): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			const styles = getHeaders((templateData.page as IPage).meta.template);
			const scripts = getScripts((templateData.page as IPage).meta.template);
			resolve({ styles, scripts });
		});
	}
}

export default BuildStepstylesAndScripts;
