const path = require("path");
const fs = require("fs-extra");
const generateHtmlPages = require("./build/generateHtmlPages");
const renderSass = require("./build/renderSass");
const util = require("util");
require("dotenv").config();

// process.chdir(process.env.ROOT)

// const copy = util.promisify(fs.copyFile)

// const copyToDist = (fpath) => {
// 	const stat = path.parse(fpath);
// 	const src = path.resolve(process.env.ROOT, stat.dir, stat.base);
// 	const dest = path.resolve(process.env.ROOT, "dist", stat.base);
// 	copy(src, dest).catch((err) => {console.log(err)})
// }

// // get some file directories to use later
// const distPath = path.resolve(process.env.ROOT, 'dist')

// // make the dist folder
// if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);

// // copy media folder to the dist folder
// fs.copy(path.resolve(process.env.ROOT, 'src/media'), path.resolve(process.env.ROOT, 'dist/media'), function (err) {
// 	if (err) return console.error(err);
// });

// copyToDist("src/styles/an-old-hope.css")
// copyToDist("src/index.js")
// copyToDist("src/gist.js")

// renderSass('src/styles/dark.scss', 'dist/dark.css')
// renderSass('src/styles/light.scss', 'dist/lightTheme.css')
// renderSass('src/styles/gist.scss', 'dist/gist.css')

generateHtmlPages();
