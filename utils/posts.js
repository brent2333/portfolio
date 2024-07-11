const pool = require("../db");

const getPosts = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM posts", (error, results) => {
      if (error) {
        reject(error);
        throw error;
      } else {
        console.log("$$", typeof results, results.rows);
        if (results.rows) {
          return resolve(results.rows);
        }
      }
    });
  });
};

module.exports = {
  getPosts,
};
