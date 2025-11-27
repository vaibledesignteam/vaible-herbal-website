/* ===== Vaible Herbal: Notice Board Rotator ===== */
(function(){
  const el = document.getElementById('vhNotice');
  if(!el) return;
  const notices = [
    "Now shipping from India • USA • EU | Ask us for COA & samples this week",
    "GMP | ISO | FSSAI — Request compliance documents with your RFQ",
    "New: Curcumin 95% & Glabridin 3.5% ready stock — dispatch in 48 hrs*"
  ];
  let i = 0;
  function showNotice(n){
    el.classList.remove('scrolling');
    el.innerHTML = "";
    const span = document.createElement('span');
    span.textContent = notices[n];
    el.appendChild(span);
    requestAnimationFrame(()=> el.classList.add('scrolling'));
  }
  showNotice(i);
  setInterval(()=> { i = (i+1) % notices.length; showNotice(i); }, 10000);
})();

/* ===== Header: mobile toggle ===== */
(function(){
  const btn = document.querySelector('.vh-nav-toggle');
  const nav = document.getElementById('vhNav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.addEventListener('click', (e) => {
    if(e.target.matches('a')){
      btn.setAttribute('aria-expanded','false');
      nav.classList.remove('open');
    }
  });
})();

/* ===== Hero slider (dots + captions + Ken-Burns) ===== */
(function(){
  const slides = document.querySelectorAll('.vh-hero__slide');
  if(!slides.length) return;
  const captionTitle = document.getElementById('vhCaptionTitle');
  const captionSubtitle = document.getElementById('vhCaptionSubtitle');
  const dotsWrap = document.querySelector('.vh-hero__dots');
  const nextBtn = document.querySelector('.vh-hero__nav.next');
  const prevBtn = document.querySelector('.vh-hero__nav.prev');

  // Preload backgrounds
  slides.forEach(s => {
    const url = (s.style.backgroundImage || "").replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    if(url){ const img = new Image(); img.src = url; }
  });

  // Build dots
  const dots = [];
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.className = 'vh-hero__dot';
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${idx+1}`);
    b.addEventListener('click', () => { show(idx); reset(); });
    dotsWrap.appendChild(b);
    dots.push(b);
  });

  let i = 0; const N = slides.length;

  function setCaptionFromSlide(n){
    const s = slides[n];
    if(!s) return;
    const title = s.getAttribute('data-title') || '';
    const subtitle = s.getAttribute('data-subtitle') || '';
    if(captionTitle) captionTitle.textContent = title;
    if(captionSubtitle) captionSubtitle.textContent = subtitle;
  }
  function setActiveDot(n){ dots.forEach((d, idx) => d.setAttribute('aria-current', idx === n ? 'true' : 'false')); }
  function show(n){
    slides[i].classList.remove('is-active');
    i = (n + N) % N;
    slides[i].classList.add('is-active');
    setCaptionFromSlide(i);
    setActiveDot(i);
  }

  setCaptionFromSlide(0); setActiveDot(0); dots[0]?.setAttribute('aria-current','true');

  let timer = setInterval(()=> show(i+1), 9000);
  function reset(){ clearInterval(timer); timer = setInterval(()=> show(i+1), 9000); }

  nextBtn?.addEventListener('click', ()=> { show(i+1); reset(); });
  prevBtn?.addEventListener('click', ()=> { show(i-1); reset(); });

  const hero = document.querySelector('.vh-hero');
  if(hero){ hero.addEventListener('mouseenter', ()=> clearInterval(timer)); hero.addEventListener('mouseleave', reset); }

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight'){ show(i+1); reset(); }
    else if(e.key === 'ArrowLeft'){ show(i-1); reset(); }
  });
})();

/* ===== Measure bars so hero sits behind them exactly ===== */
(function(){
  const root = document.documentElement;
  const tb = document.querySelector('.vh-topbar');
  const hd = document.querySelector('.vh-header');
  if(!tb || !hd) return;
  function setSizes(){
    const th = tb.offsetHeight || 0;
    const hh = hd.offsetHeight || 0;
    root.style.setProperty('--vh-topbar-h', th + 'px');
    root.style.setProperty('--vh-header-h', hh + 'px');
    root.style.setProperty('--vh-offset', (th + hh) + 'px');
  }
  window.addEventListener('load', setSizes);
  window.addEventListener('resize', setSizes);
  setTimeout(setSizes, 0);
})();

/* ===== Achievements: counters on scroll (with + suffix) ===== */
(function(){
  const wrap = document.getElementById('vhCounters');
  if(!wrap) return;
  const nums = [...wrap.querySelectorAll('.vh-counter__num')];

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start)/duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if(t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        nums.forEach(n=>{ if(!n.dataset.played){ n.dataset.played='1'; animate(n); } });
        io.disconnect();
      }
    });
  }, {threshold:0.25});
  io.observe(wrap);
})();

/* ===== Certificates lightbox ===== */
(function(){
  const lb = document.getElementById('vhLightbox');
  const img = document.getElementById('vhLightboxImg');
  if(!lb || !img) return;

  document.querySelectorAll('.vh-cert').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      img.src = a.getAttribute('href');
      img.alt = a.querySelector('figcaption')?.textContent || 'Certificate';
      lb.hidden = false;
    });
  });

  lb.addEventListener('click', (e)=>{
    if(e.target === lb || e.target.classList.contains('vh-lightbox__close')){
      lb.hidden = true; img.src = '';
    }
  });
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape'){ lb.hidden = true; img.src=''; }});
})();

/* ===== Best Products: auto-hide placeholder when cards exist ===== */
(function(){
  const grid = document.getElementById('vhProdGrid');
  if(!grid) return;
  const hasCards = grid.querySelector('.vh-prod-card');
  grid.classList.toggle('is-empty', !hasCards);
})();

/* ===== Testimonials carousel ===== */
(function(){
  const wrap = document.getElementById('vhTestis');
  if(!wrap) return;

  const viewport = wrap.querySelector('.vh-testis__viewport');
  const track = wrap.querySelector('.vh-testis__track');
  const cards = Array.from(track.children);
  const btnNext = wrap.querySelector('.vh-testis__nav.next');
  const btnPrev = wrap.querySelector('.vh-testis__nav.prev');
  const dotsWrap = wrap.querySelector('.vh-testis__dots');

  function perView(){
    if (window.matchMedia('(max-width:560px)').matches) return 1;
    if (window.matchMedia('(max-width:900px)').matches) return 2;
    return 3;
  }

  let pv = perView();
  let page = 0;
  let pages = Math.max(1, Math.ceil(cards.length / pv));
  const dots = [];

  function buildDots(){
    dotsWrap.innerHTML = '';
    dots.length = 0;
    for(let d=0; d<pages; d++){
      const b = document.createElement('button');
      b.className = 'vh-testis__dot';
      b.type = 'button';
      b.setAttribute('aria-label', `Go to testimonials page ${d+1}`);
      b.addEventListener('click', ()=> { go(d); reset(); });
      dotsWrap.appendChild(b);
      dots.push(b);
    }
    setActiveDot(page);
  }
  function setActiveDot(p){ dots.forEach((b, idx)=> b.setAttribute('aria-current', idx===p ? 'true' : 'false')); }

  function go(p){
    pv = perView();
    pages = Math.max(1, Math.ceil(cards.length / pv));
    page = ((p % pages) + pages) % pages;
    const index = page * pv;
    const target = cards[index];
    if(target){
      const left = target.offsetLeft - track.offsetLeft;
      viewport.scrollTo({ left, behavior: 'smooth' });
      setActiveDot(page);
    }
  }

  let timer = setInterval(()=> go(page+1), 7000);
  function reset(){ clearInterval(timer); timer = setInterval(()=> go(page+1), 7000); }

  btnNext?.addEventListener('click', ()=> { go(page+1); reset(); });
  btnPrev?.addEventListener('click', ()=> { go(page-1); reset(); });

  viewport.addEventListener('mouseenter', ()=> clearInterval(timer));
  viewport.addEventListener('mouseleave', reset);

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight'){ go(page+1); reset(); }
    if(e.key === 'ArrowLeft'){ go(page-1); reset(); }
  });

  let rAF; window.addEventListener('resize', ()=>{
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(()=> { pv = perView(); pages = Math.ceil(cards.length / pv); buildDots(); go(page); });
  });

  buildDots(); go(0);
})();

/* ===== Countries We Serve: Leaflet map with red pins ===== */
(function(){
  const mapEl = document.getElementById('vhMap');
  if(!mapEl || typeof L === 'undefined') return;

  // Edit the list as needed
  const COUNTRIES_SERVED = [
    { name: 'United States',        lat: 39.8283, lng: -98.5795 },
    { name: 'Germany',              lat: 51.1657, lng: 10.4515 },
    { name: 'United Arab Emirates', lat: 23.4241, lng: 53.8478 },
    { name: 'Spain',                lat: 40.4637, lng: -3.7492 },
    { name: 'Japan',                lat: 36.2048, lng: 138.2529 },
  ];

  const map = L.map(mapEl, { scrollWheelZoom:false, worldCopyJump:true, attributionControl:false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:5, minZoom:2 }).addTo(map);

  const pinStyle = { radius:7, color:'#b30000', weight:2, fillColor:'#ff2a2a', fillOpacity:0.9 };
  const group = L.featureGroup().addTo(map);

  COUNTRIES_SERVED.forEach(c=>{
  L.circleMarker([c.lat, c.lng], {
    radius: 7, color: '#b30000', weight: 2, fillColor: '#ff2a2a', fillOpacity: 0.9
  })
  .addTo(group)
  .bindTooltip(c.name, {
    permanent: true,          // <-- always show
    direction: 'top',         // top label (you can change to 'right' if preferred)
    offset: [0, -12],         // lift above the pin
    opacity: 1,
    className: 'vh-map-label' // custom style
  });
});


  if (COUNTRIES_SERVED.length > 1) map.fitBounds(group.getBounds().pad(0.35));
  else if (COUNTRIES_SERVED.length === 1) map.setView([COUNTRIES_SERVED[0].lat, COUNTRIES_SERVED[0].lng], 3);
  else map.setView([20,0], 2);

  const list = document.getElementById('vhMapList');
  if(list){ list.innerHTML = COUNTRIES_SERVED.map(c=>`<li>${c.name}</li>`).join(''); }

  setTimeout(()=> map.invalidateSize(), 250);
  window.addEventListener('resize', ()=> map.invalidateSize());
})();

/* ===== Category page renderer (A–Z index + list) ===== */

// 1) Data: add/extend freely
const PRODUCTS_DATA = {
  "essential-oils": {
    title: "Essential Oils",
    tag: "Pure, natural essential oils for food, cosmetic & aromatherapy applications.",
    items: [
      // A
      { name: "Agarwood Oil", botanical: "Aquilaria agallocha", part: "Wood", inci: "Aquilaria Agallocha Wood Oil", image: "images/agarwood-oil.png" },
      { name: "Ajowan Oil", botanical: "Trachyspermum ammi", part: "Seed", inci: "Carum Copticum Oil" },
      { name: "Anise Oil", botanical: "Pimpinella anisum", part: "Seed", inci: "Pimpinella Anisum Oil" },
      // B
      { name: "Basil Oil", botanical: "Ocimum basilicum", part: "Leaf", inci: "Ocimum Basilicum Oil" },
      { name: "Bergamot Oil", botanical: "Citrus bergamia", part: "Peel", inci: "Citrus Aurantium Bergamia Peel Oil" },
      // C
      { name: "Cardamom Oil", botanical: "Elettaria cardamomum", part: "Seed", inci: "Elettaria Cardamomum Seed Oil" },
      { name: "Cedarwood Oil", botanical: "Cedrus deodara", part: "Wood", inci: "Cedrus Deodara Wood Oil" },
      { name: "Cinnamon Leaf Oil", botanical: "Cinnamomum verum", part: "Leaf", inci: "Cinnamomum Zeylanicum Leaf Oil" },
      { name: "Citronella Oil", botanical: "Cymbopogon winterianus", part: "Grass", inci: "Cymbopogon Nardus Oil" },
      { name: "Clove Bud Oil", botanical: "Syzygium aromaticum", part: "Bud", inci: "Eugenia Caryophyllus Bud Oil" },
      // E
      { name: "Eucalyptus Oil", botanical: "Eucalyptus globulus", part: "Leaf", inci: "Eucalyptus Globulus Leaf Oil" },
      // F
      { name: "Frankincense Oil", botanical: "Boswellia serrata", part: "Resin", inci: "Boswellia Serrata Oil" },
      // G
      { name: "Ginger Oil", botanical: "Zingiber officinale", part: "Rhizome", inci: "Zingiber Officinale Root Oil" },
      // J
      { name: "Jasmine Absolute", botanical: "Jasminum grandiflorum", part: "Flower", inci: "Jasminum Grandiflorum Flower Extract" },
      // L
      { name: "Lavender Oil", botanical: "Lavandula angustifolia", part: "Flower", inci: "Lavandula Angustifolia Oil" },
      { name: "Lemon Oil", botanical: "Citrus limon", part: "Peel", inci: "Citrus Limon Peel Oil" },
      { name: "Lemongrass Oil", botanical: "Cymbopogon citratus", part: "Grass", inci: "Cymbopogon Citratus Oil" },
      // O
      { name: "Orange Oil (Sweet)", botanical: "Citrus sinensis", part: "Peel", inci: "Citrus Aurantium Dulcis Peel Oil Expressed" },
      { name: "Oregano Oil", botanical: "Origanum vulgare", part: "Leaf", inci: "Origanum Vulgare Leaf Oil" },
      // P
      { name: "Peppermint Oil", botanical: "Mentha piperita", part: "Leaf", inci: "Mentha Piperita Oil", image: "images/peppermint-oil.png" },
      { name: "Pine Oil", botanical: "Pinus sylvestris", part: "Needle", inci: "Pinus Sylvestris Leaf Oil" },
      // R
      { name: "Rose Oil", botanical: "Rosa damascena", part: "Flower", inci: "Rosa Damascena Flower Oil" },
      { name: "Rosemary Oil", botanical: "Rosmarinus officinalis", part: "Leaf", inci: "Rosmarinus Officinalis Leaf Oil" },
      // T
      { name: "Tea Tree Oil", botanical: "Melaleuca alternifolia", part: "Leaf", inci: "Melaleuca Alternifolia Leaf Oil" },
      { name: "Thyme Oil", botanical: "Thymus vulgaris", part: "Flowering tops", inci: "Thymus Vulgaris Oil" },
      // Y
      { name: "Ylang Ylang Oil", botanical: "Cananga odorata", part: "Flower", inci: "Cananga Odorata Flower Oil" }
    ]
  },

  "herbal-liquid-extract": {
    title: "Herbal Liquid Extract",
    items: [
      { name: "Amla Liquid Extract" },
      { name: "Turmeric Liquid Extract" },
      { name: "Green Tea Liquid Extract" }
    ]
  },

  "carrier-oils": {
    title: "Carrier Oils",
    items: [
      { name: "Wheat Germ Oil" },
      { name: "Walnut Oil" },
      { name: "Grapeseed Oil" }
    ]
  },

  "herbal-dry-extract": {
    title: "Herbal Dry Extract",
    items: [
      { name: "Amla Dry Extract" },
      { name: "Ashwagandha Dry Extract" },
      { name: "Brahmi Dry Extract" }
    ]
  },

  // ... add the remaining categories similarly when ready
};

// 2) Only run on category.html
(function(){
  const root = document.getElementById('vhCategoryRoot');
  if(!root) return;

  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').toLowerCase();
  const data = PRODUCTS_DATA[cat];

  // fallback if wrong slug
  if(!data){
    document.getElementById('vhCatTitle').textContent = "Products";
    document.getElementById('vhCatTitleCrumb').textContent = "Products";
    root.innerHTML = `<p>Category not found. Please go back to <a href="products.html">Products</a>.</p>`;
    return;
  }

  // Set titles / enquiry subject
  document.getElementById('vhCatTitle').textContent = data.title;
  document.getElementById('vhCatTitleCrumb').textContent = data.title;
  if(data.tag) document.getElementById('vhCatTag').textContent = data.tag;
  const enq = document.getElementById('vhEnquiryBtn');
  enq.href = `mailto:Sales@Vaibleherbal.com?subject=Enquiry%20-%20${encodeURIComponent(data.title)}`;

  // Group items by first letter
  const items = (data.items || []).slice().sort((a,b)=>a.name.localeCompare(b.name));
  const groups = {};
  items.forEach(it=>{
    const letter = (it.name[0] || '#').toUpperCase();
    groups[letter] = groups[letter] || [];
    groups[letter].push(it);
  });

  // Build A–Z strip
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  const azEl = document.getElementById('vhAz');
  azEl.innerHTML = letters.map(l=>{
    const has = !!groups[l];
    return `<a ${has ? `href="#sec-${l}"` : `class="is-disabled"`}>${l}</a>`;
  }).join('');

  // Build sections
  root.innerHTML = Object.keys(groups).sort().map(letter=>{
    const rows = groups[letter].map(it=>{
      const img = it.image || 'images/slide2.jpg';
      const botanical = it.botanical ? `<div><strong>Botanical Name:</strong> ${it.botanical}</div>` : "";
      const part = it.part ? `<div><strong>Part used:</strong> ${it.part}</div>` : "";
      const inci = it.inci ? `<div><strong>INCI Name:</strong> ${it.inci}</div>` : "";
      return `
        <article class="vh-catrow">
          <div class="vh-catrow__img"><img loading="lazy" src="${img}" alt="${it.name}"></div>
          <div class="vh-catrow__body">
            <h3>${it.name}</h3>
            ${botanical}${part}${inci}
            <div class="vh-catrow__actions">
              <a class="vh-btn" href="mailto:Sales@Vaibleherbal.com?subject=${encodeURIComponent('Enquiry – ' + it.name)}">Request COA</a>
              <a class="vh-btn ghost" href="https://wa.me/919911154497?text=${encodeURIComponent('Hello Vaible Herbal, please share COA/specs for ' + it.name)}" target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    return `
      <section id="sec-${letter}" class="vh-lettersec">
        <div class="vh-letter">${letter}</div>
        <div class="vh-lettergrid">
          ${rows}
        </div>
      </section>
    `;
  }).join('');

  // Search within category
  const search = document.getElementById('vhCatSearch');
  search?.addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const allRows = root.querySelectorAll('.vh-catrow');
    allRows.forEach(row=>{
      const txt = row.querySelector('h3').textContent.toLowerCase();
      row.style.display = txt.includes(q) ? '' : 'none';
    });
  });
})();
