import ITemplateData from "../../../interfaces/template.interface";
import axios, { AxiosRequestConfig } from "axios";
import IPage from "../../../interfaces/page.interface";
import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";
import { API_URL } from "../../../constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testIfParent(child: IPage, parentPath: Array<string>) {
	// if the child path is the same as the parent path
	const isParent = child.path.every((pathSegment, index) => pathSegment === parentPath[index]);
	return isParent;
}

async function getParent(templateData: ITemplateData): Promise<IPage> {
	// get the pages siblings by getting the children of the current pages parents
	const parentPath = templateData.page.path.slice(0, -1);
	const encPath = encodeURIComponent(parentPath.join("/"));
	const url = `${API_URL}/pages?path=/${encPath}&limit=-1`;
	const options: AxiosRequestConfig = {};
	const response = await axios(url, options);
	const data = await response.data;

	// a 404 backup page in case there is no parent
	const notFound = { name: "404", path: ["404"] };

	// get the parent by looking for the
	const parent: IPage = data.find((page: IPage) => testIfParent(page, parentPath)) || notFound;

	return parent;
}

class BuildStepParent implements IPageTemplaterBuildStep {
	build(templateData: Partial<ITemplateData>): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			// you can place logic here and add stuff to templateData by returning it
			// note you do not need to return { ...templateData }, just return the new data you add
			getParent(templateData as ITemplateData).then((parent: IPage) => {
				resolve({ parent });
			});
		});
	}
}

export default BuildStepParent;
