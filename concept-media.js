// Load only nearby gallery media, including the desktop loop's cloned tiles.
(() => {
  const media = document.querySelectorAll('.concept-card [data-src], .concept-marquee__tile [data-src], .concept-card [data-video], .concept-marquee__tile [data-video]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visibleVideos = new Set();
  function playback(video) {
    if (document.hidden || reducedMotion.matches || !visibleVideos.has(video)) video.pause();
    else video.play().catch(() => {});
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const item = entry.target;
      if (item.tagName === 'IMG') {
        if (!entry.isIntersecting) continue;
        if (item.dataset.srcset) item.srcset = item.dataset.srcset;
        item.src = item.dataset.src;
        observer.unobserve(item);
      } else {
        if (entry.isIntersecting) {
          if (!item.poster && item.dataset.poster) item.poster = item.dataset.poster;
          if (!item.getAttribute('src') && !reducedMotion.matches) item.src = item.dataset.video;
          visibleVideos.add(item);
        } else visibleVideos.delete(item);
        playback(item);
      }
    }
  }, { rootMargin: '150px' });
  media.forEach(item => observer.observe(item));
  document.addEventListener('visibilitychange', () => visibleVideos.forEach(playback));
  reducedMotion.addEventListener('change', () => visibleVideos.forEach(video => {
    if (!reducedMotion.matches && !video.getAttribute('src')) video.src = video.dataset.video;
    playback(video);
  }));
})();
