const path = require("path");
const fs = require("fs-extra");
const generateHtmlPages = require("./build/generateHtmlPages");
const renderSass = require("./build/renderSass");
const requestNewPage = require("./build/requestNewPage");
const util = require("util");
const debug = require("debug")("staticFolio:Build");
require("dotenv").config();

process.env.ROOT = __dirname;
// process.chdir(process.env.ROOT)

const copy = util.promisify(fs.copyFile);

copy("scripts/gist.js", "dist/gist.js");
copy("scripts/index.js", "dist/index.js");

if (!fs.existsSync("dist/media")) fs.mkdirSync("dist/media");
for (f of fs.readdirSync("src/media")) {
	copy(`src/media/${f}`, `dist/media/${f}`);
}

copy("src/styles/an-old-hope.css", "dist/an-old-hope.css");
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

// copy media folder to the dist folder
// fs.copy(path.resolve(process.env.ROOT, 'src/media'), path.resolve(process.env.ROOT, 'dist/media'), function (err) {
// 	if (err) return console.error(err);
// });

// copyToDist("src/styles/an-old-hope.css")
// copyToDist("src/index.js")
// copyToDist("src/gist.js")

renderSass("src/styles/dark.scss", "dist/dark.css");
renderSass("src/styles/light.scss", "dist/light.css");
renderSass("src/styles/blue.scss", "dist/blue.css");
renderSass("src/styles/gist.scss", "dist/gist.css");
renderSass("src/styles/home.scss", "dist/home.css");
renderSass("src/styles/menu.scss", "dist/menu.css");

// const page = {
// 	pageName: "notes",
// 	meta: {
// 		template: "menu.ejs",
// 	},
// 	source: [],
// 	websitePath: "/notes",
// };
// requestNewPage(page);

generateHtmlPages();
