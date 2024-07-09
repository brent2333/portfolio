const express = require("express");
var cors = require("cors");
const { optionalRequire } = require("optional-require");

const bodyParser = require("body-parser");
const formidable = require("express-formidable");
const path = require("path");
const { openai } = require("./openai.js");

const usersRouter = require("./public/routes/users");
const weatherRouter = require("./public/routes/weather.js");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

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
  const PageData = { ...mainNav, ...pageDataMap[url], pageUrl: url, isDev };
  return PageData;
};

app.get("/", function (req, res, next) {
  const dataOptions = getDataOptions(req.originalUrl);
  res.render("index", dataOptions);
});

// apis
app.use("/users", usersRouter);
app.use("/weather", weatherRouter);

// assets
app.get("/assets", function (req, res) {
  res.render(req.originalUrl, function (err) {
    if (err) {
      console.error("Error sending asset:", err);
    }
  });
});

app.get("/dalle-image", async (req, res) => {
  // Get the text input from the query string
  const text = req.query.text;
  // Check if the text is valid
  if (!text) {
    // Return an error message if not
    res.status(400).send("Please provide a text input");
    return;
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: text,
      n: 1,
      size: "1024x1024",
    });
    image_url = response.data[0].url;
    res.send(image_url);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("Something went wrong with the server");
  }
});

// catchall HTML
app.get("/*", function (req, res) {
  if (req.originalUrl.includes("favicon")) {
    res.sendFile(path.join(__dirname, "./public/assets/img", req.originalUrl));
  } else if (req.originalUrl.includes("robots")) {
    res.sendFile(path.join(__dirname, "./", req.originalUrl));
  } else if (req.originalUrl.includes("sitemap")) {
    res.sendFile(path.join(__dirname, "./", req.originalUrl));
  } else {
    const dataOptions = getDataOptions(req.originalUrl.replace("/", ""));
    res.render(req.originalUrl.replace("/", ""), dataOptions);
  }
});

app.listen(PORT);
console.log("root app listening on port: 3000");
