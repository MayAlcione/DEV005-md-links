
const fs = require ('fs');
const MarkdownIt = require ('markdown-it');
// const fetch = require ('node-fetch');
const path = require('path');

function obtenerRutasArchivos(pathUser) {
  const stats = fs.statSync
  let arrayPath = []
  if(stats(pathUser).isFile() && path.extname(pathUser)==='.md'){
    arrayPath.push(pathUser)
  } else if(stats(pathUser).isDirectory()) {
   // console.log('la ruta es de un directorio')
    const elements = fs.readdirSync(pathUser)
    //console.log('ver elemntos dentro de directorio: ', elements)
    elements.forEach((element)=>{
     // console.log('cada elemnto: ', element)
      let newPath = path.join(pathUser, element)
     //console.log('nueva ruta: ', newPath)
      if(stats(newPath).isFile() && path.extname(newPath)==='.md'){
        arrayPath.push(newPath)
      }
      if(stats(newPath).isDirectory()){
        arrayPath = arrayPath.concat(obtenerRutasArchivos(newPath))
      }
    })
  } else {
   // console.log('es otro archivo distinto a md');
  }
  return arrayPath
}
// console.log('VER RESULTADO FINAL: ', obtenerRutasArchivos('./pruebaCarpeta'))

function validarEnlaces(enlaces, validate, followRedirects) {
  const promises = enlaces.map(enlace => {
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
  return Promise.all(promises);
}

function obtenerEnlacesArchivos(rutasArchivos) {
  const enlaces = [];
  rutasArchivos.forEach(rutaArchivo => {    
    const data = fs.readFileSync(rutaArchivo, 'utf8');
    console.log('data leída: ', data);
    const md = new MarkdownIt();
    const tokens = md.parse(data, {});
    console.log('tokens: ', tokens);
    const links = tokens.filter(token => token.type === 'inline' || token.type === 'link_open')
      .map(token => {
        let url = token.content.match(/[^!]\[.+?\]\(.+?\)/g)
        const href = url[0].match(/https*?:([^"')\s]+)/)[0]
        const text = url[0].match(/\[(.*)\]/)[1]
        return { href, text, file: rutaArchivo };
        // return url[0]
    
      });
    enlaces.push(...links);
  });
  return enlaces;
}

/*function obtenerEstadisticas(enlaces, archivo) {
  const totalEnlaces = enlaces.length;
  const enlacesUnicos = new Set(enlaces.map(enlace => enlace.href)).size;
  const enlacesRotos = enlaces.filter(enlace => enlace.ok === 'fail').length;

  const hostArchivo = new URL(archivo).host;
  const enlacesInternos = enlaces.filter(enlace => {
    const hostEnlace = new URL(enlace.href).host;
    return hostArchivo === hostEnlace;
  }).length;

  const enlacesExternos = totalEnlaces - enlacesInternos;

  return {
    total: totalEnlaces,
    unicos: enlacesUnicos,
    rotos: enlacesRotos,
    internos: enlacesInternos,
    externos: enlacesExternos
  }
}*/

module.exports = {
  obtenerRutasArchivos,
  obtenerEnlacesArchivos,
  validarEnlaces,
};