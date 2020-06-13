const fs = require('fs')
const path = require('path')

/**
 * @param {Array} exclude - array of files to exclude
 */
module.exports = (filepath, exclude) => {
	const files = []

	// turn any unpassed or empty arrays into []
	if (exclude == undefined || exclude.length == 0 || exclude == undefined) exclude = [];

	fs.readdirSync(filepath).forEach((f) => {
		const stat = path.parse(f);
		if (stat.ext == ".js" && !exclude.includes(stat.name)) files.push(f)
	})
	return files;
}
