/* MarcalBus - aviso de cookies y Consent Mode v2.
   El consent 'default' (denied) y la restauracion de una eleccion previa se hacen
   inline en el <head>, antes de GTM. Este archivo solo muestra el aviso, guarda la
   eleccion (localStorage 'marcalbus_consent') y envia el consent update.
   Microsoft Clarity solo se carga con consentimiento concedido. */
(function () {
  var KEY = 'marcalbus_consent';
  var CLARITY_ID = 'x1vih506vp';
  var EN = (document.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0;

  var T = EN ? {
    label: 'Cookie notice',
    text: 'We use analytics and advertising cookies only with your consent. You can change your choice at any time.',
    more: 'Cookie policy',
    href: '/cookie-policy.html',
    accept: 'Accept',
    reject: 'Reject'
  } : {
    label: 'Aviso de cookies',
    text: 'Usamos cookies de análisis y publicidad solo con tu consentimiento. Puedes cambiar tu decisión cuando quieras.',
    more: 'Política de cookies',
    href: '/politica-de-cookies.html',
    accept: 'Aceptar',
    reject: 'Rechazar'
  };

  function gtagSafe() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function write(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* sin almacenamiento: el aviso reaparecera */ }
  }

  function setSignals(value) {
    gtagSafe('consent', 'update', {
      ad_storage: value,
      analytics_storage: value,
      ad_user_data: value,
      ad_personalization: value
    });
  }

  var clarityLoaded = false;
  function loadClarity() {
    if (clarityLoaded) return;
    clarityLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent =
      '.mb-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:640px;margin:0 auto;' +
      'background:#fff;color:#0f172a;border:1px solid #cbd5e1;border-radius:14px;padding:16px 18px;' +
      'box-shadow:0 10px 30px rgba(15,23,42,.22);font:400 14px/1.5 Inter,system-ui,sans-serif}' +
      '.mb-consent[hidden]{display:none}' +
      '.mb-consent p{margin:0 0 12px}' +
      '.mb-consent a{color:#1d4ed8;text-decoration:underline}' +
      '.mb-consent__actions{display:flex;gap:10px}' +
      '.mb-consent__btn{flex:1;min-height:44px;padding:10px 16px;border-radius:10px;border:2px solid #0f172a;' +
      'background:#fff;color:#0f172a;font:600 14px/1 Inter,system-ui,sans-serif;cursor:pointer}' +
      '.mb-consent__btn:hover{background:#0f172a;color:#fff}' +
      '.mb-consent__btn:focus-visible,.mb-consent a:focus-visible{outline:3px solid #2563eb;outline-offset:2px}';
    document.head.appendChild(s);
  }

  var box = null;
  var opener = null;

  function build() {
    box = document.createElement('div');
    box.className = 'mb-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', T.label);
    box.hidden = true;

    var p = document.createElement('p');
    p.appendChild(document.createTextNode(T.text + ' '));
    var a = document.createElement('a');
    a.href = T.href;
    a.textContent = T.more;
    p.appendChild(a);

    var actions = document.createElement('div');
    actions.className = 'mb-consent__actions';
    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'mb-consent__btn';
    reject.textContent = T.reject;
    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'mb-consent__btn';
    accept.textContent = T.accept;
    actions.appendChild(reject);
    actions.appendChild(accept);

    box.appendChild(p);
    box.appendChild(actions);
    document.body.appendChild(box);

    accept.addEventListener('click', function () { choose('granted'); });
    reject.addEventListener('click', function () { choose('denied'); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && read()) close();
    });
  }

  function open() {
    if (!box) build();
    opener = document.activeElement;
    box.hidden = false;
    // Solo se mueve el foco cuando el usuario reabre el aviso desde el footer.
    if (read()) box.querySelector('button').focus();
  }

  function close() {
    if (!box) return;
    box.hidden = true;
    if (opener && opener.focus && document.body.contains(opener)) opener.focus();
    opener = null;
  }

  function choose(value) {
    var previous = read();
    write(value);
    if (value === 'granted') {
      setSignals('granted');
      loadClarity();
    } else if (previous === 'granted') {
      // Retirada del consentimiento: se revocan las senales ya concedidas.
      setSignals('denied');
      if (typeof window.clarity === 'function') window.clarity('consent', false);
    }
    close();
  }

  function init() {
    injectStyles();
    var saved = read();
    if (saved === 'granted') loadClarity();
    if (!saved) open();

    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
      if (!t) return;
      e.preventDefault();
      open();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
