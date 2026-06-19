(function() {
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.mobile-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function() {
      panel.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let current = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function playSlides() {
    if (slides.length < 2) {
      return;
    }
    window.clearInterval(timer);
    timer = window.setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      const index = Number(dot.getAttribute('data-slide') || 0);
      showSlide(index);
      playSlides();
    });
  });

  showSlide(0);
  playSlides();

  const filterInput = document.querySelector('.card-filter');
  const yearSelect = document.querySelector('.year-filter');

  function applyCardFilter() {
    const q = filterInput ? filterInput.value.trim().toLowerCase() : '';
    const year = yearSelect ? yearSelect.value : '';
    const cards = Array.from(document.querySelectorAll('.movie-card'));

    cards.forEach(function(card) {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const dataYear = card.getAttribute('data-year') || '';
      const genre = (card.getAttribute('data-genre') || '').toLowerCase();
      const region = (card.getAttribute('data-region') || '').toLowerCase();
      const haystack = title + ' ' + dataYear + ' ' + genre + ' ' + region;
      let yearOk = true;

      if (year === '1990') {
        const numericYear = Number((dataYear.match(/\d{4}/) || ['0'])[0]);
        yearOk = numericYear > 0 && numericYear < 1990;
      } else if (year) {
        yearOk = dataYear.indexOf(year) !== -1;
      }

      card.classList.toggle('hidden-card', !(haystack.indexOf(q) !== -1 && yearOk));
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyCardFilter);
  }
  if (yearSelect) {
    yearSelect.addEventListener('change', applyCardFilter);
  }

  const searchResults = document.getElementById('searchResults');
  const searchInput = document.getElementById('searchInput');

  if (searchResults && Array.isArray(window.SITE_MOVIES)) {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get('q') || '').trim();
    if (searchInput) {
      searchInput.value = q;
    }

    function renderSearch(value) {
      const keyword = value.trim().toLowerCase();
      const list = window.SITE_MOVIES.filter(function(item) {
        const haystack = [item.title, item.year, item.genre, item.region, item.type, item.tags].join(' ').toLowerCase();
        return !keyword || haystack.indexOf(keyword) !== -1;
      }).slice(0, 160);

      searchResults.innerHTML = list.map(function(item) {
        return '<article class="movie-card" data-title="' + item.title.replace(/"/g, '&quot;') + '" data-year="' + item.year + '" data-genre="' + item.genre.replace(/"/g, '&quot;') + '" data-region="' + item.region.replace(/"/g, '&quot;') + '">' +
          '<a class="poster-link" href="./' + item.url + '">' +
          '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy">' +
          '<span class="score">' + item.score + '</span>' +
          '</a>' +
          '<div class="movie-info">' +
          '<h3><a href="./' + item.url + '">' + item.title + '</a></h3>' +
          '<p class="meta-line">' + item.year + ' · ' + item.region + ' · ' + item.type + '</p>' +
          '<p class="one-line">' + item.oneLine + '</p>' +
          '<div class="tag-row"><span>' + item.genre + '</span></div>' +
          '</div>' +
          '</article>';
      }).join('');
    }

    renderSearch(q);

    if (searchInput) {
      searchInput.addEventListener('input', function() {
        renderSearch(searchInput.value);
      });
    }
  }
})();
