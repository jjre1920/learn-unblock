# Learn & Unblock — Versión App Web (PWA)

Esta carpeta convierte tu juego en una **Progressive Web App (PWA)**:
una página web que los usuarios pueden "instalar" desde el navegador
como si fuera una app normal (con ícono en el escritorio/celular,
pantalla completa y funcionamiento sin internet).

## 📁 Contenido

- `index.html` — el juego (ya modificado con las etiquetas necesarias)
- `manifest.json` — define el nombre, ícono y modo de la app
- `service-worker.js` — permite que funcione offline e "instalable"
- `audio-system.js`, `realtime-lock.js`, `audio-integration.js` — módulos del juego
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png` — íconos de la app

## 🚀 Cómo publicarla (pasos generales)

1. Sube **TODOS** estos archivos a la **misma carpeta** en tu hosting
   (deben quedar al mismo nivel, no en subcarpetas).
2. La página debe servirse con **HTTPS** (obligatorio para que el
   "Instalar app" funcione). Casi todos los hostings gratuitos lo
   incluyen automáticamente:
   - GitHub Pages
   - Netlify
   - Vercel
   - Cloudflare Pages
3. Abre la URL en el navegador del celular o PC.

## 📲 Cómo "descargar"/instalar la app (el usuario final)

- **Android (Chrome):** al entrar al sitio aparecerá un banner o el
  menú (⋮) mostrará "Instalar app" / "Agregar a pantalla de inicio".
- **iPhone (Safari):** tocar el botón de compartir (□↑) →
  "Agregar a pantalla de inicio".
- **PC (Chrome/Edge):** aparece un ícono de instalación (⊕) en la
  barra de direcciones, o menú (⋮) → "Instalar Learn & Unblock".

Una vez instalada, el ícono del cohete aparecerá como cualquier otra
app, abrirá en pantalla completa (sin barra del navegador) y
funcionará incluso sin conexión gracias al service worker.

## ⚠️ Notas importantes

- El backend (`nexus.py` + `nexus_master.db`) **NO** está incluido en
  esta carpeta. Si tu juego depende de `/registrar-metrica`, ese
  servidor debe estar corriendo en internet (ej. en Render, Railway o
  un VPS) y la URL debe estar configurada en el HTML/JS para apuntar
  ahí (no a `localhost`).
- Si cambias el código del juego más adelante, sube de nuevo los
  archivos. El service worker tiene una caché (`CACHE_NAME =
  'learn-unblock-cache-v1'`); si quieres forzar que los usuarios
  reciban la versión nueva, cambia ese nombre (ej. a `v2`) en
  `service-worker.js`.
- Probar localmente: no abras `index.html` haciendo doble clic
  (file://), porque los service workers solo funcionan en `http(s)://`
  o `localhost`. Usa un servidor local, por ejemplo:
  `python3 -m http.server 8000` dentro de esta carpeta, y abre
  `http://localhost:8000`.
