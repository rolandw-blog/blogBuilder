const path = require("path");
const express = require("express");
const checkSSORedirect = require("./middleware/checkSSORedirect");
const isAuthenticated = require("./middleware/isAuthenticated");
const debug = require("debug")("app:server");
const app = express(); // create express app
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");
const session = require("express-session");
const supportsColor = require("supports-color");

// app.use(isAuthenticated);
// app.use(());

// serve the react app
// app.use(express.static(path.join(__dirname, "..", "build")));

// app.use((req, res, next) => {
// 	res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 100000,
		},
	})
);

app.use(checkSSORedirect());
app.use(express.json());

const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.options("*", cors());

// app.get("/api/test", [isAuthenticated], (req, res) => {
// 	debug("routing api");
// 	return res.status(200).json({ success: true });
// });

app.use("/api", apiRoutes);

// app.get("/:id", [isAuthenticated], (req, res) => {
// 	const _id = req.params.id;
// 	const filter = {};
// 	const update = {};

// 	debug("hit");
// 	if (!req.query) return res.status(422).json({ success: false });

// 	const queryKey = Object.keys(req.query);
// 	const queryVal = req.query[queryKey];

// 	// create the filter query and update object
// 	// For example
// 	// filter = {_id: aaabbbccc}
// 	// update = {pageName: "newPageName"}
// 	filter._id = _id[queryKey] = queryVal;
// 	update[queryVal] = queryVal;

// 	debug(filter);
// 	debug(update);
// 	return res.status(200).json({ success: true });
// });

// serve the react app
app.use([isAuthenticated], express.static(path.join(__dirname, "..", "build")));

// serve some static assets in server/public for example server/public/users.json
// app.use(express.static("public"));

// app.get("/", [isAuthenticated], (req, res) => {
// 	debug("r");
// 	express.static(path.join(__dirname, "..", "build"));
// });

// start express server on port 5000
app.listen(3000, () => {
	console.log("server started on port 3000");
	debug("hello world!");
});
