# Control de palés

App para descarga de contenedores: escaneo de bultos, ubicación en rack e histórico consultable.
Sustituye a `UBICACION_RACK.xlsx` manteniendo sus mismos cálculos.

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube estos archivos a la raíz (arrastrándolos en *Add file → Upload files*):
   `index.html`, `manifest.json`, `sw.js`, `icon.svg`, `.nojekyll`
3. Ve a **Settings → Pages**, en *Source* elige `Deploy from a branch`,
   rama `main` y carpeta `/ (root)`. Guarda.
4. Al minuto tendrás la dirección `https://TU-USUARIO.github.io/TU-REPO/`.

GitHub Pages gratuito sólo funciona con repositorios públicos. El código sería
visible, pero **los datos de la operativa nunca se suben aquí**: se quedan en
cada dispositivo. Si necesitas el repositorio privado, hace falta GitHub Pro.

## Instalarla en la PDA

Abre la dirección en Chrome y usa **Menú → Añadir a pantalla de inicio**.
Queda como una aplicación normal, a pantalla completa y funcionando sin cobertura.
Para actualizarla, sube el `index.html` nuevo y **sube también el número de
`VERSION` en `sw.js`**; las PDAs se actualizarán solas la próxima vez que tengan red.

## Dónde se guardan los datos — léelo

Los datos viven en el almacenamiento del navegador de **cada dispositivo**.
Esto tiene tres consecuencias que conviene tener claras:

- **No se sincronizan entre PDAs.** Cada equipo ve lo suyo. Si dos operarios
  descargan el mismo camión desde PDAs distintas, tendrás dos registros parciales.
- **Se pierden si se borran los datos de navegación** o se desinstala la app.
- **El espacio es limitado** (unos 5 MB, del orden de 100 camiones con todos sus
  bultos). Al acercarte al límite, deja de guardar.

Por eso: **descarga el respaldo JSON al cerrar cada camión** (pestaña Datos), y
guarda también el Excel. El JSON se puede restaurar en cualquier PDA.

Si necesitas que varias PDAs compartan el mismo histórico en tiempo real, hace
falta un servidor; esta app no lo lleva. Pero desde la pestaña **Datos** hay
una **sincronización online manual** que usa tu propio repositorio de GitHub
como almacén (nada de servidores de terceros):

1. Entra en GitHub → tu perfil → **Settings → Developer settings → Fine-grained
   tokens** → genera un token con permiso **Contents: Read and write** sólo
   sobre este repositorio.
2. En la app, pestaña **Datos → Sincronización online**, rellena usuario,
   repositorio, rama y ese token, y pulsa "Guardar estos datos de conexión".
   El token se queda sólo en ese dispositivo.
3. Cuando quieras compartir lo escaneado: **Subir mis datos a la nube**.
   Cuando quieras traer lo de otras PDAs: **Traer datos de la nube** — combina
   los bultos de cada palé sin borrar lo que ya tenías en el dispositivo.

No es en tiempo real: cada PDA decide cuándo subir y cuándo traer, y hace
falta cobertura para hacerlo.

## Cómo se usa

**Contenedores** — Se crea el camión con su código, fecha y número de palés.
Ahí se elige cómo se leerán los bultos: con lector de códigos o haciendo una foto
a la pegatina del número.

**Etiquetas QR** — Genera e imprime una etiqueta por palé. Formato de rollo
100 × 64 mm (una etiqueta por página) u hoja A4. Al imprimir: márgenes ninguno, escala 100 %.

**Grabar palé** — El operario escribe su nombre, escanea el QR del palé y luego
todos sus bultos, uno tras otro. Cada lectura se guarda al instante. Para pasar al
palé siguiente, se escanea su QR dos veces seguidas (la primera avisa, la segunda
confirma). No hay que tocar la pantalla.

El **primer bulto del camión fija el patrón**: cuántos caracteres tiene el código
y si son sólo números. Lo que no encaje salta como anomalía con dos botones,
*Sí, está bien* y *No, descartar*. Nunca se bloquea nada: decide el operario, y lo
aceptado queda marcado como anomalía en el histórico.

**Buscar / Histórico** — Dos cosas distintas:
- Arriba, el buscador de combinaciones: dices artículo y unidades que necesitas y
  te propone qué palés coger del rack, con sus coordenadas.
- Abajo, el registro histórico en tres niveles — **camiones, palés y bultos** —
  con búsqueda libre y rango de fechas. Las unidades cuadran entre los tres niveles.
  Lo que estés viendo filtrado se descarga en Excel.

**Mapa** — El coordinador pone pasillo, altura y número; la coordenada sale del
maestro de ubicaciones y se contrasta con lo que escanea la carretilla.

**Datos** — Maestro de ubicaciones (sustituye al `BUSCARV` contra 'CONFE TODO'),
reglas de lectura del código, respaldos y descarga del histórico completo.

## Reglas de lectura del código

Configurables en la pestaña Datos. Por defecto, sobre `84178016200200287`:

| Dato | Regla | Resultado |
|---|---|---|
| Unidades por bulto | 2 dígitos, empezando 3 por el final | `28` |
| Artículo (mocacota) | 12 primeros caracteres | `841780162002` |
| Total del palé | suma de las unidades de cada bulto | `318` |
| Copiar en layout | mocacota + espacio + total | `841780162002 318` |

## Notas técnicas

- Un solo archivo sin dependencias externas: el generador de QR va incrustado.
- La lectura del número en foto descarga un motor de reconocimiento la primera
  vez que se usa, así que ese primer uso necesita internet. Después queda en caché.
  El número leído siempre se muestra en un campo editable antes de aceptarlo.
- La cámara necesita HTTPS, que GitHub Pages ya proporciona. El lector físico de
  la PDA funciona en cualquier caso: escribe en el campo como si fuera un teclado.
