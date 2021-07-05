const preguntasIniciales = [
  {
    name: "tipoTransporte",
    message: "¿Qué tipo de transporte quiere consultar?",
    type: "list",
    default: "metro",
    choices: [
      {
        name: "Bus",
        value: "bus",
      },
      {
        name: "Metro",
        value: "metro",
      },
    ],
  },
  {
    name: "infoExtra",
    message: "¿Qué información extra quiere obtener de cada parada?",
    type: "checkbox",
    choices: [
      {
        name: "Coordenadas",
        value: "coordenadas",
      },
      {
        name: "Fecha de inauguaración",
        value: "fechaInauguracion",
      },
    ],
  },
  {
    name: "errores",
    message: "¿Quiere que le informemos de los errores?",
    type: "confirm",
  },
  {
    name: "linea",
    message: "¿Qué línea quiere consultar?",
    type: "input",
  },
];

const preguntas = [
  preguntasIniciales[0],
  ...preguntasIniciales.slice(1).map((pregunta) => ({
    ...pregunta,
    when: (respuestasAnteriores) =>
      respuestasAnteriores.tipoTransporte === "metro",
  })),
];

const preguntasEmail = [
  {
    name: "email",
    message: "¿Quieres recibir los resultados por email?",
    type: "confirm",
  },
  {
    name: "direccionEmail",
    message: "¿A qué dirección te lo envío?",
    type: "input",
    when: (respuestasAnteriores) => respuestasAnteriores.email,
  },
];

module.exports = {
  preguntas,
  preguntasEmail,
};
