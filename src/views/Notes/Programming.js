const listFilesInDirPartial = require('../../../templates/partials/listFilesInDirPartial')

const page = `
${listFilesInDirPartial("src/views/Notes/Programming")}
`;

module.exports = {
    page: page, 
	target: null,
	template: "templates/template.ejs"
};
