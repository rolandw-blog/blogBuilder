import ITemplateData from "../../interfaces/template.interface";
import IPageTemplaterBuildStep from "../../interfaces/pageTemplateBuildStep.interface";
import IPage from "../../interfaces/page.interface";
import getPage from "../../utils/getPage";

class PageTemplater {
	// the build steps parameter is created based on the ../helpers/example.ts file
	public async saturateTemplate(
		page: IPage,
		buildSteps: Array<IPageTemplaterBuildStep>
	): Promise<ITemplateData> {
		// TODO implement a cache for "created recently" pages
		const createdRecently = await getPage("path", { path: "/**", page: "1", limit: "5" });
		// pre-populate the template with the page data from api
		let templateData: Partial<ITemplateData> = {
			page: page,
			templateDir: "/usr/src/app/src/ejs-templates",
			build: {
				uuid: Math.random().toString().substring(2, 6),
			},
			recent: {
				created: createdRecently,
			},
		};

		for await (const step of buildSteps) {
			templateData = { ...templateData, ...(await step.build(templateData)) };
		}

		return { ...page, ...templateData } as ITemplateData;
	}
}

export default PageTemplater;
