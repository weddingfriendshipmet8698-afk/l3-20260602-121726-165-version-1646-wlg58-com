(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function attach(video) {
    if (video.dataset.ready === '1') return;
    var src = video.getAttribute('data-src');
    if (!src) return;
    video.dataset.ready = '1';
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      video._hls = hls;
    } else {
      video.src = src;
    }
  }

  ready(function () {
    document.querySelectorAll('.js-hls-player').forEach(function (video) {
      var shell = video.closest('.player-shell');
      var button = shell ? shell.querySelector('[data-player-start]') : null;
      var start = function () {
        attach(video);
        if (button) button.classList.add('is-hidden');
        var play = video.play();
        if (play && typeof play.catch === 'function') {
          play.catch(function () {
            if (button) button.classList.remove('is-hidden');
          });
        }
      };
      video.addEventListener('click', start);
      video.addEventListener('play', function () {
        if (button) button.classList.add('is-hidden');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0 && button) button.classList.remove('is-hidden');
      });
      if (button) button.addEventListener('click', start);
    });
  });
})();
