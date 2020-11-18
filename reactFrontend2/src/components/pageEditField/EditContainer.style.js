import styled from "styled-components";

export default styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	padding: 5px;
	height: 100%;

	// !center the button
	button {
		display: flex;
		align-self: center;
		grid-column: 2;
		padding: 0 10px;
	}

	.buttons {
		margin-left: auto;
	}

	input {
		width: 100%;
		margin: 0;
		padding: 0;
		background: ${(props) => (props.color ? props.color : "#282C34")};
		// background: ${(props) => (props.color ? props.color : "magenta")};
		border-top: none;
		border-left: none;
		border-right: none;
		border-bottom: 1px solid #dedede;
		color: #dedede;
		font-size: 1em;
	}
`;
