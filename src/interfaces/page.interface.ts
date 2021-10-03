export interface ISource {
	url: string;
}

export default interface IPage {
	_id: string;
	name: string;
	source: Array<ISource>;
	path: Array<string>;
	meta: {
		template: string;
		hero: string;
		hidden: boolean;
	};
}

// {
//     "name": "Git on Linux",
//     "source": [{
//         "url": "https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Linux/Git%20on%20Linux.md"
//     }],
//     "path": ["notes", "linux", "git_on_linux"],
//     "meta": {
//         "template": "blogPost.ejs",
//         "hero": "hero value",
//         "hidden": false
//     }
// }
