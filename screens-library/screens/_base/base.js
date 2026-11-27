/* Behaviour shared by the screen modules. Everything is guarded, so a module
   only gets what its markup contains. */
(function () {
  /* Food wall: the collapsed header (search + chips) fades in once the
     in-flow search field has scrolled up under the status bar. */
  var swScroll = document.getElementById('sw-scroll');
  var swSticky = document.getElementById('sw-sticky');
  var swSearch = document.getElementById('sw-search');
  if (swScroll && swSticky && swSearch) {
    var updateWallHeader = function () {
      var statusBarH = 54;
      swSticky.classList.toggle('is-visible', swScroll.scrollTop >= swSearch.offsetTop - statusBarH);
    };
    swScroll.addEventListener('scroll', updateWallHeader, { passive: true });
    updateWallHeader();
  }

  /* Store view: the fixed nav floats transparent over the hero and turns
     white once the hero has scrolled under it. */
  var svScroll = document.getElementById('sv-scroll');
  var svNav = document.getElementById('sv-nav');
  var svHero = svScroll && svScroll.querySelector('.sv-hero');
  if (svScroll && svNav && svHero) {
    svScroll.addEventListener('scroll', function () {
      svNav.classList.toggle('is-scrolled', svScroll.scrollTop >= svHero.offsetHeight - svNav.offsetHeight);
    }, { passive: true });
  }

  /* Modal sheets: [data-modal-open="<id>"] opens, [data-modal-close] or Esc closes. */
  function setModal(modal, open) {
    modal.classList.toggle('is-open', open);
    modal.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  document.addEventListener('keydown', function (event) {
    var opener = event.target.closest && event.target.closest('[data-modal-open]');
    if (opener && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      opener.click();
    } else if (event.key === 'Escape') {
      document.querySelectorAll('.modal.is-open').forEach(function (m) { setModal(m, false); });
    }
  });
  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-modal-open]');
    if (opener) {
      var target = document.getElementById(opener.dataset.modalOpen);
      if (target) { setModal(target, true); }
      return;
    }
    /* OTP: closing the premium banner reduces it. */
    var otp = document.getElementById('screen-otp');
    if (otp && event.target.closest('[data-otp-close]')) {
      otp.setAttribute('data-otp-state', 'reduced');
      return;
    }
    var closer = event.target.closest('[data-modal-close]');
    if (closer) { setModal(closer.closest('.modal'), false); }
  });
})();
