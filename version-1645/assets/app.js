(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMobileMenu() {
    var toggle = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function setupHero() {
    var carousel = document.querySelector(".hero-carousel");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(
      carousel.querySelectorAll(".hero-slide"),
    );
    var dots = Array.prototype.slice.call(
      carousel.querySelectorAll(".hero-dot"),
    );
    var prev = carousel.querySelector(".hero-prev");
    var next = carousel.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .trim();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(
      document.querySelectorAll(".filter-panel"),
    );
    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var cards = Array.prototype.slice.call(
        scope.querySelectorAll(".searchable-card"),
      );
      var keyword = panel.querySelector(".filter-keyword");
      var year = panel.querySelector(".filter-year");
      var type = panel.querySelector(".filter-type");
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      if (keyword && query) {
        keyword.value = query;
      }

      function apply() {
        var key = normalize(keyword && keyword.value);
        var selectedYear = normalize(year && year.value);
        var selectedType = normalize(type && type.value);
        cards.forEach(function (card) {
          var text = normalize(
            card.textContent +
              " " +
              card.dataset.title +
              " " +
              card.dataset.region +
              " " +
              card.dataset.genre +
              " " +
              card.dataset.category,
          );
          var matchKeyword = !key || text.indexOf(key) !== -1;
          var matchYear =
            !selectedYear || normalize(card.dataset.year) === selectedYear;
          var matchType =
            !selectedType || normalize(card.dataset.type) === selectedType;
          card.hidden = !(matchKeyword && matchYear && matchType);
        });
      }

      [keyword, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  function setupMoviePlayer(streamUrl) {
    var video = document.querySelector(".movie-video");
    var overlay = document.querySelector(".player-overlay");
    var detailButton = document.querySelector("[data-play-trigger]");
    var initialized = false;
    var hls = null;

    if (!video || !streamUrl) {
      return;
    }

    function attach() {
      if (initialized) {
        return;
      }
      initialized = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      video.addEventListener("error", function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      });
    }

    function play(event) {
      if (event) {
        event.preventDefault();
      }
      attach();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var request = video.play();
      if (request && typeof request.catch === "function") {
        request.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }
    if (detailButton) {
      detailButton.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
  });

  window.setupMoviePlayer = setupMoviePlayer;
})();
