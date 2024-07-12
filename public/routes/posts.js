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
  const d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();
  const date = `${curr_month + 1}/${curr_date}/${curr_year}`;
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
