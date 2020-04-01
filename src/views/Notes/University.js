const listFilesInDirPartial = require('../../../templates/partials/listFilesInDirPartial')

const page = `
${listFilesInDirPartial("src/views/Notes/University")}
`;

module.exports = {
    page: page, 
	target: null,
	template: "templates/template.ejs"
};
