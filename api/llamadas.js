require("dotenv").config();
const fetch = require("node-fetch");

const appKey = process.env.APP_KEY;
const appId = process.env.APP_ID;
const urlAPILineas = `${process.env.API_URL}?app_key=${appKey}&app_id=${appId}`;
const urlAPIParadas = (linea) =>
  `${process.env.API_URL}${linea}/estacions?app_key=${appKey}&app_id=${appId}`;

const getLineasMetro = async () => {
  const resp = await fetch(urlAPILineas);
  const lineas = await resp.json();
  return lineas;
};

const getParadasLinea = async (linea) => {
  const resp = await fetch(urlAPIParadas(linea));
  const paradas = await resp.json();
  return paradas;
};

module.exports = {
  getLineasMetro,
  getParadasLinea,
};
