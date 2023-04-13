/*const mdLinks = require('../');


describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

});*/

const mdLinksCli = require('./md-links-cli');

describe('mdLinksCli', () => {
  test('should resolve with no output when called with no options', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const resolveSpy = jest.fn();
    const rejectSpy = jest.fn();
    const path = '/path/to/file';

    await mdLinksCli(path, {});

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.anything());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(resolveSpy).toHaveBeenCalled();
    expect(rejectSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('should reject with an error when called with an invalid path', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const resolveSpy = jest.fn();
    const rejectSpy = jest.fn();
    const path = '/invalid/path';

    await expect(mdLinksCli(path, {})).rejects.toThrow(Error);

    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.anything());
    expect(resolveSpy).not.toHaveBeenCalled();
    expect(rejectSpy).toHaveBeenCalled();

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});


const { obtenerEnlacesArchivos } = require('./tu-archivo');

describe('obtenerEnlacesArchivos', () => {
  it('debería obtener los enlaces de los archivos Markdown correctamente', () => {
    const rutasArchivos = ['./ejemplo.md'];
    const enlacesEsperados = [{href:'https://ejemplo.com', text:'Un ejemplo de enlace', file: './ejemplo.md'},
                              {href:'https://otro-ejemplo.com', text: 'Otro ejemplo de enlace', file: './ejemplo.md'}];
    const enlacesObtenidos = obtenerEnlacesArchivos(rutasArchivos);
    expect(enlacesObtenidos).toEqual(enlacesEsperados);
  });
});


const mdlinks = require('./md-links');

test('Obtener rutas de archivos', () => {
  const rutas = obtenerRutasArchivos('./testFolder');
  expect(rutas).toEqual(['./testFolder/test1.md', './testFolder/test2.md']);
});


const mdlinks = require('./md-links');

test('Obtener enlaces de archivos', () => {
  const rutas = ['./testFolder/test1.md', './testFolder/test2.md'];
  const enlaces = obtenerEnlacesArchivos(rutas);
  expect(enlaces).toEqual([
    { href: 'https://google.com', text: 'Google', file: './testFolder/test1.md' },
    { href: 'https://github.com', text: 'GitHub', file: './testFolder/test1.md' },
    { href: 'https://jestjs.io/', text: 'Jest', file: './testFolder/test2.md' },
    { href: 'https://nodejs.org/', text: 'Node.js', file: './testFolder/test2.md' }
  ]);
});


const mdlinks = require('./md-links');

test('Validar enlaces', () => {
  const enlaces = [
    { href: 'https://google.com', text: 'Google', file: './testFolder/test1.md' },
    { href: 'https://github.com', text: 'GitHub', file: './testFolder/test1.md' },
    { href: 'https://jestjs.io/', text: 'Jest', file: './testFolder/test2.md' },
    { href: 'https://nodejs.org/', text: 'Node.js', file: './testFolder/test2.md' }
  ];

  return mdlinks.validarEnlaces(enlaces, false, false).then(resultados => {
    expect(resultados).toEqual([
      { href: 'https://google.com', text: 'Google', file: './testFolder/test1.md', status: 200, ok: 'OK', text: 'OK' },
      { href: 'https://github.com', text: 'GitHub', file: './testFolder/test1.md', status: 200, ok: 'OK', text: 'OK' },
      { href: 'https://jestjs.io/', text: 'Jest', file: './testFolder/test2.md', status: 200, ok: 'OK', text: 'OK' },
      { href: 'https://nodejs.org/', text: 'Node.js', file: './testFolder/test2.md' }
    ]);
  })
})

  

