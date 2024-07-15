const cheerio = require("cheerio");
const axios = require("axios");
const htmlparser2 = require("htmlparser2");

const website = "https://www.sweetwater.com/c590--Solidbody_Guitars";

try {
  axios(website).then((res) => {
    const data = res.data;
    const dom = htmlparser2.parseDocument(data);
    const $ = cheerio.load(dom);

    let content = [];

    $(".product-card", data).each(function () {
      const image = $(this).find(".product-card__img").find("img").attr("src");
      //   const imgDiv = divs[1].attribs;
      //   const image = images[0].attribs.src;
      const href = $(this).find(".product-card__info").find("a").attr("href");
      const url = `https://www.sweetwater.com${href}`;
      const title = $(this).find("h2").find("a").find("span").text();
      const price = $(this).find(".product-card__amount").find("span").text();

      content.push({
        image,
        url,
        title,
        price,
      });
      console.log("$$$$$$$$$$", content);
      //   content.filter((item) => )
      //   app.get("/", (req, res) => {
      //     res.json(content);
      //   });
    });
  });
} catch (error) {
  console.log(error, error.message);
}
