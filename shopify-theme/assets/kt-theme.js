/* ============================================================
   KIN & TAIL — theme behaviour (vanilla, dependency-free)
   Replaces the React ShopContext with Shopify Cart API +
   localStorage wishlist + native search.
   ============================================================ */
(function () {
  'use strict';

  var KT = window.KT || {};
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function money(cents) {
    var fmt = KT.moneyFormat || '${{amount}}';
    var v = (cents / 100).toFixed(2);
    return fmt.replace('{{amount}}', v).replace('{{amount_with_comma_separator}}', v.replace('.', ','));
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  }

  function esc(str) {
    var d = document.createElement('div');
    d.textContent = String(str == null ? '' : str);
    return d.innerHTML;
  }

  /* ————— toasts ————— */
  var ICONS = {
    bag: '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1.1 12H7.1L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    heart: '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.4"><path d="M12 20.2C7.2 16.4 3.6 13.2 3.6 9.4c0-2.9 2.2-4.9 4.5-4.9 1.7 0 3.2 1 3.9 2.4.7-1.4 2.2-2.4 3.9-2.4 2.3 0 4.5 2 4.5 4.9 0 3.8-3.6 7-8.4 10.8Z"/></svg>',
    check: '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>'
  };

  function toast(message, icon) {
    var stack = $('[data-toasts]');
    if (!stack) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span class="toast__icon">' + (ICONS[icon] || ICONS.check) + '</span><p>' + esc(message) + '</p>';
    stack.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity 0.6s ease';
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 620);
    }, 2600);
  }

  /* ————— reveals ————— */
  function initReveals() {
    var els = $$('.rv-up, .rv-fade, .rv-mask').filter(function (el) {
      return !el.closest('[data-hero]');
    });
    if (reducedMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ————— parallax ————— */
  function initParallax() {
    if (reducedMotion) return;
    $$('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.06;
      var raf = 0;
      function update() {
        raf = 0;
        var r = el.getBoundingClientRect();
        var centre = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = 'translate3d(0,' + (-centre * speed).toFixed(1) + 'px,0)';
      }
      function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    });
  }

  /* ————— header ————— */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 32); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ————— hero choreography ————— */
  function initHero() {
    var hero = $('[data-hero]');
    if (!hero) return;
    requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('is-in'); }); });
  }

  /* ————— mobile menu ————— */
  var lockCount = 0;
  function lock() { lockCount++; document.body.classList.add('kt-locked'); }
  function unlock() { lockCount = Math.max(0, lockCount - 1); if (!lockCount) document.body.classList.remove('kt-locked'); }

  function initMenu() {
    var menu = $('[data-mobile-menu]');
    var opener = $('[data-open-menu]');
    if (!menu) return;
    function open() { menu.classList.add('is-open'); lock(); if (opener) opener.setAttribute('aria-expanded', 'true'); }
    function close() { menu.classList.remove('is-open'); unlock(); if (opener) opener.setAttribute('aria-expanded', 'false'); }
    if (opener) opener.addEventListener('click', open);
    $$('[data-close-menu]').forEach(function (b) { b.addEventListener('click', close); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', close); });
    menu._close = close;
    window._ktMenu = menu;
  }

  /* ————— overlays ————— */
  function initOverlays() {
    var openers = {
      cart: $$('[data-open-cart]'),
      wish: $$('[data-open-wish]'),
      search: $$('[data-open-search]')
    };

    function openOverlay(name) {
      var ov = $('[data-overlay="' + name + '"]');
      if (!ov) return;
      if (name === 'cart') renderCartDrawer();
      if (name === 'wish') renderWishlist();
      ov.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add('is-open'); }); });
      lock();
      var focusEl = ov.querySelector('input, button, a');
      if (focusEl) setTimeout(function () { focusEl.focus({ preventScroll: true }); }, 350);
      if (name === 'search') {
        var input = $('[data-search-input]');
        if (input) setTimeout(function () { input.focus({ preventScroll: true }); }, 350);
      }
    }

    function closeOverlay(ov) {
      if (!ov) return;
      ov.classList.remove('is-open');
      unlock();
      setTimeout(function () { ov.hidden = true; }, 520);
    }

    Object.keys(openers).forEach(function (name) {
      openers[name].forEach(function (btn) {
        btn.addEventListener('click', function () { openOverlay(name); });
      });
    });

    $$('[data-overlay]').forEach(function (ov) {
      $$('.scrim, [data-close-overlay]', ov).forEach(function (el) {
        el.addEventListener('click', function () { closeOverlay(ov); });
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var openOv = $$('.overlay.is-open').pop();
        if (openOv) { closeOverlay(openOv); return; }
        if (window._ktMenu && window._ktMenu.classList.contains('is-open')) window._ktMenu._close();
      }
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        openOverlay('search');
      }
    });

    window._ktOpenOverlay = openOverlay;
  }

  /* ————— cart (Shopify AJAX) ————— */
  var cartCache = null;

  function fetchCart() {
    return fetch(KT.cartUrl + '.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) { cartCache = cart; return cart; });
  }

  function updateBadges(cart) {
    var count = cart.item_count;
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
      el.classList.remove('animate-badgepop');
      void el.offsetWidth;
      el.classList.add('animate-badgepop');
    });
    $$('[data-cart-count-text]').forEach(function (el) { el.textContent = count; });
  }

  function renderCartDrawer() {
    fetchCart().then(function (cart) {
      updateBadges(cart);
      var list = $('[data-cart-lines]');
      var empty = $('[data-cart-empty]');
      var foot = $('[data-cart-foot]');
      if (!list) return;

      if (cart.item_count === 0) {
        list.innerHTML = '';
        if (empty) empty.hidden = false;
        if (foot) foot.hidden = true;
        return;
      }
      if (empty) empty.hidden = true;
      if (foot) foot.hidden = false;

      list.innerHTML = cart.items.map(function (item) {
        var img = item.image ? '<img src="' + esc(item.image.replace(/_(\d+)x(\d+)?(\.\w+)$/, '_200x200$3')) + '" alt="' + esc(item.product_title) + '" loading="lazy">' : '';
        var variant = item.variant_title && item.variant_title !== 'Default Title'
          ? '<p class="line-item__variant">' + esc(item.variant_title) + '</p>' : '';
        return '<li class="line-item">' +
          '<a class="line-item__img" href="' + esc(item.url) + '" aria-hidden="true" tabindex="-1">' + img + '</a>' +
          '<div class="line-item__body">' +
            '<div class="line-item__top">' +
              '<div>' +
                '<a class="line-item__title" href="' + esc(item.url) + '">' + esc(item.product_title) + '</a>' +
                variant +
              '</div>' +
              '<button type="button" class="line-remove" data-cart-remove="' + esc(item.key) + '" aria-label="Remove ' + esc(item.product_title) + '">' +
                '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
              '</button>' +
            '</div>' +
            '<div class="line-item__row">' +
              '<div class="qty">' +
                '<button type="button" data-cart-qty="' + esc(item.key) + '" data-delta="-1" aria-label="Decrease quantity" ' + (item.quantity <= 1 ? 'disabled' : '') + '>' +
                  '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5 12h14"/></svg>' +
                '</button>' +
                '<span aria-live="polite">' + item.quantity + '</span>' +
                '<button type="button" data-cart-qty="' + esc(item.key) + '" data-delta="1" aria-label="Increase quantity">' +
                  '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
                '</button>' +
              '</div>' +
              '<span class="line-item__price">' + money(item.final_line_price) + '</span>' +
            '</div>' +
          '</div>' +
        '</li>';
      }).join('');

      var subtotal = $('[data-cart-subtotal]');
      if (subtotal) subtotal.textContent = money(cart.total_price);

      var bar = $('[data-ship-bar]');
      var note = $('[data-ship-note]');
      var threshold = KT.freeShipThreshold || 0;
      if (bar && note && threshold > 0) {
        var pct = Math.min(100, Math.round((cart.total_price / threshold) * 100));
        bar.style.width = pct + '%';
        if (cart.total_price >= threshold) {
          note.textContent = 'Complimentary shipping unlocked.';
        } else {
          note.textContent = 'You\u2019re ' + money(threshold - cart.total_price) + ' away from complimentary shipping.';
        }
      }
    });
  }

  function addToCart(variantId, qty) {
    return fetch(KT.cartAddUrl + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: [{ id: Number(variantId), quantity: Number(qty) || 1 }] })
    }).then(function (r) {
      if (!r.ok) throw new Error('cart add failed');
      return fetchCart();
    }).then(function (cart) {
      updateBadges(cart);
      if (cartCache) renderCartDrawer();
      return cart;
    });
  }

  function changeLine(key, qty) {
    return fetch(KT.cartChangeUrl + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: Number(qty) })
    }).then(function (r) {
      if (!r.ok) throw new Error('cart change failed');
      return fetchCart();
    }).then(function (cart) {
      updateBadges(cart);
      renderCartDrawer();
      return cart;
    });
  }

  function initCartEvents() {
    document.addEventListener('click', function (e) {
      var addBtn = e.target.closest('[data-add-variant]');
      if (addBtn) {
        e.preventDefault();
        var variantId = addBtn.getAttribute('data-add-variant');
        var original = addBtn.innerHTML;
        addBtn.disabled = true;
        addToCart(variantId, 1).then(function () {
          toast(KT.strings && KT.strings.addedToBag ? KT.strings.addedToBag : 'Added to your bag', 'bag');
          addBtn.classList.add('is-added');
          addBtn.textContent = 'Added';
          window._ktOpenOverlay && window._ktOpenOverlay('cart');
          setTimeout(function () {
            addBtn.innerHTML = original;
            addBtn.classList.remove('is-added');
            addBtn.disabled = false;
          }, 1400);
        }).catch(function () {
          addBtn.disabled = false;
          toast('Something went quiet on our side — try again.', 'check');
        });
        return;
      }

      var qtyBtn = e.target.closest('[data-cart-qty]');
      if (qtyBtn) {
        var key = qtyBtn.getAttribute('data-cart-qty');
        var delta = Number(qtyBtn.getAttribute('data-delta'));
        var item = cartCache && cartCache.items.filter(function (i) { return i.key === key; })[0];
        if (item) changeLine(key, Math.max(0, item.quantity + delta));
        return;
      }

      var removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        changeLine(removeBtn.getAttribute('data-cart-remove'), 0);
        return;
      }
    });

    document.addEventListener('submit', function (e) {
      var form = e.target.closest('[data-pdp-form]');
      if (!form) return;
      e.preventDefault();
      var variantId = $('[data-variant-input]', form).value;
      var qty = Number($('[data-qty-value]', form).textContent) || 1;
      addToCart(variantId, qty).then(function () {
        toast(KT.strings && KT.strings.addedToBag ? KT.strings.addedToBag : 'Added to your bag', 'bag');
        window._ktOpenOverlay && window._ktOpenOverlay('cart');
      });
    });

    fetchCart().then(updateBadges).catch(function () {});
  }

  /* ————— wishlist (localStorage) ————— */
  var WISH_KEY = 'kt-wishlist-v1';

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { return []; }
  }
  function saveWishlist(items) {
    try { localStorage.setItem(WISH_KEY, JSON.stringify(items)); } catch (e) {}
  }

  function syncWishButtons() {
    var saved = getWishlist();
    $$('[data-wish-toggle]').forEach(function (btn) {
      var handle = btn.getAttribute('data-wish-handle');
      var isSaved = saved.some(function (i) { return i.handle === handle; });
      btn.classList.toggle('is-saved', isSaved);
      btn.setAttribute('aria-pressed', String(isSaved));
      var svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', isSaved ? 'currentColor' : 'none');
      var label = $('[data-wish-label]', btn);
      if (label) label.textContent = isSaved ? 'Saved to Wishlist' : 'Save to Wishlist';
    });
    var count = saved.length;
    $$('[data-wish-count]').forEach(function (el) { el.textContent = count; el.hidden = count === 0; });
    $$('[data-wish-count-text]').forEach(function (el) { el.textContent = count; });
  }

  function renderWishlist() {
    var saved = getWishlist();
    var list = $('[data-wish-lines]');
    var empty = $('[data-wish-empty]');
    var foot = $('[data-wish-foot]');
    if (!list) return;
    if (saved.length === 0) {
      list.innerHTML = '';
      if (empty) empty.hidden = false;
      if (foot) foot.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (foot) foot.hidden = false;
    list.innerHTML = saved.map(function (item) {
      return '<li class="line-item">' +
        '<a class="line-item__img" href="' + esc(item.url) + '" aria-hidden="true" tabindex="-1"><img src="' + esc(item.image) + '" alt="' + esc(item.title) + '" loading="lazy"></a>' +
        '<div class="line-item__body">' +
          '<a class="line-item__title" href="' + esc(item.url) + '">' + esc(item.title) + '</a>' +
          '<p class="line-item__variant">' + money(item.price) + '</p>' +
          '<div class="line-item__row" style="justify-content: flex-start; gap: 1rem;">' +
            '<button type="button" class="line-move" data-wish-move="' + esc(item.handle) + '">' +
              '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1.1 12H7.1L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>' +
              'Move to Bag' +
            '</button>' +
            '<button type="button" class="u-line" style="font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:rgba(33,22,17,0.5);" data-wish-remove="' + esc(item.handle) + '">Remove</button>' +
          '</div>' +
        '</div>' +
      '</li>';
    }).join('');
  }

  function initWishlistEvents() {
    document.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-wish-toggle]');
      if (toggle) {
        e.preventDefault();
        var saved = getWishlist();
        var handle = toggle.getAttribute('data-wish-handle');
        var idx = saved.map(function (i) { return i.handle; }).indexOf(handle);
        if (idx > -1) {
          saved.splice(idx, 1);
          toast(KT.strings && KT.strings.removedFromWishlist ? KT.strings.removedFromWishlist : 'Removed from wishlist', 'heart');
        } else {
          saved.push({
            handle: handle,
            variant: toggle.getAttribute('data-wish-variant'),
            title: toggle.getAttribute('data-wish-title'),
            price: Number(toggle.getAttribute('data-wish-price')) || 0,
            image: toggle.getAttribute('data-wish-image'),
            url: toggle.getAttribute('data-wish-url')
          });
          toast(KT.strings && KT.strings.savedToWishlist ? KT.strings.savedToWishlist : 'Saved to your wishlist', 'heart');
        }
        saveWishlist(saved);
        syncWishButtons();
        return;
      }

      var move = e.target.closest('[data-wish-move]');
      if (move) {
        var handle2 = move.getAttribute('data-wish-move');
        var item = getWishlist().filter(function (i) { return i.handle === handle2; })[0];
        if (item && item.variant) {
          addToCart(item.variant, 1).then(function () {
            var saved = getWishlist().filter(function (i) { return i.handle !== handle2; });
            saveWishlist(saved);
            syncWishButtons();
            renderWishlist();
            toast('Moved to your bag', 'bag');
          });
        }
        return;
      }

      var remove = e.target.closest('[data-wish-remove]');
      if (remove) {
        var handle3 = remove.getAttribute('data-wish-remove');
        saveWishlist(getWishlist().filter(function (i) { return i.handle !== handle3; }));
        syncWishButtons();
        renderWishlist();
      }
    });
    syncWishButtons();
  }

  /* ————— collection chips ————— */
  function initChips() {
    var row = $('[data-chip-row]');
    var grid = $('[data-product-grid]');
    if (!row || !grid) return;
    var slots = $$('[data-card-slot]', grid);

    function counts() {
      $$('[data-chip-count]', row).forEach(function (sup) {
        var id = sup.getAttribute('data-chip-count');
        var n = slots.filter(function (s) {
          return (' ' + s.getAttribute('data-chips') + ' ').indexOf(' ' + id + ' ') > -1 ||
            (id === 'all');
        }).length;
        if (id === 'all') n = slots.length;
        sup.textContent = n;
      });
    }

    row.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-chip]');
      if (!chip) return;
      $$('[data-chip]', row).forEach(function (c) {
        var active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
      var id = chip.getAttribute('data-chip');
      slots.forEach(function (s) {
        var chips = (' ' + s.getAttribute('data-chips') + ' ');
        s.classList.toggle('is-filtered-out', id !== 'all' && chips.indexOf(' ' + id + ' ') === -1);
      });
    });
    counts();
  }

  /* ————— concierge ————— */
  function initConcierge() {
    var panel = $('[data-concierge]');
    var dataEl = $('#kt-concierge-data');
    if (!panel || !dataEl) return;

    var pool = [];
    try { pool = JSON.parse(dataEl.textContent) || []; } catch (e) { pool = []; }

    var stepEl = $('[data-concierge-step]', panel);
    var state = { species: null, stage: null, temp: null, focus: null, picks: [] };
    var curatingTimer = null;

    var FOCUS_LABELS = [
      { id: 'comfort', label: 'Comfort' },
      { id: 'play', label: 'Play' },
      { id: 'meals', label: 'Meals' },
      { id: 'grooming', label: 'Grooming' },
      { id: 'walk', label: 'Walks', dogOnly: true }
    ];
    var REASONS = {
      walk: 'For the walks you both look forward to.',
      comfort: 'For slow mornings and long naps.',
      play: 'For the zoomies, handled beautifully.',
      meals: 'For meals taken at their own pace.',
      grooming: 'For ten quiet minutes together.'
    };

    function tags(p) { return (p.tags || '').split(','); }
    function hasTag(p, t) { return tags(p).indexOf(t) > -1; }

    function recommend() {
      var scored = pool.filter(function (p) {
        if (state.species === 'dog') return !hasTag(p, 'cat');
        if (state.species === 'cat') return !hasTag(p, 'dog');
        return true;
      }).map(function (p) {
        var score = (hasTag(p, 'dog') || hasTag(p, 'cat')) ? 2 : 1;
        var focus = state.focus === 'walk' ? (hasTag(p, 'walk') || hasTag(p, 'walks')) : hasTag(p, state.focus);
        if (focus) score += 4;
        if (state.temp === 'calm' && hasTag(p, 'comfort')) score += 2;
        if (state.temp === 'playful' && hasTag(p, 'play')) score += 2;
        if (state.temp === 'adventurous' && (hasTag(p, 'walk') || hasTag(p, 'walks'))) score += 2;
        if (hasTag(p, state.stage) || (state.stage === 'young' && (hasTag(p, 'puppy') || hasTag(p, 'kitten')))) score += 1.5;
        return { p: p, score: score, focusHit: focus };
      });
      scored.sort(function (a, b) { return b.score - a.score; });
      return scored.slice(0, 3).map(function (s) {
        return { p: s.p, reason: s.p.reason || REASONS[state.focus] || 'Chosen with care.' };
      });
    }

    function setProgress(idx) {
      $$('[data-step-mark]', panel).forEach(function (m) {
        var i = Number(m.getAttribute('data-step-mark'));
        m.classList.toggle('is-active', i === idx);
        m.classList.toggle('is-done', i < idx);
        var dot = $('.step-marker__dot', m);
        if (dot) dot.innerHTML = i < idx
          ? '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>'
          : String(i + 1);
      });
    }

    function segBtns(options, current, attr) {
      return options.map(function (o) {
        var sel = current === o.id;
        return '<button type="button" class="seg' + (sel ? ' is-selected' : '') + '" data-seg="' + attr + '" data-value="' + o.id + '" aria-pressed="' + sel + '">' + o.label + '</button>';
      }).join('');
    }

    function renderSpecies() {
      setProgress(0);
      stepEl.innerHTML =
        '<div class="animate-stepin">' +
          '<h3>' + esc(panel.getAttribute('data-species-question')) + '</h3>' +
          '<div class="species-grid">' +
            '<button type="button" class="species-card" data-species="dog">' +
              '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="6.3"/><path d="M7.6 8.6C5.6 7.6 4.2 9.4 4.6 12.4c.3 2 1.5 3.1 2.9 2.8"/><path d="M16.4 8.6c2-1 3.4.8 3 3.8-.3 2-1.5 3.1-2.9 2.8"/><circle cx="12" cy="14.4" r="1" fill="currentColor" stroke="none"/><path d="M12 15.6v1.6"/></svg>' +
              '<strong>A dog</strong><span>Walks, rest &amp; a little glorious chaos</span>' +
            '</button>' +
            '<button type="button" class="species-card" data-species="cat">' +
              '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.2" r="6.6"/><path d="M7.2 9.4 5.8 3.9l4.2 2.4"/><path d="M16.8 9.4l1.4-5.5-4.2 2.4"/><circle cx="9.6" cy="12.8" r="0.85" fill="currentColor" stroke="none"/><circle cx="14.4" cy="12.8" r="0.85" fill="currentColor" stroke="none"/><path d="m12 14.6-.8.9h1.6Z" fill="currentColor" stroke="none"/></svg>' +
              '<strong>A cat</strong><span>Perches, rituals &amp; quiet opinions</span>' +
            '</button>' +
          '</div>' +
        '</div>';
    }

    function renderProfile() {
      setProgress(1);
      var stages = state.species === 'cat'
        ? [{ id: 'young', label: 'Kitten' }, { id: 'adult', label: 'Adult' }, { id: 'senior', label: 'Senior' }]
        : [{ id: 'young', label: 'Puppy' }, { id: 'adult', label: 'Adult' }, { id: 'senior', label: 'Senior' }];
      var temps = [{ id: 'calm', label: 'Calm' }, { id: 'playful', label: 'Playful' }, { id: 'adventurous', label: 'Adventurous' }];
      var focuses = FOCUS_LABELS.filter(function (f) { return !(f.dogOnly && state.species === 'cat'); });
      var ready = state.stage && state.temp && state.focus;
      stepEl.innerHTML =
        '<div class="animate-stepin">' +
          '<h3>' + esc(panel.getAttribute('data-profile-question')) + '</h3>' +
          '<p class="concierge-label">Stage of life</p><div class="seg-row">' + segBtns(stages, state.stage, 'stage') + '</div>' +
          '<p class="concierge-label">Temperament</p><div class="seg-row">' + segBtns(temps, state.temp, 'temp') + '</div>' +
          '<p class="concierge-label">What matters most right now</p><div class="seg-row">' + segBtns(focuses, state.focus, 'focus') + '</div>' +
          '<div class="concierge-actions">' +
            '<button type="button" class="btn btn--cream" data-curate ' + (ready ? '' : 'disabled') + '>Prepare my edit</button>' +
            '<button type="button" class="u-line back-link" data-back>← Back</button>' +
          '</div>' +
        '</div>';
    }

    function renderCurating() {
      setProgress(1);
      var stageWord = state.stage === 'young'
        ? (state.species === 'dog' ? 'a young puppy' : 'a young kitten')
        : 'a ' + state.stage + ' ' + state.species;
      stepEl.innerHTML =
        '<div class="curating animate-stepin">' +
          '<div class="curating__dots"><i></i><i style="animation-delay:.22s"></i><i style="animation-delay:.44s"></i></div>' +
          '<p>Considering ' + esc(stageWord) + ' with ' + esc(state.temp) + ' instincts…</p>' +
          '<small>' + esc(panel.getAttribute('data-curating-text')) + '</small>' +
        '</div>';
      curatingTimer = setTimeout(function () {
        state.picks = recommend();
        renderEdit();
      }, 1700);
    }

    function renderEdit() {
      setProgress(2);
      var rows = state.picks.map(function (pick, i) {
        var p = pick.p;
        return '<div class="edit-row">' +
          '<span class="edit-row__n">' + (i + 1) + '</span>' +
          '<a class="edit-row__img" href="' + esc(p.url) + '" aria-label="View ' + esc(p.title) + '"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></a>' +
          '<div class="edit-row__body"><strong>' + esc(p.title) + '</strong><span>' + esc(pick.reason) + '</span></div>' +
          '<span class="edit-row__price">' + money(p.price) + '</span>' +
          '<div class="edit-row__btns">' +
            '<a class="mini-btn" href="' + esc(p.url) + '" aria-label="View ' + esc(p.title) + '"><svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg></a>' +
            '<button type="button" class="mini-btn mini-btn--add" data-add-variant="' + p.variant + '" aria-label="Add ' + esc(p.title) + ' to bag"><svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>' +
          '</div>' +
        '</div>';
      }).join('');

      stepEl.innerHTML =
        '<div class="animate-stepin">' +
          '<h3>' + esc(panel.getAttribute('data-edit-heading')) + '</h3>' +
          '<p style="margin-top:0.5rem;font-size:14px;font-weight:300;color:rgba(250,244,230,0.55);">Three pieces, chosen with care.</p>' +
          (rows || '<p style="margin-top:1.5rem;font-family:var(--font-display);font-style:italic;color:rgba(250,244,230,0.7);">The shelves are quiet — add products to the concierge collection in Shopify Admin.</p>') +
          '<div class="concierge-actions">' +
            (state.picks.length ? '<button type="button" class="btn btn--cream" data-add-all>Add all three</button>' : '') +
            '<button type="button" class="u-line back-link" data-restart>Start over</button>' +
          '</div>' +
        '</div>';
    }

    panel.addEventListener('click', function (e) {
      var sp = e.target.closest('[data-species]');
      if (sp) { state.species = sp.getAttribute('data-species'); renderProfile(); return; }

      var seg = e.target.closest('[data-seg]');
      if (seg) {
        var attr = seg.getAttribute('data-seg');
        state[attr] = seg.getAttribute('data-value');
        renderProfile();
        return;
      }

      if (e.target.closest('[data-curate]')) { renderCurating(); return; }
      if (e.target.closest('[data-back]')) { renderSpecies(); return; }
      if (e.target.closest('[data-restart]')) {
        clearTimeout(curatingTimer);
        state = { species: null, stage: null, temp: null, focus: null, picks: [] };
        renderSpecies();
        return;
      }

      if (e.target.closest('[data-add-all]')) {
        var promises = state.picks.map(function (pick) { return addToCart(pick.p.variant, 1); });
        Promise.all(promises).then(function () {
          toast('The full edit — added to your bag', 'bag');
          window._ktOpenOverlay && window._ktOpenOverlay('cart');
        });
      }
    });

    renderSpecies();
  }

  /* ————— search modal ————— */
  function initSearch() {
    var input = $('[data-search-input]');
    var results = $('[data-search-results]');
    if (!input || !results) return;
    var defaultHtml = results.innerHTML;
    var hits = [];
    var active = 0;

    function renderHits(list) {
      hits = list;
      active = 0;
      if (!list.length) {
        results.innerHTML =
          '<p class="search-hint">' + (KT.strings ? 'Results' : 'Results') + '</p>' +
          '<div class="search-empty">' +
            '<h4>Nothing on our shelves for \u201C' + esc(input.value.trim()) + '\u201D.</h4>' +
            '<p>Try \u201Cleather\u201D, \u201Cbed\u201D or \u201Cplay\u201D — or browse the full collection.</p>' +
            '<a class="u-line" style="font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:var(--cream);" href="' + (KT.searchUrl || '/search') + '?q=' + encodeURIComponent(input.value.trim()) + '">Search the whole store</a>' +
          '</div>';
        return;
      }
      results.innerHTML =
        '<p class="search-hint">' + list.length + ' piece' + (list.length > 1 ? 's' : '') + ' found</p>' +
        list.map(function (p, i) {
          var img = p.image ? '<img src="' + esc(p.image.replace(/_(\d+)x(\d+)?(\.\w+)$/, '_120x120$3')) + '" alt="" loading="lazy">' : '';
          return '<button type="button" class="search-hit' + (i === 0 ? ' is-active' : '') + '" data-hit="' + i + '">' +
            '<span class="search-hit__img">' + img + '</span>' +
            '<span class="search-hit__body"><strong>' + esc(p.title) + '</strong><span>' + esc(p.vendor || '') + '</span></span>' +
            '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>' +
          '</button>';
        }).join('') +
        '<div style="margin-top:1.25rem;"><a class="u-line" style="font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:var(--cream);" href="' + (KT.searchUrl || '/search') + '?q=' + encodeURIComponent(input.value.trim()) + '">See all results</a></div>';
    }

    var search = debounce(function () {
      var q = input.value.trim();
      if (q.length < 2) { results.innerHTML = defaultHtml; hits = []; return; }
      fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=6')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var products = (data.resources && data.resources.results && data.resources.results.products) || [];
          renderHits(products);
        })
        .catch(function () { results.innerHTML = defaultHtml; });
    }, 250);

    input.addEventListener('input', search);

    input.addEventListener('keydown', function (e) {
      if (!hits.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        active = e.key === 'ArrowDown' ? (active + 1) % hits.length : (active - 1 + hits.length) % hits.length;
        $$('.search-hit', results).forEach(function (h, i) { h.classList.toggle('is-active', i === active); });
      } else if (e.key === 'Enter' && hits[active]) {
        e.preventDefault();
        window.location.href = hits[active].url;
      }
    });

    results.addEventListener('click', function (e) {
      var hit = e.target.closest('[data-hit]');
      if (hit && hits[Number(hit.getAttribute('data-hit'))]) {
        window.location.href = hits[Number(hit.getAttribute('data-hit'))].url;
        return;
      }
      var term = e.target.closest('[data-search-term]');
      if (term) {
        input.value = term.getAttribute('data-search-term');
        input.dispatchEvent(new Event('input'));
        input.focus();
      }
    });

    var form = $('[data-search-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        if (!input.value.trim()) { e.preventDefault(); input.focus(); }
      });
    }
  }

  /* ————— product page ————— */
  function initPDP() {
    var section = $('[data-pdp]');
    if (!section) return;

    var variants = [];
    var images = [];
    try { variants = JSON.parse($('[data-pdp-variants]', section).textContent) || []; } catch (e) {}
    try {
      var imgEl = $('[data-pdp-images]', section);
      if (imgEl) images = JSON.parse(imgEl.textContent) || [];
    } catch (e) {}

    var selected = variants.filter(function (v) { return v.id === Number($('[data-variant-input]', section).value); })[0] || variants[0];
    var options = selected ? selected.options.slice() : [];

    var priceEl = $('[data-price]', section);
    var addBtn = $('[data-add-btn]', section);
    var addLabel = $('[data-add-label]', section);
    var stock = $('[data-stock-note]', section);
    var mainImg = $('[data-main-image]', section);

    function findVariant() {
      return variants.filter(function (v) {
        return v.options.every(function (o, i) { return o === options[i]; });
      })[0] || null;
    }

    function update() {
      var v = findVariant();
      if (!v) {
        if (addBtn) addBtn.disabled = true;
        if (addLabel) addLabel.textContent = 'Unavailable';
        return;
      }
      $('[data-variant-input]', section).value = v.id;
      if (priceEl) priceEl.textContent = money(v.price);
      var compareEl = $('[data-price-wrap] s', section);
      var saveNote = $('[data-save-note]', section);
      if (compareEl) {
        if (v.compare_at_price && v.compare_at_price > v.price) {
          compareEl.textContent = money(v.compare_at_price);
          compareEl.style.display = '';
          if (saveNote) saveNote.textContent = 'Save ' + money(v.compare_at_price - v.price);
        } else {
          compareEl.style.display = 'none';
          if (saveNote) saveNote.textContent = '';
        }
      }
      if (addBtn) addBtn.disabled = !v.available;
      if (addLabel) addLabel.textContent = v.available ? 'Add to Bag' : 'Sold out';
      if (stock) {
        stock.classList.toggle('is-out', !v.available);
        stock.lastChild.textContent = v.available ? ' In stock — ships in 2–4 days' : ' Sold out';
      }
      var wishBtn = $('[data-wish-toggle]', section);
      if (wishBtn) {
        wishBtn.setAttribute('data-wish-variant', v.id);
        wishBtn.setAttribute('data-wish-price', v.price);
      }
      if (mainImg) {
        var img = images.filter(function (im) { return im.variant_ids && im.variant_ids.indexOf(v.id) > -1; })[0];
        if (img && img.src) mainImg.src = img.src + (img.src.indexOf('?') > -1 ? '&' : '?') + 'width=1200';
      }
    }

    $$('[data-opt-btn]', section).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = Number(btn.getAttribute('data-opt-index'));
        var val = btn.getAttribute('data-opt-value');
        options[idx] = val;
        $$('[data-opt-btn][data-opt-index="' + idx + '"]', section).forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-selected', on);
          b.setAttribute('aria-pressed', String(on));
        });
        var selLabel = $('[data-opt-selected="' + idx + '"]', section);
        if (selLabel) selLabel.textContent = val;
        update();
      });
    });

    var qty = 1;
    var qtyVal = $('[data-qty-value]', section);
    var dec = $('[data-qty-dec]', section);
    var inc = $('[data-qty-inc]', section);
    function setQty(n) {
      qty = Math.max(1, Math.min(9, n));
      if (qtyVal) qtyVal.textContent = qty;
      if (dec) dec.disabled = qty === 1;
      if (inc) inc.disabled = qty === 9;
    }
    if (dec) dec.addEventListener('click', function () { setQty(qty - 1); });
    if (inc) inc.addEventListener('click', function () { setQty(qty + 1); });

    $$('[data-thumb]', section).forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        $$('[data-thumb]', section).forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
        if (mainImg) mainImg.src = thumb.getAttribute('data-full');
      });
    });

    $$('[data-accordion-toggle]', section).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.pdp-detail');
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ————— boot ————— */
  function init() {
    initReveals();
    initParallax();
    initHeader();
    initHero();
    initMenu();
    initOverlays();
    initCartEvents();
    initWishlistEvents();
    initChips();
    initConcierge();
    initSearch();
    initPDP();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
