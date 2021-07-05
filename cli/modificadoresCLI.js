const { program } = require("commander");

program
  .option("--color <color>", "Color de los mensajes")
  .option("--abrev", "Obtener información abreviada");

program.parse();
const modificadoresCLI = program.opts();

module.exports = {
  modificadoresCLI,
};
