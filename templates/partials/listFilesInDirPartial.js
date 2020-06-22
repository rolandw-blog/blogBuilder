const listFilesInDir = require('../../build/listFilesInDir')
const path = require('path')

/**
 * @param {Array} exclude - Array of file names to exclude. eg. ["About"]
 */
module.exports = (filepath, exclude, linkStyleClass = "darkHyperLink") => {
	const files = listFilesInDir(filepath, exclude)
	const parsedFiles = []
	files.forEach((f) => { if (f != 'index.js') parsedFiles.push(path.parse(f).name) })

	return (
		`<ul class="">
			${parsedFiles.map((route, i) => `
			<li><a class="lightHyperLink" href="${route.replace(/\s/g, '')}">${route}</a></li>
		`
			.trim()).join('')}
		</ul>`
	)
}
