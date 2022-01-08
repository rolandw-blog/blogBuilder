/* eslint-disable no-redeclare */
import axios from "axios";
import { AxiosRequestConfig } from "axios";
import HttpException from "../exceptions/HttpException";
import IPage from "../interfaces/page.interface";
import genericLogger from "./genericLogger";
const logger = genericLogger(__filename);
import IPageSearchQuery, { QueryTypes } from "../interfaces/page.searchQueryParams.interface";
import { API_URL } from "../constants";

// construct the query (URL) string
function constructQuery(
	apiRoot: string,
	queryKey: QueryTypes,
	queryFor: string,
	page: string,
	limit: string
): string {
	const base = `${apiRoot}/pages`;
	const mainQuery = `${queryKey}=${queryFor}`;
	const pagination = `page=${page}&limit=${limit}`;
	const query = `${base}?${mainQuery}&${pagination}`;
	return query;
}

async function getPage(queryString: QueryTypes, query: IPageSearchQuery): Promise<IPage[]> {
	const apiRoot = API_URL;

	// get the pagination
	const { page, limit } = query;

	// get the query value
	const queryFor = query[queryString] ? query[queryString] : "/";

	// if there is no queryString key:value on the query object, throw an error
	if (query[queryString] === undefined) {
		throw new Error(
			`getPage was passed a query for "${queryString}",  but the query contained no key:value`
		);
	}

	try {
		const requestConfig: AxiosRequestConfig = {};
		const url = constructQuery(apiRoot, queryString, queryFor as string, page, limit);
		const response = await axios.get(url, requestConfig);
		const data = response.data;

		if (data.length === 0) {
			throw new HttpException(404, "No page data found");
		}

		return data;
	} catch (error) {
		// only allow HttpExceptions to pass through
		logger.error(`error: ${error}`);
		if (error instanceof HttpException) {
			return [];
		} else {
			// This will crash the server
			logger.error("Something went very wrong getting a page");
			return [];
		}
	}
}

export default getPage;
