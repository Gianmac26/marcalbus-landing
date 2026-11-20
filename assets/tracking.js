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

  // OpenAI Ads Pixel: conversion lead_created, solo con consentimiento concedido.
  function oaiqLead() {
    try {
      if (localStorage.getItem('marcalbus_consent') !== 'granted') return;
      if (typeof window.oaiq !== 'function') return;
      window.oaiq('measure', 'lead_created', { type: 'customer_action' }, { event_id: 'lead-' + Date.now() });
    } catch (e) { /* nunca bloquea la navegacion */ }
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
    oaiqLead();
  }

  // UTM de la visita: se guardan en sessionStorage al entrar con utm_* en la URL para que
  // sigan disponibles si el usuario navega a otra pagina antes de enviar el formulario.
  // Solo se envian con el formulario (Web3Forms); nunca se mandan a otro lado.
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var UTM_STORE = 'marcalbus_utm';

  function readUtm() {
    var fromUrl = {};
    var found = false;
    try {
      var params = new URLSearchParams(location.search);
      UTM_KEYS.forEach(function (key) {
        var v = params.get(key);
        if (v) { fromUrl[key] = v.slice(0, 200); found = true; }
      });
    } catch (e) { /* URLSearchParams no disponible */ }
    try {
      if (found) { sessionStorage.setItem(UTM_STORE, JSON.stringify(fromUrl)); return fromUrl; }
      var saved = sessionStorage.getItem(UTM_STORE);
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return fromUrl; }
  }

  var UTM = readUtm();

  // Origen legible para el correo de ventas.
  function campaignOrigin() {
    var src = String(UTM.utm_source || '').toLowerCase();
    if (src === 'chatgpt' || src === 'openai' || src === 'chatgpt.com') return 'ChatGPT Ads';
    return UTM.utm_source ? String(UTM.utm_source) : '';
  }

  // Clave de acceso publica de Web3Forms (destino: ventas@marcalbus.com).
  var W3F_URL = 'https://api.web3forms.com/submit';
  var W3F_KEY = '5bff58fc-e73c-44de-acc3-8fa9ec9af8cb';

  // Fire-and-forget: nunca bloquea ni muestra errores; el que llama abre WhatsApp aparte.
  window.marcalbusSendForm = function (formName, fields, detail) {
    var honeypot = document.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) return;
    var body = {};
    for (var k in fields) body[k] = fields[k];
    body.access_key = W3F_KEY;
    var origin = campaignOrigin();
    UTM_KEYS.forEach(function (key) { if (UTM[key]) body[key] = UTM[key]; });
    if (origin) body.origen_campana = origin;
    body.subject = 'Nueva cotización web - ' + formName + ' - ' + (detail || 'sin detalle') +
      (origin ? ' - ' + origin : '');
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
    if (payload.event === 'whatsapp_click') oaiqLead();
  }, true);
})();
