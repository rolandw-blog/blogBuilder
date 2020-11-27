import styled from "styled-components";

const Collapsible = styled.div`
	overflow: scroll;
	margin-top: 1em;
	border-radius: 10px;

	.content {
		max-height: 1000px;
		transition: max-height 0.2s;
		background-color: #363636;
		padding: 2.5px 5px;
	}

	.collapsed {
		max-height: 0;
		transition: max-height 0.2s;
		overflow: hidden;
	}

	a {
		color: #dedede;
		background-color: #363636;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr auto 10px;
		padding: 2.5px 5px;
		padding-top: 5px;
	}

	svg {
		height: 100%;
	}
`;

const History = styled.div`
	margin: 1em 0;
	padding: 1ch 0;
	font-size: 0.5em;
	border-bottom: 1px solid #dedede;
	padding: 2.5px 5px;
`;

export { Collapsible, History };
