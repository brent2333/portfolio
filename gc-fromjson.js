const pool = require("./db");
const gcData = require("./guitarcenter-nextdata.json");

const getLargerImg = (imageUrl) => {
  return imageUrl.replace("120x120", "640x640");
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

const processGcJson = async () => {
  const gcMap = gcData.products.map((gc) => {
    return {
      price: { value: gc.price },
      url: `https://www.guitarcenter.com${gc.linkUrl}`,
      title: gc.displayName,
      imageUrls: [getLargerImg(gc.thumb)],
      brand: gc.linkUrl.split("/")[0],
      retailer: "gc",
    };
  });
  if (gcMap && Array.isArray(gcMap)) {
    insertGuitars(gcMap);
  }
};

processGcJson();
