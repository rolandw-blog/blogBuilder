import styled from "styled-components";

export const DisplayContainer = styled.div`
	display: grid;
	grid-template-columns: ${(props) =>
		props.noTitle ? "1fr auto" : "30% 1fr auto auto"};
	// padding: 5px;
	background: ${(props) => (props.color ? props.color : "magenta")};
`;

export const EditContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	// padding: 5px;

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

export const AddContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	// padding: 5px;

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
	.field-edit-button {
		grid-column: last-col - 1;
	}

	.field-delete-button {
		grid-column: last-col;
	}

	span {
		color: #dedede;
		// dont overflow text
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
`;
