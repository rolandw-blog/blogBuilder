const path = require("path");
const fs = require("fs");
const sass = require("node-sass");
require("dotenv").config();

// render out sass and write it to the dist folder
// entry could equal: 'src/styles/styles.scss'
// output could equal: 'dist/app.css'
module.exports = (entry, output, options) => {
	const {quiet} = options || false;
	sass.render(
		{
			file: path.resolve(process.env.ROOT, entry),
			outFile: path.resolve(process.env.ROOT, output),
			outputStyle: "compressed",
		},
		function (error, result) {
			if (!error) {
				fs.writeFile(
					path.resolve(process.env.ROOT, output),
					result.css,
					() => {
						if (!quiet) console.log(`rendered ${result.stats.entry}`);
						//success
					}
				);
			} else {
				console.log(error);
			}
		}
	);
};
