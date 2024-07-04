const express = require("express");
const bodyParser = require("body-parser");
const formidable = require("express-formidable");
const path = require("path");

const usersRouter = require("./public/routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

const { mainNav, pageDataMap } = require("./data/index.js");

const isDev = app.get("env") === "development";

app.set("views", __dirname + "/public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(formidable());

//configure nunjucks
const nunjucks = require("nunjucks");
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "njk");
app.use(express.static(path.join(__dirname, "public")));

const getDataOptions = (url) => {
  const PageData = { ...mainNav, ...pageDataMap[url] };
  return PageData;
};

app.get("/", function (req, res, next) {
  res.render("index", mainNav);
});

// apis
app.use("/users", usersRouter);

const options = {
  root: path.join(__dirname),
};

// assets
app.get("/assets", function (req, res) {
  res.render(req.originalUrl, function (err) {
    if (err) {
      console.error("Error sending asset:", err);
    }
  });
});

// catchall HTML
app.get("/*", function (req, res) {
  if (req.originalUrl.includes("favicon")) {
    res.sendFile(path.join(__dirname, "./public/assets/img", req.originalUrl));
  } else {
    const dataOptions = getDataOptions(req.originalUrl.replace("/", ""));
    res.render(req.originalUrl.replace("/", ""), dataOptions);
  }
});

app.listen(PORT);
console.log("root app listening on port: 3000");
