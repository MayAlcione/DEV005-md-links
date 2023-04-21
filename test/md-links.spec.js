const mdlinks = require('../index.js').mdlinks;

const { obtenerRutasArchivos, obtenerEnlacesArchivos, validarEnlaces, obtenerEstadisticas} = require('../functions.js');

const fs = require('fs');
const path = require('path');

test('Obtener rutas de archivos', () => {
  const rutas = obtenerRutasArchivos('./pruebaCarpeta');
  expect(rutas).toEqual([
    "pruebaCarpeta\\file.md",
    "pruebaCarpeta\\otraCarpeta\\readme.md",
    "pruebaCarpeta\\otro.md",
  ]);
});

test('Obtener rutas de archivos vacios', () => {
  const rutas = obtenerRutasArchivos('./pruebaCarpetaVacia');
  expect(rutas).toEqual([
  ]);
});


test('Obtener enlaces de archivos', () => {
  const rutas = ["./pruebaCarpeta/file.md"];
  const enlaces = obtenerEnlacesArchivos(rutas);
  expect(enlaces).toEqual([
    { href: "https://www.docs.npmjs.com/cli/install", text: "docs oficiales de `npm install` acá",file: "./pruebaCarpeta/file.md" },
    { href: "https://www.github.com/Laboratoria", text: "Github", file: "./pruebaCarpeta/file.md" },
    { href: "https://www.google.com", text: "Google", file: "./pruebaCarpeta/file.md" },
  ]);
});


test('Validar enlaces', () => {
  const enlaces = [
    { href: 'https://www.google.com', text: 'Google', file: './pruebaCarpeta/file.md' },
    { href: 'https://www.github.com/Laboratoria', text: 'Github', file: './pruebaCarpeta/file.md' },
  ];

  return validarEnlaces(enlaces, false, false).then(resultados => {
    expect(resultados).toEqual([
      { href: 'https://www.google.com', text: 'Google', file: './pruebaCarpeta/file.md', status: 200, ok: 'ok' },
      { href: 'https://www.github.com/Laboratoria', text: 'Github', file: './pruebaCarpeta/file.md', status: 301, ok: 'ok' },
    ]);
  })
})
describe('ObtenerEstadisticas', () => {
  test('debería retornar las estadísticas correctas sin validar enlaces', () => {
    const enlaces = [{ href: 'https://www.google.com', ok: 'success'},{ href: 'https://www.facebook.com', ok: 'success' }, 
                     { href: 'https://www.twitter.com', ok: 'fail' }, { href: 'https://www.google.com', ok: 'success' } ];
    const estadisticas = obtenerEstadisticas(enlaces);
    expect(estadisticas.total).toBe(4);
    expect(estadisticas.unicos).toBe(3);
    expect(estadisticas.rotos).toBeUndefined();
  });

  test('debería retornar las estadísticas correctas validando enlaces', () => {
    const enlaces = [{ href: 'https://www.google.com', ok: 'success' },{ href: 'https://www.facebook.com', ok: 'success' },     
                     { href: 'https://www.twitter.com', ok: 'fail' },  { href: 'https://www.google.com', ok: 'success' }];
    const estadisticas = obtenerEstadisticas(enlaces, true);
    expect(estadisticas.total).toBe(4);
    expect(estadisticas.unicos).toBe(3);
    expect(estadisticas.rotos).toBe(1);
  });
});

describe('mdlinks', () => {
  test('Devuelve un array de links si ruta de archivo Markdown tiene validate true', () => {
    const pathUser = './pruebaCarpeta/file.md';
    const objeto = {
      validate: false,
      stats: false
    };
    const expectedOutput = [
      {
        file: './pruebaCarpeta/file.md',
        href: 'https://www.docs.npmjs.com/cli/install',
        text: 'docs oficiales de `npm install` acá',
      },
      {
        file: './pruebaCarpeta/file.md',
        href: 'https://www.github.com/Laboratoria',
        text: 'Github',
      },
      {
        file:'./pruebaCarpeta/file.md',
        href:'https://www.google.com',
        text:'Google',
      }
    ];
    if (objeto.validate === false) {
      return expect(mdlinks(pathUser, objeto)).resolves.toEqual(expectedOutput);
    }
  
    const expectedOutputWithValidation = [
      {
        file: './pruebaCarpeta/file.md',
        href: 'https://www.docs.npmjs.com/cli/install',
        text: 'docs oficiales de `npm install` acá',
        ok: 'fail',
        status: 404,
        error: expect.any(TypeError)
      },
      {
        file: './pruebaCarpeta/file.md',
        href: 'https://www.github.com/Laboratoria',
        text: 'Github',
        ok: 'ok',
        status: 200,
        error: null
      }
    ];
  
    expect(mdLinks(pathUser, objeto)).resolves.toEqual(expectedOutputWithValidation);
  });
});  

  test('Devolve numero total de links, de links unicos y links rotos si validate y stats son true', () => {
    const pathUser = './pruebaCarpeta';
    const objeto = {
      validate: true,
      stats: true
    };
    const expectedOutput = {
      total: 3,
      unicos: 3,
      rotos: 1
    };

    return mdlinks(pathUser, objeto).then((output) => {
      expect(output).toEqual(expectedOutput);
    });
  });

  test('Devolve un array de links con archivos Markdown si validate y stats son false', () => {
    const pathUser = './pruebaCarpeta/file.md';
    const objeto = {
      validate: false,
      stats: false
    };
    const expectedOutput = [
      {
        href: 'https://www.google.com/',
        text: 'Google',
        file: './pruebaCarpeta/file.md',
        href: 'https://www.docs.npmjs.com/cli/install',
        text: 'docs oficiales de `npm install` acá'
      },
      {
        href: 'https://nodejs.org/',
        text: 'Node.js',
        file: 'test/fixtures/markdownFiles/test.md',
        file: './pruebaCarpeta/file.md',
        href: 'https://www.github.com/Laboratoria',
        text: 'Github'
      },
      {
        file: './pruebaCarpeta/file.md',
        href: 'https://www.google.com',
        text: 'Google'
      }
    ];

    return mdlinks(pathUser, objeto).then((output) => {
      expect(output).toEqual(expectedOutput);
    });
  });

  test('Devolve Error si la ruta no existe', () => {
    const pathUser = './pruebaCarpeta/otro.md';
    const objeto = {
      validate: true,
      stats: false
    };

    return mdlinks(pathUser, objeto).catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('La ruta no existe');
    });
  });
