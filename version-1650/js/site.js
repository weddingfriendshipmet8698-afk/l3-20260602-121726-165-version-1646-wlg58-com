function initNavigation() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-nav]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-site-search]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
      }
    });
  });
}

function initFilterPanel() {
  var panel = document.querySelector('[data-filter-panel]');
  var list = document.querySelector('[data-card-list]');
  if (!panel || !list) {
    return;
  }

  var keyword = panel.querySelector('[data-filter-keyword]');
  var year = panel.querySelector('[data-filter-year]');
  var region = panel.querySelector('[data-filter-region]');
  var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

  function applyFilters() {
    var query = keyword ? keyword.value.trim().toLowerCase() : '';
    var selectedYear = year ? year.value : '';
    var selectedRegion = region ? region.value : '';

    cards.forEach(function (card) {
      var text = [
        card.dataset.title || '',
        card.dataset.tags || '',
        card.dataset.region || '',
        card.dataset.type || '',
        card.dataset.year || ''
      ].join(' ').toLowerCase();
      var matchesKeyword = !query || text.indexOf(query) !== -1;
      var matchesYear = !selectedYear || card.dataset.year === selectedYear;
      var matchesRegion = !selectedRegion || card.dataset.region === selectedRegion;
      card.classList.toggle('is-filtered-out', !(matchesKeyword && matchesYear && matchesRegion));
    });
  }

  [keyword, year, region].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });
}

function createSearchCard(movie) {
  return [
    '<article class="movie-card card-grid">',
    '  <a href="' + movie.url + '">',
    '    <span class="card-image">',
    '      <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
    '      <span class="image-cover"></span>',
    '      <span class="mini-play">▶</span>',
    '    </span>',
    '    <span class="card-body">',
    '      <h3>' + escapeHtml(movie.title) + '</h3>',
    '      <p>' + escapeHtml(movie.oneLine) + '</p>',
    '      <span class="card-foot">',
    '        <span class="pill">' + escapeHtml(movie.category) + '</span>',
    '        <span class="heat">' + escapeHtml(movie.year) + '</span>',
    '      </span>',
    '    </span>',
    '  </a>',
    '</article>'
  ].join('');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initSearchPage() {
  var results = document.querySelector('[data-search-results]');
  if (!results || !window.MOVIES) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var input = document.querySelector('[data-search-page-input]');
  if (input) {
    input.value = query;
  }

  var normalized = query.toLowerCase();
  var matches = window.MOVIES.filter(function (movie) {
    if (!normalized) {
      return true;
    }
    return [
      movie.title,
      movie.category,
      movie.year,
      movie.region,
      movie.type,
      movie.genre,
      movie.tags,
      movie.oneLine
    ].join(' ').toLowerCase().indexOf(normalized) !== -1;
  }).slice(0, 160);

  if (!matches.length) {
    results.innerHTML = '<p class="empty-state">未找到相关剧集，换个关键词试试。</p>';
    return;
  }

  results.innerHTML = matches.map(createSearchCard).join('');
}

function initMoviePlayer(sourceUrl) {
  document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById('movie-player');
    var toggle = document.getElementById('player-toggle');
    if (!video || !sourceUrl) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }

    function togglePlay() {
      if (video.paused) {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      } else {
        video.pause();
      }
    }

    if (toggle) {
      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        togglePlay();
      });
    }

    video.addEventListener('click', function () {
      togglePlay();
    });

    video.addEventListener('play', function () {
      if (toggle) {
        toggle.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (toggle) {
        toggle.classList.remove('is-hidden');
      }
    });
  });
}

window.initMoviePlayer = initMoviePlayer;

document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initFilterPanel();
  initSearchPage();
});
