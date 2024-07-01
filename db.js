const Pool = require("pg").Pool;
const pool = new Pool({
  user: "brent",
  host: "localhost",
  database: "api",
  password: "Y211f9twR!!!",
  port: 5432,
});

module.exports = pool;
