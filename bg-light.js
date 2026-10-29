// Background light: the blue blob behind the frosted glass follows the cursor
// with a soft lag, like a torch behind frosted glass. With no mouse (touch
// devices) or after a few idle seconds it drifts around on its own.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var x = window.innerWidth * 0.3, y = window.innerHeight * 0.35;   // current
  var tx = x, ty = y;                                                // target
  var lastMove = -1e9, t0 = performance.now();
  var IDLE_MS = 3500;

  function size() {
    var vmax = Math.max(window.innerWidth, window.innerHeight);
    return { w: vmax * 0.5, h: vmax * 0.46 };
  }

  function apply() {
    var s = size();
    root.style.setProperty("--light-x", (x - s.w / 2).toFixed(1) + "px");
    root.style.setProperty("--light-y", (y - s.h / 2).toFixed(1) + "px");
  }

  if (reduce) {
    x = window.innerWidth / 2; y = window.innerHeight * 0.4; apply();
    window.addEventListener("resize", function () { x = window.innerWidth / 2; y = window.innerHeight * 0.4; apply(); });
    return;
  }

  if (finePointer) {
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY; lastMove = performance.now();
    }, { passive: true });
  }

  function frame(now) {
    var idle = now - lastMove > IDLE_MS;
    if (idle) {
      // Slow wandering path across the screen.
      var t = (now - t0) / 1000;
      var w = window.innerWidth, h = window.innerHeight;
      tx = w * (0.5 + 0.38 * Math.sin(t * 0.17) + 0.08 * Math.sin(t * 0.53));
      ty = h * (0.45 + 0.32 * Math.sin(t * 0.23 + 1.3) + 0.06 * Math.cos(t * 0.61));
    }
    var k = idle ? 0.02 : 0.075;   // follow the cursor with a soft lag
    x += (tx - x) * k;
    y += (ty - y) * k;
    apply();
    requestAnimationFrame(frame);
  }
  apply();
  requestAnimationFrame(frame);
})();
