const mdlinks = require('../index.js').mdlinks;

const { obtenerRutasArchivos, obtenerEnlacesArchivos, validarEnlaces, obtenerEstadisticas} = require('../functions.js');
const functions = require('../functions.js');
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
    if('Validar enlaces con enlace roto', () => {
      const enlace = { href: 'https://www.google.com/notfound', text: 'Google', file: './pruebaCarpeta/file.md' };
      return validarEnlace(enlace).then(resultado => {
        expect(resultado).toEqual({ href: 'https://www.google.com/notfound', text: 'Google', file: './pruebaCarpeta/file.md', ok: 'fail', status: 404 });
      });
    });
    
  });
});


describe('obtenerEstadisticas', () => {
  test('Devuelve objeto con estadísticas de enlaces', () => {
    const pathUser = './pruebaCarpeta/file.md';
    const arrLinks = [
      {
        file: './pruebaCarpeta/file.md',
        href: 'https://www.docs.npmjs.com/cli/install',
        text: 'docs oficiales de `npm install` acá',
        ok: 'ok',
        status: 200,
        error: null
      },
      {
        file: './pruebaCarpeta/file.md',
        href: 'https://www.github.com/Laboratoria',
        text: 'Github',
        ok: 'fail',
        status: 404,
        error: expect.any(TypeError)
      },
      {
        file:'./pruebaCarpeta/file.md',
        href:'https://www.google.com',
        text:'Google',
        ok: 'ok',
        status: 200,
        error: null
      }
    ];
    const expectedOutput = {
      total: 3,
      unicos: 3,
      rotos: 1
    };

    expect(obtenerEstadisticas(arrLinks, pathUser)).toEqual(expectedOutput);
  });
});


describe('mdlinks', () => {
  test('Devuelve estadísticas de enlaces si validate es true y stats es true', () => {
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
    }).catch((err) => {
      throw err;
    });
  });
});
  
  test('Devuelve el número total de enlaces, enlaces únicos y enlaces rotos incluso si se proporciona un objeto de opciones vacío', () => {
    const path = './some/directory';
    const options = {};
    const expectedOutput = {
      total: 0,
      unicos: 0,
      rotos: 0
    };
    });
  
      test('Devuelve el número total de enlaces, enlaces únicos y enlaces rotos incluso si se proporciona un objeto de opciones con valores booleanos negativos', () => {
        const pathUser = './pruebaCarpeta2';
        const objeto = {
          validate: false,
          stats: false
        };
        const expectedOutput = {
          total: 3,
          unicos: 2,
          rotos: 1
        };
    });
    describe('obtenerEstadisticas', () => {
      test('Devuelve objeto con estadísticas de enlaces totales y únicos si no hay enlaces rotos', () => {
        const arrLinks = [
          { href: 'https://www.google.com', text: 'Google', file: './pruebaCarpeta/file.md' },
          { href: 'https://www.github.com/Laboratoria', text: 'Github', file: './pruebaCarpeta/file.md' },
          { href: 'https://www.docs.npmjs.com/cli/install', text: 'docs oficiales de `npm install` acá', file: './pruebaCarpeta/file.md' },
        ];
    
        const pathUser = './pruebaCarpeta';
    
        const expectedOutput = {
          total: 3,
          unicos: 3,
          rotos: 0
        };
    
        expect(obtenerEstadisticas(arrLinks, pathUser)).toEqual(expectedOutput);
      });
    });
    

  test('Devuelve un array de links con archivos Markdown si validate y stats son false', () => {
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
    }).catch((err) => {
      throw err;
    });
  });

  test('Devuelve array si validate es true pero no encuentra links', () => {
    const pathUser = './pruebaCarpeta/otro.md';
    const options = {
      validate: true,
      stats: false
    };
    const expectedOutput = [];
    return expect(mdlinks(pathUser, options)).resolves.toEqual(expectedOutput);
  });
