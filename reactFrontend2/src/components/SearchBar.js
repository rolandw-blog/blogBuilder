import React from "react";
import Styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Styles = Styled.form`
	// paddo: 1em 0;
	padding: 0;
	padding: 1em 0;
	
	
	display: grid;
	grid-template-columns: 1fr 10px auto;
	
	
	input {
		grid-column: 1
	}

	button {
		grid-column: 3;
	}
`;
export default function SearchBar(props) {
	const search = () => {
		console.log("searching!");
	};

	return (
		<Styles>
			<input className="input" placeholder="Search"></input>
			<button className="button is-dark" onClick={search}>
				<FontAwesomeIcon
					className="has-text-right icon"
					icon={faSearch}
					color={"white"}
				/>
			</button>
		</Styles>
	);
}
