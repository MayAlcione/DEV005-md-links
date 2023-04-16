const { obtenerRutasArchivos, obtenerEnlacesArchivos, validarEnlaces, obtenerEstadisticas } = require ('./functions.js');
const process = require('process')
// console.log('argumentos de la terminal: ', process.argv);
const routePath = process.argv[2]

const mdlinks = (pathUser, objeto) => {
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


mdlinks(routePath, {validate:false, stats: false})
.then(res=>console.log('resultado mdLinks: ', res))
.catch(err=>console.error(err))

module.exports = mdlinks;

























/*module.exports = () => {
  
};*/
