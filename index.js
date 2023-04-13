const { obtenerRutasArchivos, obtenerEnlacesArchivos } = require ('./functions.js');
const process = require('process')
// console.log('argumentos de la terminal: ', process.argv);
const routePath = process.argv[2]

const mdlinks = (pathUser, objeto) => {
  return new Promise((resolve, reject) => {
    const pathMds = obtenerRutasArchivos(pathUser)
    const arrObj = obtenerEnlacesArchivos(pathMds)
    if (objeto.validate === true) {
      resolve("te ganaste el objesto con los links validados")
    }
    else {
      resolve(arrObj)
      // resolve("te ganaste solo el objeto")
    }
  })
}


mdlinks(routePath, {})
.then(res=>console.log('resultado mdLinks: ', res))
.catch(err=>console.error(err))

module.exports = mdlinks;

























/*module.exports = () => {
  
};*/
