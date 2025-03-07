const express = require("express");
const { optionalRequire } = require("optional-require");

const config = optionalRequire("../../../config");

const ipapiKey = config?.weather.ipapiKey || process.env.IPAPIKEY;
const weatherApiKey =
  config?.weather.weatherApiKey || process.env.WEATHERAPIKEY;

const weatherRouter = express.Router();

weatherRouter.get("/ip", (request, response) => {
  response.send(ipapiKey);
});

weatherRouter.get("/forecast", (request, response) => {
  const weatherApiBaseUrl = "https://api.weatherapi.com/v1/forecast.json";
  try {
    fetch(`${weatherApiBaseUrl}?key=${weatherApiKey}&${request._parsedUrl.query}&aqi=no&alerts=no
`)
      .then((res) => res.text())
      .then(function (data) {
        response.status(200).send(data);
      });
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

weatherRouter.get("/currentsearch", (request, response) => {
  const weatherApiBaseUrl = "https://api.weatherapi.com/v1/current.json";
  try {
    fetch(`${weatherApiBaseUrl}?key=${weatherApiKey}&${request._parsedUrl.query}&aqi=no&alerts=no
`)
      .then((res) => res.text())
      .then(function (data) {
        response.status(200).send(data);
      });
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

module.exports = weatherRouter;
