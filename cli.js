#!/usr/bin/env node

//const { argv } = require('node:process');

const { obtenerEstadisticas } = require('./functions.js');
const { mdlinks }= require('./index.js');

const path = process.argv[2];
const options = process.argv;
const validate = options.includes("--validate") ? true : false;
const stats = options.includes("--stats") ? true : false;
mdlinks(path, { validate: validate})
  .then((response) => {
    if (validate && stats) {
      //console.log({response});
     console.log(obtenerEstadisticas(response, true));
   //   return console.table(calculateBrokenLinksStats(response));
    } else if (stats) {
     // const stats = calculateLinksStats(response);
     console.log(obtenerEstadisticas(response));
    } else {
      return console.table(response);
    }
  })
  .catch((err) => console.log(err));


   






  
/*const { program } = require('commander');
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
  });*/