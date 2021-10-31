import { JSONSchemaType } from "ajv";

// These are the query params that are used to filter by which method a page will be built:
// either by an id like ?id=abc123 or a path like ?path=/blog/my-post

// This interface can also be used to build avj models (which is why i created it) to be used in
// route middleware.

// The supported query parameters for this route
export interface IQueryParams {
	id?: string;
	path?: string;
}

// validate that either an ID or PATH query is given in the request
const schema: JSONSchemaType<IQueryParams> = {
	type: "object",
	properties: {
		id: { type: "string", pattern: "^[a-f\\d]{24}$", nullable: true },
		path: { type: "string", nullable: true },
	},
	oneOf: [{ required: ["id"] }, { required: ["path"] }],
	additionalProperties: false,
};

export default schema;
