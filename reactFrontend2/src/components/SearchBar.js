import React, { useState } from "react";
import Styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Styles = Styled.form`
	padding: 0;
	padding: 1em 0;
	
	
	display: grid;
	grid-template-columns: 1fr 10px auto;
	
	
	input {
		grid-column: 1;
		background-color: #363636;
		border: none;
	}

	button {
		grid-column: 3;
	}
`;

const parseTags = (queryString) => {
	// split the string into an array of words
	const queryArray = queryString.split(" ");

	// store the end result
	const tagResult = [];

	// store indexes for the detected tags here
	const tagIndexes = [];

	// for each word add its index to tagIndexes if its a tag keyword
	for (let i = 0; i < queryArray.length; i++) {
		const word = queryArray[i];
		if (word[0] === ":") tagIndexes.push(i);
	}

	// print the tagIndexes [number, number,...]
	// console.log(`tags found at ${tagIndexes}`);

	// for each tagindex get a "from and to" range
	// use that range to slice the queryArray of all words to extract the tag + its value
	for (let i = 0; i < tagIndexes.length; i++) {
		// get the fromIndex which is the tag name in the array
		const fromIndex = tagIndexes[i];
		// get the toIndex which is the next tag index plus one
		const toIndex = tagIndexes[i + 1] || queryArray.length;

		// the results is a range in the query array [fromTheTag...toTheNextTag]
		const result = queryArray.slice(fromIndex, toIndex).join(" ");
		tagResult.push({
			key: result.split(" ")[0].substring(1),
			value: result.split(" ").splice(1, result.length).join(" "),
		});
		// console.log(`from ${fromIndex} to ${toIndex}: ${result}`);
	}

	return tagResult;
};

export default function SearchBar(props) {
	const [queryString, setQueryString] = useState("");
	const search = (event) => {
		event.preventDefault();
		// console.log("searching!");

		// right now theres a limitation on the blogwatcher backend that only allows for 1 things to be queried at a time
		// this is a workaround where i just return an array of 1 tag so in the future i can work with multiple tags
		const tag = parseTags(queryString)[0];
		props.formCallback(queryString, tag);
	};

	return (
		<Styles>
			<input
				className="input"
				placeholder="Search"
				defaultValue=""
				onSubmit={search}
				onChange={(e) => {
					setQueryString(e.currentTarget.value);
				}}
			></input>
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
