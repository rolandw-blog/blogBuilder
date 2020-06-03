const path = require('path')
const util = require('util')
const fs = require('fs')
const renderSass = require('./renderSass')
require('dotenv').config()

const copy = util.promisify(fs.copyFile)

const copyToDist = (fpath) => {
	const stat = path.parse(fpath);
	const src = path.resolve(process.env.ROOT, stat.dir, stat.base);
	const dest = path.resolve(process.env.ROOT, "dist", stat.base);
	copy(src, dest).catch((err) => {console.log(err)})
}

// This file is to be called npm monitor:sass to regenerate the styles without rebuilding the entire site
const dark = path.resolve(process.env.ROOT, 'src/styles/dark.scss')
const light = path.resolve(process.env.ROOT, 'src/styles/light.scss')
const gist = path.resolve(process.env.ROOT, 'src/styles/gist.scss')
renderSass(dark, 'dist/dark.css')
renderSass(light, 'dist/lightTheme.css')
renderSass(gist, 'dist/gist.css')

copyToDist("src/styles/an-old-hope.css")
copyToDist("src/index.js")
copyToDist("src/gist.js")