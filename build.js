const path = require('path')
const fs = require('fs-extra');
const generateHtmlPages = require('./build/generateHtmlPages');
const renderSass = require('./build/renderSass')
require('dotenv').config()

process.chdir(process.env.ROOT)

// get some file directories to use later
const distPath = path.resolve(process.env.ROOT, 'dist')

// make the disk folder
if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);

// copy media to the dist folder
fs.copy(path.resolve(process.env.ROOT, 'src/media'), path.resolve(process.env.ROOT, 'dist/media'), function (err) {
	if (err) return console.error(err);
});

// copy highlight-js styles to dist
fs.copyFile(path.resolve(process.env.ROOT, 'src/styles/an-old-hope.css'), path.resolve(process.env.ROOT, 'dist/an-old-hope.css'), function (err) {
	if (err) return console.error(err);
});

renderSass('src/styles/dark.scss', 'dist/dark.css')
renderSass('src/styles/light.scss', 'dist/lightTheme.css')
renderSass('src/styles/gist.scss', 'dist/gist.css')

generateHtmlPages()
