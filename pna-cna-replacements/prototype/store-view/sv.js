/* Store view for the PNA flow: Honest Greens' real catalog (store-catalog.js).
   Tapping "+" on a product adds it to the cart behind this screen (postMessage
   sv-add); back / the bottom bar return to the cart (sv-close).
   Opened as ?cart=<json {productId: qty}>&n=<products already in the cart>. */
(function () {
  var SC = window.STORE_CATALOG;
  if (!SC) return;
  var q = new URLSearchParams(window.location.search);
  var counts = {};
  try { counts = JSON.parse(q.get('cart') || '{}') || {}; } catch (e) { counts = {}; }
  var inCart = parseInt(q.get('n') || '0', 10) || 0;
  var baseTotal = parseFloat(q.get('t') || '0') || 0;
  var delta = 0;
  var added = 0;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function money(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
  var byId = {};
  SC.sections.forEach(function (s) { s.products.forEach(function (p) { byId[p.id] = p; }); });

  var tabs = document.getElementById('sv-tabs');
  var menu = document.getElementById('sv-menu');
  var scroller = document.getElementById('sv-scroll');

  tabs.innerHTML = SC.sections.map(function (s, i) {
    return '<div class="sv-tab' + (i === 0 ? ' is-selected' : '') + '" data-i="' + i + '" role="button" tabindex="0"><span>' + esc(s.title) + '</span></div>';
  }).join('') + '<div class="sv-tabs__extender"></div>';

  menu.innerHTML = SC.sections.map(function (s, i) {
    return '<section class="sv-section" data-i="' + i + '"><div class="sv-section-header"><h2 class="sv-section-header__title pintxo-typography-title3">' + esc(s.title) + '</h2></div>' +
      '<div class="sv-rows">' + s.products.map(function (p) {
        return '<article class="item-row" data-id="' + p.id + '"><div class="item-row__body">' +
          '<div class="item-row__image"><img src="' + esc(p.image) + '" alt="" loading="lazy" /></div>' +
          '<div class="item-row__desc"><div class="item-row__head"><p class="item-row__name">' + esc(p.name) + '</p><span class="item-row__price">' + money(p.price) + '</span></div>' +
          (p.description ? '<p class="item-row__text">' + esc(p.description) + '</p>' : '') + '</div></div>' +
          '<div class="item-row__footer"></div></article>';
      }).join('') + '</div></section>';
  }).join('');

  var PLUS = '<img src="assets/icons/plus-16.svg" alt="" />';
  /* Neutral counter with only the trailing accessory visible (pintxo-counter--collapsed). */
  var ADD = '<div class="pintxo-counter pintxo-counter--collapsed"><button type="button" class="pintxo-counter__button" data-act="add" aria-label="Add">' + PLUS + '</button></div>';
  function counter(n) {
    var left = n > 1
      ? '<button type="button" class="pintxo-counter__button" data-act="dec" aria-label="Remove one"><img src="assets/icons/minus-24.svg" alt="" /></button>'
      : '<button type="button" class="pintxo-counter__button" data-act="dec" aria-label="Remove"><img src="assets/icons/trash-16.svg" alt="" /></button>';
    return '<div class="pintxo-counter">' + left + '<span class="pintxo-counter__label">' + n + '</span>' +
      '<button type="button" class="pintxo-counter__button" data-act="add" aria-label="Add one more"><img src="assets/icons/plus-16.svg" alt="" /></button></div>';
  }
  function paint(id) {
    var n = counts[id] || 0;
    menu.querySelectorAll('.item-row[data-id="' + id + '"] .item-row__footer').forEach(function (f) {
      f.innerHTML = n ? counter(n) : ADD;
    });
  }
  Object.keys(byId).forEach(paint);

  var bar = document.getElementById('sv-cartbar');
  var barBtn = document.getElementById('sv-cartbtn');
  function send(msg) { window.parent.postMessage(msg, window.location.origin); }
  function paintBar() {
    bar.hidden = inCart + added <= 0;
    document.getElementById('sv-total').textContent = money(Math.max(0, baseTotal + delta)).replace(' €', '€');
  }
  paintBar();

  menu.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var id = b.closest('.item-row').dataset.id;
    var p = byId[id];
    if (b.dataset.act === 'add') {
      counts[id] = (counts[id] || 0) + 1;
      added++;
      delta += p.price;
      send({ type: 'sv-add', product: { id: p.id, name: p.name, description: p.description, price: p.price, image: p.image, selected: [] } });
    } else if (b.dataset.act === 'dec' && counts[id]) {
      counts[id]--;
      added--;
      delta -= p.price;
      send({ type: 'sv-remove', id: id });
    } else return;
    paint(id);
    paintBar();
  });

  document.getElementById('sv-back').addEventListener('click', function () { send({ type: 'sv-close' }); });
  barBtn.addEventListener('click', function () { send({ type: 'sv-close' }); });

  /* Tabs: scroll to the section, follow the scroll position */
  var sections = [].slice.call(menu.querySelectorAll('.sv-section'));
  var offset = 118 + 56 + 8;
  function goTo(i) {
    var top = scroller.scrollTop + sections[i].getBoundingClientRect().top - scroller.getBoundingClientRect().top - offset;
    scroller.scrollTo({ top: top, behavior: 'smooth' });
  }
  tabs.addEventListener('click', function (e) {
    var t = e.target.closest('.sv-tab');
    if (t) goTo(+t.dataset.i);
  });
  tabs.addEventListener('keydown', function (e) {
    var t = e.target.closest('.sv-tab');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); goTo(+t.dataset.i); }
  });
  scroller.addEventListener('scroll', function () {
    var cur = 0;
    sections.forEach(function (s, i) {
      if (s.getBoundingClientRect().top - scroller.getBoundingClientRect().top - offset - 1 <= 0) cur = i;
    });
    tabs.querySelectorAll('.sv-tab').forEach(function (t, i) {
      var on = i === cur;
      t.classList.toggle('is-selected', on);
      if (on) { var l = t.offsetLeft - 16; if (tabs.scrollLeft > l || tabs.scrollLeft + tabs.clientWidth < t.offsetLeft + t.offsetWidth) tabs.scrollLeft = l; }
    });
  }, { passive: true });
})();
