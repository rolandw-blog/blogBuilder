/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/__tests__/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: ["node_modules", "src/database", "src/test", "src/types"],
  reporters: ["default"],
  globals: { "ts-jest": { diagnostics: true } },
  transform: {}
};
