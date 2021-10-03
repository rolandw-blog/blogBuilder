// This file is a controller that runs some code when a route is hit
// This file is referenced by the index.route.ts ROUTE which uses IndexController as its CONTROLLER

interface IndexDoc {
	message: string;
}

import { Request, Response } from "express";

class IndexController {
	public index = (_req: Request, res: Response): void => {
		const response: IndexDoc = {
			message: "ok",
		};

		res.status(200).json(response);
	};
}

export default IndexController;
