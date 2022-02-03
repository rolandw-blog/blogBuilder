import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";
import ITemplateData from "../../../interfaces/template.interface";
import getPage from "../../../utils/getPage";

class BuildStepRootLinks implements IPageTemplaterBuildStep {
	build(): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			// you can place logic here and add stuff to templateData by returning it
			// note you do not need to return { ...templateData }, just return the new data you add
			getPage("path", {
				path: "/*",
				limit: "-1",
				page: "1",
			}).then((rootPages) => {
				// remove the page with zero length which is the index page and should
				// not be displayed as a "root link"
				const indexRootLink = rootPages.findIndex((page) => page.path[0] === "");
				if (indexRootLink >= 0) rootPages.splice(indexRootLink, 1);
				resolve({ rootLinks: rootPages });
			});
		});
	}
}

export default BuildStepRootLinks;
