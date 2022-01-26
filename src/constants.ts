const API_URL = process.env["API_URL"] || "http://localhost:3000";
const NODE_ENV = process.env["NODE_ENV"] || "development";
const DOMAIN = process.env["DOMAIN"] || "blogbuilder";
const PORT = process.env["PORT"] || "3000";
const LOG_LEVEL = process.env["LOG_LEVEL"] || "debug";
const OUTPUT_DIR = process.env["OUTPUT_DIR"] || "/data/dist";
export { API_URL, NODE_ENV, DOMAIN, PORT, LOG_LEVEL, OUTPUT_DIR };
