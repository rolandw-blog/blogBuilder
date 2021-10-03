// This is just ONE route. A new file is created for every route
// The Route contains an indexController which is a standard-ish MVC controller
// 	The job for IndexController is to actually run some code for the request
// 	In this case, the IndexController just returns 200 "OK"

import { Router } from "express";
import IndexController from "../controllers/index.controller";
import Route from "../interfaces/routes.interface";

class IndexRoute implements Route {
	public path = "/";
	public router = Router({ strict: true });
	public indexController: IndexController;

	constructor() {
		this.indexController = new IndexController();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, this.indexController.index);
	}
}

export default IndexRoute;
