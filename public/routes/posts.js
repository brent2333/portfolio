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

module.exports = postsRouter;
