import React, { useState } from "react";
import "../../styles/styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Collapsible } from "./styles";

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

/**
 *
 * @param {*} props
 * @param {*} name
 * @param {*} fetchDataCallback
 * @param {*} renderDataCallback
 */
function Dropdown(props) {
	const [collapsed, setCollapsed] = useState(false);
	const [buttonText, setButtonText] = useState(`Open ${props.name}`);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [addFieldIndex, setAddFieldIndex] = useState(0);
	const { _id } = props;

	const loadHistoryData = async () => {
		if (!collapsed) {
			const { data } = await props.fetchDataCallback(_id);
			setData(data);
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
			setButtonText(`Open ${props.name}`);
		} else {
			content.className = "content";
			setButtonText(`Close ${props.name}`);
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
					data.map((data, index) => {
						console.log(`redering ${props.name} dropdown`);
						return props.renderDataCallback(data, _id, index);
					})}

				{!loading &&
					props.addField &&
					props.renderAddFieldCallback(addFieldIndex)}

				{!loading && data.length === 0 && `No data found.`}
			</div>
		</Collapsible>
	);
}

export default Dropdown;
