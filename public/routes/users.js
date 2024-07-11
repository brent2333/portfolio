const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const pool = require("../../db");

const usersRouter = express.Router();

const { sendMail } = require("./utils/sendmail");

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
      sendMail(request.fields);
      response.status(201).send(`message saved with ID: ${results.insertId}`);
    }
  );
});

const hashPassword = async (plaintextPassword) => {
  return await bcrypt.hash(plaintextPassword, 10);
};

const comparePassword = async (plaintextPassword, hash) => {
  return await bcrypt.compare(plaintextPassword, hash);
};

const getTheUser = (user) =>
  pool
    .query(`SELECT * FROM users WHERE username = '${user}'`)
    .then((response) => response.rows);

usersRouter.post("/login", async (request, response) => {
  const { user, password } = request.fields;
  const hash = await hashPassword(password);
  getTheUser(user)
    .then((user) => {
      if (comparePassword(user[0].hashedpassword, hash)) {
        response.status(200).json({ message: "successful login" });
      }
    })
    .catch((error) => {
      console.error("ERROR ON LOGIN", error);
      response.status(403).json({ message: "error logging in" });
    });
});

// TODO: create form for this
usersRouter.post("/create", async (request, response) => {
  const { username, password } = request.fields;
  const created_at = Date.now();
  const hPass = await bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      console.log("Hash ", hash);
      return hash;
    })
    .catch((err) => console.error(err.message));
  console.log(username, password, hPass);
  pool.query(
    "INSERT INTO users (username, hashedpassword, created_at) VALUES ($1, $2, $3)",
    [username, hPass, created_at],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`user saved`);
    }
  );
});

module.exports = usersRouter;
