// Designer canvas under the frosted glass: small Figma-style UI pieces
// (selection with size badge, multiplayer cursors, comment pin, component set,
// prototype noodle, redlines, auto-layout, toolbar, layers, colour swatches,
// vector nodes) drift slowly behind the page. The layer shifts a little toward
// the mouse for a soft parallax.
(function () {
  var ru = (document.documentElement.lang || "").indexOf("ru") === 0;
  var F = "Inter,-apple-system,BlinkMacSystemFont,sans-serif";
  var C = { sel: "#0d99ff", comp: "#9747ff", red: "#f24822", green: "#14ae5c", yellow: "#ffcd29", pink: "#ff24bd", ink: "#1e1e1e", grey: "#b3b3b3" };

  function handles(pts, col) {
    return pts.map(function (p) {
      return '<rect x="' + (p[0] - 4) + '" y="' + (p[1] - 4) + '" width="8" height="8" fill="#fff" stroke="' + col + '" stroke-width="1.5"/>';
    }).join("");
  }
  function cursor(col, name, w) {
    return '<svg viewBox="0 0 ' + (w + 30) + ' 46"><path d="M2 2 L2 26 L8.5 20 L13 30 L17 28.2 L12.6 18.4 L21 18.4 Z" fill="' + col + '" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<rect x="16" y="24" width="' + w + '" height="20" rx="5" fill="' + col + '"/><text x="' + (16 + w / 2) + '" y="38" text-anchor="middle" font-family="' + F + '" font-size="11" font-weight="600" fill="#fff">' + name + "</text></svg>";
  }

  var objects = [
    // Selection with handles and the blue size badge.
    { x: 6, y: 12, w: 11.25, r: 0, d: 34, svg:
      '<svg viewBox="0 0 200 150"><rect x="10" y="10" width="180" height="110" fill="' + C.sel + '" fill-opacity=".06" stroke="' + C.sel + '" stroke-width="1.5"/>' +
      handles([[10, 10], [190, 10], [10, 120], [190, 120]], C.sel) +
      '<rect x="62" y="128" width="76" height="18" rx="3" fill="' + C.sel + '"/><text x="100" y="141" text-anchor="middle" font-family="' + F + '" font-size="11" font-weight="500" fill="#fff">1440 × 900</text></svg>' },

    // Multiplayer cursors.
    { x: 74, y: 58, w: 5.62, r: -4, d: 26, cursor: true, svg: cursor(C.pink, ru ? "Анна" : "Anna", 46) },
    { x: 20, y: 46, w: 5.62, r: 4, d: 30, cursor: true, svg: cursor(C.green, "Dev", 34) },
    { x: 58, y: 16, w: 5.62, r: -2, d: 36, cursor: true, svg: cursor("#ff8c00", "PM", 30) },

    // Comment pin.
    { x: 92, y: 50, w: 3.0, r: 0, d: 28, svg:
      '<svg viewBox="0 0 48 52"><path d="M24 2 C36 2 46 12 46 24 C46 36 36 46 24 46 L4 46 L4 24 C4 12 12 2 24 2 Z" fill="#fff" stroke="#e6e6e6" stroke-width="1.5"/>' +
      '<circle cx="25" cy="24" r="14" fill="' + C.comp + '"/><text x="25" y="29" text-anchor="middle" font-family="' + F + '" font-size="13" font-weight="700" fill="#fff">' + (ru ? "А" : "A") + "</text></svg>" },

    // Component set: purple dashed frame with two variants.
    { x: 34, y: 74, w: 10.5, r: 2, d: 40, svg:
      '<svg viewBox="0 0 190 120"><path d="M10 10 l6 -6 l6 6 l-6 6 z M24 10 l6 -6 l6 6 l-6 6 z" fill="' + C.comp + '" transform="translate(0 2)"/><text x="42" y="16" font-family="' + F + '" font-size="11" font-weight="500" fill="' + C.comp + '">Button</text>' +
      '<rect x="6" y="24" width="178" height="90" rx="6" fill="none" stroke="' + C.comp + '" stroke-width="1.5" stroke-dasharray="5 4"/>' +
      '<rect x="22" y="48" width="66" height="28" rx="8" fill="' + C.ink + '"/><text x="55" y="66" text-anchor="middle" font-family="' + F + '" font-size="11" font-weight="600" fill="#fff">Primary</text>' +
      '<rect x="102" y="48" width="66" height="28" rx="8" fill="#fff" stroke="' + C.ink + '" stroke-opacity=".2"/><text x="135" y="66" text-anchor="middle" font-family="' + F + '" font-size="11" font-weight="600" fill="' + C.ink + '">Ghost</text></svg>' },

    // Prototype noodle.
    { x: 60, y: 76, w: 9.0, r: 0, d: 32, svg:
      '<svg viewBox="0 0 160 80"><circle cx="10" cy="64" r="6" fill="#fff" stroke="' + C.sel + '" stroke-width="2"/><path d="M16 64 C70 64 70 16 140 16" fill="none" stroke="' + C.sel + '" stroke-width="2.5"/><path d="M134 9 L148 16 L134 23 Z" fill="' + C.sel + '"/></svg>' },

    // Redline spacing.
    { x: 82, y: 34, w: 5.25, r: 0, d: 30, svg:
      '<svg viewBox="0 0 90 40"><path d="M4 12 V34 M86 12 V34 M4 23 H86" stroke="' + C.red + '" stroke-width="1.5"/><rect x="32" y="2" width="26" height="15" rx="3" fill="' + C.red + '"/><text x="45" y="13" text-anchor="middle" font-family="' + F + '" font-size="10" font-weight="600" fill="#fff">24</text></svg>' },

    // Auto-layout tile with pink padding hint.
    { x: 8, y: 66, w: 7.5, r: -3, d: 38, svg:
      '<svg viewBox="0 0 130 90"><rect x="4" y="4" width="122" height="82" rx="8" fill="#fff" stroke="' + C.sel + '" stroke-width="1.5"/>' +
      '<rect x="4" y="4" width="122" height="12" fill="' + C.pink + '" fill-opacity=".14"/><rect x="18" y="26" width="94" height="14" rx="4" fill="' + C.ink + '" fill-opacity=".14"/><rect x="18" y="48" width="70" height="14" rx="4" fill="' + C.ink + '" fill-opacity=".09"/>' +
      '<path d="M65 16 V26" stroke="' + C.pink + '" stroke-width="1.5"/></svg>' },

    // Bottom toolbar.
    { x: 72, y: 90, w: 12.0, r: 0, d: 44, svg:
      '<svg viewBox="0 0 220 44"><rect x="2" y="2" width="216" height="40" rx="12" fill="#fff" stroke="#e6e6e6"/>' +
      '<rect x="10" y="8" width="28" height="28" rx="7" fill="' + C.sel + '"/><path d="M19 14 L19 30 L23 26 L26 32 L28.6 31 L25.8 25 L31 25 Z" fill="#fff"/>' +
      '<path d="M54 14 H72 M54 30 H72 M58 10 V34 M68 10 V34" stroke="' + C.ink + '" stroke-width="1.8"/>' +
      '<rect x="88" y="13" width="18" height="18" rx="2" fill="none" stroke="' + C.ink + '" stroke-width="1.8"/>' +
      '<path d="M124 31 L131 13 L138 31 M126.5 25 H135.5" fill="none" stroke="' + C.ink + '" stroke-width="1.8"/>' +
      '<path d="M156 32 L160 14 L170 24 Z" fill="none" stroke="' + C.ink + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M186 15 H204 M195 15 V31" stroke="' + C.ink + '" stroke-width="1.8"/></svg>' },

    // Layers panel snippet.
    { x: 2, y: 34, w: 7.5, r: 0, d: 42, svg:
      '<svg viewBox="0 0 130 92"><rect x="1" y="1" width="128" height="90" rx="8" fill="#fff" stroke="#e6e6e6"/>' +
      '<text x="12" y="20" font-family="' + F + '" font-size="10" font-weight="600" fill="' + C.ink + '">Layers</text>' +
      '<path d="M12 36 h8 v8 h-8 z" fill="none" stroke="' + C.ink + '" stroke-width="1.2"/><text x="26" y="43" font-family="' + F + '" font-size="10" fill="' + C.ink + '">Home</text>' +
      '<rect x="6" y="50" width="118" height="16" rx="3" fill="' + C.sel + '" fill-opacity=".14"/><path d="M22 54 l4 4 l-4 4 l-4 -4 z" fill="' + C.comp + '"/><text x="32" y="62" font-family="' + F + '" font-size="10" fill="' + C.ink + '">Button</text>' +
      '<text x="22" y="82" font-family="' + F + '" font-size="12" font-weight="700" fill="' + C.ink + '" fill-opacity=".6">T</text><text x="32" y="81" font-family="' + F + '" font-size="10" fill="' + C.ink + '">Title</text></svg>' },

    // Colour swatches.
    { x: 88, y: 76, w: 5.25, r: 4, d: 34, svg:
      '<svg viewBox="0 0 92 30">' + [C.sel, C.comp, C.pink, C.yellow, C.green].map(function (c, i) {
        return '<circle cx="' + (14 + i * 16) + '" cy="15" r="11" fill="' + c + '" stroke="#fff" stroke-width="2"/>';
      }).join("") + "</svg>" },

    // Vector path with nodes.
    { x: 70, y: 2, w: 6.75, r: 0, d: 40, svg:
      '<svg viewBox="0 0 120 80"><path d="M8 66 C30 10, 60 10, 70 40 S 104 70, 112 14" fill="none" stroke="' + C.sel + '" stroke-width="1.5"/>' +
      handles([[8, 66], [70, 40], [112, 14]], C.sel) + '<circle cx="45" cy="12" r="3" fill="' + C.sel + '"/><path d="M45 12 L70 40" stroke="' + C.sel + '" stroke-width="1" stroke-dasharray="3 3"/></svg>' }
  ];

  var layer = document.createElement("div");
  layer.className = "bg-canvas";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = objects.map(function (o, i) {
    return '<div class="bg-obj' + (o.cursor ? " bg-obj--cursor" : "") + '" style="left:' + o.x + '%;top:' + o.y + '%;--w:' + o.w + ';' +
      '--r:' + o.r + 'deg;--d:' + o.d + 's;--delay:-' + (i * 3.1).toFixed(1) + 's">' + o.svg + "</div>";
  }).join("");
  document.body.insertBefore(layer, document.body.firstChild);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Collaborator cursors wander on their own: pick a spot, glide there, pause, repeat.
  var cursors = Array.prototype.map.call(layer.querySelectorAll(".bg-obj--cursor"), function (el) {
    return { el: el, x: 0, y: 0, tx: 0, ty: 0, wait: Math.random() * 1500, speed: 0.012 + Math.random() * 0.01, phase: Math.random() * 6 };
  });
  function pick(c) {
    var w = window.innerWidth, h = window.innerHeight;
    var r = c.el.getBoundingClientRect();
    var baseX = r.left - c.x, baseY = r.top - c.y;            // where the cursor sits with no offset
    var nx = w * (0.04 + Math.random() * 0.88), ny = h * (0.06 + Math.random() * 0.82);
    c.tx = nx - baseX; c.ty = ny - baseY;
    c.speed = 0.01 + Math.random() * 0.014;
  }
  cursors.forEach(pick);

  // Gentle parallax of the whole layer toward the mouse.
  var px = 0, py = 0, ptx = 0, pty = 0;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    window.addEventListener("pointermove", function (e) {
      ptx = (e.clientX / window.innerWidth - 0.5) * 26;
      pty = (e.clientY / window.innerHeight - 0.5) * 20;
    }, { passive: true });
  }

  var last = performance.now();
  (function frame(now) {
    var dt = Math.min(64, now - last); last = now;
    cursors.forEach(function (c) {
      var dx = c.tx - c.x, dy = c.ty - c.y;
      if (Math.abs(dx) + Math.abs(dy) < 2) {
        c.wait -= dt;
        if (c.wait <= 0) { pick(c); c.wait = 600 + Math.random() * 2200; }
      } else {
        var k = 1 - Math.pow(1 - c.speed, dt / 16.7);
        c.x += dx * k; c.y += dy * k;
      }
      c.phase += dt / 900;
      var wob = Math.sin(c.phase) * 3;
      c.el.style.transform = "translate(" + c.x.toFixed(1) + "px," + (c.y + wob).toFixed(1) + "px) rotate(var(--r))";
    });
    px += (ptx - px) * 0.05; py += (pty - py) * 0.05;
    layer.style.transform = "translate(" + px.toFixed(2) + "px," + py.toFixed(2) + "px)";
    requestAnimationFrame(frame);
  })(last);
})();
