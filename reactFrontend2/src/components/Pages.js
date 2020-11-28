import fetchDataPromise from "./helpers/fetchDataPromise";
import React, { useMemo, useState, useRef, useEffect } from "react";
import SearchBar from "./SearchBar";

import Table from "./Table";

export default function Pages() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pageCount, setPageCount] = useState(0);

	const columns = useMemo(
		() => [
			{
				Header: "Index",
				accessor: "i",
			},
			{
				Header: "ID",
				accessor: "_id",
			},
			{
				Header: "page Name",
				accessor: "pageName",
			},
			{
				Header: "Edit",
				accessor: "",
			},
			{
				Header: "Build",
				accessor: "",
			},
		],
		[]
	);

	const fetchData = React.useCallback(
		({ pageSize, pageIndex, searchFilter }) => {
			// console.log("running fetchData callback");
			// This will get called when the table needs new data

			// Set the loading state
			setLoading(true);

			fetchDataPromise(pageIndex, pageSize, searchFilter)
				.then((res) => {
					return res.json();
				})
				.then((json) => {
					const newData = json.data;
					// console.log(`got ${newData.length} new items from the API`);

					setData(newData);
					setPageCount(Math.ceil(parseInt(json.count) / pageSize));
					setLoading(false);
				});
		},
		[]
	);

	return (
		<>
			<Table
				columns={columns}
				data={data}
				fetchData={fetchData}
				loading={loading}
				pageCount={pageCount}
			/>
		</>
	);
}
