(function () {
    function each(selector, fn) {
        Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
    }

    var navToggle = document.querySelector('[data-nav-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length > 1) {
        var active = 0;
        var setSlide = function (index) {
            active = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                setSlide(i);
            });
        });
        window.setInterval(function () {
            setSlide((active + 1) % slides.length);
        }, 5600);
    }

    each('img', function (img) {
        img.addEventListener('error', function () {
            img.classList.add('is-missing');
        });
    });

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
    var filterSelects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
    var filterItems = Array.prototype.slice.call(document.querySelectorAll('.filter-item'));
    function runFilter() {
        if (!filterItems.length) {
            return;
        }
        var terms = filterInputs.map(function (input) {
            return input.value.trim().toLowerCase();
        }).filter(Boolean);
        var selected = filterSelects.map(function (select) {
            return select.value;
        }).filter(Boolean);
        filterItems.forEach(function (item) {
            var text = item.textContent.toLowerCase();
            var okTerms = terms.every(function (term) {
                return text.indexOf(term) !== -1;
            });
            var okSelected = selected.every(function (value) {
                return value === 'all' || text.indexOf(value.toLowerCase()) !== -1;
            });
            item.style.display = okTerms && okSelected ? '' : 'none';
        });
    }
    filterInputs.forEach(function (input) {
        input.addEventListener('input', runFilter);
    });
    filterSelects.forEach(function (select) {
        select.addEventListener('change', runFilter);
    });

    window.initMoviePlayer = function (videoId, source, layerId) {
        var video = document.getElementById(videoId);
        var layer = document.getElementById(layerId);
        if (!video || !source) {
            return;
        }
        var loaded = false;
        var hls = null;
        function load() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }
        function play() {
            load();
            if (layer) {
                layer.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }
        if (layer) {
            layer.addEventListener('click', play);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            if (layer) {
                layer.classList.add('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
