#!/usr/bin/env node

const { obtenerEstadisticas } = require('./functions.js');
const { mdlinks }= require('./index.js');
const path = process.argv[2];
const options = process.argv;
const validate = options.includes("--validate") ? true : false;
const stats = options.includes("--stats") ? true : false;

mdlinks(path, { validate: validate})
  .then((response) => {
    if (validate && stats) {
     console.log(obtenerEstadisticas(response, true));        
  } else if (stats) {
     console.log(obtenerEstadisticas(response));    
  } else {
      return console.log(response);
    }
  })
  .catch((err) => console.log(err));
  

