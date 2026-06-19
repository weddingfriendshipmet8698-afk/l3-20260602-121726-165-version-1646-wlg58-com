(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
  var current = 0;
  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });
  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var input = document.querySelector('[data-filter-input]');
  var select = document.querySelector('[data-type-filter]');
  var items = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-row'));
  function applyFilter() {
    var q = input ? input.value.trim().toLowerCase() : '';
    var type = select ? select.value.trim() : '';
    items.forEach(function (item) {
      var title = (item.getAttribute('data-title') || '').toLowerCase();
      var itemType = item.getAttribute('data-type') || '';
      var okText = !q || title.indexOf(q) !== -1;
      var okType = !type || itemType.indexOf(type) !== -1;
      item.classList.toggle('hidden-card', !(okText && okType));
    });
  }
  if (input) input.addEventListener('input', applyFilter);
  if (select) select.addEventListener('change', applyFilter);
})();
