import React from "react";
import Pages from "./components/Pages";
import styled from "styled-components";
import SearchBar from "./components/SearchBar";

const Styles = styled.div`
	color: #dedede;
	font-size: calc(10px + 1.5vmin);
	padding: 0 10%;
`;

function App() {
	return (
		<Styles>
			<SearchBar />
			<Pages />
		</Styles>
	);
}

export default App;