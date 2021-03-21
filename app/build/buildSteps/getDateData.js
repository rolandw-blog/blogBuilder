const getDateData = (templateData) => {
    const {_id} = templateData;

    const dateData = new Date(parseInt(_id.substring(0, 8), 16) * 1000);

    const createdDate = {
		full: dateData,
		year: dateData.getFullYear(),
		month: dateData.getMonth() + 1,
		day: dateData.getDate(),
		hour: dateData.getHours(),
	};

    return createdDate;
}

module.exports = getDateData;