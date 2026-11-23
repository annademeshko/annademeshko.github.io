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
})();
