const { obtenerRutasArchivos, obtenerEnlacesArchivos, validarEnlaces, obtenerEstadisticas } = require ('./functions.js');
const process = require('process');
//const processCliArgs = require('./cli.js')
// console.log('argumentos de la terminal: ', process.argv);
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
          reject(err)
        })
      } else if (objeto.validate === true) {
        validarEnlaces(arrObj, objeto.validate, true).then((arrLinks) => {
          resolve(arrLinks)
        }).catch((err) => {
          reject(err)
        })
      } else {
        resolve(arrObj)
        // resolve("te ganaste solo el objeto")
      }
    } catch (err) {
      reject(err)
    }
  })
}

/*mdlinks(routePath, { validate: true, stats: false })
  .then(res => console.log('resultado mdLinks: ', res))
  .catch(err => console.error(err))*/

/*const mdlinks = (pathUser, objeto) => {
  return new Promise((resolve, reject) => {
    const pathMds = obtenerRutasArchivos(pathUser)
    const arrObj = obtenerEnlacesArchivos(pathMds)
   if (objeto.validate === true && objeto.stats === true) {
      validarEnlaces(arrObj, objeto.validate,true).then((arrLinks)=>{
        resolve(obtenerEstadisticas(arrLinks, pathUser))
      })
    } else if (objeto.validate === true) {
      validarEnlaces(arrObj, objeto.validate,true).then((arrLinks)=>{
        resolve(arrLinks)
      })
    } else {
      resolve(arrObj)
      // resolve("te ganaste solo el objeto")
    }
  })
}

mdlinks(routePath, {validate:true, stats: false})
.then(res=>console.log('resultado mdLinks: ', res))
.catch(err=>console.error(err))*/

module.exports = {mdlinks};

