(function () {
  // Swap the skeleton shimmer for the real screenshot once it has loaded.
  const lazyImages = document.querySelectorAll("img.is-loading");
  function markLoaded(img) {
    img.classList.remove("is-loading");
    img.classList.add("is-loaded");
  }
  lazyImages.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      markLoaded(img);
      return;
    }
    img.addEventListener("load", () => markLoaded(img), { once: true });
    // If the image fails, drop the shimmer so it doesn't animate forever.
    img.addEventListener("error", () => markLoaded(img), { once: true });
  });
})();

(function () {
  const tooltip = document.querySelector(".cursor-tooltip");
  const cards = document.querySelectorAll(".work .case-link");

  if (!tooltip || cards.length === 0 || !window.matchMedia("(hover: hover)").matches) {
    return;
  }

  const offsetX = 14;
  const offsetY = 18;

  function moveTooltip(event) {
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const maxX = window.innerWidth - tooltipWidth - 8;
    const maxY = window.innerHeight - tooltipHeight - 8;
    const x = Math.min(event.clientX + offsetX, maxX);
    const y = Math.min(event.clientY + offsetY, maxY);

    tooltip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function showTooltip(event) {
    tooltip.setAttribute("aria-hidden", "false");
    tooltip.classList.add("is-visible");
    moveTooltip(event);
  }

  function hideTooltip() {
    tooltip.setAttribute("aria-hidden", "true");
    tooltip.classList.remove("is-visible");
  }

  cards.forEach((card) => {
    card.addEventListener("mouseenter", showTooltip);
    card.addEventListener("mousemove", moveTooltip);
    card.addEventListener("mouseleave", hideTooltip);
  });
})();

(function () {
  const images = document.querySelectorAll(".study-image");

  if (images.length === 0) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-hidden", "true");

  const bigImage = document.createElement("img");
  bigImage.alt = "";
  overlay.appendChild(bigImage);
  document.body.appendChild(overlay);

  function openLightbox(source, alt) {
    bigImage.src = source;
    bigImage.alt = alt || "";
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  images.forEach((image) => {
    image.addEventListener("click", () => {
      openLightbox(image.currentSrc || image.src, image.alt);
    });
  });

  overlay.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeLightbox();
    }
  });
})();

(function () {
  const root = document.documentElement;

  function store(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* ignore */
    }
  }

  function applyAria(lang) {
    document.querySelectorAll("[data-aria-ru]").forEach((el) => {
      const value = el.getAttribute("data-aria-" + lang);
      if (value) {
        el.setAttribute("aria-label", value);
      }
    });
  }

  function getLang() {
    return root.getAttribute("lang") === "en" ? "en" : "ru";
  }

  function getTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateThemeControl() {
    const themeToggle = document.querySelector(".theme-toggle");
    if (!themeToggle) {
      return;
    }

    const isDark = getTheme() === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Включить светлую тему / Switch to light theme" : "Включить темную тему / Switch to dark theme");
    themeToggle.title = isDark ? "Light theme" : "Dark theme";
  }

  function updateLangControls(lang) {
    document.querySelectorAll(".lang-btn[data-lang-set]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lang-set") === lang));
    });
  }

  const titleEl = document.querySelector("title[data-ru]");
  function updateTitle(lang) {
    if (!titleEl) {
      return;
    }
    const value = titleEl.getAttribute("data-" + lang);
    if (value) {
      document.title = value;
    }
  }

  const cvLinks = document.querySelectorAll("[data-cv]");
  function updateCV(lang) {
    const href = lang === "en"
      ? "/assets/anna-demeshko-product-designer-en-20261107.pdf"
      : "/assets/anna-demeshko-product-designer-ru-20261103.pdf";
    cvLinks.forEach((link) => link.setAttribute("href", href));
  }

  const initialLang = getLang();
  applyAria(initialLang);
  updateLangControls(initialLang);
  updateCV(initialLang);
  updateTitle(initialLang);
  updateThemeControl();

  // Fluid chrome from the two screen-recording references: undulating
  // reflections, floating inner lens loops, and narrow spectral edge glints.
  // Uses real View Transition snapshots so actual text, images and controls
  // change as the wave passes; no imitation screenshot is displayed.
  let runningThemeTransition = null;
  let fluidFrame = 0;
  const FLUID_DURATION = 2750;

  function fluidPath(cx, cy, radius, elapsed, count, phase, ovalX, ovalY) {
    const parts = [];
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count;
      const irregular = 1
        + 0.155 * Math.sin(2 * a - elapsed * 4.9 + phase)
        + 0.098 * Math.sin(3 * a + elapsed * 3.6 - phase * .5)
        + 0.044 * Math.sin(6 * a - elapsed * 8.3 + phase * 2);
      const r = Math.max(0, radius * irregular);
      const px = (cx + r * Math.cos(a) * ovalX).toFixed(1);
      const py = (cy + r * Math.sin(a) * ovalY).toFixed(1);
      parts.push((i ? "L" : "M") + px + " " + py);
    }
    return parts.join(" ") + " Z";
  }

  function animateFluidChrome(root, state, stamp) {
    if (runningThemeTransition !== state.transition) return;
    if (state.began == null) state.began = stamp;
    const progress = Math.min(1, (stamp - state.began) / FLUID_DURATION);
    if (progress >= 1) {
      root.style.setProperty("--theme-fluid-clip", "inset(0)");
      root.style.setProperty("--theme-fluid-rim", "linear-gradient(transparent, transparent)");
      root.style.setProperty("--theme-fluid-opacity", "0");
      return;
    }

    // A viscous acceleration, soft slowdown and small oscillations rather
    // than the previous expanding circular masks.
    const e = progress * progress * (3 - 2 * progress);
    const radius = state.farthest * 1.80 * e;
    const outer = fluidPath(state.x, state.y, radius, progress, 100, .36, 1, 1);
    root.style.setProperty("--theme-fluid-clip", 'path("' + outer + '")');

    // Two evolving inner lenses echo the floating chromatic loops in the
    // supplied close-up video. They decorate the rim; never obscure links.
    const lensFade = Math.max(0, Math.min(1, (progress - .12) * 5, (.89 - progress) * 5));
    let loops = "";
    if (lensFade > 0) {
      const a = fluidPath(
        state.x + radius * (.19 + .025 * Math.sin(progress * 7)),
        state.y - radius * .12,
        Math.max(9, radius * .23), progress, 64, 1.18, 1.10, .67
      );
      const b = fluidPath(
        state.x - radius * .21,
        state.y + radius * (.17 + .02 * Math.cos(progress * 5)),
        Math.max(9, radius * .135), progress, 56, 2.14, 1.12, .78
      );
      loops = '<path d="' + a + '" fill="none" stroke="#fff" stroke-width="14" opacity="' + (.46 * lensFade).toFixed(2) + '"/>' +
              '<path d="' + a + '" fill="none" stroke="#fff" stroke-width="3" opacity="' + (.68 * lensFade).toFixed(2) + '"/>' +
              '<path d="' + b + '" fill="none" stroke="#fff" stroke-width="9" opacity="' + (.32 * lensFade).toFixed(2) + '"/>';
    }

    // The mask paints a layered, tapered metallic contour over the captured
    // gradient. Its width is intentionally irregular in perceived brightness,
    // with an optically narrow, colored refraction at the leading edge.
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + state.width +
      '" height="' + state.height + '" viewBox="0 0 ' + state.width + ' ' + state.height + '">' +
      '<path d="' + outer + '" fill="none" stroke="#fff" stroke-width="76" opacity=".08"/>' +
      '<path d="' + outer + '" fill="none" stroke="#fff" stroke-width="38" opacity=".22"/>' +
      '<path d="' + outer + '" fill="none" stroke="#fff" stroke-width="18" opacity=".60"/>' +
      '<path d="' + outer + '" fill="none" stroke="#fff" stroke-width="5" opacity="1"/>' +
      loops + '</svg>';
    root.style.setProperty("--theme-fluid-rim",
      'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
    const shine = Math.min(1, progress * 9) * Math.min(1, (1 - progress) * 7);
    root.style.setProperty("--theme-fluid-opacity", String((shine * .96).toFixed(3)));
    fluidFrame = requestAnimationFrame((time) => animateFluidChrome(root, state, time));
  }

  function switchThemeWithLiquidMetal(next, apply) {
    if (root.getAttribute("data-theme") === next) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supported = typeof document.startViewTransition === "function"
      && CSS.supports("clip-path", 'path("M 0 0 L 1 1 Z")');
    if (!supported || reduced || document.visibilityState === "hidden" ||
        !document.querySelector('link[href*="/theme-wave.css"]')) {
      apply();
      return;
    }
    if (runningThemeTransition) {
      runningThemeTransition.skipTransition();
      cancelAnimationFrame(fluidFrame);
      apply();
      return;
    }

    const width = window.innerWidth, height = window.innerHeight;
    const dock = document.querySelector(".intro .contact-dock");
    const rect = dock && dock.getBoundingClientRect();
    const visible = rect && rect.bottom > 0 && rect.top < height &&
      rect.right > 0 && rect.left < width;
    const x = visible ? Math.max(0, Math.min(width, rect.left + rect.width / 2)) : width / 2;
    const y = visible ? Math.max(0, Math.min(height, rect.top + rect.height / 2)) : height / 2;
    const farthest = Math.max(
      Math.hypot(x, y), Math.hypot(width - x, y),
      Math.hypot(x, height - y), Math.hypot(width - x, height - y)
    );

    root.classList.add("theme-wave-active");
    root.setAttribute("data-theme-wave-to", next);
    root.style.setProperty("--theme-fluid-x", x.toFixed(1) + "px");
    root.style.setProperty("--theme-fluid-y", y.toFixed(1) + "px");
    root.style.setProperty("--theme-fluid-clip", 'circle(0px at ' + x + 'px ' + y + 'px)');
    root.style.setProperty("--theme-fluid-opacity", "0");
    root.style.setProperty("--theme-fluid-rim", "linear-gradient(transparent, transparent)");
    let prism = null, transition;
    const state = { x, y, width, height, farthest, began: null, transition: null };

    const cleanup = () => {
      if (state.transition && runningThemeTransition !== state.transition) return;
      cancelAnimationFrame(fluidFrame);
      prism?.remove();
      root.classList.remove("theme-wave-active");
      root.removeAttribute("data-theme-wave-to");
      for (const key of ["--theme-fluid-x", "--theme-fluid-y",
        "--theme-fluid-clip", "--theme-fluid-rim", "--theme-fluid-opacity"]) {
        root.style.removeProperty(key);
      }
      runningThemeTransition = null;
    };

    try {
      transition = document.startViewTransition(() => {
        apply();
        prism = document.createElement("div");
        prism.className = "theme-wave-prism";
        prism.setAttribute("aria-hidden", "true");
        document.body.appendChild(prism);
      });
      state.transition = transition;
      runningThemeTransition = transition;
      transition.ready.then(() => {
        fluidFrame = requestAnimationFrame((time) => animateFluidChrome(root, state, time));
      }, cleanup);
      transition.finished.then(cleanup, cleanup);
    } catch (error) {
      cleanup();
      apply();
    }
  }

  // Three-way theme switch (pink / white / black) on the homepage.
  const themeButtons = document.querySelectorAll(".theme-btn[data-theme-set]");
  const updateThemeButtons = () => {
    const current = root.getAttribute("data-theme");
    themeButtons.forEach((button) => {
      const active = button.getAttribute("data-theme-set") === current;
      button.setAttribute("aria-checked", String(active));
      button.tabIndex = active ? 0 : -1;
    });
  };
  themeButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const next = button.getAttribute("data-theme-set");
      switchThemeWithLiquidMetal(next, () => {
        root.setAttribute("data-theme", next);
        store("theme", next);
        updateThemeButtons();
      });
    });
    button.addEventListener("keydown", (event) => {
      const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const target = themeButtons[(index + step + themeButtons.length) % themeButtons.length];
      target.focus();
      target.click();
    });
  });
  if (themeButtons.length) {
    if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", "dark");
    updateThemeButtons();
  }

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      switchThemeWithLiquidMetal(next, () => {
        root.setAttribute("data-theme", next);
        store("theme", next);
        updateThemeControl();
      });
    });
  }

  const langButtons = document.querySelectorAll(".lang-btn[data-lang-set]");
  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-lang-set");
      root.setAttribute("lang", lang);
      store("lang", lang);
      applyAria(lang);
      updateLangControls(lang);
      updateCV(lang);
      updateTitle(lang);
    });
  });

  // Cases / Concepts segmented switcher with a sliding active "pill".
  const segmented = document.querySelector(".segmented");
  const segThumb = segmented ? segmented.querySelector(".segmented__thumb") : null;
  const segButtons = document.querySelectorAll(".segmented-btn[data-panel]");
  const panels = document.querySelectorAll(".works section[data-panel]");
  if (segmented && segThumb && segButtons.length && panels.length) {
    const activeButton = () =>
      document.querySelector(".segmented-btn.is-active") || segButtons[0];

    const moveThumb = (button) => {
      segThumb.style.width = button.offsetWidth + "px";
      segThumb.style.height = button.offsetHeight + "px";
      segThumb.style.transform =
        "translate(" + button.offsetLeft + "px, " + button.offsetTop + "px)";
    };

    // Place the pill on the initial tab without animating, then enable flow.
    moveThumb(activeButton());
    requestAnimationFrame(() => segmented.classList.add("is-ready"));

    segButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-panel");
        segButtons.forEach((b) => {
          const active = b === button;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", String(active));
        });
        panels.forEach((panel) => {
          panel.hidden = panel.getAttribute("data-panel") !== target;
        });
        moveThumb(button);
      });
    });

    // Re-measure when labels change width (language switch) or on resize.
    window.addEventListener("resize", () => moveThumb(activeButton()));
    document.querySelectorAll(".lang-btn[data-lang-set]").forEach((b) => {
      b.addEventListener("click", () => {
        requestAnimationFrame(() => moveThumb(activeButton()));
      });
    });
  }

  // Keep the Vibe Check button on the same vertical rail as the theme/language
  // controls (align its right edge with the controls' right edge).
  const siteControls = document.querySelector(".site-controls");
  const vibeButton = document.querySelector(".vibe-button");
  if (siteControls && vibeButton) {
    const alignVibe = () => {
      // On mobile the button is centred at the bottom via CSS — leave it alone.
      if (window.matchMedia("(max-width: 520px)").matches) {
        vibeButton.style.right = "";
        return;
      }
      const rect = siteControls.getBoundingClientRect();
      vibeButton.style.right = Math.max(0, Math.round(window.innerWidth - rect.right)) + "px";
    };
    alignVibe();
    window.addEventListener("resize", alignVibe);
    window.addEventListener("load", alignVibe);
  }

  // Mobile: hide the theme/language controls while scrolling down, and slide
  // them back in the moment the scroll moves up.
  if (siteControls) {
    const mobile = window.matchMedia("(max-width: 520px)");
    let lastY = window.scrollY;
    let scrollTicking = false;

    const onScrollDirection = () => {
      const y = window.scrollY;
      if (mobile.matches) {
        if (y > lastY && y > 48) {
          siteControls.classList.add("is-hidden");
        } else if (y < lastY) {
          siteControls.classList.remove("is-hidden");
        }
      } else {
        siteControls.classList.remove("is-hidden");
      }
      lastY = y <= 0 ? 0 : y;
      scrollTicking = false;
    };

    window.addEventListener("scroll", () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScrollDirection);
      }
    }, { passive: true });

    const resetControls = () => {
      if (!mobile.matches) {
        siteControls.classList.remove("is-hidden");
      }
    };
    if (typeof mobile.addEventListener === "function") {
      mobile.addEventListener("change", resetControls);
    }
  }

  // Preserve the bilingual RU-origin mode while the visitor browses English pages.
  // Direct visits to annademeshko.com stay English-only with no language switch.
  try {
    const params = new URLSearchParams(window.location.search);
    const state = window.history.state || {};
    const fromRussianPortfolio =
      params.get("langswitch") === "1" || state.langSwitchFromRu === true ||
      document.documentElement.classList.contains("lang-switch-enabled");

    if (document.documentElement.lang === "en" && fromRussianPortfolio) {
      const nextState = Object.assign({}, state, { langSwitchFromRu: true });

      if (params.get("langswitch") === "1") {
        params.delete("langswitch");
        const cleanUrl =
          window.location.pathname +
          (params.toString() ? "?" + params.toString() : "") +
          window.location.hash;
        window.history.replaceState(nextState, "", cleanUrl);
      } else if (state.langSwitchFromRu !== true) {
        window.history.replaceState(nextState, "", window.location.href);
      }

      document.documentElement.classList.add("lang-switch-enabled");

      const keepBilingualMode = (link) => {
        if (!link || !link.href) return;
        try {
          const url = new URL(link.href, window.location.href);
          if (url.origin !== window.location.origin) return;
          // Go directly to the matching English home, without relying on a root redirect.
          if (link.classList.contains("case-nav-home") || url.pathname === "/") {
            url.pathname = "/en/";
          }
          url.searchParams.set("langswitch", "1");
          link.href = url.pathname + url.search + url.hash;
        } catch (e) {}
      };

      document.querySelectorAll(
        ".case-link, .case-nav-home, .case-nav-prev, .case-nav-next, .lang-btn[data-lang-set='en']"
      ).forEach(keepBilingualMode);
    }
  } catch (e) {}

  // Barely-there magnetic pull: buttons drift a couple of px toward the cursor.
  // Applies to every button except the contact links (tg / LinkedIn / email).
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(hover: hover)").matches) {
    const STRENGTH = 0.14;
    const MAX = 3;
    const magneticSelector =
      ".theme-toggle, .theme-btn, .lang-btn, .segmented-btn, .vibe-button, " +
      ".case-nav-home, .case-nav-prev, .case-nav-next";
    document.querySelectorAll(magneticSelector).forEach((btn) => {
      btn.addEventListener("mousemove", (event) => {
        const rect = btn.getBoundingClientRect();
        const clamp = (v) => Math.max(-MAX, Math.min(MAX, v));
        const dx = clamp((event.clientX - (rect.left + rect.width / 2)) * STRENGTH);
        const dy = clamp((event.clientY - (rect.top + rect.height / 2)) * STRENGTH);
        btn.style.setProperty("--mx", dx + "px");
        btn.style.setProperty("--my", dy + "px");
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--mx", "0px");
        btn.style.setProperty("--my", "0px");
      });
    });
  }

  document.querySelectorAll("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
      const email = button.getAttribute("data-copy-email");
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        const helper = document.createElement("textarea");
        helper.value = email;
        helper.setAttribute("readonly", "");
        helper.style.position = "absolute";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        document.body.removeChild(helper);
      }
      button.classList.add("is-copied");
      window.setTimeout(() => button.classList.remove("is-copied"), 1600);
    });
  });

})();
