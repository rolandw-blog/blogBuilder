import styled from "styled-components";

export const DisplayContainer = styled.div`
	display: grid;
	grid-template-columns: ${(props) =>
		props.noTitle ? "1fr auto" : "30% 1fr 10%"};
	padding: 5px;
	height: 100%;
	background: ${(props) => (props.color ? props.color : "magenta")};

	span {
		color: #dedede;
		// dont overflow text
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
`;

// DisplayContainer.defaultProps = {
// 	background: "282C34",
// };

// const EditingTheme = styled.div`
// 	background: ${(props) => props.theme.background}
// 	height: 100%;
// 	padding: 5px;
// `;

export const EditContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	padding: 5px;
	height: 100%;

	input {
		width: 100%;
		margin: 0;
		padding: 0;
		background: ${(props) => (props.color ? props.color : "#282C34")};
		border-top: none;
		border-left: none;
		border-right: none;
		border-bottom: 1px solid #dedede;
		color: #dedede;
		font-size: 1em;
	}
`;

export const BaseStyle = styled.div`
	button {
		grid-column: last-col;
	}
	// div {
	// 	padding: 5px;
	// 	// height: 100%;
	// 	// height: 100%;
	// }

	// div > .buttons {
	// 	margin: auto;
	// }

	// // !center the button
	// div > button {
	// 	// display: flex;
	// 	// align-self: center;
	// 	margin: auto;
	// 	grid-column: 2;
	// 	padding: 0 10px;
	// }
`;
