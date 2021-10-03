import ITemplateData from "../../../interfaces/template.interface";
import axios, { AxiosRequestConfig } from "axios";
import IPage from "../../../interfaces/page.interface";
import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";

async function getSiblings(templateData: ITemplateData): Promise<Partial<ITemplateData>> {
	const dbUrl = process.env["DB_API"] as string;
	// get the pages siblings by getting the children of the current pages parents
	const parentPath = templateData.page.path.slice(0, -1);
	const encPath = encodeURIComponent(parentPath.join("/"));
	const url = `${dbUrl}/pages?path=/${encPath}/*&limit=-1`;
	const options: AxiosRequestConfig = {};
	const response = await axios(url, options);
	const siblings = (await response.data) as IPage[];
	// console.log(siblings);
	return { siblings };
}

class BuildStepSiblings implements IPageTemplaterBuildStep {
	build(templateData: Partial<ITemplateData>): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			getSiblings(templateData as ITemplateData).then(({ siblings }) => {
				resolve({ siblings });
			});
		});
	}
}

export default BuildStepSiblings;
