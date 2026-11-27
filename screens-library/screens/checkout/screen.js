/* Checkout interactions: expanders, delivery speed, cutlery toggle, tip chips, checkboxes. */
(function () {
  document.querySelectorAll('[data-expander]').forEach(function (exp) {
    var header = exp.querySelector('.pintxo-expander__header');
    var chevron = exp.querySelector('[data-chevron-up]');
    header.addEventListener('click', function () {
      var open = exp.getAttribute('data-open') !== 'true';
      exp.setAttribute('data-open', open ? 'true' : 'false');
      header.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (chevron) { chevron.src = open ? chevron.dataset.chevronUp : chevron.dataset.chevronDown; }
    });
  });

  function selectIn(group, item, selectedClass) {
    group.querySelectorAll('[role="radio"]').forEach(function (el) {
      var on = el === item;
      el.setAttribute('aria-checked', on ? 'true' : 'false');
      if (selectedClass) { el.classList.toggle(selectedClass, on); }
    });
  }
  var options = document.querySelector('[data-options]');
  if (options) {
    options.addEventListener('click', function (e) {
      var item = e.target.closest('[role="radio"]');
      if (item) { selectIn(options, item, 'pintxo-card--selected'); }
    });
    options.addEventListener('keydown', function (e) {
      var item = e.target.closest('[role="radio"]');
      if (item && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectIn(options, item, 'pintxo-card--selected'); }
    });
  }
  var tips = document.querySelector('[data-tips]');
  if (tips) {
    tips.addEventListener('click', function (e) {
      var chip = e.target.closest('[role="radio"]');
      if (chip) { selectIn(tips, chip); }
    });
  }
  document.querySelectorAll('.pintxo-toggle').forEach(function (t) {
    t.addEventListener('click', function () {
      t.setAttribute('aria-checked', t.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    });
  });
  document.querySelectorAll('.pintxo-checkbox__input').forEach(function (c) {
    c.addEventListener('change', function () { c.setAttribute('data-state', c.checked ? 'checked' : 'unchecked'); });
  });
})();
