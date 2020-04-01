const path = require('path')
const fs = require('fs')
const sass = require('node-sass');

// render out sass and write it to the dist folder
// entry could equal: 'src/styles/styles.scss'
// output could equal: 'dist/app.css'
module.exports = (entry, output) => {
	const appRootPath = path.resolve(process.cwd())

	sass.render({
		file: path.resolve(appRootPath, entry),
		outFile: path.resolve(appRootPath, output),
		outputStyle: 'compressed'
	}, function (error, result) {
		if (!error) {
			fs.writeFile(path.resolve(appRootPath, output), result.css, () => {
				//success
			});
		} else {
			console.log(error)
		}
	});
}
