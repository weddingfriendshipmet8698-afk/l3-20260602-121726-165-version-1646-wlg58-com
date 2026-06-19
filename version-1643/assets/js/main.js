(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-mobile-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (menuButton && menu) {
      menuButton.addEventListener('click', function () {
        menu.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('.site-search-form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        var root = form.getAttribute('data-root') || document.body.getAttribute('data-root') || './';
        var target = root + 'search.html';
        if (value) {
          target += '?q=' + encodeURIComponent(value);
        }
        window.location.href = target;
      });
    });

    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
      var prev = carousel.querySelector('[data-hero-prev]');
      var next = carousel.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) return;
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }

      function restart() {
        if (timer) window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5500);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
          restart();
        });
      });
      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          restart();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          restart();
        });
      }
      show(0);
      restart();
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
      var container = panel.parentElement;
      var list = container ? container.querySelector('[data-filter-list]') : null;
      if (!list) return;
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
      var empty = document.createElement('div');
      empty.className = 'empty-filter';
      empty.textContent = '没有找到匹配的影片';
      list.parentNode.insertBefore(empty, list);

      function apply() {
        var keywordEl = panel.querySelector('[data-filter-keyword]');
        var categoryEl = panel.querySelector('[data-filter-category]');
        var typeEl = panel.querySelector('[data-filter-type]');
        var genreEl = panel.querySelector('[data-filter-genre]');
        var sortEl = panel.querySelector('[data-filter-sort]');
        var keyword = keywordEl ? keywordEl.value.trim().toLowerCase() : '';
        var category = categoryEl ? categoryEl.value : '';
        var type = typeEl ? typeEl.value : '';
        var genre = genreEl ? genreEl.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-genre')).toLowerCase();
          var ok = true;
          if (keyword && text.indexOf(keyword) === -1) ok = false;
          if (category && card.getAttribute('data-category') !== category) ok = false;
          if (type && card.getAttribute('data-type') !== type) ok = false;
          if (genre && (card.getAttribute('data-genre') || '').indexOf(genre) === -1) ok = false;
          card.style.display = ok ? '' : 'none';
          if (ok) visible += 1;
        });

        if (sortEl && sortEl.value !== 'default') {
          var visibleCards = cards.filter(function (card) { return card.style.display !== 'none'; });
          visibleCards.sort(function (a, b) {
            if (sortEl.value === 'year-desc') {
              return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
            }
            return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
          });
          visibleCards.forEach(function (card) { list.appendChild(card); });
        }

        empty.style.display = visible ? 'none' : 'block';
      }

      panel.querySelectorAll('input, select').forEach(function (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      });
    });
  });
})();
