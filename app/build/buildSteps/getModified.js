const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const getLastModified = (templateData) => {
	if (templateData.history.length === 0) return undefined;
	const last = templateData.history.reduce((max, e) => {
		if (new Date(e.data.timestamp).getTime() <= new Date(max.data.timestamp).getTime()) {
			return e;
		} else {
			return max;
		}
	});

	// parse the timestamp to a JS date
	const d = new Date(last.data.timestamp);

	// set a pretty date string
	last.data.prettyDate = `${d.getDay()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;

	// return the date object for the last modified history item
	return last;
};

const getFirstModified = (templateData) => {
	if (templateData.history.length === 0) return undefined;
	const first = templateData.history.reduce((min, e) => {
		if (new Date(e.data.timestamp).getTime() >= new Date(min.data.timestamp).getTime()) {
			return e;
		} else {
			return min;
		}
	});

	// parse the timestamp to a JS date
	const d = new Date(first.data.timestamp);

	// set a pretty date string
	first.data.prettyDate = `${d.getDay()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;

	// return the date object for the first modified history item
	return first;
};

module.exports = { getLastModified, getFirstModified };
