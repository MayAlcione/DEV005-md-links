const { obtenerRutasArchivos, obtenerEnlacesArchivos, validarEnlaces, obtenerEstadisticas } = require ('./functions.js');
const process = require('process');
const routePath = "./pruebaCarpeta"

const mdlinks = (pathUser, objeto) => {
  return new Promise((resolve, reject) => {
    try {
      const pathMds = obtenerRutasArchivos(pathUser)
      const arrObj = obtenerEnlacesArchivos(pathMds)
      if (objeto.validate === true && objeto.stats === true) {
        validarEnlaces(arrObj, objeto.validate, true).then((arrLinks) => {         
          resolve(obtenerEstadisticas(arrLinks, pathUser))
        }).catch((err) => {
          reject((`Error al procesar los archivos: ${err.message}`));
        })
      } else if (objeto.validate === true) {
        validarEnlaces(arrObj, objeto.validate, true).then((arrLinks) => {
          resolve(arrLinks)
        }).catch((err) => {
        reject(Error(`Error al procesar los archivos: ${err.message}`));
        })
      } else {
        resolve(arrObj)
      }
    } catch (err) {
      reject((`Error al procesar los archivos: ${err.message}`));    
    }
  })
}

module.exports = {mdlinks};