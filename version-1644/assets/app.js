(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var forms = document.querySelectorAll('[data-top-search]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var value = input ? input.value.trim() : '';
      if (value) {
        var prefix = form.getAttribute('data-prefix') || '';
        window.location.href = prefix + 'search.html?q=' + encodeURIComponent(value);
      }
    });
  });

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var show = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    };
    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5000);
  }

  var filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    var input = filterRoot.querySelector('[data-filter-input]');
    var category = filterRoot.querySelector('[data-filter-category]');
    var year = filterRoot.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-filter-card]'));
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (initial && input) {
      input.value = initial;
    }
    var apply = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var cat = category ? category.value : '';
      var yr = year ? year.value : '';
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-text') || '').toLowerCase();
        var cardCat = card.getAttribute('data-category') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matched = (!keyword || haystack.indexOf(keyword) !== -1) && (!cat || cardCat === cat) && (!yr || cardYear === yr);
        card.style.display = matched ? '' : 'none';
      });
    };
    [input, category, year].forEach(function (item) {
      if (item) {
        item.addEventListener('input', apply);
        item.addEventListener('change', apply);
      }
    });
    apply();
  }
})();
