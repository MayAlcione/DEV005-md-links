const fs = require ('fs'); //fs es un módulo que proporciona una API para interactuar con el sistema de archivos del equipo.
const MarkdownIt = require ('markdown-it');//MarkdownIt es una librería para analizar y renderizar texto en formato Markdown.
const path = require('path');//path es un módulo que proporciona una API para trabajar con rutas de archivos y directorios en el sistema de archivos del equipo.

/*La función obtenerRutasArchivos recibe como parámetro una ruta de archivo o directorio (pathUser). Dentro de la función, 
se utiliza fs.statSync para obtener información sobre el archivo o directorio especificado por pathUser, como por ejemplo, 
si es un archivo o directorio. Luego se crea un arreglo vacío arrayPath que se utiliza para almacenar las rutas de los archivos markdown encontrados.*/
function obtenerRutasArchivos(pathUser) {
  const stats = fs.statSync
  let arrayPath = []

/*Este código verifica si el pathUser es un archivo (isFile()) y si su extensión es .md (path.extname(pathUser) === '.md'). Si ambos son verdaderos, 
se agrega el pathUser al array arrayPath. En resumen, se está buscando archivos con extensión .md. */  
if(pathUser.length > 0 && stats(pathUser).isFile() && path.extname(pathUser)==='.md'){
    arrayPath.push(pathUser)

/*Si pathUser es un directorio, se llama a la función readdirSync() del módulo fs para leer todos los elementos del directorio especificado y almacenarlos 
en un array llamado elements. Luego, se recorre cada elemento del array mediante la función forEach() y se crea un nuevo camino o ruta concatenando el directorio 
pathUser con el nombre de cada elemento utilizando la función path.join(). La nueva ruta se almacena en la variable newPath. */    
  } else if(stats(pathUser).isDirectory()) {
    const elements = fs.readdirSync(pathUser)
    elements.forEach((element)=>{
      let newPath = path.join(pathUser, element)

/*Para realizar esta verificación, se utiliza la función isFile() del objeto stats para verificar si el elemento en newPath es un archivo. 
Además, se utiliza la función path.extname() para obtener la extensión del archivo en newPath y se compara con la cadena '.md'.
Si el archivo en newPath cumple ambas condiciones, es decir, es un archivo y tiene la extensión .md, se añade la ruta del archivo a un array 
arrayPath utilizando la función push(). El resultado es que arrayPath contendrá la ruta de todos los archivos con extensión .md encontrados en 
el directorio especificado en pathUser y sus subdirectorios. */    
      if(stats(newPath).isFile() && path.extname(newPath)==='.md'){
        arrayPath.push(newPath)
      }
/*Si el elemento en newPath es un directorio, se llama recursivamente a la función obtenerRutasArchivos() para obtener las rutas de los archivos
 que se encuentran en el directorio especificado por newPath. La función concat() se utiliza para concatenar el array arrayPath con el resultado 
 de la llamada a la función obtenerRutasArchivos() y así agregar las rutas de los archivos encontrados en el subdirectorio al array original */     
      if(stats(newPath).isDirectory()){
        arrayPath = arrayPath.concat(obtenerRutasArchivos(newPath))
      }
    })
/*La estructura condicional if-else comprueba si el archivo o elemento en pathUser no es ni un directorio ni un archivo con extensión .md. 
Si este es el caso, se imprime un mensaje en la consola indicando que es otro tipo de archivo diferente a .md.
Luego, la función retorna el array arrayPath que contiene las rutas de todos los archivos con extensión .md encontrados en el directorio 
especificado en pathUser y sus subdirectorios. Si no se encontraron archivos .md, el array estará vacío. */    
  } else {
    console.log('es otro archivo distinto a md');
  }
  return arrayPath
}

/*El argumento enlaces es un array de objetos que contienen información sobre los enlaces a validar, 
como la URL (href), el texto asociado al enlace (text) y el archivo donde se encontró el enlace (file).
El argumento validate es un valor booleano que indica si se debe validar el estado del enlace (si es un 
enlace válido o no). Si es true, se validará el estado del enlace; si es false, no se validará el estado del enlace.
El argumento followRedirects es un valor booleano que indica si se deben seguir o no las redirecciones de los enlaces. */
function validarEnlaces(enlaces, validate, followRedirects) {
  const promises = enlaces.map(enlace => {
// Cada promesa realiza una petición HTTP utilizando fetch() con el método HEAD para obtener información sobre el enlace.    
    return fetch(enlace.href, { method: 'HEAD', redirect: followRedirects ? 'follow' : 'manual' })
      .then(res => {
        if (!validate) {
          return { href: enlace.href, text: enlace.text, file: enlace.file, ok: 'ok', status: res.status };
        } else if (res.ok) {
          return { href: enlace.href, text: enlace.text, file: enlace.file, ok: 'ok', status: res.status };
        } else {
          return { href: enlace.href, text: enlace.text, file: enlace.file, ok: 'fail', status: res.status };
        }
      })
      .catch(err => {
        return { href: enlace.href, text: enlace.text, file: enlace.file, ok: 'fail', error: err };
      });
  });
//se utiliza para esperar a que todas las promesas se resuelvan antes de devolver el resultado.  
  return Promise.all(promises);
}
//argumento rutasArchivos que es un array de rutas de archivos en formato de texto plano que contienen enlaces Markdown.
function obtenerEnlacesArchivos(rutasArchivos) {
  const enlaces = [];
/*La función lee el contenido de cada archivo de texto plano en rutasArchivos utilizando la función fs.readFileSync(), 
y luego convierte el contenido a HTML utilizando la biblioteca markdown-it. */  
  rutasArchivos.forEach(rutaArchivo => {    
    const data = fs.readFileSync(rutaArchivo, 'utf8');
    const md = new MarkdownIt();
    const tokens = md.parse(data, {});
/*La función busca todos los enlaces en el contenido HTML utilizando la biblioteca markdown-it y los filtra para 
obtener solo los enlaces de texto (inline) y los enlaces de apertura (link_open). Luego extrae la URL (href) y el 
texto asociado al enlace (text) de cada enlace y los almacena en un objeto.*/
    const links = tokens.filter(token => token.type === 'inline' || token.type === 'link_open')
      .map(token => {
        let url = token.content.match(/[^!]\[.+?\]\(.+?\)/g)  // en Markdown, un token puede representar un título (# título), un enlace ([texto del enlace](URL)) o una imagen (![texto alternativo](URL de la imagen))
        const href = url[0].match(/https*?:([^"')\s]+)/)[0]
        const text = url[0].match(/\[(.*)\]/)[1]
        return { href, text, file: rutaArchivo };
      });
    enlaces.push(...links);
  });
//la función devuelve un array que contiene todos los objetos de enlace extraídos de todos los archivos de texto plano en rutasArchivos.  
  return enlaces;
}

/* calcula el número total de enlaces en el array enlaces 
calcula el número de enlaces únicos en el array enlaces, utilizando el método filter() en un array que contiene solo las URLs de los enlaces 
y eliminando los elementos duplicados mediante indexOf(). 
calcula el número de enlaces rotos, que tienen una respuesta HTTP fallida */
function obtenerEstadisticas(enlaces, validate = false) {
  const totalEnlaces = enlaces.length;
  const newEnlace = enlaces.map(enlace => enlace.href)
  const enlacesUnicos = newEnlace.filter((elem, index, arr) => index === arr.indexOf(elem)).length;
  const enlacesRotos = enlaces.filter(enlace => enlace.ok === 'fail').length;

/*Si el argumento validate es verdadero, la función devuelve un objeto que contiene tres propiedades: total que representa el número total de enlaces,
 unicos que representa el número de enlaces únicos y rotos que representa el número de enlaces rotos. */
 if (validate){  return {
  total: totalEnlaces,
  unicos: enlacesUnicos,
  rotos: enlacesRotos,
}
//Si el argumento validate es falso o no se proporciona, la función devuelve un objeto que contiene solo dos propiedades: total y unicos.
 } else { return {
  total: totalEnlaces,
  unicos: enlacesUnicos,
}}
}

module.exports = {
  obtenerRutasArchivos,
  validarEnlaces,
  obtenerEnlacesArchivos,
  obtenerEstadisticas
};

