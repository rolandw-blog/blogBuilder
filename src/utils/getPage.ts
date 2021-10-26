import axios from "axios";
import { AxiosRequestConfig } from "axios";
import HttpException from "../exceptions/HttpException";
import IPage from "../interfaces/page.interface";
import genericLogger from "./genericLogger";
const logger = genericLogger(__filename);

async function getPage(queryKey: string, queryValue: string): Promise<IPage[]> {
	const apiRoot = process.env["DB_API"] as string;

	try {
		const requestConfig: AxiosRequestConfig = {};
		const url = `${apiRoot}/pages?${queryKey}=${queryValue}`;
		const response = await axios.get(url, requestConfig);
		const data = response.data;
		logger.info(data);
		if (data.length === 0) {
			throw new HttpException(404, "No page data found");
		}
		return data;
	} catch (error) {
		// only allow HttpExceptions to pass through
		if (error instanceof HttpException) {
			return [];
		} else {
			// This will crash the server
			// throw new Error("Invalid query");
			logger.error("Something went very wrong getting a page");
			return [];
		}
	}
}

export default getPage;
