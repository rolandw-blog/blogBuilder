const fs = require('fs')
const path = require('path')
const getRoutePositionInDir = require('./getRoutePositionInDir');
const listFilesInDir = require('./listFilesInDir');
const getLinkToHtmlFilepath = require('./getLinkToHtmlFilepath');
const log = require('./log');

/**
 * @param {JSON} filepath - readdirp object containing at least a fullpath and path key
 */
module.exports = (filepath) => {

	// get directory of the filepath
	const currentDirectory = path.parse(filepath.fullPath).dir
	// log(`the file ${filepath.path} is in ${currentDirectory}`, "disabled")

	// get the files in the filepaths directory
	const filesInDir = listFilesInDir(currentDirectory, filepath.path)

	// get the position of the filepath in the directory
	const relativeIndex = getRoutePositionInDir(currentDirectory, filepath.basename)

	const potentialNextLink = filesInDir[relativeIndex + 1]
	const potentialPrevLink = filesInDir[relativeIndex - 1]
	
	// if the files is 1 or less then it returns the wrong values
	// this is because the relative index is is -1 if its doesn't exist and evaluates to index 0
	// it can still return undefined though if the relitiveIndex +- 1 is out of range
	const next = (filesInDir.length > 1 && potentialNextLink != undefined && potentialNextLink != "index.js") ?
		filesInDir[relativeIndex + 1] : "-"

	const prev = (filesInDir.length > 1 && potentialPrevLink != undefined && potentialPrevLink != "index.js") ?
		filesInDir[relativeIndex - 1] : "-"

	const nextFilepath = (next != "-" && next != "index.js") ? getLinkToHtmlFilepath(filepath, next) : "#"
	const prevFilepath = (prev != "-" && next != "index.js") ? getLinkToHtmlFilepath(filepath, prev) : "#"

	return {
		next: {
			// get the hyperlink to its neighbor
			filepath: nextFilepath,
			title: (path.parse(next).name)
		},
		prev: {
			// get the hyperlink to its neighbor
			filepath: prevFilepath,
			title: (path.parse(prev).name)
		}
	}
}
