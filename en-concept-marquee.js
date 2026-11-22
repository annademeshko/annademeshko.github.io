      (function () {
        const gallery = document.querySelector('.concept-marquee');
        const track = document.querySelector('.concept-marquee__track');
        if (!gallery || !track) return;
        const originals = Array.from(track.children);
        originals.forEach(tile => { const copy = tile.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); track.appendChild(copy); });
        let dragging = false;
        let dragStartX = 0;
        let lastPointerX = 0;
        let moved = false;
        let suppressClick = false;
        let idleUntil = 0;
        let lastFrame = 0;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const cycleSize = () => track.scrollWidth / 2;
        function wrapPosition() {
          const cycle = cycleSize();
          if (!cycle) return;
          if (gallery.scrollLeft >= cycle) gallery.scrollLeft -= cycle;
          else if (gallery.scrollLeft < 0) gallery.scrollLeft += cycle;
        }
        function loop(now) {
          if (!gallery.getClientRects().length || document.hidden) { lastFrame = 0; requestAnimationFrame(loop); return; }
          wrapPosition();
          if (!dragging && !reducedMotion.matches && now > idleUntil && lastFrame) {
            gallery.scrollLeft += Math.min(now - lastFrame, 64) * 0.095;
            wrapPosition();
          }
          lastFrame = now;
          requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
        gallery.addEventListener('pointerdown', event => {
          if (event.button !== 0 || event.pointerType === 'touch') return;
          dragging = true;
          moved = false;
          suppressClick = false;
          dragStartX = event.clientX;
          lastPointerX = event.clientX;
          gallery.classList.add('is-dragging');
          idleUntil = performance.now() + 1500;
        });
        gallery.addEventListener('pointermove', event => {
          if (!dragging) return;
          const delta = event.clientX - dragStartX;
          if (Math.abs(delta) > 5 && !moved) { moved = true; gallery.setPointerCapture(event.pointerId); }
          gallery.scrollLeft -= event.clientX - lastPointerX;
          lastPointerX = event.clientX;
          wrapPosition();
          idleUntil = performance.now() + 1500;
        });
        const stopDrag = () => {
          if (!dragging) return;
          dragging = false;
          suppressClick = moved;
          gallery.classList.remove('is-dragging');
          idleUntil = performance.now() + 1500;
        };
        gallery.addEventListener('pointerup', stopDrag);
        gallery.addEventListener('pointercancel', stopDrag);
        gallery.addEventListener('lostpointercapture', stopDrag);
        gallery.addEventListener('dragstart', event => event.preventDefault());

        const lightbox = document.createElement('div');
        lightbox.className = 'concept-fullscreen';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Concept preview');
        const close = document.createElement('button');
        close.type = 'button'; close.className = 'concept-fullscreen__close'; close.setAttribute('aria-label', 'Close'); close.textContent = '×';
        lightbox.appendChild(close); document.body.appendChild(lightbox);
        let currentIndex = 0;
        function showConcept(index) {
          currentIndex = (index + originals.length) % originals.length;
          const media = originals[currentIndex].querySelector('img, video');
          if (!media) return;
          lightbox.querySelectorAll('img,video').forEach(el => { if (el.tagName === 'VIDEO') el.pause(); el.remove(); });
          const full = media.dataset.full ? document.createElement('img') : media.cloneNode(true);
          if (media.dataset.full) { full.src = media.dataset.full; full.alt = media.alt || media.getAttribute('aria-label') || ''; }
          else if (full.tagName === 'VIDEO') { full.src = media.dataset.video || media.currentSrc; }
          full.removeAttribute('loading');
          full.removeAttribute('autoplay');
          if (full.tagName === 'VIDEO') { full.controls = true; full.autoplay = true; }
          lightbox.insertBefore(full, close);
          lightbox.classList.add('is-open');
          document.body.style.overflow = 'hidden';
          if (full.tagName === 'VIDEO') full.play().catch(() => {});
          close.focus();
        }
        function hide() {
          lightbox.classList.remove('is-open');
          lightbox.querySelectorAll('img,video').forEach(el => { if (el.tagName === 'VIDEO') el.pause(); el.remove(); });
          document.body.style.overflow = '';
        }
        gallery.addEventListener('click', event => {
          if (suppressClick) { suppressClick = false; event.preventDefault(); return; }
          const tile = event.target.closest('.concept-marquee__tile');
          if (!tile) return;
          const index = Array.from(track.children).indexOf(tile) % originals.length;
          if (index >= 0) showConcept(index);
        });
        close.addEventListener('click', hide);
        lightbox.addEventListener('click', event => { if (event.target === lightbox) hide(); });
        document.addEventListener('keydown', event => {
          if (!lightbox.classList.contains('is-open')) return;
          if (event.key === 'Escape') hide();
          else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            showConcept(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
          }
        });
      })();
