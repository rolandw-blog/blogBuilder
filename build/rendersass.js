const path = require('path')
const renderSass = require('./renderSass')

// This file is to be called npm monitor:sass to regenerate the styles without rebuilding the entire site
// It is not meant to be run as part of the full build process in build.js
renderSass(path.resolve(process.cwd(), 'src/styles/styles.scss'), 'dist/app.css')
renderSass(path.resolve(process.cwd(), 'src/styles/light.scss'), 'dist/lightTheme.css')
renderSass(path.resolve(process.cwd(), 'src/styles/gist.scss'), 'dist/gist.css')