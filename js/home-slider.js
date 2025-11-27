// js/home-slider.js
(function () {
  const track = document.getElementById('bestTrack');
  const dotsWrap = document.getElementById('bestDots');
  const prevBtn = document.getElementById('bestPrev');
  const nextBtn = document.getElementById('bestNext');
  const viewport = document.getElementById('bestViewport');

  const FALLBACK_IMG = 'images/slide1.jpg';

  fetch('data/home-featured.json?_=' + Date.now())
    .then(r => r.json())
    .then(({ items, options }) => init(items || [], options || {}))
    .catch(err => {
      console.error('best slider data error', err);
    });

  function init(items, opts) {
    // defaults
    const autoplayMs = +opts.autoplayMs || 3000;
    const pauseOnHover = opts.pauseOnHover !== false;
    const infinite = opts.infinite !== false;
    const showArrows = opts.showArrows !== false;
    const showDots = opts.showDots !== false;
    const perView = Object.assign({ desktop: 4, tablet: 3, mobile: 1 }, opts.perView || {});

    // build cards
    const cards = items.map(makeCard);
    if (infinite && cards.length > 1) {
      // clone head/tail for seamless loop
      track.appendChild(cards[cards.length - 1].cloneNode(true));
      cards.forEach(c => track.appendChild(c));
      track.appendChild(cards[0].cloneNode(true));
    } else {
      cards.forEach(c => track.appendChild(c));
    }

    const slideCount = cards.length;
    let visible = calcVisible(perView);
    let index = infinite ? 1 : 0; // because of cloning
    let timer = null;

    function calcVisible(pv) {
      const w = viewport.clientWidth;
      if (w < 640) return pv.mobile;
      if (w < 1024) return pv.tablet;
      return pv.desktop;
    }

    function setSizes() {
      visible = calcVisible(perView);
      const totalInTrack = track.children.length;
      const cardWidth = viewport.clientWidth / visible;
      [...track.children].forEach(el => {
        el.style.width = cardWidth + 'px';
        el.style.flex = `0 0 ${cardWidth}px`;
      });
      jumpTo(index, false);
    }

    function slideTo(i) {
      index = i;
      track.style.transition = 'transform 600ms cubic-bezier(.2,.7,.2,1)';
      applyTransform();
    }

    function jumpTo(i, withTransition = false) {
      index = i;
      track.style.transition = withTransition ? 'transform 600ms cubic-bezier(.2,.7,.2,1)' : 'none';
      applyTransform();
    }

    function applyTransform() {
      const cardWidth = viewport.clientWidth / visible;
      const x = -index * cardWidth;
      track.style.transform = `translateX(${x}px)`;
      updateDots();
    }

    function next() { slideTo(index + 1); }
    function prev() { slideTo(index - 1); }

    function start() {
      stop();
      timer = setInterval(() => next(), autoplayMs);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    if (pauseOnHover) {
      viewport.addEventListener('mouseenter', stop);
      viewport.addEventListener('mouseleave', start);
      viewport.addEventListener('focusin', stop);
      viewport.addEventListener('focusout', start);
    }

    // dots
    let dots = [];
    if (showDots) {
      dotsWrap.innerHTML = '';
      const pageCount = slideCount; // one dot per real item
      dots = Array.from({ length: pageCount }, (_, i) => {
        const b = document.createElement('button');
        b.className = 'vh-best__dot';
        b.type = 'button';
        b.setAttribute('aria-label', `Go to ${i + 1}`);
        b.addEventListener('click', () => {
          const target = infinite ? i + 1 : i;
          slideTo(target);
        });
        dotsWrap.appendChild(b);
        return b;
      });
    } else {
      dotsWrap.style.display = 'none';
    }

    // arrows
    prevBtn.style.display = showArrows ? '' : 'none';
    nextBtn.style.display = showArrows ? '' : 'none';
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // snap after transition for infinite loop
    track.addEventListener('transitionend', () => {
      if (!infinite) return;
      if (index === 0) {
        // jumped before first (we showed cloned last)
        jumpTo(slideCount, false); // real last
      } else if (index === slideCount + 1) {
        // jumped after last (we showed cloned first)
        jumpTo(1, false); // real first
      }
    });

    // resize
    window.addEventListener('resize', () => {
      setSizes();
    });

    // init
    setSizes();
    if (infinite) jumpTo(1, false);
    start();

    function updateDots() {
      if (!dots.length) return;
      let realIndex = infinite ? index - 1 : index;
      if (realIndex < 0) realIndex = slideCount - 1;
      if (realIndex >= slideCount) realIndex = 0;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === realIndex));
    }
  }

  function makeCard(item) {
    const a = document.createElement('a');
    a.className = 'vh-best__card';
    a.href = item.link || '#';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'vh-best__imgwrap';

    const img = document.createElement('img');
    img.src = item.image || FALLBACK_IMG;
    img.alt = item.name || '';
    img.loading = 'lazy';
    img.onerror = () => { img.src = FALLBACK_IMG; };
    imgWrap.appendChild(img);

    const meta = document.createElement('div');
    meta.className = 'vh-best__meta';

    const h = document.createElement('div');
    h.className = 'vh-best__name';
    h.textContent = item.name || '';
    meta.appendChild(h);

    const p = document.createElement('div');
    p.className = 'vh-best__tag';
    p.textContent = item.tagline || '';
    meta.appendChild(p);

    a.appendChild(imgWrap);
    a.appendChild(meta);
    return a;
  }
})();
