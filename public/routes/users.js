const express = require("express");

const pool = require("../../db");

const usersRouter = express.Router();

usersRouter.get("/", (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
});

usersRouter.post("/createuser", (request, response) => {
  const { name, email } = request.fields;

  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    [name, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.insertId}`);
    }
  );
});

usersRouter.post("/sendmessage", (request, response) => {
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
