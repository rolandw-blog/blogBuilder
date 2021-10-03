import IPage from "../../../interfaces/page.interface";
import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";
import ITemplateData from "../../../interfaces/template.interface";

// function breadCrumbs(templateData: Partial<ITemplateData>): Promise<Partial<ITemplateData>> {
// 	return new Promise((resolve) => {
// 		// the array of segments that make up the URL
// 		// ["a", "b", "c"]
// 		const fullArrayOfPathSegments = (templateData.page as IPage).path;

// 		// the array of segments that can be used to create navigation links to previous pages
// 		// [["a"], ["a", "b"], ["a", "b", "c"]]
// 		const nodes: Array<Array<string>> = [[fullArrayOfPathSegments[0] || ""]];

// 		// stick the fullArrayOfPathSegments into the nodes array from left (smallest) to right (largest)
// 		for (let i = 1; i < fullArrayOfPathSegments.length; i++) {
// 			// get the current node
// 			const cur = fullArrayOfPathSegments[i] || "";
// 			// get the array of nodes that are one level below the current node
// 			const pre = nodes[i - 1] || [];
// 			// create a new array of nodes using the current node and the nodes that are one level below the current node
// 			nodes.push([...pre, cur]);
// 		}

// 		// return these nodes back to the templateData
// 		resolve({ breadCrumbs: nodes });
// 	});
// }

class BuildStepBreadCrumbs implements IPageTemplaterBuildStep {
	public build(templateData: Partial<ITemplateData>): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			// the array of segments that make up the URL
			// ["a", "b", "c"]
			const fullArrayOfPathSegments = (templateData.page as IPage).path;

			// the array of segments that can be used to create navigation links to previous pages
			// [["a"], ["a", "b"], ["a", "b", "c"]]
			const nodes: Array<Array<string>> = [[fullArrayOfPathSegments[0] || ""]];

			// stick the fullArrayOfPathSegments into the nodes array from left (smallest) to right (largest)
			for (let i = 1; i < fullArrayOfPathSegments.length; i++) {
				// get the current node
				const cur = fullArrayOfPathSegments[i] || "";
				// get the array of nodes that are one level below the current node
				const pre = nodes[i - 1] || [];
				// create a new array of nodes using the current node and the nodes that are one level below the current node
				nodes.push([...pre, cur]);
			}

			// return these nodes back to the templateData
			resolve({ breadCrumbs: nodes });
		});
	}
}

export default BuildStepBreadCrumbs;
