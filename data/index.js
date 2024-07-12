const mainNav = require("./main-nav.json");
const technologies = require("./technologies.json");
const relatedSkills = require("./related-skills.json");

const aboutMeData = {
  techList: technologies.technologies,
  relatedSkills: relatedSkills.relatedSkills,
  metaTitle: "About Me | Atlanta Web Developer | brentlawson-webdeveloper.com",
};

const aboutSiteData = {
  techList: technologies.technologies,
  relatedSkills: relatedSkills.relatedSkills,
  metaTitle:
    "About this site | Atlanta Web Developer | brentlawson-webdeveloper.com",
};

weatherPageData = {
  metaTitle:
    "Weather Forecast & Current Weather | Atlanta Web Developer | brentlawson-webdeveloper.com",
};

imagegenPageData = {
  metaTitle:
    "AI Image Generation, OpenAI DALL-E | Atlanta Web Developer | brentlawson-webdeveloper.com",
};

const pageDataMap = {
  "about-me": aboutMeData,
  "about-site": aboutSiteData,
  weather: weatherPageData,
  imagegen: imagegenPageData,
};

module.exports = {
  mainNav,
  pageDataMap,
};
