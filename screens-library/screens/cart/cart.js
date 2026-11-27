      /* Cart state + rendering for each version, using real Honest Greens products
   from catalog.js. The static placeholder markup stays as the fallback if the
   data is missing. Counters, tile "+" and "Add more items" are interactive. */
(function () {
  var C = window.CATALOG;
  if (!C) return;
  var P = C.products;
  var TILES = ['42320609711', '42333383578', '42320609716', '42374661323', '42287289486', '42247726007'];
  var STATE = {
    regular: { items: [{ id: '42274330448', qty: 1 }, { id: '42336174195', qty: 1 }], tiles: TILES }
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function money(n) { return n.toFixed(2).replace('.', ',') + '€'; }
  function icon(name, size) { return '<img src="assets/icon-' + name + '.svg" width="' + size + '" height="' + size + '" alt="" />'; }
  function desc(p) { return p.selected && p.selected.length ? '<p class="item-row__desc pintxo-typography-body2">' + esc(p.selected.join(', ')) + '</p>' : ''; }

  function row(it) {
    var p = P[it.id];
    var info = it.missing
      ? '<div class="item-row__warning pintxo-typography-body2"><img src="assets/icon-warning-critical.svg" width="16" height="14.6" alt="" /><p>Action required</p></div>'
      : desc(p);
    var left = it.qty > 1
      ? '<button type="button" class="pintxo-counter__button" data-act="dec" aria-label="Remove one">' + icon('minus-24', 16) + '</button>'
      : '<button type="button" class="pintxo-counter__button" data-act="dec" aria-label="Remove">' + icon('trash-16', 16) + '</button>';
    return '<article class="item-row" data-id="' + p.id + '">' +
      '<div class="item-row__body"><div class="thumb"><img src="' + esc(p.image) + '" alt="" loading="lazy" /></div>' +
      '<div class="item-row__info"><div class="item-row__head">' +
      '<p class="item-row__name item-row__name--medium pintxo-typography-body1-emphasis">' + esc(p.name) + '</p>' +
      '<p class="item-row__price pintxo-typography-body2">' + money(p.price * it.qty) + '</p></div>' + info + '</div></div>' +
      '<div class="item-row__footer"><div class="pintxo-counter">' + left +
      '<span class="pintxo-counter__label">' + it.qty + '</span>' +
      '<button type="button" class="pintxo-counter__button" data-act="inc" aria-label="Add one more"' + (it.missing ? ' disabled' : '') + '>' + icon('plus-16', 16) + '</button>' +
      '</div></div></article>';
  }
  function oos(p) {
    return '<article class="item-row item-row--compact item-row--oos" data-id="' + p.id + '"><div class="item-row__body">' +
      '<div class="thumb thumb--l"><img src="' + esc(p.image) + '" alt="" loading="lazy" /></div>' +
      '<div class="item-row__info"><p class="item-row__flag pintxo-typography-caption-emphasis">Out of stock</p>' +
      '<div class="item-row__head"><p class="item-row__name item-row__name--medium pintxo-typography-body1-emphasis">' + esc(p.name) + '</p>' +
      '<p class="item-row__price pintxo-typography-body2">' + money(p.price) + '</p></div>' + desc(p) +
      '</div></div></article>';
  }
  function tile(p) {
    return '<article class="tile" data-id="' + p.id + '"><div class="tile__img"><img src="' + esc(p.image) + '" alt="" loading="lazy" />' +
      '<button type="button" class="pintxo-icon-button pintxo-icon-button--s pintxo-icon-button--floating tile__add" data-act="tile-add" aria-label="Add ' + esc(p.name) + '">' + icon('plus-16', 16) + '</button></div>' +
      '<div class="tile__text"><p class="tile__name pintxo-typography-body1-emphasis">' + esc(p.name) + '</p>' +
      '<p class="tile__price pintxo-typography-body2">' + money(p.price) + '</p></div></article>';
  }

  function nextNew(st) {
    var inCart = st.items.map(function (i) { return i.id; });
    for (var k = 0; k < C.addMore.length; k++) if (inCart.indexOf(C.addMore[k]) < 0) return C.addMore[k];
    return null;
  }
  function addItem(st, id) {
    var f = st.items.filter(function (i) { return i.id === id; })[0];
    if (f) { if (!f.missing) f.qty++; } else st.items.push({ id: id, qty: 1 });
  }

  function render(id) {
    var st = STATE[id];
    var el = document.querySelector('.screen[data-screen="' + id + '"]');
    if (!el) return;
    var stack = el.querySelector('.stack--end');
    var addBtn = stack.querySelector(':scope > .pintxo-button');
    stack.querySelectorAll(':scope > .item-row').forEach(function (r) { r.remove(); });
    var total = 0, count = 0, anyMissing = false;
    st.items.forEach(function (it) {
      total += P[it.id].price * it.qty; count += it.qty;
      if (it.missing) anyMissing = true;
      addBtn.insertAdjacentHTML('beforebegin', row(it));
    });
    var sub = el.querySelector('.section-header__sub');
    sub.querySelector('.count').textContent = count + (count === 1 ? ' product from' : ' products from');
    sub.querySelector('a').textContent = C.store;
    addBtn.disabled = !nextNew(st);
    var o = el.querySelector('.item-row--oos');
    if (o && st.oos) o.outerHTML = oos(P[st.oos]);
    el.querySelector('.tiles').innerHTML = st.tiles.map(function (t) { return tile(P[t]); }).join('');
    el.querySelector('.footer__total').textContent = money(total);
    var orig = el.querySelector('.footer__original');
    if (orig) orig.remove(); /* the API has no original prices */
    if (id === 'cna') {
      var banner = el.querySelector('.pintxo-banner');
      if (banner) banner.hidden = !anyMissing;
    }
    el.querySelector('.footer__cta').disabled = !count || anyMissing;
  }

  Object.keys(STATE).forEach(function (id) {
    var el = document.querySelector('.screen[data-screen="' + id + '"]');
    if (!el) return;
    var st = STATE[id];
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled) return;
      var article = b.closest('[data-id]');
      var act = b.dataset.act;
      if (act === 'inc' || act === 'dec') {
        var it = st.items.filter(function (i) { return i.id === article.dataset.id; })[0];
        if (!it) return;
        it.qty += act === 'inc' ? 1 : -1;
        if (it.qty < 1) st.items.splice(st.items.indexOf(it), 1);
      } else if (act === 'tile-add') {
        addItem(st, article.dataset.id);
      } else if (b.classList.contains('pintxo-button') && b.textContent.trim() === 'Add more items') {
        var n = nextNew(st); if (n) addItem(st, n);
      } else if (b.getAttribute('aria-label') === 'Empty cart') {
        st.items = [];
      } else return;
      render(id);
    });
    render(id);
  });
})();
