import ITemplateData from "../../../interfaces/template.interface";
import IPage from "../../../interfaces/page.interface";
import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";

// async function neighbors(templateData: ITemplateData): Promise<Partial<ITemplateData>> {
// 	return new Promise((resolve) => {
// 		// get the location of the actual page within its siblings
// 		const currPageIndexInSiblings = templateData.siblings.findIndex(
// 			(s: IPage) => s._id === templateData.page._id
// 		);

// 		const prev =
// 			currPageIndexInSiblings > 0 ? templateData.siblings[currPageIndexInSiblings - 1] : null;
// 		const next =
// 			currPageIndexInSiblings < templateData.siblings.length - 1
// 				? templateData.siblings[currPageIndexInSiblings + 1]
// 				: null;
// 		resolve({ nextPage: next, prevPage: prev });
// 	});
// }

class BuildStepNeighbors implements IPageTemplaterBuildStep {
	public build(templateData: Partial<ITemplateData>): Promise<Partial<ITemplateData>> {
		return new Promise((resolve, reject) => {
			if (!templateData.siblings) {
				// TODO use _filename in this or something for a custom error(make sure _filename works in a test)
				reject(new Error(`No siblings provided`));
			} else if (!templateData.page) {
				reject(new Error(`No page.id provided`));
			} else {
				// get the location of the actual page within its siblings
				const pageId = templateData.page._id;
				const currPageIndexInSiblings = templateData.siblings.findIndex(
					(s: IPage) => s._id === pageId
				);

				const prev =
					currPageIndexInSiblings > 0
						? templateData.siblings[currPageIndexInSiblings - 1]
						: null;

				const next =
					currPageIndexInSiblings < templateData.siblings.length - 1
						? templateData.siblings[currPageIndexInSiblings + 1]
						: null;

				resolve({ nextPage: next, prevPage: prev });
			}
		});
	}
}

export default BuildStepNeighbors;
