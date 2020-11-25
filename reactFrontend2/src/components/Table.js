import React from "react";
// import styled from "styled-components";
import { useTable, usePagination } from "react-table";
import styled from "styled-components";
import Modal from "./Modal";

const Loading = styled.tr`
	grid-column: 1 / -1;
	progress {
		width: 100%;
		background: #363636;
	}
`;

const NavButtonsLeft = styled.div`
	button {
		margin: 0 10px;
	}

	*:last-child {
		margin: 0;
	}
`;

const NavButtonsRight = styled.div`
	* {
		margin: 0 10px;
	}

	*:first-child {
		margin: 0;
	}
`;

const Pagination = styled.div`
	padding: 1em 0;
	strong {
		color: #dedede;
	}

	input {
		background: #363636;
		border: 0px solid black;
		border-radius: 5px;
		// padding: 10px;
		height: 40px;
		text-align: center;
		color: #dedede;
	}

	// disable input spinners (tick goto page box up and down)
	input[type="number"]::-webkit-outer-spin-button,
	input[type="number"]::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type="number"] {
		-moz-appearance: textfield;
	}

	select {
		background: #363636;
		border: 0px solid black;
		padding: 5px;
		text-align: center;
		font-size: 1em;
		border-radius: 5px;
		color: #dedede;

		// remove the dropdown arrow
		-webkit-appearance: none;
		-moz-appearance: none;
		text-indent: 1px;
		text-overflow: "";
	}
`;

const Styles = styled.div`
	table {
		border: none;
		width: 100%;
		border-spacing: 0;

		tr {
			display: grid;
			grid-template-columns: 0.5fr 1fr 2fr 10% 10%;
			color: #dedede;
		}

		// make the loading bar (last row) span all columns
		tr:last-child > td {
			grid-column: 1 / -1;
		}

		tr:hover {
			background: #51555e;
		}

		td {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		td:last-child,
		td:nth-last-child(2) {
			align-self: end;
			justify-self: right;
		}

		th {
			text-align: left;
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			// border-bottom: 1px solid black;
			// border-right: 1px solid black;

			:last-child {
				border-right: 0;
			}
		}
	}
`;

export default function Table({
	columns,
	data,
	fetchData,
	loading,
	pageCount: controlledPageCount,
}) {
	const {
		getTableProps,
		getTableBodyProps,
		gotoPage,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		nextPage,
		previousPage,
		setPageSize,
		prepareRow,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0 }, // Pass our hoisted table state
			manualPagination: true,
			pageCount: controlledPageCount,
		},
		usePagination
	);

	// Listen for changes in pagination and use the state to fetch our new data
	React.useEffect(() => {
		fetchData({ pageIndex, pageSize });
	}, [fetchData, pageIndex, pageSize]);

	// Render the UI for your table
	return (
		<Styles>
			<table {...getTableProps()}>
				<tbody {...getTableBodyProps()}>
					{page.map((row, i) => {
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
														data={cell.row}
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
															cell.row.original
																.hidden
																? "true"
																: "false"
														}
														// __v
														__v={
															cell.row.original
																.__v
														}
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
														style={{
															color: "white",
														}}
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
													{/* <span
														style={{
															color: "white",
														}}
													> */}
													{cell.render("Cell")}
													{/* </span> */}
												</td>
											);
											break;
									}
									return output;
								})}
							</tr>
						);
					})}
					<Loading>
						{loading && (
							// Use our custom loading state to show a loading indicator
							<td>
								<progress
									className="progress is-medium is-dark"
									max="100"
								>
									45%
								</progress>
							</td>
						)}
					</Loading>
				</tbody>
			</table>
			<Pagination className="pagination">
				<NavButtonsLeft>
					{/* first page */}
					<button
						className="button is-dark"
						onClick={() => gotoPage(0)}
						disabled={!canPreviousPage}
					>
						{"<<"}
					</button>{" "}
					{/* previous page */}
					<button
						className="button is-dark"
						onClick={() => previousPage()}
						disabled={!canPreviousPage}
					>
						{"<"}
					</button>{" "}
					{/* next page */}
					<button
						className="button is-dark"
						onClick={() => nextPage()}
						disabled={!canNextPage}
					>
						{">"}
					</button>{" "}
					{/* last page */}
					<button
						className="button is-dark"
						onClick={() => gotoPage(pageCount - 1)}
						disabled={!canNextPage}
					>
						{">>"}
					</button>{" "}
				</NavButtonsLeft>
				<NavButtonsRight>
					{/* page number of total */}
					<span>
						Page{" "}
						<strong>
							{pageIndex + 1} of {pageOptions.length}
						</strong>{" "}
					</span>
					<span>
						Go to page:{" "}
						<input
							type="number"
							defaultValue={pageIndex + 1}
							onChange={(e) => {
								const page = e.target.value
									? Number(e.target.value) - 1
									: 0;
								gotoPage(page);
							}}
							style={{ width: "100px" }}
						/>
					</span>{" "}
					<select
						className="select"
						value={pageSize}
						onChange={(e) => {
							setPageSize(Number(e.target.value));
						}}
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</select>
				</NavButtonsRight>
			</Pagination>
		</Styles>
	);
}