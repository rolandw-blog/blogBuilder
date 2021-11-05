import HttpException from "../exceptions/HttpException";
import path from "node:path";
import fs from "node:fs";
import loggerFunction from "./genericLogger";
const logger = loggerFunction(__filename);

// Throw an error if the file cannot be read
function safeSyncRead(filePath: string): string {
	try {
		return fs.readFileSync(filePath, "utf8");
	} catch (err) {
		logger.error(`safeSyncRead error ${err}`);

		// throw a more verbose error if in development
		if (process.env["NODE_ENV"] === "development") {
			console.trace();
		}

		const filename = path.parse(filePath).name + path.parse(filePath).ext;
		throw new HttpException(404, `The file '${filename}' does not exist on the file system`);
	}
}

export default safeSyncRead;
