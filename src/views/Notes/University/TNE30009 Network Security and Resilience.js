const page = `
`;

const W1L1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W1/W1_Lecture1.md" 
const W1L2 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W1/W1_Lecture2.md" 
const W2L1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W2/W2_Lecture1.md"
const W2L2 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W2/W2_Lecture2.md"
const W3L1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W3/W3_Lecture1.md"
const W3L2 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W3/W3_lecture2.md"
const W4L1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W4/W4_lecture1.md"
const W5L1 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W5/W5_Lecture1.md"
const W5L2 = "https://TOKEN@raw.githubusercontent.com/RolandWarburton/Swinburne2020S1/master/TNE30009_Network_Security_and_Resilience/W5/W5_Lecture2.md"

module.exports = {
    page: page, 
	target: [W1L1, W1L2, W2L1, W2L2, W3L1, W3L2, W4L1, W5L1, W5L2],
	template: "templates/navigablePage.ejs"
};
