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
		async ({ pageSize, pageIndex, searchFilter }) => {
			// console.log("running fetchData callback");
			// This will get called when the table needs new data

			// Set the loading state
			setLoading(true);

			const json = await fetchDataPromise(
				pageIndex,
				pageSize,
				searchFilter
			);

			const newData = json.data;
			setData(newData);

			if (!searchFilter) {
				const pgCount = Math.ceil(parseInt(json.count) / pageSize);
				setPageCount(pgCount);
				console.log(`the new number of pages is: ${pgCount}`);
			} else {
				// if there is a filter (we are searching for a page) then only show page numbers for those results
				const pgCount = Math.ceil(parseInt(newData.length) / pageSize);
				setPageCount(pgCount);
				console.log(`the new number of pages is: ${pgCount}`);
			}

			setLoading(false);
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
