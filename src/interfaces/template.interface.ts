import IPage from "./page.interface";
import IHumanDates from "./humanDates.interface";

interface buildInfo {
	uuid: string;
}

interface RecentPages {
	created?: IPage[];
	edits?: IPage[];
}

interface ITemplateData extends IPage {
	page: IPage;
	// [["a"], ["a", "b"], ["a", "b", "c"]]
	breadCrumbs: Array<Array<string>>;
	created: IHumanDates;
	styles: Array<string>;
	scripts: Array<string>;
	siblings: Array<IPage>;
	children: Array<IPage>;
	prevPage: IPage | null;
	nextPage: IPage | null;
	parent: IPage | null;
	templateDir: string;
	build: buildInfo;
	rootLinks: Array<IPage>;
	recent: RecentPages;
}

export default ITemplateData;
