
const fs = require ('fs');
const MarkdownIt = require ('markdown-it');
const fetch = require ('node-fetch');

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
    const links = tokens.filter(token => token.type === 'link_open')
      .map(token => {
        const href = token.attrs.find(attr => attr[0] === 'href')[1];
        const text = md.renderer.render([token], md.options, {}).trim();
        return { href, text, file: rutaArchivo };
      });
    enlaces.push(...links);
  });
  return enlaces;
}

function obtenerEstadisticas(enlaces, archivo) {
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
}

module.exports = {
  obtenerEnlacesArchivos,
  validarEnlaces,
};