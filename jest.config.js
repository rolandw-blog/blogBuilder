const base = {
	testEnvironment: "node",
	testTimeout: 10000,
	setupFiles: ["dotenv/config"],
	moduleFileExtensions: ["js", "ts", "tsx"],
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},
	preset: "ts-jest",
	testPathIgnorePatterns: ["<rootDir>/dist"],
};

const unit = {
	...base,
	testMatch: ["**/__tests__/*.+(ts|tsx|js)"],
};

const integration = {
	...base,
	testMatch: ["**/__tests__/integrations/*.+(ts|tsx|js)"],
};

module.exports = () => {
	switch (process.env["SUITE"]) {
		case "unit":
			return unit;
		case "integration":
			return integration;
		default:
			return { ...unit, testMatch: [...unit.testMatch, ...integration.testMatch] };
	}
};
