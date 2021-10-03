// This file is called by an MVC controller when it fails to run
// It uses the custom HttpException which extends the Error class with a HTTP "status" field

import { Request, Response, NextFunction } from "express";

// in order for express to treat this as propper middleware, it requires ALL the parameters (error, req, res, next) to be passed in
function errorMiddleware(error: unknown, _: Request, res: Response, next: NextFunction): void {
	if (error instanceof Error) {
		const status = 500;
		const message = error.message;

		console.log("[ERROR] ", status, message);

		res.setHeader("Content-Type", "text/html");
		res.status(status);
		res.send(
			`Error: ${message}<br/><br/><div style="max-width: 1000px; line-height: 150%;">${error.stack}<div/>`
		);
	} else {
		next(error);
	}
}
export default errorMiddleware;
