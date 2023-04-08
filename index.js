#!/usr/bin/env node

const { program } = require('commander');
const mdLinks = require('./md-links');
const { processCliArgs } = require('./cli');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .description(pkg.description)
  .arguments('<path>')
  .option('-v, --validate', 'Valida los enlaces encontrados')
  .option('-s, --stats', 'Muestra estadísticas de los enlaces encontrados')
  .option('-r, --recursive', 'Busca enlaces de manera recursiva en los directorios')
  .action(async (path, options) => {
    const { validate, stats, recursive } = options;
    let links;
    try {
      links = await mdLinks(path, { validate, recursive });
    } catch (err) {
      console.error(`Error al leer el archivo ${path}: ${err.message}`);
      return;
    }
    if (stats) {
      let statsData;
      try {
        statsData = mdLinks.stats(links, path);
      } catch (err) {
        console.error(`Error al calcular las estadísticas: ${err.message}`);
        return;
      }
      console.log(statsData);
    } else if (validate) {
      try {
        const validateData = await mdLinks.validate(links);
        console.log(validateData);
      } catch (err) {
        console.error(`Error al validar los enlaces: ${err.message}`);
        return;
      }
    } else {
      console.log(links);
    }
  });
  module.exports = () => {
    // ...
  };
