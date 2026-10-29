/* MarcalBus - formulario y WhatsApp para las paginas de turismo (EN/ES) */
(function () {
  var NUMBER = '51928672932';
  var LANG = (document.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var T = {
    en: {
      hello: 'Hello MarcalBus, I would like a quote for a private transfer in Peru.',
      title: 'Hello MarcalBus, I would like a quote from your website:',
      name: 'Name', email: 'Email', route: 'Route', date: 'Travel date',
      pax: 'Passengers', unit: 'Vehicle', details: 'Details', none: 'Not specified',
      auto: 'Not sure, please recommend one',
      suggest: 'Suggested vehicle: ',
      multi: 'Large group: we will combine vehicles for you.'
    },
    es: {
      hello: 'Hola MarcalBus, quisiera cotizar un traslado privado en Perú.',
      title: 'Hola MarcalBus, quisiera una cotización desde su web:',
      name: 'Nombre', email: 'Correo', route: 'Ruta', date: 'Fecha de viaje',
      pax: 'Pasajeros', unit: 'Vehículo', details: 'Detalle', none: 'No indicado',
      auto: 'No estoy seguro, recomiéndenme uno',
      suggest: 'Vehículo sugerido: ',
      multi: 'Grupo grande: combinaremos unidades para ti.'
    }
  }[LANG];

  function track(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  function openWhatsApp(message) {
    var w = window.open('https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(message), '_blank');
    if (w) w.opener = null;
  }

  function suggestUnit(pax) {
    if (!pax || pax < 1) return '';
    if (pax <= 7) return 'Mini Van (H1) - 7';
    if (pax <= 19) return 'Mercedes-Benz Sprinter - 19';
    if (pax <= 25) return 'Mini Bus - 25';
    if (pax <= 33) return 'Mini Bus - 33';
    if (pax <= 45) return 'Bus - 45';
    return 'multi';
  }

  document.addEventListener('DOMContentLoaded', function () {
    ['waHero', 'waCta', 'waFloat', 'waFooter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', function (e) {
        e.preventDefault();
        track('click_whatsapp', { event_category: 'lead', event_label: id, language: LANG });
        openWhatsApp(T.hello);
      });
    });

    document.querySelectorAll('[data-route]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sel = document.getElementById('route');
        if (sel) sel.value = btn.getAttribute('data-route');
        track('select_route', { route: btn.getAttribute('data-route'), language: LANG });
      });
    });

    var pax = document.getElementById('pax');
    var hint = document.getElementById('unitHint');
    if (pax && hint) {
      pax.addEventListener('input', function () {
        var s = suggestUnit(parseInt(pax.value, 10));
        hint.textContent = !s ? '' : (s === 'multi' ? T.multi : T.suggest + s.replace(/ - (\d+)$/, ' (' + (LANG === 'en' ? 'up to ' : 'hasta ') + '$1)'));
      });
    }

    var form = document.getElementById('tripForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
        var unit = v('unit') || T.auto;
        var msg = T.title + '\n\n' +
          T.name + ': ' + v('fullname') + '\n' +
          T.email + ': ' + (v('email') || T.none) + '\n' +
          T.route + ': ' + v('route') + '\n' +
          T.date + ': ' + (v('tripdate') || T.none) + '\n' +
          T.pax + ': ' + v('pax') + '\n' +
          T.unit + ': ' + unit + '\n' +
          T.details + ': ' + (v('details') || T.none);
        track('generate_lead', { event_category: 'lead', route: v('route'), passengers: v('pax'), language: LANG });
        openWhatsApp(msg);
      });
    }
  });
})();
