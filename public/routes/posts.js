const express = require("express");

const pool = require("../../db");

const postsRouter = express.Router();

postsRouter.get("/remainder/:id", (request, response) => {
  pool.query(
    `SELECT * FROM posts WHERE post_id = ${request.params.id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows && results.rows.length) {
        response.status(200).json(results.rows[0]);
      }
    }
  );
});

postsRouter.post("/create", (request, response) => {
  const { title, body } = request.fields;
  const date = new Date().toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const author = "brent";
  pool.query(
    "INSERT INTO posts (author, title, date, body) VALUES ($1, $2, $3, $4)",
    [author, title, date, body],
    (error, results) => {
      if (error) {
        console.log("ERROR", error);
        response.status(400).send("<p>Sorry post failed</p>");
      }
      response.status(200).send("<p>Post succeeded</p>");
    }
  );
});

module.exports = postsRouter;
