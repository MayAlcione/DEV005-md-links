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
  .action((path, options) => {
    return new Promise((resolve, reject) => {
      const { validate, stats, recursive } = options;
      let links;
      mdLinks(path, { validate, recursive })
        .then((links) => {
          if (stats) {
            let statsData;
            try {
              statsData = mdLinks.stats(links, path);
            } catch (err) {
              console.error(`Error al calcular las estadísticas: ${err.message}`);
              reject(err);
              return;
            }
            console.log(statsData);
            resolve();
          } else if (validate) {
            mdLinks.validate(links)
              .then((validateData) => {
                console.log(validateData);
                resolve();
              })
              .catch((err) => {
                console.error(`Error al validar los enlaces: ${err.message}`);
                reject(err);
              });
          } else {
            console.log(links);
            resolve();
          }
        })
        .catch((err) => {
          console.error(`Error al leer el archivo ${path}: ${err.message}`);
          reject(err);
        });
    });
  });
  
  module.exports = () => {
    // ...
  };
