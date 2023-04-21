#!/usr/bin/env node

const { obtenerEstadisticas } = require('./functions.js');
const { mdlinks }= require('./index.js');

const path = process.argv[2];
const options = process.argv;
const validate = options.includes("--validate") ? true : false;
const stats = options.includes("--stats") ? true : false;
/*Si se ha pasado la opción --validate, se llama a la función obtenerEstadisticas 
con el resultado de mdlinks como argumento, y se imprime por consola las estadísticas 
obtenidas (total de enlaces, enlaces únicos y enlaces rotos) utilizando el objeto retornado 
por la función obtenerEstadisticas. */
mdlinks(path, { validate: validate})
  .then((response) => {
    if (validate && stats) {
     console.log(obtenerEstadisticas(response, true));
/*pasado la opción --stats, se llama a la función obtenerEstadisticas con el resultado de 
mdlinks como argumento, y se imprime por consola las estadísticas obtenidas (total de enlaces 
y enlaces únicos) utilizando el objeto retornado por la función obtenerEstadisticas. */         
  } else if (stats) {
     console.log(obtenerEstadisticas(response));
/*Si no se ha pasado ninguna de las opciones, se imprime por consola una tabla con los enlaces 
encontrados y su texto correspondiente, utilizando la respuesta retornada por la función mdlinks. */     
  } else {
      return console.table(response);
    }
  })
  .catch((err) => console.log(err));
  

  