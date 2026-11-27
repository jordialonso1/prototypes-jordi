/* Product view for the CNA "change customisations" flow.
   Renders the product's real customisation sections from catalog.js. Sections whose
   previous choice is no longer available come in with nothing selected; the user has
   to pick again before confirming. */
(function () {
  var C = window.CATALOG;
  var q = new URLSearchParams(window.location.search);
  var P = C && C.products[q.get('id')];
  if (!P) return;

  var sel = {};
  try { sel = JSON.parse(q.get('sel') || '{}') || {}; } catch (e) { sel = {}; }
  var chosen = {};
  var sections = P.customizations || [];
  sections.forEach(function (s) { chosen[s.title] = (sel[s.title] || []).slice(); });
  var submitted = false;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function money(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
  function hint(s) {
    var req = s.min >= 1;
    if (req && s.max === 1) return 'Choose 1 item';
    if (req) return s.min === s.max ? 'Choose ' + s.min + ' items' : 'Choose at least ' + s.min + (s.min === 1 ? ' item' : ' items');
    if (s.max === 1) return 'Choose only 1 item';
    if (s.max >= 99) return 'Choose as many as you like';
    return 'Choose a maximum of ' + s.max + ' items';
  }
  var CHECK = '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6.5l2.2 2.2L9.5 3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var WARN = '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1.6l4.6 8H1.4l4.6-8z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/><path d="M6 4.7v2.4M6 8.4v.1" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>';

  document.getElementById('pv-photo').src = P.image;
  document.getElementById('pv-name').textContent = P.name;
  document.getElementById('pv-nav-title').textContent = P.name;
  document.getElementById('pv-price').textContent = money(P.price);
  document.getElementById('pv-desc').textContent = P.description;

  var host = document.getElementById('pv-sections');
  host.innerHTML = sections.map(function (s, i) {
    var radio = s.max === 1;
    return '<section class="cz" data-i="' + i + '"><header class="pintxo-section-header"><div class="pintxo-section-header__text">' +
      '<h2 class="pintxo-section-header__title">' + esc(s.title) + '</h2><p class="pintxo-section-header__description">' + hint(s) + '</p></div>' +
      (s.min >= 1 ? '<div class="pintxo-section-header__trailing"><span class="cz__badge pintxo-tag pintxo-typography-caption-emphasis" data-style="neutral" data-variant="primary">Required</span></div>' : '') + '</header>' +
      s.options.map(function (o, j) {
        var kind = radio ? 'pintxo-radio-button' : 'pintxo-checkbox';
        return '<label class="cz__opt ' + kind + '" data-align="right" data-j="' + j + '">' +
          '<input class="' + kind + '__input" type="' + (radio ? 'radio' : 'checkbox') + '" name="s' + i + '">' +
          '<span class="' + kind + '__label"><span class="cz__text"><span class="cz__name">' + esc(o.name) + '</span>' +
          (o.price > 0 ? '<span class="cz__price">+' + money(o.price) + '</span>' : '') + '</span></span></label>';
      }).join('') + '</section>';
  }).join('');

  function unmet() {
    return sections.filter(function (s) { return s.min >= 1 && chosen[s.title].length < s.min; });
  }
  function sync() {
    host.querySelectorAll('.cz').forEach(function (el) {
      var s = sections[+el.dataset.i];
      var set = chosen[s.title];
      var full = s.max > 1 && s.max < 99 && set.length >= s.max;
      var error = s.min >= 1 && set.length < s.min && submitted;
      el.querySelectorAll('.cz__opt').forEach(function (lab) {
        var name = s.options[+lab.dataset.j].name;
        var on = set.indexOf(name) >= 0;
        var input = lab.querySelector('input');
        var off = full && !on;
        input.checked = on;
        input.disabled = off;
        input.dataset.checked = on;
        input.dataset.state = on ? 'checked' : 'unchecked';
        input.dataset.disabled = off;
        input.dataset.error = error && !on;
        lab.classList.toggle('is-disabled', off);
        lab.querySelector('[class$="__label"]').dataset.disabled = off;
      });
      var badge = el.querySelector('.cz__badge');
      if (badge) {
        var ok = set.length >= s.min;
        var state = ok ? 'ok' : (submitted ? 'error' : 'idle');
        badge.dataset.style = state === 'ok' ? 'positive' : state === 'error' ? 'critical' : 'neutral';
        badge.innerHTML = (state === 'ok' ? CHECK : state === 'error' ? WARN : '') + 'Required';
        el.querySelector('.pintxo-section-header').dataset.state = state === 'error' ? 'error' : '';
      }
    });
  }

  host.addEventListener('change', function (e) {
    var lab = e.target.closest('.cz__opt');
    if (!lab) return;
    var el = lab.closest('.cz');
    var s = sections[+el.dataset.i];
    var name = s.options[+lab.dataset.j].name;
    var set = chosen[s.title];
    if (s.max === 1) {
      chosen[s.title] = [name];
    } else {
      var at = set.indexOf(name);
      if (at >= 0) set.splice(at, 1); else if (set.length < s.max) set.push(name);
    }
    sync();
  });

  var scroller = document.getElementById('pv-scroll');
  var nav = document.getElementById('pv-nav');
  function onScroll() { nav.classList.toggle('is-scrolled', scroller.scrollTop > 330); }
  scroller.addEventListener('scroll', onScroll, { passive: true });

  function send(msg) { window.parent.postMessage(msg, window.location.origin); }
  document.getElementById('pv-close').addEventListener('click', function () { send({ type: 'pv-close' }); });
  document.getElementById('pv-confirm').addEventListener('click', function () {
    var missing = unmet();
    if (missing.length) {
      submitted = true;
      sync();
      var first = host.querySelector('.cz[data-i="' + sections.indexOf(missing[0]) + '"]');
      scroller.scrollTo({ top: scroller.scrollTop + first.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 130, behavior: 'smooth' });
      return;
    }
    send({ type: 'pv-confirm', id: P.id, sel: chosen });
  });

  sync();
  onScroll();
})();
