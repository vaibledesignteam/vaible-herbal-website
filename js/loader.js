// js/loader.js — Logo splash loader
(function(){
  const loader = document.getElementById('vhLoader');

  function showLoader() {
    if (!loader) return;
    loader.classList.remove('is-hidden');
    loader.classList.add('is-active');
    document.documentElement.classList.add('vh-no-scroll');
    document.body.classList.add('vh-no-scroll');
  }

  function hideLoader() {
    if (!loader) return;
    loader.classList.remove('is-active');
    loader.classList.add('is-hidden');
    document.documentElement.classList.remove('vh-no-scroll');
    document.body.classList.remove('vh-no-scroll');
    // remove from DOM after fade for performance
    setTimeout(() => { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 450);
  }

  // Hide after full load (images, css, etc.)
window.addEventListener('load', () => {
  setTimeout(hideLoader, 550); // was 300ms, now 600ms for a nicer reveal
});


  // Show on internal navigations
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    // Skip if opens new tab/window or is a special protocol
    if (a.hasAttribute('data-skip-loader')) return;
    if (a.target && a.target !== '_self') return;

    const href = a.getAttribute('href') || '';
    if (!href) return;
    if (href.startsWith('#')) return;                          // in-page anchor
    if (/^(mailto:|tel:|sms:|whatsapp:)/i.test(href)) return;  // protocols

    // Absolute links: only show loader for same-origin
    if (/^https?:\/\//i.test(href)) {
      try {
        const u = new URL(href, location.href);
        if (u.origin !== location.origin) return;
      } catch(_) { return; }
    }

    // OK, navigate within same site
    showLoader();
  });

  // Backup: some browsers allow this visual change on unload
  window.addEventListener('beforeunload', showLoader);
})();
