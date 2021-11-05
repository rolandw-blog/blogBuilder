import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import PageTemplater from "../models/pageTemplater/template.model";
import BuildStepBreadCrumbs from "../models/pageTemplater/helpers/breadCrumbs.step";
import BuildStepBuildAt from "../models/pageTemplater/helpers/builtAt.step";
import BuildStepstylesAndScripts from "../models/pageTemplater/helpers/stylesAndScripts.step";
import BuildStepSiblings from "../models/pageTemplater/helpers/siblings.step";
import BuildStepNeighbors from "../models/pageTemplater/helpers/neighbors.step";
import BuildStepParent from "../models/pageTemplater/helpers/parent.step";
import Renderer from "../models/pageRenderer/render.model";
import BuildStepRootLinks from "../models/pageTemplater/helpers/rootLinks";
import BuildStepChildren from "../models/pageTemplater/helpers/children.step";
import axios, { AxiosRequestConfig } from "axios";
import IPage from "../interfaces/page.interface";
import loggerFunction from "../utils/genericLogger";
import getPage from "../utils/getPage";
import { QueryTypes } from "../interfaces/page.searchQueryParams.interface";
const logger = loggerFunction(__filename);

const getPages = async (path: string): Promise<IPage[]> => {
	const encPath = encodeURIComponent(`${path}`);
	// const encPath = path;
	const url = `${process.env["DB_API"] as string}/pages?path=${encPath}&limit=-1`;
	const options: AxiosRequestConfig = {};
	const response = await axios(url, options);
	const data = await response.data;
	return data;
};

class BuildController {
	public pageTemplater: PageTemplater;
	public outDir = process["env"]["OUTPUT"] || "/data/dist";
	private pageRenderer: Renderer;

	// use these steps for this page build
	steps = [
		new BuildStepBreadCrumbs(),
		new BuildStepBuildAt(),
		new BuildStepstylesAndScripts(),
		new BuildStepSiblings(),
		new BuildStepNeighbors(),
		new BuildStepParent(),
		new BuildStepRootLinks(),
		new BuildStepChildren(),
	];

	constructor() {
		this.pageTemplater = new PageTemplater();
		this.pageRenderer = new Renderer();
	}

	public async build(req: Request, res: Response, next: NextFunction): Promise<void> {
		// Just supporting building by path or id for now
		if (req.query["path"] === undefined && req.query["id"] === undefined) {
			throw new HttpException(500, "no path or id provided");
		}

		// get the key and value that we can use to query the database api with
		// an example of queries that could be passed:
		//     by the path: /page?path=/home/roland
		//     by the id:   /page?id=24letterstring
		let queryFor: QueryTypes = "path";
		let val: string;
		if ("path" in req.query) {
			queryFor = "path";
			val = req.query["path"] as string;
		} else if ("id" in req.query) {
			queryFor = "id";
			val = req.query["id"] as string;
		} else {
			// defaults to fall back on
			queryFor = "path";
			val = "/";
		}

		// get the page from the database api
		const pages = await getPage(queryFor, {
			[queryFor]: val,
			page: "1",
			limit: "1",
		});
		const page = pages[0];

		if (page === undefined) {
			next(new HttpException(500, `No page found for where ${queryFor} = ${val}`));
		} else {
			try {
				// saturate the template with all the template related data from the database
				const template = await this.pageTemplater.saturateTemplate(page, this.steps);

				// render the page with the template
				const html = await this.pageRenderer.render(template);

				// write to disk
				this.pageRenderer.writeToDisk(template, html).then(() => {
					logger.info(`"${template.path}" written to disk`);
				});

				// send the page back as html
				res.header("Content-Type", "text/html");
				res.send(html);
			} catch (err) {
				next(err);
			}
		}
	}

	public async buildAll(res: Response): Promise<void> {
		// get the pages on the root level
		const rootPages = await getPages("/**");

		if (rootPages.length === 0) {
			throw new HttpException(500, "no pages found");
		}

		for (const page of rootPages) {
			// saturate the template with all the template related data from the database
			const template = this.pageTemplater.saturateTemplate(page, this.steps);

			// render the page with the template
			const html = this.pageRenderer.render(await template);

			// write to disk
			this.pageRenderer.writeToDisk(await template, await html).then(() => {
				logger.info(`${page.path} written to disk`);
			});
		}

		res.status(200).json({ message: "OK" });
	}
}

export default BuildController;
