// Two pixel effects shared by every page:
// 1. A trail of multicoloured pixels that light up under the cursor and fade out.
// 2. The profile photo shows as shimmering pixels and turns back into the photo on hover.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  function isDark() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  // ---------- 1. Cursor pixel trail ----------
  function initTrail() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    var CELL = 14;
    var LIFE = 700; // ms a pixel takes to fade out
    var canvas = document.createElement("canvas");
    canvas.className = "pixel-trail";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var dpr = 1;
    var cells = new Map(); // "col,row" -> { born, hue }
    var running = false;
    var baseHue = Math.random() * 360;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(window.innerWidth * dpr);
      canvas.height = Math.ceil(window.innerHeight * dpr);
    }

    function light(x, y) {
      var now = performance.now();
      var col = Math.floor(x / CELL);
      var row = Math.floor(y / CELL);
      // The hue slowly travels around the colour wheel as the cursor moves.
      baseHue = (baseHue + 2.5) % 360;
      cells.set(col + "," + row, { born: now, hue: baseHue });
      for (var i = 0; i < 2; i++) {
        var dc = Math.round((Math.random() - 0.5) * 4);
        var dr = Math.round((Math.random() - 0.5) * 4);
        cells.set(col + dc + "," + (row + dr), {
          born: now - Math.random() * 250,
          hue: (baseHue + (Math.random() - 0.5) * 90 + 360) % 360
        });
      }
      if (!running) {
        running = true;
        requestAnimationFrame(draw);
      }
    }

    function draw() {
      var now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dark = isDark();
      var maxAlpha = dark ? 0.6 : 0.5;
      var light = dark ? 62 : 60;
      var size = CELL * dpr;
      cells.forEach(function (c, key) {
        var age = now - c.born;
        if (age >= LIFE) {
          cells.delete(key);
          return;
        }
        var parts = key.split(",");
        var a = maxAlpha * (1 - age / LIFE);
        ctx.fillStyle = "hsla(" + c.hue.toFixed(0) + ", 90%, " + light + "%, " + a.toFixed(3) + ")";
        ctx.fillRect(parts[0] * size, parts[1] * size, size - dpr, size - dpr);
      });
      if (cells.size) {
        requestAnimationFrame(draw);
      } else {
        running = false;
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", function (e) {
      light(e.clientX, e.clientY);
    }, { passive: true });
  }

  // ---------- 2. Shimmering pixel photo ----------
  function initPhoto() {
    var img = document.querySelector(".intro-photo");
    if (!img) return;

    var PX = 9; // size of one photo pixel, in CSS pixels
    var canvas = document.createElement("canvas");
    canvas.className = "pixel-photo";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var grid = null; // sampled colours: { cols, rows, data }
    var active = false;
    var frame = 0;

    function place() {
      var r = img.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.left = r.left + window.scrollX + "px";
      canvas.style.top = r.top + window.scrollY + "px";
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      canvas.style.borderRadius = getComputedStyle(img).borderRadius;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      var cols = Math.max(1, Math.round(r.width / PX));
      var rows = Math.max(1, Math.round(r.height / PX));
      var small = document.createElement("canvas");
      small.width = cols;
      small.height = rows;
      var sctx = small.getContext("2d");
      try {
        sctx.drawImage(img, 0, 0, cols, rows);
        grid = { cols: cols, rows: rows, data: sctx.getImageData(0, 0, cols, rows).data };
      } catch (e) {
        grid = null; // image from another origin: skip the effect
      }
    }

    function draw(t) {
      if (!grid) return;
      var cw = canvas.width / grid.cols;
      var ch = canvas.height / grid.rows;
      var time = t / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var y = 0; y < grid.rows; y++) {
        for (var x = 0; x < grid.cols; x++) {
          var i = (y * grid.cols + x) * 4;
          // A diagonal rainbow wave travels across the pixels, each pixel flickers a little.
          var wave = Math.sin(time * 2.2 + (x + y) * 0.35);
          var flicker = 0.92 + 0.08 * Math.sin(time * 7 + x * 1.7 + y * 2.3);
          var hue = (time * 60 + (x + y) * 9) % 360;
          var mix = 0.18 + 0.12 * wave;
          var tint = hslToRgb(hue / 360, 0.9, 0.62);
          var r = (grid.data[i] * (1 - mix) + tint[0] * mix) * flicker;
          var g = (grid.data[i + 1] * (1 - mix) + tint[1] * mix) * flicker;
          var b = (grid.data[i + 2] * (1 - mix) + tint[2] * mix) * flicker;
          ctx.fillStyle = "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
          ctx.fillRect(Math.floor(x * cw), Math.floor(y * ch), Math.ceil(cw), Math.ceil(ch));
        }
      }
    }

    function loop(t) {
      draw(t);
      if (active || canvas.classList.contains("is-on")) {
        frame = requestAnimationFrame(loop);
      } else {
        frame = 0;
      }
    }

    function start() {
      if (!grid) place();
      if (!grid) return;
      active = true;
      canvas.classList.add("is-on");
      if (!frame) frame = requestAnimationFrame(loop);
    }

    function stop() {
      active = false;
      canvas.classList.remove("is-on");
      // Keep drawing while the fade-out runs, then stop.
      setTimeout(function () {
        if (!active && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      }, 300);
    }

    function ready() {
      place();
      // Pixels by default; hovering reveals the real photo.
      start();
      img.addEventListener("pointerenter", stop);
      img.addEventListener("pointerleave", start);
      // On phones there is no hover: a tap toggles between pixels and the photo.
      img.addEventListener("click", function () {
        if (active) stop(); else start();
      });
      window.addEventListener("resize", place);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
      // Don't animate while the photo is scrolled out of view.
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          var visible = entries[0].isIntersecting;
          if (!visible && frame) {
            cancelAnimationFrame(frame);
            frame = 0;
          } else if (visible && active && !frame) {
            frame = requestAnimationFrame(loop);
          }
        }).observe(img);
      }
    }

    if (img.complete && img.naturalWidth) ready();
    else img.addEventListener("load", ready, { once: true });
  }

  function hslToRgb(h, s, l) {
    function f(n) {
      var k = (n + h * 12) % 12;
      var a = s * Math.min(l, 1 - l);
      return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
    }
    return [f(0), f(8), f(4)];
  }

  function init() {
    initTrail();
    initPhoto();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
