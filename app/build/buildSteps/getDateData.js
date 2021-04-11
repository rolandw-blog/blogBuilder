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

const getDateData = (templateData) => {
	const { _id } = templateData;

	// I am re-purposing this template field for the CURRENT date at build time
	// 		instead of the time the page was created. To find out when the time was created, look under getModified.js
	// 		getModified.js uses "History" documents logged when the page is created instead of the pages ID parsed to a string.
	// const dateData = new Date(parseInt(_id.substring(0, 8), 16) * 1000);

	// Get the current date
	const dateData = new Date();

	const createdDate = {
		year: dateData.getFullYear(),
		month: dateData.getMonth() + 1,
		day: dateData.getDate(),
		hour: dateData.getHours(),
	};

	createdDate.full = `${monthNames[createdDate.month]} ${createdDate.day}, ${createdDate.year}`; // pretty print full date

	return createdDate;
};

module.exports = getDateData;
