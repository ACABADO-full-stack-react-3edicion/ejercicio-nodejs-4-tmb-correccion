const inquirer = require("inquirer");

const preguntar = async (preguntas) => {
  const respuestas = await inquirer.prompt(preguntas);
  return respuestas;
};

module.exports = {
  preguntar,
};
