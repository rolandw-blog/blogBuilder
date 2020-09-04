const fs = require("fs");
const path = require("path");

// ! Single Sign On system

const publicKeyFilePath =
	process.env.JWT_CW_PLATFORM_PUBLIC_KEY_FILE ||
	path.resolve(__dirname, "./jwtPublic.key");

const publicKey = fs.readFileSync(publicKeyFilePath);

const jwtValidatityKey = "simple-sso-jwt-validatity";

module.exports = Object.assign(
	{},
	{
		publicKey,
		jwtValidatityKey,
	}
);
