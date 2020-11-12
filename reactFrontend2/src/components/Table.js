import React from "react";
// import styled from "styled-components";
import { useTable } from "react-table";
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
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data,
	});

	// Render the UI for your table
	return (
		<Styles>
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
			</table>
		</Styles>
	);
}
