import React from "react";
import Pages from "./components/Pages";
import styled from "styled-components";
import SearchBar from "./components/SearchBar";

const Styles = styled.div`
	background-color: #282c34;
	// color: #fff;
	font-size: calc(10px + 1.5vmin);
	padding: 0 10%;
	// min-width: 100vw;
	min-height: 100vh;
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
