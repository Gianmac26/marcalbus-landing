/* MarcalBus - eventos de conversion hacia dataLayer (GTM).
   Un unico listener delegado en captura. Sin datos personales.
   window.marcalbusSendForm envia el formulario a ventas@marcalbus.com por Web3Forms sin
   bloquear WhatsApp; generate_lead se emite solo si Web3Forms responde OK (envio recibido). */
(function () {
  var LANG = (document.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  // Servicio solo donde la pagina lo deja claro; en home, blog y legales se omite.
  var SERVICES = {
    '/transporte-de-personal-lima.html': 'transporte_de_personal',
    '/minibus-corporativo-lima.html': 'minibus_corporativo',
    '/taxi-ejecutivo-lima.html': 'taxi_ejecutivo',
    '/turismo-empresarial.html': 'turismo_empresarial',
    '/traslados-turisticos-peru.html': 'traslados_turisticos',
    '/peru-private-transfers.html': 'traslados_turisticos',
    '/cusco-ollantaytambo-private-transfer.html': 'cusco_ollantaytambo'
  };

  // contactForm: la opcion del select manda si coincide; si no, el servicio de la pagina (SERVICES).
  // Solo el slug; nunca nombre, correo ni mensaje.
  var SELECT_SERVICES = {
    'transporte de personal': 'transporte_de_personal',
    'minibus corporativo': 'minibus_corporativo',
    'taxi ejecutivo': 'taxi_ejecutivo',
    'transporte turistico': 'turismo_empresarial'
  };

  function serviceFromSelect() {
    var sel = document.getElementById('servicio');
    if (!sel) return '';
    var key = String(sel.value || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return SELECT_SERVICES[key] || '';
  }

  function trackLead(formName) {
    var payload = {
      event: 'generate_lead',
      form_name: formName,
      page_path: location.pathname,
      page_language: LANG
    };
    var service = formName === 'contacto'
      ? (serviceFromSelect() || SERVICES[location.pathname])
      : SERVICES[location.pathname];
    if (service) payload.service = service;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  // Clave de acceso publica de Web3Forms (destino: ventas@marcalbus.com).
  var W3F_URL = 'https://api.web3forms.com/submit';
  var W3F_KEY = '67235d37-24c1-4b6c-a673-353670bfaf41';

  // Fire-and-forget: nunca bloquea ni muestra errores; el que llama abre WhatsApp aparte.
  window.marcalbusSendForm = function (formName, fields, detail) {
    var honeypot = document.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) return;
    var body = {};
    for (var k in fields) body[k] = fields[k];
    body.access_key = W3F_KEY;
    body.subject = 'Nueva cotización web - ' + formName + ' - ' + (detail || 'sin detalle');
    body.from_name = 'MarcalBus Web';
    try {
      fetch(W3F_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true
      }).then(function (res) {
        return res.json().then(function (d) { return res.ok && d && d.success === true; }, function () { return false; });
      }).then(function (ok) {
        if (ok) trackLead(formName);
      }).catch(function () {});
    } catch (e) { /* sin red o fetch no disponible: WhatsApp ya se abrio */ }
  };

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;

    var href = (a.getAttribute('href') || '').toLowerCase();
    var payload;

    if (href.indexOf('wa.me/51928672932') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
      payload = { event: 'whatsapp_click' };
    } else if (href.indexOf('tel:') === 0) {
      payload = { event: 'phone_click' };
    } else {
      return;
    }

    payload.link_url = a.href;
    payload.page_path = location.pathname;
    payload.page_language = LANG;
    if (payload.event === 'whatsapp_click' && SERVICES[location.pathname]) {
      payload.service = SERVICES[location.pathname];
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }, true);
})();
