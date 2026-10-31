/* MarcalBus - eventos de conversion hacia dataLayer (GTM).
   Un unico listener delegado en captura. Sin datos personales.
   generate_lead no se envia: los formularios del sitio no tienen respuesta de servidor,
   solo componen un mensaje y abren WhatsApp (ver SEO-IMPLEMENTATION.md). */
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
