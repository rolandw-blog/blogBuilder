import React from "react";
import PageEditField from "../PageEditField";
import "../../styles/styles.scss";
import Dropdown from "./Dropdown";

/**
 *
 * @param {JSON} history - History object returned from blogwatcher
 */
const sourceEntry = (history, key) => {
	return (
		<div key={key.toString()}>
			<PageEditField noTitle name={"URL"} value={history.url} />
		</div>
	);
};

export default function SourcesDropdown(props) {
	const { _id } = props;

	// mock the "api call" to the database
	// because we already have the source information on hand
	const fetchData = () => {
		const { source } = props;
		return { data: source };
	};

	return (
		<Dropdown
			_id={_id}
			name={"sources"}
			fetchDataCallback={() => {
				return fetchData();
			}}
			renderDataCallback={(data, index) => {
				console.log(data);
				return sourceEntry(data, index);
			}}
		></Dropdown>
	);
}
