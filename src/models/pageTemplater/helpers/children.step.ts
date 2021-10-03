import ITemplateData from "../../../interfaces/template.interface";
import axios, { AxiosRequestConfig } from "axios";
import IPage from "../../../interfaces/page.interface";
import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";

async function getSiblings(templateData: ITemplateData): Promise<Partial<ITemplateData>> {
	const dbUrl = process.env["DB_API"] as string;
	const parentPath = templateData.page.path;
	const encPath = encodeURIComponent(`${parentPath.join("/")}/*`);
	const url = `${dbUrl}/pages?path=/${encPath}&limit=-1`;
	const options: AxiosRequestConfig = {};
	const response = await axios(url, options);
	const children = (await response.data) as IPage[];
	if (children.length === 0) {
		return { children: [] };
	}
	return { children };
}

class BuildStepChildren implements IPageTemplaterBuildStep {
	build(templateData: Partial<ITemplateData>): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			getSiblings(templateData as ITemplateData).then(({ children }) => {
				resolve({ children });
			});
		});
	}
}

export default BuildStepChildren;
