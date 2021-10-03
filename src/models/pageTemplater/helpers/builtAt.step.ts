import IPageTemplaterBuildStep from "../../../interfaces/pageTemplateBuildStep.interface";

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

import IHumanDates from "../../../interfaces/humanDates.interface";
import ITemplateData from "../../../interfaces/template.interface";

// function buildAt(): Promise<Partial<ITemplateData>> {
// 	return new Promise((resolve) => {
// 		const dateData = new Date();
// 		const year = dateData.getFullYear();
// 		const month = dateData.getMonth();
// 		const day = dateData.getDate();
// 		const hour = dateData.getHours();
// 		const dateString = `${monthNames[month]} ${day}, ${year}`;

// 		const createdDate: IHumanDates = {
// 			year,
// 			month,
// 			day,
// 			hour,
// 			dateString,
// 		};
// 		resolve({ created: createdDate });
// 	});
// }

class BuildStepBuildAt implements IPageTemplaterBuildStep {
	build(): Promise<Partial<ITemplateData>> {
		return new Promise((resolve) => {
			const dateData = new Date();
			const year = dateData.getFullYear();
			const month = dateData.getMonth();
			const day = dateData.getDate();
			const hour = dateData.getHours();
			const dateString = `${monthNames[month]} ${day}, ${year}`;

			const createdDate: IHumanDates = {
				year,
				month,
				day,
				hour,
				dateString,
			};
			resolve({ created: createdDate });
		});
	}
}

export default BuildStepBuildAt;
