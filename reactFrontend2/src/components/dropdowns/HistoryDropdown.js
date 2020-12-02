import React from "react";
import fetchHistoryPromise from "../helpers/fetchHistoryPromise";
import emoji from "node-emoji";
import "../../styles/styles.scss";
import { History } from "./styles";
import Dropdown from "./Dropdown";

/**
 *
 * @param {JSON} history - History object returned from blogwatcher
 */
const historyEntry = (history, key) => {
	// if the history data is a single "event" its returned as a JSON object and needs to be turned into an iterable array
	if (!Array.isArray(history.data.modified)) {
		history.data.modified = new Array(history.data.modified);
	}

	return (
		<History key={key + history.data.timestamp}>
			{/* author */}
			<h3>Author</h3>
			<span>
				Commit from {history.data.committer.name} at{" "}
				{history.data.timestamp}.
			</span>
			{/* message */}
			<h3>Message</h3>
			<span>{emoji.emojify(history.data.message)}</span>
			{/* modified */}
			<h3>Modified</h3>
			<ul>
				{history.data.modified.map((file, index) => {
					return (
						<li key={history.data.timestamp}>
							<span>{file}</span>
						</li>
					);
				})}
			</ul>
		</History>
	);
};

export default function SourcesDropdown(props) {
	const { _id } = props;

	// mock the "api call" to the database
	// because we already have the source information on hand
	const loadHistoryData = async (_id) => {
		const request = await fetchHistoryPromise(_id);
		const result = await request.json();
		console.log(result);
		return result;
	};

	return (
		<Dropdown
			_id={_id}
			name={"history"}
			addfield={false}
			fetchDataCallback={(_id) => {
				return loadHistoryData(_id);
			}}
			renderDataCallback={(data, index) => {
				console.log(data);
				return historyEntry(data, index);
			}}
		></Dropdown>
	);
}
