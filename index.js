const express = require("express");
const bodyParser = require("body-parser");
const formidable = require("express-formidable");
const path = require("path");

const usersRouter = require("./public/routes/users");
const app = express();
const PORT = process.env.PORT || 3000;

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

app.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// apis
app.use("/users", usersRouter);

const options = {
  root: path.join(__dirname),
};
// const fourOhFour = "/public/fourohfour.html";

// const sendHome = (res) => {
//   const fileName = "/public/index.html";
//   res.sendFile(fileName, options, function (err) {
//     if (err) {
//       res.sendFile(fourOhFour, options);
//       console.error("Error sending file:", err);
//     }
//   });
// };

// const sendFourOhFour = (res) => {
//   res.sendFile(fourOhFour, options);
// };

// const returnHTML = (req, res, name) => {
//   if (req.headers["hx-request"]) {
//     const fileName = `/public/${name}.html`;
//     res.sendFile(fileName, options, function (err) {
//       if (err) {
//         sendFourOhFour(res);
//         console.error("Error sending file:", err);
//       }
//     });
//   } else {
//     sendHome(res);
//   }
// };

// assets
app.get("/assets", function (req, res) {
  res.sendFile(req.originalUrl, options, function (err) {
    if (err) {
      console.error("Error sending asset:", err);
    }
  });
});

app.listen(PORT);
console.log("root app listening on port: 3000");
