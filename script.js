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
      ? "./assets/CV%20Anna%20Demeshko.pdf"
      : "./assets/CV%20%E2%80%94%20%D0%94%D0%B5%D0%BC%D0%B5%D1%88%D0%BA%D0%BE%20%D0%90%D0%BD%D0%BD%D0%B0%20%28Product%20designer%29.pdf";
    cvLinks.forEach((link) => link.setAttribute("href", href));
  }

  const initialLang = getLang();
  applyAria(initialLang);
  updateLangControls(initialLang);
  updateCV(initialLang);
  updateTitle(initialLang);
  updateThemeControl();

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("theme", next);
      updateThemeControl();
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

  // Barely-there magnetic pull: buttons drift a couple of px toward the cursor.
  // Applies to every button except the contact links (tg / LinkedIn / email).
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(hover: hover)").matches) {
    const STRENGTH = 0.14;
    const MAX = 3;
    const magneticSelector =
      ".theme-toggle, .lang-btn, .segmented-btn, .vibe-button, " +
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
