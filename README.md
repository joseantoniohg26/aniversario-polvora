# Aniversario del Distrito de Pólvora

Micrositio informativo del 42.° aniversario del distrito de Pólvora (Tocache, San Martín). Sitio estático hecho con Astro 5 y Tailwind CSS 4.

## Cambiar contenido
Todo el contenido está en dos archivos:
- `src/data/programa.json`: actividades por día (hora, título, detalle, lugar).
- `src/data/distrito.json`: datos del distrito, historia, contacto y textos fijos.

Si una actividad no tiene lugar en el afiche de la municipalidad, `lugar` queda en `null` y no se muestra.

## Comandos
```
npm install
npm run dev      # servidor local
npm run check    # revisa tipos y errores de Astro
npm run build    # genera dist/
```

## Dependencias (y por qué)
- `astro`: generador del sitio estático y optimización de imágenes (WebP).
- `tailwindcss` y `@tailwindcss/vite`: estilos, con la paleta del escudo definida en `src/styles/global.css`.
- `@astrojs/check` y `typescript` (solo desarrollo): `npm run check` revisa errores de tipos y de Astro antes de publicar.
- `@fontsource/bree-serif` y `@fontsource/source-sans-3`: las dos únicas tipografías, alojadas en el mismo sitio (sin pedir nada a Google Fonts).

## Audio y video
- Los videos van en `public/video/`, en H.264, de 854 px de ancho como máximo y de unos 10 MB cada uno.
- Los audios van en `public/audio/`, cortos, en `.m4a`.
- Todos llevan `preload="none"`: no se descargan hasta que alguien los reproduce.

## Notas
- `contenido/` (materiales de la municipalidad) no se sube al repo.
- `npm audit` marca avisos en Astro 5 que solo se corrigen con Astro 7. Aquí no aplican porque el sitio es estático, sin servidor.
