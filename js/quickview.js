// js/quickview.js
(function () {
  const modal = document.getElementById('vhModal');
  const img   = document.getElementById('vhModalImg');
  const title = document.getElementById('vhModalTitle');
  const desc  = document.getElementById('vhModalDesc');
  const grid  = document.getElementById('vhModalGrid');
  const btnEnq= document.getElementById('vhModalEnq');
  const btnWa = document.getElementById('vhModalWa');
  const btnClose = document.getElementById('vhModalClose');

  const DEFAULTS = {
    purity: '100% Pure',
    extraction_method: 'Steam Distillation',
    usage_application: 'Cosmetics',
    manufacturer: 'Vaible Herbal',
    shelf_life: '24 months',
    origin: 'India'
  };

  function setBg(el, src) {
    const fallback = 'images/peppermint-oil.png';  // same fixed image as cards

    el.style.backgroundImage = `url('${src || fallback}')`;
  }

  function keyVal(label, val) {
    return `<div class="vh-kv"><b>${label}:</b> ${val || '-'}</div>`;
  }

  function open(product) {
    if (!product) return;

    title.textContent = product.name || 'Product';
    desc.textContent = product.short_desc || `Pure ${product.name} essential oil for cosmetic & aromatherapy use`;
    setBg(img, product.image1);

    const kv = [];
    kv.push(keyVal('Botanical Name', product.botanical_name));
    kv.push(keyVal('Part used', product.part_used));
    kv.push(keyVal('INCI Name', product.inci_name));
    kv.push(keyVal('Purity', product.purity || DEFAULTS.purity));
    kv.push(keyVal('Extraction Method', product.extraction_method || DEFAULTS.extraction_method));
    kv.push(keyVal('Usage/Application', product.usage_application || DEFAULTS.usage_application));
    kv.push(keyVal('Manufacturer', product.manufacturer || DEFAULTS.manufacturer));
    kv.push(keyVal('Shelf Life', product.shelf_life || DEFAULTS.shelf_life));
    kv.push(keyVal('Country of Origin', product.origin || DEFAULTS.origin));
    grid.innerHTML = kv.join('');

    btnEnq.href = `mailto:Sales@Vaibleherbal.com?subject=${encodeURIComponent('Enquiry — ' + (product.name || 'Product'))}`;
    btnWa.href  = `https://wa.me/919911154497?text=${encodeURIComponent('Hello, I need COA/specs for ' + (product.name || 'Product'))}`;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    btnClose.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  btnClose.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // expose globally so catalog.js can call it
  window.VHQuickView = {
    openBySlug: function (slug) {
      let list = Array.isArray(window.__vhProducts) ? window.__vhProducts : [];
      // fallback fetch if global not ready
      if (!list.length) {
        fetch('data/products.json').then(r => r.json()).then(d => {
          list = d.products || [];
          const p = list.find(x => x.slug === slug);
          open(p);
        });
      } else {
        const p = list.find(x => x.slug === slug);
        open(p);
      }
    }
  };
})();
