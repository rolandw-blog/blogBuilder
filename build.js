const path = require('path')
const fs = require('fs-extra');
const generateHtmlPages = require('./build/generateHtmlPages');
const renderSass = require('./build/renderSass')
const log = require('./build/log')


// get some file directories to use later
const viewsDir = path.resolve(process.cwd(), 'src/views')
const appRootPath = path.resolve(process.cwd())
const distPath = path.resolve(appRootPath, 'dist')

// make the disk folder
if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);

// copy media to the dist folder
fs.copy(path.resolve(appRootPath, 'src/media'), path.resolve(appRootPath, 'dist/media'), function (err) {
	if (err) return console.error(err);
});

renderSass('src/styles/styles.scss', 'dist/app.css')
renderSass('src/styles/light.scss', 'dist/lightTheme.css')

generateHtmlPages()
