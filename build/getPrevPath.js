const fs = require('fs');
const path = require('path');

// return the previous path from the given path
const generateHtmlpage = function (filepath) {
	const link = filepath.split('/')

	// prepend '/' at the start of the path
	if (link[0].charAt(0) != '/') link[0] = '/' + link[0]

	// remove the last element if not on the root path
	// otherwise the path looks like '/somefile' and should return '/'
	if (link.length > 1) link.pop()
	else return '/'

	// if the link is not on index (link > 0) join it back together
	const result = link.join('/')
	// if (link.length > 0) return 
	// else return '/'
	return result
}

module.exports = generateHtmlpage

// Fetching content from github can be done like this
// const response = await fetch('https://github.com/');
// const data = await response.text();
// console.log(data); 