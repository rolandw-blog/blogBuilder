import React from "react";
// import styled from "styled-components";
import { useTable, usePagination } from "react-table";
import styled from "styled-components";
import Modal from "./Modal";

const Styles = styled.div`
	// padding: 1rem;

	table {
		// margin: 0 auto;
		// border: 1px solid black;
		border: none;
		width: 100%;
		border-spacing: 0;

		tr {
			display: grid;
			grid-template-columns: 0.5fr 1fr 2fr 10% 10%;
			color: #dedede;
		}

		tr:hover {
			background: #51555e;
		}

		td {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
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

export default function Table({ columns, data }) {
	const {
		getTableProps,
		getTableBodyProps,
		gotoPage,
		rows,
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
			initialState: { pageIndex: 0 },
		},
		usePagination
	);

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
				</tbody>
				<div className="pagination">
					<button
						onClick={() => gotoPage(0)}
						disabled={!canPreviousPage}
					>
						{"<<"}
					</button>{" "}
					<button
						onClick={() => previousPage()}
						disabled={!canPreviousPage}
					>
						{"<"}
					</button>{" "}
					<button onClick={() => nextPage()} disabled={!canNextPage}>
						{">"}
					</button>{" "}
					<button
						onClick={() => gotoPage(pageCount - 1)}
						disabled={!canNextPage}
					>
						{">>"}
					</button>{" "}
					<span>
						Page{" "}
						<strong>
							{pageIndex + 1} of {pageOptions.length}
						</strong>{" "}
					</span>
					<span>
						| Go to page:{" "}
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
				</div>
			</table>
		</Styles>
	);
}
