const { obtenerRutasArchivos, obtenerEnlacesArchivos, validarEnlaces, obtenerEstadisticas } = require ('./functions.js');
const process = require('process');
const routePath = "./pruebaCarpeta"

// La función mdlinks recibe dos parámetros: pathUser y objeto
const mdlinks = (pathUser, objeto) => {
  return new Promise((resolve, reject) => {
    try {
//obtenerRutasArchivos recibe una ruta de un directorio y devuelve un array con las rutas de los archivos Markdown encontrados en ese directorio y en sus subdirectorios.
      const pathMds = obtenerRutasArchivos(pathUser)
//obtenerEnlacesArchivos: esta función recibe un array de rutas de archivos Markdown y devuelve un array con los enlaces encontrados en cada archivo, junto con la ruta del archivo y el texto del enlace.      
      const arrObj = obtenerEnlacesArchivos(pathMds)
      if (objeto.validate === true && objeto.stats === true) {
//validarEnlaces: esta función recibe un array de objetos de enlaces, y dos booleanos, validate y stats. Si validate es verdadero, la función valida cada enlace para comprobar si está funcionando o no. Si stats es verdadero, la función devuelve estadísticas sobre los enlaces (cantidad de enlaces totales y cantidad de enlaces rotos).        
        validarEnlaces(arrObj, objeto.validate, true).then((arrLinks) => {
//obtenerEstadisticas: esta función recibe un array de objetos de enlaces y una ruta, y devuelve un objeto con estadísticas sobre los enlaces, incluyendo la cantidad de enlaces totales y la cantidad de enlaces rotos.         
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

/*La función mdlinks utiliza estas funciones para procesar los archivos Markdown 
y devolver un array de objetos de enlaces. Si se pasa objeto.validate como verdadero, 
la función también valida los enlaces y devuelve estadísticas. Luego, la función 
devuelve una promesa que resuelve con el resultado final o se rechaza con un error 
si se produce un error durante el proceso.*/
module.exports = {mdlinks};

