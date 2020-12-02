import fetchDataPromise from "./helpers/fetchDataPromise";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Container } from "@material-ui/core";
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

					// set the data for the table
					setData(newData);

					// if there isnt a search filter then display a page count for ALL possible pages (we load them in later)
					if (!searchFilter) {
						setPageCount(
							Math.ceil(parseInt(json.count) / pageSize)
						);
					} else {
						// if there is a filter (we are searching for a page) then only show page numbers for those results
						setPageCount(
							Math.ceil(parseInt(newData.length) / pageSize)
						);
					}
					setLoading(false);
				});
		},
		[]
	);

	return (
		<Container maxWidth="md">
			<Table
				columns={columns}
				data={data}
				fetchData={fetchData}
				loading={loading}
				pageCount={pageCount}
			/>
		</Container>
	);
}
