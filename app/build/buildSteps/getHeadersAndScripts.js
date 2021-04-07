const path = require('path');

const generate = (fileName) => {
    const ext = path.parse(fileName).ext
    switch (ext) {
        case ".css":
            return `<link rel="stylesheet" type="text/css" href="/${fileName}" />`
        case ".js":
            return `<script src="/${fileName}"></script>`
        default:
            break;
    }
}

const getScripts = (template) => {
    const scripts = [];
    switch (template) {
        case "blogPost.ejs":
            scripts.push(generate("gist.js"));
            break;
        case "home.ejs":
            scripts.push(generate("index.js"));
            break;
        case "template.ejs":
            scripts.push(generate("gist.js"));
            break;
        default:
            break;
    }
    return scripts;
}

const getHeaders = (template) => {
    const styles = [];
    switch (template) {
        case "blogPost.ejs":
            styles.push(generate("light.css"));
            styles.push(generate("gist.css"));
            styles.push(generate("an-old-hope.css"));
            break;
        case "home.ejs":
            styles.push(generate("home.css"));
            break;
         case "menu.ejs":
            styles.push(generate("dark.css"));
            break;
        case "about.ejs":
            styles.push(generate("dark.css"));
            break;
        case "template.ejs":
            styles.push(generate("light.css"));
            break;
        default:
            break;
    }
    return styles;
}

module.exports = {getHeaders, getScripts}