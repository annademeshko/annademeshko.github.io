// Keep the reading position when navigating between translated portfolio pages.
(() => {
  const storageKey = "portfolio-language-position";
  const pagePath = (url) => new URL(url, location.href).pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");
  const mediaKey = (node) => {
    const src = node.getAttribute("src") || node.getAttribute("poster") || node.querySelector("source")?.getAttribute("src");
    if (!src || src.startsWith("data:")) return null;
    return "media:" + new URL(src, location.href).pathname;
  };
  function landmarks() {
    const result = [];
    const seen = new Set();
    const add = (key, node) => {
      const rect = node.getBoundingClientRect();
      if (!key || seen.has(key) || !rect.width || !rect.height || !node.getClientRects().length) return;
      seen.add(key);
      result.push({ key, top: rect.top + window.scrollY });
    };
    document.querySelectorAll(".intro, .concept-marquee-band, .case-hero, .case-summary, .site-footer").forEach(node => {
      add("section:" + [...node.classList].find(name => ["intro", "concept-marquee-band", "case-hero", "case-summary", "site-footer"].includes(name)), node);
    });
    document.querySelectorAll(".work .case-link").forEach(node => {
      add("case:" + pagePath(node.href).replace(/^\/ru\//, "/"), node);
    });
    document.querySelectorAll(".case-study img, .case-study video").forEach(node => add(mediaKey(node), node));
    return result.sort((a, b) => a.top - b.top).filter((item, i, all) => !i || item.top > all[i - 1].top + 1);
  }
  function capture(target) {
    const line = Math.min(160, window.innerHeight * .2);
    const y = window.scrollY + line;
    const points = landmarks();
    let before = points[0], after;
    for (const point of points) {
      if (point.top <= y) before = point;
      else { after = point; break; }
    }
    const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return {
      path: pagePath(target), at: Date.now(), y: window.scrollY, progress: window.scrollY / range,
      before: before?.key, after: after?.key, offset: before ? y - before.top : 0,
      fraction: before && after ? (y - before.top) / Math.max(1, after.top - before.top) : 0
    };
  }
  document.addEventListener("click", event => {
    const link = event.target.closest("a.lang-btn[data-lang-set]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
    if (link.getAttribute("data-lang-set") === document.documentElement.lang) {
      event.preventDefault();
      return;
    }
    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin) return;
    try { sessionStorage.setItem(storageKey, JSON.stringify(capture(target.href))); } catch (_) {}
  }, true);

  let saved;
  try {
    saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    if (!saved || saved.path !== pagePath(location.href)) return;
    sessionStorage.removeItem(storageKey);
  } catch (_) { return; }
  if (Date.now() - saved.at > 30000 || !Number.isFinite(saved.y) || !Number.isFinite(saved.progress)) return;

  let active = true;
  let observer;
  const timers = [];
  const stop = () => {
    active = false;
    observer?.disconnect();
    timers.forEach(clearTimeout);
    for (const name of ["wheel", "touchstart", "pointerdown", "keydown"]) window.removeEventListener(name, stop);
  };
  const restore = () => {
    if (!active) return;
    const points = landmarks();
    const before = points.find(point => point.key === saved.before);
    const after = points.find(point => point.key === saved.after);
    const line = Math.min(160, window.innerHeight * .2);
    let top = saved.progress * Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (saved.y < 2) top = 0;
    else if (before && after && after.top > before.top) top = before.top + saved.fraction * (after.top - before.top) - line;
    else if (before) top = before.top + saved.offset - line;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "instant" });
  };
  for (const name of ["wheel", "touchstart", "pointerdown", "keydown"]) window.addEventListener(name, stop, { passive: true });
  restore();
  requestAnimationFrame(restore);
  window.addEventListener("load", restore, { once: true });
  document.fonts?.ready.then(restore);
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(() => requestAnimationFrame(restore));
    observer.observe(document.body);
  }
  for (const delay of [100, 350, 900, 1800]) timers.push(setTimeout(restore, delay));
  timers.push(setTimeout(stop, 4000));
})();
