import ITemplateData from "./template.interface";

// type PageTemplaterBuildStepFunction = Array<
// 	(templateData: Partial<ITemplateData>) => Promise<Partial<ITemplateData>>
// >;

interface IPageTemplaterBuildStep {
	// just assume we have full ITemplateData as the argument
	build: (templateData: Partial<ITemplateData>) => Promise<Partial<ITemplateData>>;
}

// type buildStepFunctionSignature = (
// 	templateData: Partial<ITemplateData>
// ) => Promise<Partial<ITemplateData>>;

// class PageTemplateBuildStepFactory implements IPageTemplaterBuildStep {
// 	private runBuildStep: buildStepFunctionSignature;
// 	constructor(buildStep: buildStepFunctionSignature, templateData: Partial<ITemplateData>) {
//         this.runBuildStep = buildStep;
//         this.runBuildStep(templateData);
// 	}
// }

// function PageTemplateBuildStepFactory(
// 	buildStep: buildStepFunctionSignature,
// 	templateData: Partial<ITemplateData>
// ): PageTemplateBuildStep {
// 	return new PageTemplateBuildStep(buildStep, templateData);
// }

// class PageTemplateBuildStep implements IPageTemplaterBuildStep {
// 	private runBuildStep: buildStepFunctionSignature;
// 	private templateData: Partial<ITemplateData>;
// 	constructor(buildStep: buildStepFunctionSignature, templateData: Partial<ITemplateData>) {
// 		this.runBuildStep = buildStep;
// 		this.templateData = templateData;
// 	}

// 	public get TemplateData(): Partial<ITemplateData> {
// 		return this.runBuildStep(this.templateData);
// 	}
// }

// export default PageTemplateBuildStepFactory;
export default IPageTemplaterBuildStep;
