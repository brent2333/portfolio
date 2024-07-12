const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
let jwtKey;
try {
  if (require.resolve("../../config")) {
    jwtKey = require("../../config").jwtKey;
  }
} catch (e) {
  console.error("CONFIG is not found");
  // process.exit(e.code);
}

const jwt = require("jsonwebtoken");
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

const getTheUser = (user) =>
  pool
    .query(`SELECT * FROM users WHERE username = '${user}'`)
    .then((response) => response.rows);

usersRouter.post("/login", async (request, response) => {
  const { user, password } = request.fields;

  getTheUser(user)
    .then((user) => {
      if (user[0]) {
        bcrypt.compare(password, user[0].hashedpassword, (err, data) => {
          if (err) throw err;
          if (data) {
            const token = jwt.sign(
              { userId: user[0].username },
              jwtKey || process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            return response.status(200).json({ token });
          } else {
            return response.status(401).json({ msg: "Invalid credentials" });
          }
        });
      } else {
        response.status(403).json({ message: "error logging in" });
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
