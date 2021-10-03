// Extend the basic Error class thats provided by NodeJS
//	and add a "status" field which will contain a HTTP repose code, for example 404, 500, 401 etc

class HttpException extends Error {
	public status: number;
	public details: unknown;
	public override message: string;

	constructor(status: number, message: string, details: unknown = {}) {
		super(message);
		this.status = status;
		this.message = message;
		this.details = details;
	}
}

export default HttpException;
