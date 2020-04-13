const path = require('path')
const renderSass = require('./renderSass')
require('dotenv').config()

// This file is to be called npm monitor:sass to regenerate the styles without rebuilding the entire site
// It is not meant to be run as part of the full build process in build.js
renderSass(path.resolve(process.env.ROOT, 'src/styles/styles.scss'), 'dist/app.css')
renderSass(path.resolve(process.env.ROOT, 'src/styles/light.scss'), 'dist/lightTheme.css')
renderSass(path.resolve(process.env.ROOT, 'src/styles/gist.scss'), 'dist/gist.css')