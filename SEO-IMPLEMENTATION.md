# Implementación SEO — MarcalBus

## Alcance

Se añadió `transporte-de-personal-lima.html` como landing estática SEO dentro de la arquitectura activa `marcalbus-landing/`. La página conserva los tokens visuales, componentes de CTA, formulario, header, footer, tipografía Inter, navegación y lógica de WhatsApp de la landing existente.

## Cambios técnicos realizados

- Se creó una URL SEO con aproximadamente 2,500 palabras originales orientadas a transporte de personal en Lima.
- Se añadieron `title`, meta description, canonical, Open Graph, Twitter Cards y `lang="es-PE"`.
- Se añadieron JSON-LD para `LocalBusiness`, `Service`, `BreadcrumbList` y `FAQPage`.
- Se incorporaron ocho preguntas frecuentes visibles y estructuradas para SEO.
- Se añadieron enlaces internos hacia inicio, servicios, beneficios, proceso y contacto usando rutas/anclas existentes; no se generan enlaces a páginas que todavía no existen.
- Se añadieron las cinco imágenes WebP solicitadas en `img/seo/`, reutilizando variantes optimizadas existentes para evitar peso duplicado.
- Todas las imágenes nuevas tienen `alt`, `width`, `height`, `loading="lazy"` cuando no son hero, y `decoding="async"`. El hero usa `fetchpriority="high"` y dimensiones explícitas.
- Se extrajo el CSS compartido a `assets/marcalbus.css` y el JavaScript compartido a `assets/marcalbus.js`. Esto evita duplicación entre `index.html` y la landing SEO.
- Se agregó una guardia para que el clic de WhatsApp no falle si la función de analítica no está disponible.
- Se amplió `vercel.json` para publicar cualquier HTML de la raíz y se actualizó `sitemap.xml` con la nueva URL.

## Decisión de dominio

El repositorio activo y su landing actual usan `https://marcalbus.com/` como dominio canónico. El contexto menciona `marcalbus.pe`, pero el diagnóstico técnico del proyecto indica que `.pe` no responde. Por ello se conserva `.com` para evitar canonicalizar hacia un dominio no operativo. Si `.pe` debe ser el dominio principal, primero debe configurarse DNS y una redirección 301 consistente.

## Plantilla para la Fase 2

La plantilla reutilizable está compuesta por:

- `assets/marcalbus.css`: sistema visual compartido y capa editorial SEO.
- `assets/marcalbus.js`: formulario, WhatsApp, analítica defensiva y animaciones.
- `transporte-de-personal-lima.html`: referencia estructural de metadata, schema, hero, bloques de contenido, FAQ y CTA.

Las extensiones publicadas usan la misma plantilla compartida:

- `taxi-ejecutivo-lima.html`
- `minibus-corporativo-lima.html`
- `turismo-empresarial.html`

Cada página tiene mensajes propios para los dolores de usuario y de Recursos Humanos, además de contenido sobre GPS, IA aplicada a la operación, experiencia del pasajero y coordinación B2B.

Para futuras páginas se debe duplicar únicamente la estructura HTML de la landing, cambiar el contenido semántico, metadata, canonical, schema, imagen hero y enlaces internos; CSS y JS deben seguir apuntando a los assets compartidos.

## Verificación realizada

- Sintaxis JavaScript validada con `node --check`.
- `vercel.json` validado como JSON.
- `sitemap.xml` validado con `xmllint`.
- Se verificó la existencia y peso reducido de las cinco imágenes SEO WebP.
- Se verificó que la landing tenga un solo `h1`, ocho FAQ visibles y atributos de imagen completos.

## SEO y GEO adicional

- La home enlaza desde la tarjeta de servicios hacia `transporte-de-personal-lima.html`, reforzando la arquitectura interna sin alterar el menú principal.
- Home y landing comparten el mismo identificador de entidad `@id`, junto con schema `WebSite` y `knowsAbout` para mejorar la comprensión de la marca y sus servicios.
- La optimización GEO se basa en respuestas directas visibles, contexto local explícito, FAQ rastreable, contenido original y relaciones semánticas consistentes. No se agregaron claims ni perfiles sociales no verificados.

## Analítica y versionado de assets

- **GTM + Consent Mode v2:** GA4 (`G-9V515LS8VM`) se carga **solo desde Google Tag Manager** (`GTM-T93CCWPW`). No volver a pegar gtag.js ni la config de GA4 en las páginas (el ID antiguo `G-2CVJ9MP5CR` se eliminó). Cada página lleva, inline en el `<head>` justo tras el viewport y en este orden: `dataLayer` + `function gtag`, `consent default` (todo `denied`, `wait_for_update: 500`), restauración de `marcalbus_consent` si es `granted`, y el fragmento de GTM; el `<noscript><iframe>` va tras `<body>`. `assets/analytics.js` se eliminó.
- **Aviso de cookies:** `assets/consent.js` (estilos inyectados por el propio JS) muestra el aviso ES/EN según `<html lang>`, guarda `granted`/`denied` en `localStorage.marcalbus_consent` y hace el `consent update`. El enlace "Configuración de cookies" / "Cookie settings" del footer (`data-cookie-settings`) lo reabre. Microsoft Clarity (`x1vih506vp`), antes en `analytics.js`, ahora solo se carga si el consentimiento es `granted`.
- **Eventos (dataLayer):** `assets/tracking.js` tiene un único listener delegado (captura) que empuja `whatsapp_click` (enlaces `wa.me/51928672932` o `api.whatsapp.com`, con `service` solo en páginas de servicio) y `phone_click` (`tel:`), con `link_url`, `page_path` y `page_language`. Los enlaces de WhatsApp son `<a href>` reales con `?text=` prellenado (ES/EN); ya no hay handlers JS que hagan `preventDefault`. `generate_lead` se emite desde `tracking.js` solo cuando Web3Forms responde OK al envío por correo de `contactForm` (`form_name: 'contacto'`) o `tripForm` (`form_name: 'traslado'`), con `page_path`, `page_language` y `service` (opción del select si coincide, si no el servicio de la página, si lo tiene); sin datos personales y con un solo push por envío. **Ahora mide un envío recibido por el proveedor de formularios, no un lead confirmado ni que el usuario envíe el mensaje de WhatsApp.** `window.marcalbusSendForm` hace un `fetch` (JSON, `keepalive`) a `https://api.web3forms.com/submit` con la clave pública de acceso, asunto `Nueva cotización web - [form_name] - [servicio o ruta]`, `from_name: MarcalBus Web` y los campos del formulario (más un honeypot `botcheck` oculto en el HTML); el destino (`ventas@marcalbus.com`) se configura en Web3Forms. WhatsApp se abre siempre de inmediato, dentro del clic, sin esperar al correo; si el envío falla no hay error visible ni `generate_lead`. No hay CSP en el sitio, así que no hace falta permitir `api.web3forms.com`. `tourism.js` conserva `select_route` (push plano al dataLayer).
- **Páginas legales:** `politica-de-privacidad.html`, `privacy-policy.html`, `politica-de-cookies.html`, `cookie-policy.html` (hreflang entre pares, en `sitemap.xml`, enlazadas desde todos los footers). Contacto: WhatsApp y ventas@marcalbus.com. Pendiente de revisión legal. `vercel.json` ya las publica con `{ "src": "*.html" }`.
- **Fuentes autoalojadas:** Inter (variable, pesos 400–900) se sirve desde `assets/fonts/` (`inter-latin.woff2`, `inter-latin-ext.woff2`) con `@font-face` en `assets/fonts.css` (`font-display: swap`, mismas familias y fallbacks). Ya no hay peticiones ni `preconnect` a `fonts.googleapis.com` / `fonts.gstatic.com`. Solo se precarga `inter-latin.woff2`; la URL del preload debe coincidir exactamente con la de `fonts.css` (incluido `?v=`). Si se cambia un archivo de fuente, cambiar el `?v=` en `fonts.css` y en el preload de todas las páginas.
- **Caché (headers de `vercel.json`):** se quitó el bloque `routes` de `vercel.json`, por lo que las reglas `headers` ya se aplican. `/assets/*` se sirve con `Cache-Control: public, max-age=31536000, immutable` (1 año); `/img/*` con `public, max-age=604800` (7 días, sin `immutable`); las páginas `.html` con `public, max-age=0, must-revalidate`. Todas las respuestas llevan `X-Frame-Options: DENY`.
- **Versionado `?v=`:** todas las referencias a `marcalbus.css`, `tourism.css`, `fonts.css`, `consent.js`, `tracking.js`, `marcalbus.js` y `tourism.js` llevan `?v=AAAAMMDD` (`tracking.js`, `marcalbus.js` y `tourism.js` están en `?v=20261101`; `consent.js` y `fonts.css` en `?v=20261031`; los CSS siguen en `?v=20261028` porque no cambiaron). Como `/assets/*` es `immutable` de 1 año, el `?v=` es lo que hace que los visitantes descarguen una versión nueva.
- **Regla:** cada vez que se edite un archivo de `/assets/`, hay que cambiar el valor de `?v=` en TODAS las páginas HTML (raíz y `/blog/`) o renombrar el archivo. Sin el cambio, los visitantes que ya tienen el archivo en caché no verán la actualización durante un año (`immutable`). Ejemplo (macOS):

  ```bash
  grep -rl "?v=20261031" --include="*.html" . | xargs sed -i '' 's/?v=20261031/?v=AAAAMMDD/g'
  ```

  Después de ejecutarlo, comprobar que no queda ninguna referencia con el valor anterior (`grep -r "?v=20261031" --include="*.html" .`).
