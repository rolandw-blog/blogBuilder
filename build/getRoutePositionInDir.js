const fs = require('fs')
const path = require('path')

// example getRoutePositionInDir("views/notes", "notesPage.js")
const getRoutePositionInDir = (filepath, filename) => {
	const files = []
	fs.readdirSync(filepath).forEach((f) => {
		if (path.parse(f).ext) files.push(f)
	})
	return files.indexOf(filename);
}

module.exports = getRoutePositionInDir