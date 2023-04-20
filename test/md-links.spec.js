const mdlinks = require('../index.js').mdlinks;

/*describe('mdlinks', () => {
  test('should resolve with no output when called with no options', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const resolveSpy = jest.fn();
    const rejectSpy = jest.fn();
    const path = '/path/to/file';

    mdlinks(path, {});

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.anything());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(resolveSpy).toHaveBeenCalled();
    expect(rejectSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('should reject with an error when called with an invalid path', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const resolveSpy = jest.fn();
    const rejectSpy = jest.fn();
    const path = '/invalid/path';

    expect(mdlinks(path, {})).rejects.toThrow(Error);

    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.anything());
    expect(resolveSpy).not.toHaveBeenCalled();
    expect(rejectSpy).toHaveBeenCalled();

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
*/



const { obtenerRutasArchivos, obtenerEnlacesArchivos, validarEnlaces } = require('../functions.js');


test('Obtener rutas de archivos', () => {
  const rutas = obtenerRutasArchivos('./pruebaCarpeta');
  expect(rutas).toEqual([
    './pruebaCarpeta/otraCarpeta/readme.md',
    './pruebaCarpeta/file.md',
    './pruebaCarpeta/otro.md'
  ]);
});

test('Obtener rutas de archivos', () => {
  const rutas = obtenerRutasArchivos('./documentos');
  expect(rutas).toEqual([
    '\Users\myalc\OneDrive\Documentos\CONCEPTOS CSS.docx'
  ]);
});

test('Obtener rutas de archivos', () => {
  const rutas = obtenerRutasArchivos('./directorio');
  expect(rutas).toEqual([
  ]);
});


test('Obtener rutas de archivos', () => {
  const rutas = obtenerRutasArchivos('./pruebaCarpetaVacia');
  expect(rutas).toEqual([
    
  ]);
});


test('Obtener enlaces de archivos', () => {
  const rutas = ['./pruebaCarpeta/file.md'];
  const enlaces = obtenerEnlacesArchivos(rutas);
  expect(enlaces).toEqual([
    { href: 'https://google.com', text: 'Google', file: './pruebaCarpeta/file.md' },
    { href: 'https://github.com/Laboratoria', text: 'GitHub', file: './pruebaCarpeta/file.md' },
  ]);
});


test('Validar enlaces', () => {
  const enlaces = [
    { href: 'https://google.com', text: 'Google', file: './pruebaCarpeta/file.md' },
    { href: 'https://github.com/Laboratoria', text: 'GitHub', file: './pruebaCarpeta/file.md' },
  ];

  return validarEnlaces(enlaces, false, false).then(resultados => {
    expect(resultados).toEqual([
      { href: 'https://google.com', text: 'Google', file: './pruebaCarpeta/file.md', status: 301, ok: 'ok' },
      { href: 'https://github.com/Laboratoria', text: 'GitHub', file: './pruebaCarpeta/file.md', status: 200, ok: 'ok' },
    ]);
  })
})

