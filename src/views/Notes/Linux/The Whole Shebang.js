const fs = require('fs')
const path = require('path')
require('dotenv').config()

const page = ``;

// const apt = "/RolandWarburton/staticFolio/master/src/views/Notes/Linux/Apt Package Manager.md"
const files = fs.readdirSync(path.resolve(process.env.ROOT, "src/views/Notes/Linux/"))
const baseurl = "https://raw.githubusercontent.com/RolandWarburton/knowledge/master/Linux/"

const targets = []
files.forEach((f) => {
	targets.push(baseurl + path.parse(f).name.replace('%20', ' ') + ".md")
})

module.exports = {
    page: page, 
	target: targets,
	template: "templates/navigablePage.ejs"
};
