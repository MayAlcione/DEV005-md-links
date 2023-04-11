 Ejemplos de uso

## Búsqueda de enlaces en un archivo

Buscar todos los enlaces en un archivo markdown:

$ md-links archivo.md


Buscar solo los enlaces rotos en un archivo markdown:

$ md-links archivo.md --validate --stats


Buscar solo los enlaces rotos en un archivo markdown y mostrar el detalle de cada uno:

$ md-links archivo.md --validate --stats --detail


## Búsqueda de enlaces en un directorio

Buscar todos los enlaces en todos los archivos markdown en un directorio:

$ md-links directorio/


Buscar solo los enlaces rotos en todos los archivos markdown en un directorio:

$ md-links directorio/ --validate --stats


Buscar solo los enlaces rotos en todos los archivos markdown en un directorio y mostrar el detalle de cada uno:

$ md-links directorio/ --validate --stats --recursive
