// Designer canvas under the frosted glass: oversized design-tool objects
// (cursor, Bézier curve, selection frame, sticky notes, component, frame label,
// spacing redline) drift slowly behind the page. The whole layer shifts a little
// toward the mouse for a soft parallax.
(function () {
  var ru = (document.documentElement.lang || "").indexOf("ru") === 0;
  var C = { blue: "#0d99ff", purple: "#9747ff", coral: "#ff6a55", green: "#14ae5c", yellow: "#ffcd29", pink: "#ff8fd0", ink: "#1d1e21" };

  var objects = [
    // Selection frame with handles and a size badge.
    { x: 8, y: 10, w: 34, r: -4, d: 34, svg:
      '<svg viewBox="0 0 340 220"><rect x="10" y="10" width="320" height="180" fill="' + C.blue + '" fill-opacity=".08" stroke="' + C.blue + '" stroke-width="3"/>' +
      [[10,10],[330,10],[10,190],[330,190],[170,10],[170,190],[10,100],[330,100]].map(function (p) {
        return '<rect x="' + (p[0]-7) + '" y="' + (p[1]-7) + '" width="14" height="14" fill="#fff" stroke="' + C.blue + '" stroke-width="3"/>';
      }).join("") +
      '<rect x="122" y="202" width="96" height="18" rx="4" fill="' + C.blue + '"/><text x="170" y="215.5" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#fff">1440 × 900</text></svg>' },

    // Bézier curve with control handles.
    { x: 62, y: 8, w: 30, r: 6, d: 40, svg:
      '<svg viewBox="0 0 300 200"><path d="M20 160 C 90 20, 200 20, 280 140" fill="none" stroke="' + C.purple + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M20 160 L90 20 M280 140 L200 20" stroke="' + C.purple + '" stroke-width="2" stroke-dasharray="6 6"/>' +
      '<circle cx="90" cy="20" r="9" fill="#fff" stroke="' + C.purple + '" stroke-width="3"/><circle cx="200" cy="20" r="9" fill="#fff" stroke="' + C.purple + '" stroke-width="3"/>' +
      '<rect x="10" y="150" width="20" height="20" fill="' + C.purple + '"/><rect x="270" y="130" width="20" height="20" fill="' + C.purple + '"/></svg>' },

    // Big cursor with a name tag.
    { x: 70, y: 52, w: 16, r: -8, d: 28, svg:
      '<svg viewBox="0 0 160 150"><path d="M10 6 L10 96 L34 74 L52 116 L70 108 L52 66 L86 66 Z" fill="' + C.coral + '" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>' +
      '<rect x="62" y="102" width="92" height="34" rx="17" fill="' + C.coral + '"/><text x="108" y="125" text-anchor="middle" font-family="Inter,sans-serif" font-size="18" font-weight="600" fill="#fff">' + (ru ? "Анна" : "Anna") + '</text></svg>' },

    // Sticky notes.
    { x: 12, y: 58, w: 15, r: 7, d: 36, svg:
      '<svg viewBox="0 0 150 150"><rect x="6" y="6" width="138" height="138" rx="6" fill="' + C.yellow + '"/><path d="M28 48 H118 M28 74 H104 M28 100 H86" stroke="' + C.ink + '" stroke-opacity=".35" stroke-width="8" stroke-linecap="round"/></svg>' },
    { x: 28, y: 70, w: 12, r: -10, d: 44, svg:
      '<svg viewBox="0 0 150 150"><rect x="6" y="6" width="138" height="138" rx="6" fill="' + C.pink + '"/><path d="M28 52 H118 M28 80 H96" stroke="' + C.ink + '" stroke-opacity=".3" stroke-width="8" stroke-linecap="round"/></svg>' },

    // Component diamond.
    { x: 46, y: 40, w: 9, r: 0, d: 30, svg:
      '<svg viewBox="0 0 100 100"><g transform="rotate(45 50 50)" fill="' + C.purple + '"><rect x="20" y="20" width="26" height="26" rx="3"/><rect x="54" y="20" width="26" height="26" rx="3"/><rect x="20" y="54" width="26" height="26" rx="3"/><rect x="54" y="54" width="26" height="26" rx="3"/></g></svg>' },

    // Frame label + empty frame.
    { x: 40, y: 78, w: 24, r: 3, d: 38, svg:
      '<svg viewBox="0 0 240 170"><text x="2" y="16" font-family="Inter,sans-serif" font-size="15" font-weight="500" fill="' + C.ink + '" fill-opacity=".55"># Frame 1</text><rect x="2" y="26" width="236" height="142" rx="4" fill="#fff" stroke="' + C.ink + '" stroke-opacity=".18" stroke-width="2"/>' +
      '<rect x="20" y="44" width="120" height="14" rx="7" fill="' + C.ink + '" fill-opacity=".14"/><rect x="20" y="68" width="200" height="56" rx="8" fill="' + C.green + '" fill-opacity=".5"/><rect x="20" y="134" width="86" height="22" rx="11" fill="' + C.blue + '"/></svg>' },

    // Spacing redline.
    { x: 84, y: 26, w: 12, r: 90, d: 32, svg:
      '<svg viewBox="0 0 120 50"><path d="M6 10 V40 M114 10 V40 M6 25 H114" stroke="' + C.coral + '" stroke-width="3"/><rect x="40" y="2" width="40" height="18" rx="4" fill="' + C.coral + '"/><text x="60" y="15.5" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#fff">24</text></svg>' },

    // Pen-tool circle.
    { x: 2, y: 34, w: 10, r: 0, d: 42, svg:
      '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="' + C.green + '" fill-opacity=".85"/><circle cx="50" cy="12" r="6" fill="#fff" stroke="' + C.blue + '" stroke-width="3"/><circle cx="88" cy="50" r="6" fill="#fff" stroke="' + C.blue + '" stroke-width="3"/><circle cx="50" cy="88" r="6" fill="#fff" stroke="' + C.blue + '" stroke-width="3"/><circle cx="12" cy="50" r="6" fill="#fff" stroke="' + C.blue + '" stroke-width="3"/></svg>' }
  ];

  var layer = document.createElement("div");
  layer.className = "bg-canvas";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = objects.map(function (o, i) {
    return '<div class="bg-obj" style="left:' + o.x + '%;top:' + o.y + '%;--w:' + o.w + ';' +
      '--r:' + o.r + 'deg;--d:' + o.d + 's;--delay:-' + (i * 3.7).toFixed(1) + 's">' + o.svg + "</div>";
  }).join("");
  document.body.insertBefore(layer, document.body.firstChild);

  // Gentle parallax toward the cursor.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  var x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", function (e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 36;
    ty = (e.clientY / window.innerHeight - 0.5) * 28;
  }, { passive: true });
  (function frame() {
    x += (tx - x) * 0.05; y += (ty - y) * 0.05;
    layer.style.transform = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px)";
    requestAnimationFrame(frame);
  })();
})();
