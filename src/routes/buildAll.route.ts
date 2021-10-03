// This is just ONE route. A new file is created for every route
// The Route contains an indexController which is a standard-ish MVC controller
// 	The job for IndexController is to actually run some code for the request
// 	In this case, the IndexController just returns 200 "OK"

import { Request, Response, Router } from "express";
import BuildController from "../controllers/builder.controller";
import Route from "../interfaces/routes.interface";

class BuildAllRoute implements Route {
	public path = "/all";
	public router = Router({ strict: true });
	public controller: BuildController;

	constructor() {
		this.controller = new BuildController();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, (_req: Request, res: Response) => {
			this.controller.buildAll(res);
			// res.send("OK");
		});
	}
}

export default BuildAllRoute;
