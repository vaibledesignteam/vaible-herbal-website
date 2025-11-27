// js/catalog.js
(function () {
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat') || '';
    const presetSearch = params.get('s') || '';
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const azBar = document.getElementById('azBar');
  const searchBox = document.getElementById('searchBox');

  // One fixed image for all cards (change path if you want)
  const DEFAULT_CARD_IMG = 'images/peppermint-oil.png';
  const ALWAYS_USE_PLACEHOLDER = true; // set to false later to use per-product images

  const CAT_META = {
    'essential-oils': {
      title: 'Essential Oils',
      tag: 'Pure, natural essential oils for cosmetic & aromatherapy applications.'
    },
    // add other categories later…
    'cosmetics-butter': {
  title: 'Cosmetics Butter',
  tag: 'Natural cosmetic butters for skincare & haircare.'
},
'carrier-oils': {
    title: 'Carrier Oils',
    tag: 'Cold-pressed & refined carriers for skincare, haircare and aromatherapy dilution.'
  },

   'herbal-dry-extract': {
    title: 'Herbal Dry Extract',
    tag: 'Standardized botanical dry extracts for nutraceutical, cosmetic & food applications.'
  },

  'floral-water': {
  title: 'Floral Water',
  tag: 'Plant hydrosols (aromatic waters) for cosmetic & aromatherapy applications.'
},

'herbal-oil-extract': {
  title: 'Herbal Oil Extract',
  tag: 'Infused herbal oil actives for cosmetic formulations.'
},
'herbal-powder': {
  title: 'Herbal Powder',
  tag: 'Finely milled herbal powders for cosmetic & formulation use.'
},
'ayurvedic-oil': {
  title: 'Ayurvedic Oil',
  tag: 'Traditional Ayurvedic thailams & blends for external application.'
},
'soft-extract': {
  title: 'Soft Extract',
  tag: 'Concentrated soft extracts for nutraceutical, cosmetic & food.'
},
'bhasma': {
  title: 'Bhasma',
  tag: 'Classical Ayurvedic bhasmas for pharma & research.'
},
'protein-powder': {
  title: 'Protein Powder',
  tag: 'Plant-based proteins for nutrition, food & wellness.'
},
'crystals': {
  title: 'Crystals',
  tag: 'Menthol, Camphor, Thymol and other aroma crystals.'
},
'fruits-powder': {
  title: 'Fruits Powder',
  tag: 'Fruit-based herbal powders for nutraceutical, beverage & cosmetic applications.'
},
'granules': {
  title: 'Granules',
  tag: 'Herbal granules for nutraceutical & wellness applications.'
},
'bhasma': {
  title: 'Bhasma',
  tag: 'Traditional Ayurvedic bhasmas for medicinal use.'
},
'juices': {
  title: 'Juices',
  tag: 'Aloe and herbal juices for wellness & cosmetic use.'
},
'gel': {
  title: 'Gel',
  tag: 'Aloe & cosmetic gels for skincare and personal care.'
},
'resin': {
    title: 'Resin',
    tag: 'Natural resins for ayurvedic & wellness applications.'
  }

  };

  // Set hero texts
  const meta = CAT_META[cat] || { title: 'Products', tag: 'Browse items' };
  const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setText('crumbCat', meta.title);
  setText('catTitle', meta.title);
  setText('catHeading', meta.title + ' — Items');
  setText('catTag', meta.tag);

  // Load data
  fetch('data/products.json?_=' + Date.now())
    .then(r => r.json())
    .then(data => {
      window.__vhProducts = data.products || []; // expose to quickview
      init(data);
    })
    .catch(() => {
      grid.innerHTML = '<div class="vh-empty">Could not load data/products.json</div>';
    });

  function init(data) {
    const items = (data.products || []).filter(p => p.category_slug === cat);

    // Build A–Z
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(L => {
      const a = document.createElement('a');
      a.textContent = L;
      a.href = '#';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.vh-az a').forEach(x => x.classList.remove('is-active'));
        a.classList.add('is-active');
        filterAndRender(items, L, searchBox.value.trim());
      });
      azBar.appendChild(a);
    });

    // Search
    searchBox.addEventListener('input', () => {
      const activeLetter = (azBar.querySelector('.is-active') || {}).textContent || '';
      filterAndRender(items, activeLetter, searchBox.value.trim());
    });

    // First render
    filterAndRender(items, '', '');
  }

  function filterAndRender(items, letter, query) {
    let list = items.slice();

    if (letter) list = list.filter(p => (p.name || '').toUpperCase().startsWith(letter));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.botanical_name && p.botanical_name.toLowerCase().includes(q)) ||
        (p.short_desc && p.short_desc.toLowerCase().includes(q))
      );
    }

    render(list);
  }

  function setBg(el, src) {
    const use = ALWAYS_USE_PLACEHOLDER ? DEFAULT_CARD_IMG : (src || DEFAULT_CARD_IMG);
    el.style.backgroundImage = `url('${use}')`;
  }

  function render(list) {
    grid.innerHTML = '';
    empty.style.display = list.length ? 'none' : 'block';

    list.forEach(p => {
      const art = document.createElement('article');
      art.className = 'vh-card-mini';
      art.dataset.slug = p.slug;
      art.style.cursor = 'pointer';

      const img = document.createElement('div');
      img.className = 'vh-card-mini__img';
      setBg(img, p.image1);
      // Removed: img.title = 'Quick View';
      art.appendChild(img);

      const body = document.createElement('div');
      body.className = 'vh-card-mini__body';

      const h3 = document.createElement('h3');
      h3.textContent = p.name || '';
      body.appendChild(h3);

      const small = document.createElement('p');
      small.textContent = p.short_desc || `Pure ${p.name} essential oil for cosmetic & aromatherapy use`;
      body.appendChild(small);

      const meta = document.createElement('p');
      meta.style.margin = '0 0 10px';
      meta.innerHTML = `<strong>Botanical:</strong> ${p.botanical_name || '-'} • <strong>Part:</strong> ${p.part_used || '-'}`;
      body.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'vh-prod-actions';

      // Quick View button (single discoverable action)
      const btnQV = document.createElement('a');
      btnQV.className = 'vh-btn ghost';
      btnQV.href = '#';
      btnQV.textContent = 'Quick View';
      btnQV.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.VHQuickView) window.VHQuickView.openBySlug(p.slug);
      });
      actions.appendChild(btnQV);

      const btnEnq = document.createElement('a');
      btnEnq.className = 'vh-btn';
      btnEnq.href = `mailto:Sales@Vaibleherbal.com?subject=${encodeURIComponent('Enquiry — ' + p.name)}`;
      btnEnq.textContent = 'Enquire';
      actions.appendChild(btnEnq);

      const btnWa = document.createElement('a');
      btnWa.className = 'vh-btn wa';
      btnWa.href = `https://wa.me/919911154497?text=${encodeURIComponent('Hello, I need COA/specs for ' + p.name)}`;
      btnWa.target = '_blank';
      btnWa.textContent = 'WhatsApp';
      actions.appendChild(btnWa);

      body.appendChild(actions);
      art.appendChild(body);

      // Open popup when card (not the buttons) is clicked
      art.addEventListener('click', (e) => {
        if (e.target.closest('.vh-prod-actions')) return;
        if (window.VHQuickView) window.VHQuickView.openBySlug(p.slug);
      });

      grid.appendChild(art);
    });
  }
})();
