# Consumo de datos de APIs con Fetch y Axios

Pequeña app frontend (HTML + JavaScript con módulos ES) para consumir datos de una API y mostrarlos con búsqueda y paginación.

- Modos de consumo: **Fetch**, **Axios** (CDN) y **Custom API** (URL introducida por el usuario).
- Estilos: **Tailwind CSS** (CLI).
- API por defecto: `https://jsonplaceholder.typicode.com/posts`

## Requisitos

- Node.js (recomendado: 18+)
- npm


## Instalación

```bash
npm install
```

## Uso

En la pantalla principal:

1. Selecciona el modo:
   - **Use Fetch**: usa `fetch()` contra la API por defecto.
   - **Use Axios**: usa `axios` (cargado desde CDN) contra la API por defecto.
   - **Use Custom API**: el campo de búsqueda pasa a ser una URL completa.
2. (Opcional) Escribe un término en “Search element” (se envía como `q=` a la API).
3. Pulsa **Get Data**.
4. Navega por páginas desde la paginación inferior.

### Custom API

- Introduce una **URL válida** en el campo (por ejemplo, un endpoint que devuelva JSON).
- En este modo la paginación se hace **en cliente** (divide el JSON recibido en páginas).

## Estructura del proyecto

- [index.html](index.html): página principal.
- [src/js/main.js](src/js/main.js): listeners de UI y disparo de carga.
- [src/js/api.js](src/js/api.js): llamadas a API (Fetch/Axios), caché con `AbortController` y control de errores.
- [src/js/ui.js](src/js/ui.js): renderizado de resultados + paginación.
- [src/js/helpers.js](src/js/helpers.js): utilidades (formateo, escape HTML, mensajes de error).
- [src/css/input.css](src/css/input.css): entrada de Tailwind.
- [src/css/style.css](src/css/style.css): salida compilada de Tailwind (se referencia desde `index.html`).

## Notas

- La API de JSONPlaceholder soporta paginación con `_page` y `_limit`. La app también intenta leer `x-total-count` para calcular páginas.
- En modo `custom`, si el endpoint no añade `x-total-count`, se pagina en cliente usando `items.length`.

## Licencia

ISC
