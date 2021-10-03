import IPage from "../../interfaces/page.interface";
import ITemplateData from "../../interfaces/template.interface";
import axios, { AxiosRequestConfig } from "axios";
import IPageTemplaterBuildStep from "../../interfaces/pageTemplateBuildStep.interface";

class PageTemplater {
	// private templateData: Partial<ITemplateData>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// constructor(buildSteps: Array<any>) {
	// 	// const page = this.getPage(id);
	// 	// this.templateData = this.saturateTemplate(page, buildSteps) as unknown as ITemplateData;
	// }

	private async getPage(id: string): Promise<IPage> {
		const url = `${process.env["DB_API"] as string}/page/${id}`;
		const options: AxiosRequestConfig = {};
		const response = await axios(url, options);
		const data = await response.data;
		// TODO check if data is valid
		return data as IPage;
	}

	// the build steps parameter is created based on the ../helpers/example.ts file
	public async saturateTemplate(
		_id: string,
		buildSteps: Array<IPageTemplaterBuildStep>
	): Promise<ITemplateData> {
		const page = await this.getPage(_id);
		// pre-populate the template with the page data from api
		let templateData: Partial<ITemplateData> = {
			page: page,
			templateDir: "/usr/src/app/src/ejs-templates",
			build: {
				uuid: Math.random().toString().substring(2, 6),
			},
		};

		for await (const step of buildSteps) {
			templateData = { ...templateData, ...(await step.build(templateData)) };
		}

		return { ...page, ...templateData } as ITemplateData;
	}

	// this is the getter to get the template data as a promise so we can await it in other code
	// public get template(): Promise<ITemplateData> {
	// 	return this.templateData as Promise<ITemplateData>;
	// }
}

export default PageTemplater;
