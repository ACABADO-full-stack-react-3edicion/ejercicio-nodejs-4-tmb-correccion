const chalk = require("chalk");
const fs = require("fs");
const { getLineasMetro, getParadasLinea } = require("./api/llamadas");
const { modificadoresCLI } = require("./cli/modificadoresCLI");
const { preguntas, preguntasEmail } = require("./cli/preguntas/preguntas");
const { preguntar } = require("./cli/preguntador");
const { enviaEmail } = require("./emails/email");

const chequeaTransporte = (tipoTransporte) => {
  if (tipoTransporte === "bus") {
    console.log(
      chalk.yellow(
        "No tenemos información disponible sobre los buses. Consulta https://tmb.cat"
      )
    );
    process.exit(0);
  }
};

const hazPreguntasIniciales = async () => {
  const respuestas = await preguntar(preguntas);
  return respuestas;
};

const generaColor = (color) => {
  if (color && !color.startsWith("#")) {
    color = `#${color}`;
  }
  return color;
};

const hazPreguntasEmail = async () => {
  const respuestas = await preguntar(preguntasEmail);
  return respuestas;
};

const buscaLinea = (color, linea, features, errores) => {
  const lineaEncontrada = features.find(
    (lineaBuscada) =>
      lineaBuscada.properties.NOM_LINIA.toLowerCase() === linea.toLowerCase()
  );
  if (!lineaEncontrada) {
    if (errores) {
      console.log(chalk.red.bold(`No existe la línea ${linea}.`));
    }
    process.exit(0);
  }
  imprimeInfoLinea(color, lineaEncontrada);
  return lineaEncontrada;
};

const imprimeInfoLinea = (color, linea) => {
  const {
    properties: { NOM_LINIA, DESC_LINIA, COLOR_LINIA, CODI_LINIA },
  } = linea;
  console.log(
    chalk.hex(color || `#${COLOR_LINIA}`)(`${NOM_LINIA}: ${DESC_LINIA}`)
  );
};

const imprimeInfoParadas = (features, infoExtra, abrev) => {
  for (const {
    geometry: { coordinates },
    properties: { NOM_ESTACIO, DATA_INAUGURACIO },
  } of features) {
    const nombreParada = abrev
      ? `${NOM_ESTACIO.substring(0, 3)}.`
      : NOM_ESTACIO;
    let mensajeLinea = nombreParada;
    if (infoExtra.includes("coordenadas")) {
      mensajeLinea += ` [${coordinates[0]}, ${coordinates[1]}]`;
    }
    if (infoExtra.includes("fechaInauguracion")) {
      mensajeLinea += ` Inaugurada en ${DATA_INAUGURACIO}`;
    }
    console.log(mensajeLinea);
  }
};

const guardaParadas = (paradas, destinatario) => {
  const nombresParadas = paradas.map((parada) => parada.properties.NOM_ESTACIO);
  fs.writeFile("paradas.txt", JSON.stringify(nombresParadas), (err) => {
    if (err) {
      console.log("No se ha podido guardar el archivo");
      return;
    }
    enviaEmail(destinatario);
  });
};

(async () => {
  const { tipoTransporte, infoExtra, errores, linea } =
    await hazPreguntasIniciales();
  chequeaTransporte(tipoTransporte);
  const { color, abrev } = modificadoresCLI;
  const colorGenerado = generaColor(color);
  const { features } = await getLineasMetro();
  const lineaEncontrada = buscaLinea(colorGenerado, linea, features, errores);
  const { features: paradas } = await getParadasLinea(
    lineaEncontrada.properties.CODI_LINIA
  );
  imprimeInfoParadas(paradas, infoExtra, abrev);
  const { email, direccionEmail } = await hazPreguntasEmail();
  if (email) {
    guardaParadas(paradas, direccionEmail);
  }
})();
