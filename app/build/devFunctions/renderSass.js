const renderSass = require("../renderSass");

console.log("rendering sass...");
renderSass("src/styles/dark.scss", "dist/dark.css");
renderSass("src/styles/light.scss", "dist/light.css");
renderSass("src/styles/blue.scss", "dist/blue.css");
renderSass("src/styles/gist.scss", "dist/gist.css");
renderSass("src/styles/home.scss", "dist/home.css");
renderSass("src/styles/menu.scss", "dist/menu.css");
console.log("rendering sass Complete");
