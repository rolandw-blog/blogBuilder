const fs = require('fs')
const path = require('path')

module.exports = (filepath) => {
	const files = []
	fs.readdirSync(filepath).forEach((f) => {
		if (path.parse(f).ext) files.push(f)
	})
	return files;
}