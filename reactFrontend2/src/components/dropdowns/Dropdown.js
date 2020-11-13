import React, { useState } from "react";
import fetchHistoryPromise from "../fetchHistoryPromise";
import emoji from "node-emoji";
import styled from "styled-components";
import "../../styles/styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

const Collapsible = styled.div`
	overflow: scroll;
	margin-top: 1em;
	border-radius: 10px;

	.content {
		max-height: 1000px;
		transition: max-height 0.2s;
		background-color: #363636;
		padding: 2.5px;
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
		grid-template-columns: 1fr auto;
		padding: 2.5px;
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
	padding: 2.5px;
`;

/**
 *
 * @param {JSON} history - History object returned from blogwatcher
 */
const historyEntry = (history, key) => {
	return (
		<History key={key}>
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
				{history.data.modified.map((file) => {
					return (
						<li>
							<span>{file}</span>
						</li>
					);
				})}
			</ul>
		</History>
	);
};

function DropdownButton(props) {
	const { collapsed } = props;
	return (
		<FontAwesomeIcon
			onClick={(e) => {
				e.preventDefault();
			}}
			className="has-text-right icon"
			icon={collapsed ? faAngleUp : faAngleDown}
			color={"white"}
		/>
	);
}

export default function Dropdown(pageID) {
	const [collapsed, setCollapsed] = useState(false);
	const [buttonText, setButtonText] = useState("Open history");
	const [loading, setLoading] = useState(true);
	const [history, setHistory] = useState([]);
	const { _id } = pageID;

	const loadHistoryData = async () => {
		if (!collapsed) {
			const { history } = await (await fetchHistoryPromise(_id)).json();
			setHistory(history);
			setLoading(false);
		}
	};

	const handleCollapser = (event) => {
		event.preventDefault();
		setCollapsed(!collapsed);

		// get the target conent div to show/hide it
		const content = event.target.closest("div").querySelector(".content");

		if (collapsed) {
			content.className = "content collapsed";
			setButtonText("Open history");
		} else {
			content.className = "content";
			setButtonText("Close history");
			loadHistoryData();
		}
	};

	return (
		<Collapsible>
			<a href={"/"} onClick={handleCollapser}>
				{buttonText} <DropdownButton collapsed={collapsed} />
			</a>

			<div className="content collapsed">
				{!loading &&
					history.map((history, index) => {
						console.log("redering history");
						console.log(index);
						return historyEntry(history, index);
					})}

				{!loading && history.length === 0 && `No history found.`}
			</div>
		</Collapsible>
	);
}
