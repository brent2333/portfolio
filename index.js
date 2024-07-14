const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const formidable = require("express-formidable");
const path = require("path");
const { openai } = require("./openai.js");
const { getPosts } = require("./utils/posts");
const usersRouter = require("./public/routes/users");
const weatherRouter = require("./public/routes/weather.js");
const postsRouter = require("./public/routes/posts.js");
const { verifyToken, verifyTokenCookie } = require("./middleware/auth");
const { getGuitars } = require("./utils/amazon.js");
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

const getGuitarData = async () => {
  const data = await getGuitars();
  const mapped = data.map(
    (guitar) => (guitar.productdata = JSON.parse(guitar.productdata))
  );
  return mapped;
};

app.get("/guitars", async function (req, res) {
  const guitarsFromDB = await getGuitarData();
  res.render("guitars", { guitarList: guitarsFromDB });
});

app.get("/cms", function (req, res) {
  res.render("cms", { pageUrl: "/cms" });
});

app.get("/", async function (req, res, next) {
  const posts = await getPosts();
  const firstPost = posts[0];
  const remainderPosts = posts;
  const dataOptions = getDataOptions(req.originalUrl);
  res.render("index", { ...dataOptions, firstPost, remainderPosts });
});

// apis
app.use("/users", usersRouter);
app.use("/weather", weatherRouter);
app.use("/posts", postsRouter);

// assets
app.get("/assets", function (req, res) {
  res.render(req.originalUrl, function (err) {
    if (err) {
      console.error("Error sending asset:", err);
    }
  });
});

app.get("/dalle-image", async (req, res) => {
  const text = req.query.text;
  if (!text) {
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
    console.error(error);
    res.status(500).send("Something went wrong with the image server");
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
