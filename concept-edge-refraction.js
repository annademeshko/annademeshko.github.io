/**
 * Edge-only liquid-glass refraction for the existing Concepts marquee.
 * Inspired by the glass carousel referenced at adamperlis.com/how-i-built-this/.
 * This is a lightweight SVG/backdrop-filter adaptation, not their Three.js renderer.
 * The interactive images, videos, marquee scrolling and modal remain untouched.
 */
(function () {
  'use strict';

  const band = document.querySelector('.concept-marquee-band');
  if (!band || !band.querySelector('.concept-marquee')) return;
  if (document.getElementById('concept-edge-refraction')) return;

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';

  // Separate R/G/B sampling produces spectral fringes around refracted edges.
  // The centered part of the gallery is never filtered.
  svg.innerHTML = `
    <defs>
      <filter id="concept-edge-refraction" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.005 0.027" numOctaves="2" seed="5" result="liquidNoise" />
        <feGaussianBlur in="liquidNoise" stdDeviation="10 1.2" result="liquidFlow" />
        <feDisplacementMap in="SourceGraphic" in2="liquidFlow" scale="120" xChannelSelector="R" yChannelSelector="G" result="redShift" />
        <feDisplacementMap in="SourceGraphic" in2="liquidFlow" scale="95" xChannelSelector="R" yChannelSelector="G" result="greenShift" />
        <feDisplacementMap in="SourceGraphic" in2="liquidFlow" scale="68" xChannelSelector="R" yChannelSelector="G" result="blueShift" />
        <feColorMatrix in="redShift" type="matrix" values="1 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0" result="red" />
        <feColorMatrix in="greenShift" type="matrix" values="0 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 1 0" result="green" />
        <feColorMatrix in="blueShift" type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 1 0 0   0 0 0 1 0" result="blue" />
        <feBlend in="red" in2="green" mode="screen" result="redGreen" />
        <feBlend in="redGreen" in2="blue" mode="screen" />
      </filter>
    </defs>`;
  document.body.appendChild(svg);

  const style = document.createElement('style');
  style.setAttribute('data-concept-edge-refraction', '');
  style.textContent = `
    /* Desktop-only: mobile and reduced-motion retain the original marquee. */
    @media (min-width: 1025px) and (prefers-reduced-motion: no-preference) {
      .concept-marquee-band.concept-edge-glass {
        position: relative;
      }
      .concept-marquee-band.concept-edge-glass::before,
      .concept-marquee-band.concept-edge-glass::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: clamp(110px, 18vw, 260px);
        z-index: 3;
        pointer-events: none;
        -webkit-backdrop-filter: url('#concept-edge-refraction');
        backdrop-filter: url('#concept-edge-refraction');
      }
      .concept-marquee-band.concept-edge-glass::before {
        left: 0;
        -webkit-mask-image: linear-gradient(to right, #000 0%, #000 20%, transparent 100%);
        mask-image: linear-gradient(to right, #000 0%, #000 20%, transparent 100%);
      }
      .concept-marquee-band.concept-edge-glass::after {
        right: 0;
        -webkit-mask-image: linear-gradient(to left, #000 0%, #000 20%, transparent 100%);
        mask-image: linear-gradient(to left, #000 0%, #000 20%, transparent 100%);
      }
    }
  `;
  document.head.appendChild(style);
  band.classList.add('concept-edge-glass');


  // The card silhouette bends near each side, while its scrolling box stays
  // the same size. This creates the rounded upper/lower lens contour.
  const marquee = band.querySelector('.concept-marquee');
  const track = band.querySelector('.concept-marquee__track');
  const motionAllowed = window.matchMedia('(min-width: 1025px) and (prefers-reduced-motion: no-preference)');
  const curveSvg = document.createElementNS(ns, 'svg');
  curveSvg.setAttribute('aria-hidden', 'true');
  curveSvg.setAttribute('width', '0');
  curveSvg.setAttribute('height', '0');
  curveSvg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const curveDefs = document.createElementNS(ns, 'defs');
  curveSvg.appendChild(curveDefs);
  document.body.appendChild(curveSvg);

  const clipData = new WeakMap();
  // Proximity-based depth: the tile nearest the viewport centre grows gently
  // while all others recede. The CSS 'scale' property composes with the existing
  // transform-based float animation (unlike setting 'transform' directly).
  const depthData = new WeakMap();
  let nextId = 0;
  let queued = false;
  let visible = true;
  const clamp = value => Math.max(0, Math.min(1, value));
  const num = value => Number(value.toFixed(4));

  function outline(side, amount, rx, ry) {
    const d = .084 * amount;
    const inner = 1 - rx;
    const near = rx + .21;
    if (side === 'left') {
      return 'M ' + num(rx) + ' 0 C ' + num(near) + ' ' + num(d * .23) + ' .7 ' + num(d * .98) + ' ' + num(inner) + ' ' + num(d) + ' ' +
        'Q 1 ' + num(d) + ' 1 ' + num(d + ry) + ' L 1 ' + num(1 - d - ry) + ' ' +
        'Q 1 ' + num(1 - d) + ' ' + num(inner) + ' ' + num(1 - d) + ' ' +
        'C .7 ' + num(1 - d * .98) + ' ' + num(near) + ' ' + num(1 - d * .23) + ' ' + num(rx) + ' 1 ' +
        'Q 0 1 0 ' + num(1 - ry) + ' L 0 ' + num(ry) + ' Q 0 0 ' + num(rx) + ' 0 Z';
    }
    return 'M ' + num(rx) + ' ' + num(d) + ' C .3 ' + num(d * .98) + ' ' + num(1 - near) + ' ' + num(d * .23) + ' ' + num(inner) + ' 0 ' +
      'Q 1 0 1 ' + num(ry) + ' L 1 ' + num(1 - ry) + ' Q 1 1 ' + num(inner) + ' 1 ' +
      'C ' + num(1 - near) + ' ' + num(1 - d * .23) + ' .3 ' + num(1 - d * .98) + ' ' + num(rx) + ' ' + num(1 - d) + ' ' +
      'Q 0 ' + num(1 - d) + ' 0 ' + num(1 - d - ry) + ' L 0 ' + num(d + ry) + ' ' +
      'Q 0 ' + num(d) + ' ' + num(rx) + ' ' + num(d) + ' Z';
  }

  function ensureClip(tile) {
    let item = clipData.get(tile);
    if (item) return item;
    const clip = document.createElementNS(ns, 'clipPath');
    const path = document.createElementNS(ns, 'path');
    const id = 'concept-edge-curve-' + (++nextId);
    clip.setAttribute('id', id);
    clip.setAttribute('clipPathUnits', 'objectBoundingBox');
    clip.appendChild(path);
    curveDefs.appendChild(clip);
    item = { id, path, strength: -1, side: '' };
    clipData.set(tile, item);
    return item;
  }

  function updateCurves() {
    queued = false;
    if (!track) return;
    const enabled = motionAllowed.matches && visible;
    const galleryRect = marquee.getBoundingClientRect();
    const galleryCenter = galleryRect.left + galleryRect.width / 2;
    const depthRange = Math.max(380, Math.min(760, galleryRect.width * .64));
    const zone = Math.min(300, Math.max(190, galleryRect.width * .22));
    track.querySelectorAll('.concept-marquee__tile').forEach(tile => {
      const stored = clipData.get(tile);
      if (!enabled) {
        if (depthData.has(tile)) {
          tile.style.removeProperty('scale');
          tile.style.removeProperty('z-index');
          depthData.delete(tile);
        }
        if (stored && stored.strength !== 0) {
          tile.style.removeProperty('clip-path');
          stored.strength = 0;
        }
        return;
      }
      const rect = tile.getBoundingClientRect();
      // Transform scaling does not move the tile's horizontal centre, so the
      // calculation stays stable without feedback loops as the marquee flows.
      const tileCenter = rect.left + rect.width / 2;
      const proximity = clamp(1 - Math.abs(tileCenter - galleryCenter) / depthRange);
      const smoothFocus = proximity * proximity * (3 - 2 * proximity);
      const depthScale = (.9 + .175 * smoothFocus).toFixed(3);
      if (depthData.get(tile) !== depthScale) {
        tile.style.setProperty('scale', depthScale);
        tile.style.setProperty('z-index', String(Math.round(smoothFocus * 20)));
        depthData.set(tile, depthScale);
      }
      if (rect.right < galleryRect.left || rect.left > galleryRect.right) {
        if (stored && stored.strength !== 0) {
          tile.style.removeProperty('clip-path');
          stored.strength = 0;
        }
        return;
      }
      const left = clamp((zone - (rect.left - galleryRect.left)) / zone);
      const right = clamp((rect.right - (galleryRect.right - zone)) / zone);
      const side = left > right ? 'left' : 'right';
      const strength = Math.max(left, right);
      if (strength < .025) {
        if (stored && stored.strength !== 0) {
          tile.style.removeProperty('clip-path');
          stored.strength = 0;
        }
        return;
      }
      const item = ensureClip(tile);
      if (item.side === side && Math.abs(item.strength - strength) < .004) return;
      const rx = Math.min(.08, 18 / Math.max(1, rect.width));
      const ry = Math.min(.09, 18 / Math.max(1, rect.height));
      item.path.setAttribute('d', outline(side, strength, rx, ry));
      item.strength = strength;
      item.side = side;
      if (!tile.style.clipPath) tile.style.clipPath = 'url("#' + item.id + '")';
    });
  }

  function scheduleCurveUpdate() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(updateCurves);
  }
  marquee.addEventListener('scroll', scheduleCurveUpdate, { passive: true });
  window.addEventListener('resize', scheduleCurveUpdate, { passive: true });
  document.addEventListener('visibilitychange', scheduleCurveUpdate);
  if (motionAllowed.addEventListener) motionAllowed.addEventListener('change', scheduleCurveUpdate);
  if ('ResizeObserver' in window && track) new ResizeObserver(scheduleCurveUpdate).observe(track);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      scheduleCurveUpdate();
    }, { rootMargin: '180px' }).observe(band);
  }
  scheduleCurveUpdate();

})();
