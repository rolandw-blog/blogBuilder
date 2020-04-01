const page = `
sup
`;

const W1L1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W1/W1_Lecture1.md" 
const W1L2 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W1/W1_Lecture2.md" 
const W2L1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W2/W2_Lecture1.md"
const W2L2 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W2/W2_Lecture2.md"

module.exports = {
    page: page, 
	target: [W1L1, W1L2, W2L1, W2L2],
	template: "templates/navigablePage.ejs"
};
