import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import fetchDataPromise from "./fetchDataPromise";
import Modal from "./Modal";

const Styles = styled.div`
	// padding: 1rem;

	table {
		// margin: 0 auto;
		width: 100%;
		border-spacing: 0;
		border: 1px solid black;
		tr {
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid black;
			border-right: 1px solid black;

			:last-child {
				border-right: 0;
			}
		}
	}
`;

function Table({ columns, data }) {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data,
	});

	// Render the UI for your table
	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th {...column.getHeaderProps()}>
								<span style={{ color: "white" }}>
									{column.render("Header")}
								</span>
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row, i) => {
					prepareRow(row);
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map((cell, i) => {
								// console.log(cell);

								// store the return value
								let output;

								// figure out if we are displaying buttons or content
								switch (cell.column.Header) {
									// Return the edit button
									case "Edit":
										output = (
											<td {...cell.getCellProps()}>
												<Modal
													// cells ID (1,2,3...)
													cellID={cell.row.id}
													// pagename
													pageName={
														cell.row.original
															.pageName
													}
													// websitePath
													websitePath={
														cell.row.original
															.websitePath
													}
													// hidden
													hidden={
														cell.row.original.hidden
															? "true"
															: "false"
													}
													// __v
													__v={cell.row.original.__v}
													// _id
													_id={
														cell.row.allCells[1]
															.value
													}
												/>
											</td>
										);
										break;

									// Return the rebuild button
									case "Build":
										output = (
											<td {...cell.getCellProps()}>
												<button
													className="button is-dark"
													key={cell.row.id}
												>
													Build
												</button>
											</td>
										);
										break;

									case "Index":
										output = (
											<td {...cell.getCellProps()}>
												<span
													style={{ color: "white" }}
												>
													{cell.row.index}
												</span>
											</td>
										);
										break;

									// Return the cells data
									default:
										output = (
											<td {...cell.getCellProps()}>
												<span
													style={{ color: "white" }}
												>
													{cell.render("Cell")}
												</span>
											</td>
										);
										break;
								}
								return output;
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

function Pages() {
	// const [data, setData] = useState([]);
	const [loadingData, setLoadingData] = useState(true);

	const columns = React.useMemo(
		() => [
			{
				Header: "Pages",
				columns: [
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
			},
		],
		[]
	);

	const [data, setData] = useState([]);

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

	// const data = React.useMemo(() => makeData(20), []);

	return (
		<Styles>
			{/* <Table columns={columns} data={data} /> */}
			{loadingData ? (
				// <p>Loading Please wait...</p>
				<progress className="progress is-medium is-dark" max="100">
					45%
				</progress>
			) : (
				<Table columns={columns} data={data} />
			)}
		</Styles>
	);
}

export default Pages;
