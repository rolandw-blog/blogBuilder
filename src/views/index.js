const listFilesInDirPartial = require('../../templates/partials/listFilesInDirPartial')

const page = `
	<div id="home">
		<div class="center">
			${listFilesInDirPartial("src/views")}
		</div>
		<a class="darkHyperLink">
			<img height="25px" src="/media/logo.svg" class="caret" />
		</a>
	</div>
`;

module.exports = {
	page: page,
	target: null,
	template: "./templates/home.ejs"
};

// module.exports = {
// 	page: page,
// 	target: "https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Linux/gitOnLinux.md",
// 	template: "./templates/home.ejs"
// };

// 