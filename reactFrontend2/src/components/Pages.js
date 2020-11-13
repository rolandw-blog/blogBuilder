import fetchDataPromise from "./fetchDataPromise";
import React, { useMemo, useState, useRef } from "react";

import Table from "./Table";

export default function Pages() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pageCount, setPageCount] = useState(0);
	const fetchIdRef = useRef(0);

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

	const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
		console.log("running fetchData callback");
		// This will get called when the table needs new data
		// You could fetch your data from literally anywhere,
		// even a server. But for this example, we'll just fake it.

		// Give this fetch an ID
		const fetchId = ++fetchIdRef.current;

		// Set the loading state
		setLoading(true);

		fetchDataPromise(pageIndex, pageSize)
			.then((res) => {
				return res.json();
			})
			.then((json) => {
				console.log(json);
				const newData = json.data;
				console.log(newData[0].pageName);
				console.log(fetchId);
				console.log(fetchId.current);

				setData(newData);
				setPageCount(Math.ceil(parseInt(json.count) / pageSize));
				setLoading(false);
				if (fetchId === fetchId.current) {
				}
			});
	}, []);

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

// return (
// 	<>
// 		{/* <Table columns={columns} data={data} /> */}
// 		{loading ? (
// 			// <p>Loading Please wait...</p>
// <progress className="progress is-medium is-dark" max="100">
// 	45%
// </progress>
// 		) : (
// 			<Table
// 				columns={columns}
// 				data={data}
// 				fetchData={fetchData}
// 				loading={loading}
// 				pageCount={pageCount}
// 			/>
// 		)}
// 	</>
// );
