const fs = require ('fs'); 
const MarkdownIt = require ('markdown-it');
const path = require('path');

function obtenerRutasArchivos(pathUser) {
  const stats = fs.statSync
  let arrayPath = []
if(pathUser.length > 0 && stats(pathUser).isFile() && path.extname(pathUser)==='.md'){
    arrayPath.push(pathUser) 
  } else if(stats(pathUser).isDirectory()) {
    const elements = fs.readdirSync(pathUser)
    elements.forEach((element)=>{
      let newPath = path.join(pathUser, element) 
      if(stats(newPath).isFile() && path.extname(newPath)==='.md'){
        arrayPath.push(newPath)
      }     
      if(stats(newPath).isDirectory()){
        arrayPath = arrayPath.concat(obtenerRutasArchivos(newPath))
      }
    })  
  } else {
  }
  return arrayPath
}

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
    const md = new MarkdownIt();
    const tokens = md.parse(data, {});

    const links = tokens.filter(token => token.type === 'inline' || token.type === 'link_open')
      .map(token => {
        let url = token.content.match(/[^!]\[.+?\]\(.+?\)/g)  
        const href = url[0].match(/https*?:([^"')\s]+)/)[0]
        const text = url[0].match(/\[(.*)\]/)[1]
        return { href, text, file: rutaArchivo };
      });
    enlaces.push(...links);
  });
  return enlaces;
}

function obtenerEstadisticas(enlaces, validate = false) {
  const totalEnlaces = enlaces.length;
  const newEnlace = enlaces.map(enlace => enlace.href)
  const enlacesUnicos = newEnlace.filter((elem, index, arr) => index === arr.indexOf(elem)).length;
  const enlacesRotos = enlaces.filter(enlace => enlace.ok === 'fail').length;
 if (validate){  return {
  total: totalEnlaces,
  unicos: enlacesUnicos,
  rotos: enlacesRotos,
}
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
