const mainNav = require("./main-nav.json");
const technologies = require("./technologies.json");
const relatedSkills = require("./related-skills.json");

const aboutMeData = {
  techList: technologies.technologies,
  relatedSkills: relatedSkills.relatedSkills,
};

const pageDataMap = {
  "about-me": aboutMeData,
  "about-site": aboutMeData,
};

module.exports = {
  mainNav,
  pageDataMap,
};
