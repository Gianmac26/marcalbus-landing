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
