const fetch = require("node-fetch");
const { optionalRequire } = require("optional-require");
const config = optionalRequire("../../../config");
let canopyapiKey = config.canopyapiKey || process.env.CANOPYAPI_KEY;
const pool = require("../db");

const getGuitars = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM guitars", (error, results) => {
      if (error) {
        console.log("ERROR", error);
        reject(error);
      }
      // console.log("SUCCESSFUL GET", results.rows.slice(0, 9));
      if (results.rows) {
        return resolve(results.rows);
      }
    });
  });
};

const insertGuitars = (productList) => {
  for (const productdata of productList) {
    pool.query(
      "INSERT INTO guitars (productdata) VALUES ($1)",
      [productdata],
      (error, results) => {
        if (error) {
          console.log("ERROR", error);
        }
        console.log("SUCCESSFUL INSERT");
        return true;
      }
    );
  }
};

const query = `
query amazonProduct {
  amazonProductSearchResults(input: {searchTerm: "electric guitars"}) {
    productResults {
      results {
        price {
          value
        }
        imageUrls
        brand
        url
        title
        subtitle
      }
    }
  }
}`;

const fetchGuitars = async () => {
  try {
    await fetch("https://graphql.canopyapi.co", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "API-KEY": canopyapiKey,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.text())
      .then((res) => {
        const resJson = JSON.parse(res);
        const products = resJson.data.amazonProductSearchResults.productResults;
        const RetailerMap = products.results.map((p) => {
          return { ...p, retailer: "amazon" };
        });
        if (RetailerMap && Array.isArray(RetailerMap)) {
          insertGuitars(RetailerMap);
        }
      });
  } catch (error) {
    console.log("ERROR Fetching Amazon Data", error);
  }
};

module.exports = {
  fetchGuitars,
  getGuitars,
};
