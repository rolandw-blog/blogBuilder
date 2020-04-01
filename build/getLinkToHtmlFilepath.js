const fs = require('fs')
const path = require('path')
const getRoutePositionInDir = require('./getRoutePositionInDir');
const listFilesInDir = require('./listFilesInDir');
const log = require('./log');
const colors = require('colors');

// the targetFilepath MUST be in the SAME directory that the filepath is
module.exports = (filepath, targetFile) => {
	// the path up until the current dir that we are grabbing the targetFile in
	targetFile = (targetFile != "index.js") ? path.parse(targetFile).name : '#'

	let thisDirPath = targetFile
	if (filepath.path.split('/').length > 1) {
		const a = filepath.path.split('/')
		a.pop()
		thisDirPath = '/' + a.join('/') + '/' + targetFile;
		return thisDirPath
	} else {
		return '/' + thisDirPath
	}
}
