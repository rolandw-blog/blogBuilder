const page = `
`;

const SETUP = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S2/master/TNE30023-Advanced-Switching/README.md"
const LAB1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S2/master/TNE30023-Advanced-Switching/week1/labs/lab1.md"

module.exports = {
    page: page, 
	target: [SETUP, LAB1],
	template: "templates/navigablePage.ejs"
};
