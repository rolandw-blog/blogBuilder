import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";
import ITemplateData from "../../../interfaces/template.interface";

class example implements IPageTemplaterBuildStep {
	build(templateData: Partial<ITemplateData>): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			// you can place logic here and add stuff to templateData by returning it
			// note you do not need to return { ...templateData }, just return the new data you add
			resolve({ ...templateData });
		});
	}
}

export default example;
