  
    const MARCALBUS_CONFIG = {
      whatsappNumber: '51928672932',
      defaultMessage: 'Hola MarcalBus, necesito información sobre sus servicios.',
      quoteMessage: 'Hola MarcalBus, quiero solicitar una cotización para mi empresa.'
    };

    function openWhatsApp(message) {
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${MARCALBUS_CONFIG.whatsappNumber}?text=${encodedMessage}`;
      if (typeof gtag === 'function') gtag('event', 'click_whatsapp', {
          event_category: 'lead',
          event_label: 'whatsapp_marcalbus'
      });
      const newWindow = window.open(url, '_blank');
      if (newWindow) newWindow.opener = null;
    }

    function buildQuoteMessage({ nombre, empresa, email, servicio, mensaje }) {
      return `Hola MarcalBus, solicito una cotización desde la web:\n\n` +
        `Nombre: ${nombre}\n` +
        `Empresa: ${empresa}\n` +
        `Correo: ${email}\n` +
        `Tipo de servicio: ${servicio}\n` +
        `Detalle: ${mensaje || 'No indicado'}`;
    }

    function sendToWhatsApp(event) {
      event.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const empresa = document.getElementById('empresa').value.trim();
      const email = document.getElementById('email').value.trim();
      const servicio = document.getElementById('servicio').value;
      const mensaje = document.getElementById('mensaje').value.trim();

      if (!nombre || !empresa || !email || !servicio) {
        alert('Por favor completa todos los campos requeridos.');
        return;
      }

      const quoteMessage = buildQuoteMessage({ nombre, empresa, email, servicio, mensaje });
      openWhatsApp(quoteMessage);
    }

    function setupWhatsAppButton(id, message) {
      const element = document.getElementById(id);
      if (!element) return;

      element.addEventListener('click', function (event) {
        event.preventDefault();
        openWhatsApp(message);
      });
    }

    document.addEventListener('DOMContentLoaded', function () {
      const form = document.getElementById('contactForm');
      if (form) form.addEventListener('submit', sendToWhatsApp);

      setupWhatsAppButton('whatsappDirectBtn', MARCALBUS_CONFIG.quoteMessage);
      setupWhatsAppButton('seoWhatsappHero', MARCALBUS_CONFIG.quoteMessage);
      setupWhatsAppButton('whatsappFloatBtn', MARCALBUS_CONFIG.defaultMessage);
      setupWhatsAppButton('footerWhatsAppLink', MARCALBUS_CONFIG.defaultMessage);

      console.assert(
        buildQuoteMessage({ nombre: 'Ana', empresa: 'ACME', email: 'ana@acme.com', servicio: 'Taxi ejecutivo', mensaje: '' }).includes('Detalle: No indicado'),
        'buildQuoteMessage debe usar “No indicado” cuando no hay detalle.'
      );
      console.assert(
        buildQuoteMessage({ nombre: 'Luis', empresa: 'Beta', email: 'luis@beta.com', servicio: 'Transporte turístico', mensaje: 'Ruta Lima' }).includes('Ruta Lima'),
        'buildQuoteMessage debe incluir el detalle ingresado.'
      );
    });
  

  
    // IntersectionObserver-based reveal animations
    (function () {
      const reveals = Array.from(document.querySelectorAll('.reveal'));
      if (!reveals.length) return;

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // slight stagger based on position
            const idx = reveals.indexOf(el) || 0;
            el.style.transitionDelay = (Math.min(idx, 6) * 60) + 'ms';
            el.classList.add('reveal--visible');
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      reveals.forEach(r => io.observe(r));
    })();

    // Improve map route draw on load: lightly trigger reflow for CSS-driven dash animation
    (function () {
      const path = document.querySelector('.route-path');
      if (!path) return;
      // ensure the stroke-dasharray is applied for animation
      const len = path.getTotalLength ? path.getTotalLength() : 120;
      path.style.strokeDasharray = path.style.strokeDasharray || '18 12';
      // minor throttling: start animation after a frame
      requestAnimationFrame(() => requestAnimationFrame(() => { path.classList.add('route-animate'); }));
    })();
  
