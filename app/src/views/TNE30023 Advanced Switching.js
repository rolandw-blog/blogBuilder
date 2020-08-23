const page = `
`;

const SETUP = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S2/master/TNE30023-Advanced-Switching/README.md"
const LAB1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S2/master/TNE30023-Advanced-Switching/week1/labs/lab1.md"
const LAB2 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S2/master/TNE30023-Advanced-Switching/week2/labs/lab2.md"

module.exports = {
    page: page, 
	target: [SETUP, LAB1, LAB2],
	template: "templates/navigablePage.ejs"
};
