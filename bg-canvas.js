// Designer canvas under the frosted glass: small Figma-style UI pieces
// (selection with size badge, multiplayer cursors, comment pin, component set,
// prototype noodle, redlines, auto-layout, toolbar, layers, colour swatches,
// vector nodes, Motion / Weave / generative-plugin / shader panels) drift slowly behind the page. The layer shifts a little toward
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
  // Figma's multiplayer cursor: a tail-less, rounded arrowhead with a name tag.
  var ARROW = "M3.2 2.6 C2.3 2.2 1.6 3 2 3.9 L8.4 19.2 C8.8 20.1 10.1 20 10.3 19 L12.2 12.2 L19 10.3 C20 10.1 20.1 8.8 19.2 8.4 Z";
  function cursor(col, name, w) {
    return '<svg viewBox="0 0 ' + (w + 30) + ' 46"><path d="' + ARROW + '" fill="' + col + '" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<rect x="14" y="20" width="' + w + '" height="20" rx="6" fill="' + col + '"/><text x="' + (14 + w / 2) + '" y="34" text-anchor="middle" font-family="' + F + '" font-size="11" font-weight="600" fill="#fff">' + name + "</text></svg>";
  }

  // Small floating property panel, like Figma's plugin / shader / motion panels.
  function panel(title, icon, body, h) {
    return '<svg viewBox="0 0 180 ' + h + '"><rect x="1" y="1" width="178" height="' + (h - 2) + '" rx="10" fill="#fff" stroke="#e6e6e6"/>' +
      '<g transform="translate(12 12)">' + icon + '</g><text x="32" y="23" font-family="' + F + '" font-size="11" font-weight="600" fill="' + C.ink + '">' + title + '</text>' +
      '<path d="M158 15 l7 7 m0 -7 l-7 7" stroke="' + C.ink + '" stroke-width="1.3" stroke-linecap="round"/>' + body + "</svg>";
  }
  function row(y, label) {
    return '<text x="12" y="' + y + '" font-family="' + F + '" font-size="9.5" fill="#777">' + label + "</text>";
  }

  function sticky(col, text, author) {
    return '<svg viewBox="0 0 120 124"><rect x="4" y="6" width="112" height="112" rx="4" fill="#000" fill-opacity=".08"/><rect x="2" y="2" width="112" height="112" rx="4" fill="' + col + '"/>' +
      '<text x="14" y="40" font-family="' + F + '" font-size="20" font-weight="600" fill="#1e1e1e">' + text + '</text>' +
      '<text x="14" y="100" font-family="' + F + '" font-size="11" fill="#1e1e1e" fill-opacity=".55">' + author + "</text></svg>";
  }

  var objects = [
    // Selection with handles and the blue size badge.
    { x: 5, y: 14, w: 11.25, r: 0, d: 54, svg:
      '<svg viewBox="0 0 200 150"><rect x="10" y="10" width="180" height="110" fill="' + C.sel + '" fill-opacity=".06" stroke="' + C.sel + '" stroke-width="1.5"/>' +
      handles([[10, 10], [190, 10], [10, 120], [190, 120]], C.sel) +
      '<rect x="62" y="128" width="76" height="18" rx="3" fill="' + C.sel + '"/><text x="100" y="141" text-anchor="middle" font-family="' + F + '" font-size="11" font-weight="500" fill="#fff">1440 × 900</text></svg>' },

    // Multiplayer cursors.
    { x: 64.1, y: 56.8, w: 5.62, r: -4, d: 42, cursor: true, svg: cursor(C.pink, ru ? "Анна" : "Anna", 46) },
    { x: 30.7, y: 46.6, w: 5.62, r: 4, d: 48, cursor: true, svg: cursor(C.green, "Dev", 34) },
    { x: 54.2, y: 21.1, w: 5.62, r: -2, d: 58, cursor: true, svg: cursor("#ff8c00", "PM", 30) },

    // Comment pin.
    { x: 90, y: 27, w: 3.0, r: 0, d: 45, svg:
      '<svg viewBox="0 0 48 52"><path d="M24 2 C36 2 46 12 46 24 C46 36 36 46 24 46 L4 46 L4 24 C4 12 12 2 24 2 Z" fill="#fff" stroke="#e6e6e6" stroke-width="1.5"/>' +
      '<circle cx="25" cy="24" r="14" fill="' + C.comp + '"/><text x="25" y="29" text-anchor="middle" font-family="' + F + '" font-size="13" font-weight="700" fill="#fff">' + (ru ? "А" : "A") + "</text></svg>" },

    // Component set: purple dashed frame with two variants.
    { x: 21, y: 50, w: 10.5, r: 2, d: 64, svg:
      '<svg viewBox="0 0 190 120"><path d="M10 10 l6 -6 l6 6 l-6 6 z M24 10 l6 -6 l6 6 l-6 6 z" fill="' + C.comp + '" transform="translate(0 2)"/><text x="42" y="16" font-family="' + F + '" font-size="11" font-weight="500" fill="' + C.comp + '">Button</text>' +
      '<rect x="6" y="24" width="178" height="90" rx="6" fill="none" stroke="' + C.comp + '" stroke-width="1.5" stroke-dasharray="5 4"/>' +
      '<rect x="22" y="48" width="66" height="28" rx="8" fill="' + C.ink + '"/><text x="55" y="66" text-anchor="middle" font-family="' + F + '" font-size="11" font-weight="600" fill="#fff">Primary</text>' +
      '<rect x="102" y="48" width="66" height="28" rx="8" fill="#fff" stroke="' + C.ink + '" stroke-opacity=".2"/><text x="135" y="66" text-anchor="middle" font-family="' + F + '" font-size="11" font-weight="600" fill="' + C.ink + '">Ghost</text></svg>' },

    // Prototype noodle.
    { x: 77, y: 55, w: 9.0, r: 0, d: 51, svg:
      '<svg viewBox="0 0 160 80"><circle cx="10" cy="64" r="6" fill="#fff" stroke="' + C.sel + '" stroke-width="2"/><path d="M16 64 C70 64 70 16 140 16" fill="none" stroke="' + C.sel + '" stroke-width="2.5"/><path d="M134 9 L148 16 L134 23 Z" fill="' + C.sel + '"/></svg>' },

    // Redline spacing.
    { x: 81, y: 37, w: 5.25, r: 0, d: 48, svg:
      '<svg viewBox="0 0 90 40"><path d="M4 12 V34 M86 12 V34 M4 23 H86" stroke="' + C.red + '" stroke-width="1.5"/><rect x="32" y="2" width="26" height="15" rx="3" fill="' + C.red + '"/><text x="45" y="13" text-anchor="middle" font-family="' + F + '" font-size="10" font-weight="600" fill="#fff">24</text></svg>' },

    // Auto-layout tile with pink padding hint.
    { x: 6, y: 58, w: 7.5, r: -3, d: 61, svg:
      '<svg viewBox="0 0 130 90"><rect x="4" y="4" width="122" height="82" rx="8" fill="#fff" stroke="' + C.sel + '" stroke-width="1.5"/>' +
      '<rect x="4" y="4" width="122" height="12" fill="' + C.pink + '" fill-opacity=".14"/><rect x="18" y="26" width="94" height="14" rx="4" fill="' + C.ink + '" fill-opacity=".14"/><rect x="18" y="48" width="70" height="14" rx="4" fill="' + C.ink + '" fill-opacity=".09"/>' +
      '<path d="M65 16 V26" stroke="' + C.pink + '" stroke-width="1.5"/></svg>' },

    // Bottom toolbar.
    { x: 63, y: 15, w: 12.0, r: 0, d: 70, svg:
      '<svg viewBox="0 0 220 44"><rect x="2" y="2" width="216" height="40" rx="12" fill="#fff" stroke="#e6e6e6"/>' +
      '<rect x="10" y="8" width="28" height="28" rx="7" fill="' + C.sel + '"/><path d="M19 14 L19 30 L23 26 L26 32 L28.6 31 L25.8 25 L31 25 Z" fill="#fff"/>' +
      '<path d="M54 14 H72 M54 30 H72 M58 10 V34 M68 10 V34" stroke="' + C.ink + '" stroke-width="1.8"/>' +
      '<rect x="88" y="13" width="18" height="18" rx="2" fill="none" stroke="' + C.ink + '" stroke-width="1.8"/>' +
      '<path d="M124 31 L131 13 L138 31 M126.5 25 H135.5" fill="none" stroke="' + C.ink + '" stroke-width="1.8"/>' +
      '<path d="M156 32 L160 14 L170 24 Z" fill="none" stroke="' + C.ink + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M186 15 H204 M195 15 V31" stroke="' + C.ink + '" stroke-width="1.8"/></svg>' },

    // Layers panel snippet.
    { x: 8, y: 38, w: 7.5, r: 0, d: 67, svg:
      '<svg viewBox="0 0 130 92"><rect x="1" y="1" width="128" height="90" rx="8" fill="#fff" stroke="#e6e6e6"/>' +
      '<text x="12" y="20" font-family="' + F + '" font-size="10" font-weight="600" fill="' + C.ink + '">Layers</text>' +
      '<path d="M12 36 h8 v8 h-8 z" fill="none" stroke="' + C.ink + '" stroke-width="1.2"/><text x="26" y="43" font-family="' + F + '" font-size="10" fill="' + C.ink + '">Home</text>' +
      '<rect x="6" y="50" width="118" height="16" rx="3" fill="' + C.sel + '" fill-opacity=".14"/><path d="M22 54 l4 4 l-4 4 l-4 -4 z" fill="' + C.comp + '"/><text x="32" y="62" font-family="' + F + '" font-size="10" fill="' + C.ink + '">Button</text>' +
      '<text x="22" y="82" font-family="' + F + '" font-size="12" font-weight="700" fill="' + C.ink + '" fill-opacity=".6">T</text><text x="32" y="81" font-family="' + F + '" font-size="10" fill="' + C.ink + '">Title</text></svg>' },

    // Colour swatches.
    { x: 71, y: 46, w: 5.25, r: 4, d: 54, svg:
      '<svg viewBox="0 0 92 30">' + [C.sel, C.comp, C.pink, C.yellow, C.green].map(function (c, i) {
        return '<circle cx="' + (14 + i * 16) + '" cy="15" r="11" fill="' + c + '" stroke="#fff" stroke-width="2"/>';
      }).join("") + "</svg>" },

    // Vector path with nodes.
    { x: 79, y: 19, w: 6.75, r: 0, d: 64, svg:
      '<svg viewBox="0 0 120 80"><path d="M8 66 C30 10, 60 10, 70 40 S 104 70, 112 14" fill="none" stroke="' + C.sel + '" stroke-width="1.5"/>' +
      handles([[8, 66], [70, 40], [112, 14]], C.sel) + '<circle cx="45" cy="12" r="3" fill="' + C.sel + '"/><path d="M45 12 L70 40" stroke="' + C.sel + '" stroke-width="1" stroke-dasharray="3 3"/></svg>' },
    // ---- Figma Motion: custom bezier panel + timeline ----
    { x: 87, y: 43, w: 8.5, r: 0, d: 66, svg:
      panel("Custom Bezier", '<path d="M0 12 C6 12 6 2 12 2" fill="none" stroke="' + C.ink + '" stroke-width="1.4"/>',
        '<rect x="12" y="36" width="156" height="20" rx="6" fill="#f5f5f5"/><rect x="14" y="38" width="76" height="16" rx="5" fill="#fff" stroke="#e6e6e6"/>' +
        '<text x="52" y="49.5" text-anchor="middle" font-family="' + F + '" font-size="9" fill="' + C.ink + '">Curve</text><text x="129" y="49.5" text-anchor="middle" font-family="' + F + '" font-size="9" fill="#999">Spring</text>' +
        '<rect x="12" y="64" width="156" height="84" rx="6" fill="#f5f5f5"/>' +
        '<path d="M28 136 C76 136 112 76 152 76" fill="none" stroke="' + C.ink + '" stroke-width="2"/>' +
        '<path d="M28 136 L72 128 M152 76 L108 84" stroke="' + C.sel + '" stroke-width="1"/><circle cx="72" cy="128" r="4" fill="#fff" stroke="' + C.sel + '" stroke-width="1.5"/><circle cx="108" cy="84" r="4" fill="#fff" stroke="' + C.sel + '" stroke-width="1.5"/>' +
        '<text x="12" y="166" font-family="' + F + '" font-size="9" fill="#777">0.4, 0.0, 0.6, 1.0</text>' +
        '<path d="M12 182 H168" stroke="#e6e6e6"/><rect x="12" y="190" width="156" height="8" rx="4" fill="' + C.sel + '"/>' +
        '<path d="M40 186 v16" stroke="' + C.sel + '" stroke-width="2"/><path d="M36 182 h8 l-4 5 z" fill="' + C.sel + '"/>' +
        '<path d="M60 210 l4 -4 l4 4 l-4 4 z M120 210 l4 -4 l4 4 l-4 4 z M160 210 l4 -4 l4 4 l-4 4 z" fill="#fff" stroke="#999"/>', 222) },

    // ---- Figma Weave tools: "Change lighting" workflow ----
    { x: 69, y: 24, w: 7, r: 0, d: 72, svg:
      panel("Change lighting", '<rect width="14" height="12" rx="2" fill="' + C.ink + '"/><text x="7" y="9.5" text-anchor="middle" font-family="' + F + '" font-size="8" font-weight="800" fill="#fff">W</text>',
        row(46, "Image input") +
        '<defs><linearGradient id="dune" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9d2b0"/><stop offset=".55" stop-color="#c79b6b"/><stop offset="1" stop-color="#8f6740"/></linearGradient></defs>' +
        '<rect x="12" y="54" width="156" height="104" rx="6" fill="url(#dune)"/><path d="M12 120 C60 96 110 140 168 104 V152 a6 6 0 0 1 -6 6 H18 a6 6 0 0 1 -6 -6 Z" fill="#b5875a" opacity=".6"/>' +
        row(176, "Light style") + '<rect x="12" y="184" width="156" height="22" rx="5" fill="#fff" stroke="#e6e6e6"/><text x="20" y="198.5" font-family="' + F + '" font-size="9.5" fill="' + C.ink + '">Moonlight</text><path d="M154 193 l4 4 l4 -4" fill="none" stroke="#777" stroke-width="1.2"/>' +
        '<rect x="112" y="218" width="56" height="20" rx="5" fill="' + C.sel + '"/><text x="140" y="231.5" text-anchor="middle" font-family="' + F + '" font-size="9.5" font-weight="600" fill="#fff">Generate</text>', 248) },

    // ---- Generative plugins: "Map maker" ----
    { x: 4, y: 24, w: 8, r: 0, d: 68, svg:
      panel("Map maker", '<path d="M2 11 L5 3 L8 8 L11 2 L13 11 Z" fill="none" stroke="' + C.ink + '" stroke-width="1.2" stroke-linejoin="round"/>',
        row(52, "Style") + '<rect x="72" y="40" width="96" height="18" rx="5" fill="#f5f5f5"/><rect x="120" y="42" width="46" height="14" rx="4" fill="#fff" stroke="#e6e6e6"/><text x="96" y="52.5" text-anchor="middle" font-family="' + F + '" font-size="9" fill="#999">Light</text><text x="143" y="52.5" text-anchor="middle" font-family="' + F + '" font-size="9" fill="' + C.ink + '">Dark</text>' +
        row(78, "Interaction") + '<rect x="72" y="66" width="96" height="18" rx="5" fill="#f5f5f5"/><rect x="74" y="68" width="46" height="14" rx="4" fill="#fff" stroke="#e6e6e6"/><text x="97" y="78.5" text-anchor="middle" font-family="' + F + '" font-size="9" fill="' + C.ink + '">On</text><text x="143" y="78.5" text-anchor="middle" font-family="' + F + '" font-size="9" fill="#999">Off</text>' +
        row(104, "Pins") + '<rect x="72" y="92" width="96" height="18" rx="5" fill="#f5f5f5"/><text x="80" y="104.5" font-family="' + F + '" font-size="9" fill="' + C.ink + '">7</text>' +
        row(130, "Colors") + ['#a8d5d8', '#e9e6df', '#ffffff', '#a6c98a', '#3f6b2a'].map(function (c, i) { return '<rect x="' + (72 + i * 19.2) + '" y="118" width="19.2" height="18" fill="' + c + '" stroke="#e6e6e6" stroke-width=".5"/>'; }).join("") +
        '<rect x="104" y="148" width="64" height="20" rx="5" fill="' + C.sel + '"/><text x="136" y="161.5" text-anchor="middle" font-family="' + F + '" font-size="9.5" font-weight="600" fill="#fff">Create map</text>', 178) },

    // ---- Shaders: "Gradient map" ----
    { x: 23, y: 33, w: 7.5, r: 0, d: 62, svg:
      panel("Gradient map", '<path d="M1 10 C4 4 8 12 13 4" fill="none" stroke="' + C.ink + '" stroke-width="1.4"/>',
        '<defs><linearGradient id="gmap"><stop offset="0" stop-color="#2d5bff"/><stop offset=".35" stop-color="#3fd1a0"/><stop offset=".65" stop-color="#ffd84d"/><stop offset="1" stop-color="#ff4d3d"/></linearGradient></defs>' +
        row(52, "Colors") + '<rect x="72" y="42" width="96" height="14" rx="4" fill="url(#gmap)"/>' +
        row(78, "Blend") + '<rect x="72" y="70" width="70" height="6" rx="3" fill="#e6e6e6"/><rect x="72" y="70" width="34" height="6" rx="3" fill="' + C.sel + '"/><circle cx="106" cy="73" r="5" fill="#fff" stroke="#ccc"/><text x="160" y="77" text-anchor="middle" font-family="' + F + '" font-size="9" fill="' + C.ink + '">3</text>' +
        row(102, "Clip to layer"), 114) },

    // ---- FigJam ----
    // Sticky notes with author names.
    { x: -2, y: 94, w: 5.2, r: -6, d: 62, svg: sticky("#ffd966", ru ? "Идея!" : "Idea!", ru ? "Анна" : "Anna") },
    { x: 97, y: -3, w: 4.8, r: 5, d: 70, extra: true, svg: sticky("#85e0a3", ru ? "Тест" : "Test", "Dev") },
    { x: -3, y: -4, w: 4.8, r: 7, d: 66, extra: true, svg: sticky("#ffbdf2", ru ? "UX?" : "UX?", "PM") },
    { x: 95, y: 93, w: 4.6, r: -4, d: 74, extra: true, svg: sticky("#80caff", ru ? "Флоу" : "Flow", ru ? "Анна" : "Anna") },

    // Stamps.
    { x: 98, y: 30, w: 2.6, r: -12, d: 56, svg:
      '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="#ff7262" stroke="#fff" stroke-width="3"/><text x="30" y="37" text-anchor="middle" font-family="' + F + '" font-size="20" font-weight="800" fill="#fff">+1</text></svg>' },
    { x: -1, y: 47, w: 2.6, r: 10, d: 60, extra: true, svg:
      '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="#9747ff" stroke="#fff" stroke-width="3"/><path d="M30 42 C18 34 16 28 18 23 C20 18 27 17 30 23 C33 17 40 18 42 23 C44 28 42 34 30 42 Z" fill="#fff"/></svg>' },

    // Reaction bubble.
    { x: 97, y: 58, w: 3.6, r: 0, d: 58, extra: true, svg:
      '<svg viewBox="0 0 84 44"><rect x="2" y="2" width="80" height="34" rx="17" fill="#fff" stroke="#e6e6e6"/><path d="M18 34 L14 42 L26 35" fill="#fff" stroke="#e6e6e6"/><text x="42" y="26" text-anchor="middle" font-size="18">👍 🔥 💡</text></svg>' },

    // Washi tape.
    { x: 30, y: 97, w: 5, r: -14, d: 72, extra: true, svg:
      '<svg viewBox="0 0 120 30"><path d="M4 4 L116 4 L112 10 L116 16 L112 22 L116 26 L4 26 L8 20 L4 14 L8 8 Z" fill="#ffaf6e" fill-opacity=".75"/><path d="M20 4 L12 26 M44 4 L36 26 M68 4 L60 26 M92 4 L84 26" stroke="#fff" stroke-opacity=".5" stroke-width="5"/></svg>' },

    // Elbow connector between two shapes.
    { x: 60, y: -5, w: 7, r: 0, d: 64, extra: true, svg:
      '<svg viewBox="0 0 150 80"><rect x="4" y="44" width="40" height="30" rx="6" fill="#d9b8ff"/><path d="M106 8 L130 30 L106 52 L82 30 Z" fill="#80caff"/>' +
      '<path d="M44 59 H64 V30 H76" fill="none" stroke="#1e1e1e" stroke-width="2"/><path d="M74 25 L82 30 L74 35 Z" fill="#1e1e1e"/></svg>' },

    // Marker scribble.
    { x: 45, y: -4, w: 5, r: 0, d: 68, svg:
      '<svg viewBox="0 0 120 50"><path d="M6 36 C18 8 30 44 42 22 S 64 6 74 30 S 98 44 114 12" fill="none" stroke="#14ae5c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/></svg>' },

    // Section label.
    { x: 22, y: -3, w: 4, r: 0, d: 76, extra: true, svg:
      '<svg viewBox="0 0 96 28"><rect x="2" y="2" width="92" height="24" rx="6" fill="#ffc943"/><text x="48" y="19" text-anchor="middle" font-family="' + F + '" font-size="12" font-weight="700" fill="#1e1e1e">' + (ru ? "Идеи" : "Ideas") + '</text></svg>' },

    // Timer widget.
    { x: 68, y: 97, w: 4.2, r: 0, d: 80, extra: true, svg:
      '<svg viewBox="0 0 100 40"><rect x="2" y="2" width="96" height="36" rx="10" fill="#1e1e1e"/><circle cx="20" cy="20" r="8" fill="none" stroke="#ffc943" stroke-width="2.5"/><path d="M20 15 V20 L24 22" stroke="#ffc943" stroke-width="2" stroke-linecap="round"/><text x="62" y="26" text-anchor="middle" font-family="' + F + '" font-size="15" font-weight="700" fill="#fff">04:59</text></svg>' }
  ];

  var layer = document.createElement("div");
  layer.className = "bg-canvas";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = objects.map(function (o, i) {
    return '<div class="bg-obj' + (o.cursor ? " bg-obj--cursor" : "") + (o.extra ? " bg-obj--extra" : "") + '" style="left:' + o.x + '%;top:' + o.y + '%;--w:' + o.w + ';' +
      '--r:' + o.r + 'deg;--d:' + o.d + 's;--delay:-' + (i * 3.1).toFixed(1) + 's">' + o.svg + "</div>";
  }).join("");
  document.body.insertBefore(layer, document.body.firstChild);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Collaborator cursors wander on their own: pick a spot, glide there, pause, repeat.
  var cursors = Array.prototype.map.call(layer.querySelectorAll(".bg-obj--cursor"), function (el) {
    return { el: el, x: 0, y: 0, tx: 0, ty: 0, wait: Math.random() * 1500, speed: 0.005 + Math.random() * 0.004, phase: Math.random() * 6 };
  });
  function pick(c) {
    var w = window.innerWidth, h = window.innerHeight;
    var r = c.el.getBoundingClientRect();
    var baseX = r.left - c.x, baseY = r.top - c.y;            // where the cursor sits with no offset
    var nx = w * (0.18 + Math.random() * 0.64), ny = h * (0.12 + Math.random() * 0.72);
    c.tx = nx - baseX; c.ty = ny - baseY;
    c.speed = 0.0045 + Math.random() * 0.005;
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
        if (c.wait <= 0) { pick(c); c.wait = 1500 + Math.random() * 3000; }
      } else {
        var k = 1 - Math.pow(1 - c.speed, dt / 16.7);
        c.x += dx * k; c.y += dy * k;
      }
      c.phase += dt / 1500;
      var wob = Math.sin(c.phase) * 3;
      c.el.style.transform = "translate(" + c.x.toFixed(1) + "px," + (c.y + wob).toFixed(1) + "px) rotate(var(--r))";
    });
    px += (ptx - px) * 0.05; py += (pty - py) * 0.05;
    layer.style.transform = "translate(" + px.toFixed(2) + "px," + py.toFixed(2) + "px)";
    requestAnimationFrame(frame);
  })(last);
})();
