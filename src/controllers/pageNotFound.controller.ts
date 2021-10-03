import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";

class PageNotFoundController {
	public pageNotFound = (req: Request, res: Response, next: NextFunction): void => {
		try {
			if (req.accepts("json")) {
				// if this is an API consumer, pass an error to the middleware to handle
				next(new HttpException(404, "Page not found"));
			} else {
				// else send a 404 page back to the user
				res.sendStatus(404);
			}
		} catch (error) {
			next(error);
		}
	};
}

export default PageNotFoundController;
