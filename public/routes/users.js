const express = require("express");

const pool = require("../../db");

const usersRouter = express.Router();

usersRouter.post("/sendmessage", (request, response) => {
  console.log("PROCESS", process.env);
  const { name, email, message } = request.fields;
  const created_at = Date.now();

  pool.query(
    "INSERT INTO messages (name, email, message, created_at) VALUES ($1, $2, $3, $4)",
    [name, email, message, created_at],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`message saved with ID: ${results.insertId}`);
    }
  );
});

usersRouter.get("/messages", (request, response) => {
  pool.query(
    "SELECT * FROM messages ORDER BY user_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
});

module.exports = usersRouter;
