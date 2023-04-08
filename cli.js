#!/usr/bin/env node

const mdlinks = require('./md-links');
const argv = require('yargs')
  .usage('Usage: $0 <path-to-file> [options]')
  .option('validate', {
    alias: 'v',
    describe: 'Validates if the links are broken or not',
    type: 'boolean',
    default: false
  })
  .option('stats', {
    alias: 's',
    describe: 'Shows statistics about the links',
    type: 'boolean',
    default: false
  })
  .option('statsValidate', {
    alias: 'sv',
    describe: 'Shows statistics about the links and validates if they are broken or not',
    type: 'boolean',
    default: false
  })
  .option('followRedirects', {
    alias: 'f',
    describe: 'Follows HTTP redirects',
    type: 'boolean',
    default: false
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const rutaArchivo = argv._[0];

if (!rutaArchivo) {
  console.error('Please specify a path to a file.');
  process.exit(1);
}

const rutasArchivos = mdlinks.obtenerRutasArchivos(rutaArchivo);

if (rutasArchivos.length === 0) {
  console.error(`There are no .md files in the directory "${rutaArchivo}".`);
  process.exit(1);
}

const enlaces = mdlinks.obtenerEnlacesArchivos(rutasArchivos);

if (enlaces.length === 0) {
  console.error(`There are no links in the .md files in the directory "${rutaArchivo}".`);
  process.exit(1);
}

if (argv.validate && !argv.stats && !argv.statsValidate) {
  mdlinks.validarEnlaces(enlaces, true, argv.followRedirects)
    .then(resultados => {
      resultados.forEach(resultado => {
        console.log(`${resultado.file} ${resultado.href} ${resultado.status} ${resultado.ok} ${resultado.text}`);
      });
    })
    .catch(err => console.error(err));
} else if (!argv.validate && argv.stats && !argv.statsValidate) {
  const estadisticas = mdlinks.obtenerEstadisticas(enlaces, rutaArchivo);
  console.log(`Total: ${estadisticas.total}\nUnique: ${estadisticas.unicos}\nBroken: ${estadisticas.rotos}`);
} else if (!argv.validate && !argv.stats && argv.statsValidate) {
  mdlinks.validarEnlaces(enlaces, true, argv.followRedirects)
    .then(resultados => {
      const estadisticas = mdlinks.obtenerEstadisticas(resultados, rutaArchivo);
      console.log(`Total: ${estadisticas.total}\nUnique: ${estadisticas.unicos}\nBroken: ${estadisticas.rotos}`);
    })
    .catch(err => console.error(err));
} else {
  console.error('Please specify only one option: --validate, --stats or --statsValidate.');
  process.exit(1);
}

module.exports = {
    processCliArgs,
  };

