const listFilesInDirPartial = require('../../templates/partials/listFilesInDirPartial')

const page = `
${listFilesInDirPartial("src/views/Notes")}
`;

module.exports = {
    page: page, 
	target: null,
	template: null
};
