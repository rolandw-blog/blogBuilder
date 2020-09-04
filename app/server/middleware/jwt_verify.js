const jwt = require("jsonwebtoken");
const debug = require("debug")("app:verifyJWTToken");
const { publicKey } = require("../../config").keys;

// ! Single Sign On system
const ISSUER = "simple-sso";
const verifyJwtToken = (token) =>
	new Promise((resolve, reject) => {
		jwt.verify(
			token,
			publicKey,
			{ issuer: ISSUER, algorithms: ["RS256"] },
			(err, decoded) => {
				if (err) return reject(err);
				return resolve(decoded);
			}
		);
	});
module.exports = Object.assign({}, { verifyJwtToken });
