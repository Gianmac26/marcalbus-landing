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

- **Analítica unificada:** `assets/analytics.js` define `window.dataLayer` y `window.gtag`, hace `gtag('config', 'G-2CVJ9MP5CR')`, carga `gtag/js` de forma asíncrona y el loader de Microsoft Clarity (`x1vih506vp`). Todas las páginas lo incluyen con `defer` antes de `marcalbus.js` y `tourism.js` (orden: `analytics.js`, `marcalbus.js`, `tourism.js`). Ya no se usa Google Tag Manager (el contenedor `GTM-MJ4T5CQN` estaba vacío): no volver a pegar snippets de GTM, gtag.js ni Clarity dentro de las páginas.
- **Eventos:** `click_whatsapp` solo en clics directos a botones de WhatsApp; `generate_lead` solo en el envío del formulario de las páginas de turismo.
- **Caché de `/assets/*` (estado actual):** `vercel.json` declara reglas `headers` para `/assets/*` con `Cache-Control: public, max-age=31536000, immutable`, pero **actualmente NO se aplican**: el archivo usa `routes` y Vercel ignora `headers` cuando existe `routes`. En la práctica los assets se sirven con `Cache-Control: public, max-age=0, must-revalidate` (verificado en producción y en previews), así que los navegadores revalidan en cada visita.
- **Versionado `?v=`:** todas las referencias a `marcalbus.css`, `tourism.css`, `analytics.js`, `marcalbus.js` y `tourism.js` llevan `?v=AAAAMMDD` (hoy `?v=20261028`). Se mantiene como protección para cuando se corrija la configuración de `vercel.json` y los assets pasen a `immutable`; mientras tanto es inofensivo.
- **Regla:** cada vez que se edite un archivo de `/assets/`, hay que cambiar el valor de `?v=` en TODAS las páginas HTML (raíz y `/blog/`). Sin el cambio, cuando los assets pasen a `immutable`, los visitantes que ya tienen el archivo en caché no verán la actualización durante un año. Ejemplo (macOS):

  ```bash
  grep -rl "?v=20261028" --include="*.html" . | xargs sed -i '' 's/?v=20261028/?v=AAAAMMDD/g'
  ```

  Después de ejecutarlo, comprobar que no queda ninguna referencia con el valor anterior (`grep -r "?v=20261028" --include="*.html" .`).
