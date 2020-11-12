import fetchDataPromise from "./fetchDataPromise";
import React, { useState, useEffect } from "react";

import Table from "./Table";

export default function Pages() {
	const [data, setData] = useState([]);
	const [loadingData, setLoadingData] = useState(true);

	const columns = React.useMemo(
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

	useEffect(() => {
		const getData = async () => {
			fetchDataPromise()
				.then((res) => res.json())
				.then((json) => {
					setData(json.data);
					setLoadingData(false);
				});
		};

		if (loadingData) {
			// if the result is not ready so you make the axios call
			getData();
		}
	}, [loadingData]);

	return (
		<>
			{/* <Table columns={columns} data={data} /> */}
			{loadingData ? (
				// <p>Loading Please wait...</p>
				<progress className="progress is-medium is-dark" max="100">
					45%
				</progress>
			) : (
				<Table columns={columns} data={data} />
			)}
		</>
	);
}
