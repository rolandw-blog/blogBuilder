const argv = require('yargs').argv
const colors = require('colors');

const low = (message) => {
	console.log(`${message}`.white)
}

const medium = (message) => {
	console.log(`${message}`.yellow)
}

const high = (message) => {
	console.log(`${message}`.red)
}

const superHigh = (message) => {
	console.log(`${message}`.red.bold.underline)
}

module.exports = (message, type = "low") => {
	switch (type) {
		case "disabled":
			break;
		case "low":
			if (argv.v) low(message);
			break;
		case "medium":
			if (argv.v) medium(message);
			break;
		case "high":
			if (argv.v) high(message);
			break;
		case "veryHigh":
			superHigh(message);
			break;
		default:
			low(message);
	}
}
