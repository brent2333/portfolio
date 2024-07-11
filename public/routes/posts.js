const express = require("express");

const pool = require("../../db");

const postsRouter = express.Router();

postsRouter.get("/remainder/:id", (request, response) => {
  response.status(200).send("test");
});

module.exports = postsRouter;
