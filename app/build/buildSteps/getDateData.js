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

	const dateData = new Date(parseInt(_id.substring(0, 8), 16) * 1000);

	const createdDate = {
		year: dateData.getFullYear(),
		month: dateData.getMonth() + 1,
		day: dateData.getDate(),
		hour: dateData.getHours(),
		full: `${monthNames[this.month]} ${this.day}, ${this.year}`, // pretty print full date
	};

	return createdDate;
};

module.exports = getDateData;
