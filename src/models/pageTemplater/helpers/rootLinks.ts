import axios, { AxiosRequestConfig } from "axios";
import IPage from "../../../interfaces/page.interface";
import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";
import ITemplateData from "../../../interfaces/template.interface";

async function getRootLinks(): Promise<IPage[]> {
	const dbUrl = process.env["DB_API"] as string;
	// get the pages siblings by getting the children of the current pages parents
	const url = `${dbUrl}/pages?path=/*&limit=-1`;
	// console.log({ url, path: templateData.page.path, adjusted: parentPath });
	const options: AxiosRequestConfig = {};
	const response = await axios(url, options);
	const siblings = (await response.data) as IPage[];
	// console.log(siblings);
	return siblings;
}

class BuildStepRootLinks implements IPageTemplaterBuildStep {
	build(): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			// you can place logic here and add stuff to templateData by returning it
			// note you do not need to return { ...templateData }, just return the new data you add
			getRootLinks().then((rootPages) => {
				resolve({ rootLinks: rootPages });
			});
		});
	}
}

export default BuildStepRootLinks;
