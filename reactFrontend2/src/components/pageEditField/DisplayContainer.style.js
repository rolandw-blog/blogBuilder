import styled from "styled-components";

export default styled.div`
	display: grid;
	grid-template-columns: ${(props) =>
		props.noTitle ? "1fr auto" : "30% 1fr 10%"};
	padding: 5px;
	height: 100%;

	span {
		background: ${(props) => (props.color ? props.color : "magenta")};
		color: #dedede;
		// dont overflow text
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	button {
		display: flex;
		align-self: center;
		grid-column: 2;
		padding: 0 10px;
	}

	.buttons {
		margin-left: auto;
	}
`;
