(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  function card(movie, root) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="card-tag">' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<a class="movie-card group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300" href="' + root + 'movie/' + movie.id + '.html">' +
      '<div class="relative overflow-hidden aspect-[3/4]">' +
      '<img src="' + root + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">' +
      '<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"><div class="absolute inset-0 flex items-center justify-center"><span class="play-badge bg-teal-600 rounded-full">▶</span></div></div>' +
      '<span class="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded text-xs font-medium">' + escapeHtml(movie.typeBucket) + '</span>' +
      '<span class="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">' + escapeHtml(movie.category) + '</span>' +
      '<div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent"><span class="text-white text-xs">' + escapeHtml(movie.year) + ' · ' + escapeHtml((movie.genre || '').split('/')[0]) + '</span></div>' +
      '</div>' +
      '<div class="p-4"><h3 class="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">' + escapeHtml(movie.title) + '</h3><p class="text-sm text-gray-600 line-clamp-2 leading-relaxed">' + escapeHtml(movie.oneLine) + '</p><div class="card-tags">' + tags + '</div></div>' +
      '</a>';
  }

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"]/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch];
    });
  }

  ready(function () {
    var root = document.currentScript ? (document.currentScript.getAttribute('data-root') || './') : './';
    var input = document.querySelector('[data-search-input]');
    var form = document.querySelector('[data-search-form]');
    var results = document.querySelector('[data-search-results]');
    var title = document.querySelector('[data-search-title]');
    var current = getQuery();
    if (input) input.value = current;

    function render(items, query) {
      if (!results) return;
      if (title) title.textContent = query ? '搜索结果：' + query : '影片搜索';
      results.innerHTML = items.map(function (movie) { return card(movie, root); }).join('');
      if (!items.length) {
        results.innerHTML = '<div class="content-panel"><h2>暂无匹配影片</h2><p>可以尝试输入片名、地区、类型或标签。</p></div>';
      }
    }

    fetch(root + 'data/movies.json').then(function (res) { return res.json(); }).then(function (movies) {
      function doSearch(query) {
        var q = (query || '').trim().toLowerCase();
        if (!q) {
          render(movies.slice(0, 24), '');
          return;
        }
        var items = movies.filter(function (movie) {
          var haystack = [movie.title, movie.region, movie.category, movie.type, movie.typeBucket, movie.year, movie.genre, movie.oneLine, (movie.tags || []).join(' ')].join(' ').toLowerCase();
          return haystack.indexOf(q) !== -1;
        }).slice(0, 120);
        render(items, query);
      }
      doSearch(current);
      if (form) {
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          var value = input ? input.value.trim() : '';
          var next = root + 'search.html';
          if (value) next += '?q=' + encodeURIComponent(value);
          window.history.pushState({}, '', next.replace(root, './'));
          doSearch(value);
        });
      }
    });
  });
})();
