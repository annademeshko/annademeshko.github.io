(function () {
  const scene = document.querySelector(".neverlandScene");
  const title = document.querySelector(".neverlandTitle");
  const progressLabel = document.querySelector(".neverlandDepth");
  const endCard = document.querySelector(".neverlandEnd");
  const mobileFeed = document.querySelector(".neverlandMobile");

  if (!scene) {
    return;
  }

  const NEVERLAND_MEDIA = [
    "0515c18df7001b1f96a5434b58a6441b.jpg",
    "056ddb7b5d307360300cfc3a38c07d6d.jpg",
    "05fcd171321a7448a3e21870b875ce74.jpg",
    "0a4321a63998c7f80f4d27f65652d854.jpg",
    "0a7f3506ffea66b6c46efe07903cab00.jpg",
    "0b0212cab1acf241eafabf8e1d88218c.jpg",
    "12265ab4f32ff892e57756173dce5585.jpg",
    "13a09ca307fb349545d335900d8842eb.jpg",
    "169f54dc71b60e0c0136510ec772deba.jpg",
    "17e4ec33940683d8ab4ea11298c734ff.jpg",
    "1ddcad2f7cddf184abb28aefbd703793.jpg",
    "1ea117043c8b270d028dc475a46d77ed.jpg",
    "1f19e78f9b32fb5e5c1754d59288841f.jpg",
    "1fc46fc3e493e3e8dc31e410ab07c6ec.jpg",
    "1ff54ba4ef1228e021be7660be5afeff.jpg",
    "23104bee8ceb29b79faf5113eaca0850.jpg",
    "29f112efce74c17d8a4f645baa7c1f4d.jpg",
    "2a90e1e4ed2fdec1a3a1c48a9275c8af.jpg",
    "2e8e8e11bcbd9c2c6ba5a9aeb209ae76.jpg",
    "33ac673c94a6527db08674ed74099d31.jpg",
    "34eb57d56af81b9ee5383a673f3b62b0.jpg",
    "35aa07118d454b8a2313d45e5cd1701b.jpg",
    "37bad2a44e8d622e33892c69b75da23e.jpg",
    "3a6ad358396aee4a1fbc44ca999956cd.jpg",
    "445a49a57ffef320a7dd63441f13c78a.jpg",
    "4522339a468e011c6eb81842b5e449a6.jpg",
    "45d53294887fe23172171ca8d2f12ce4.jpg",
    "47404e2228cd90029b747ef0e80782a8.jpg",
    "5035e428d8f6ad29bda9bc278badc9a5.jpg",
    "57db5d515ab8b99e8da08f0450fccde8.jpg",
    "580894d818ced0f8daa3f3b26e4cbede.jpg",
    "5874425b48dd020367f1f42ef8bd9c4f.jpg",
    "5ecb4fb562b292bafd10b3c5dcafff91.jpg",
    "660b425d43c9d76060c17325a96ce34f.jpg",
    "6be3ef15ddf1acf4aba328084b5b7ec1.jpg",
    "6e680fb2aa54869c415dd8cd307f9d6b.jpg",
    "7930ad092511940015133f9ef563469e.jpg",
    "7ae262a02022ff61ae05bb72b21e9d81.jpg",
    "7e4d8fdd1ead02e636e851592090639a.jpg",
    "807fc9de574e26316a3e2c8a4c952400.jpg",
    "8153bb2d5d8d8a2b4275d4fc6a5dbdf3.jpg",
    "868dda2357095a2a92917c6e375b1eac.jpg",
    "89cdb212351b61215d013116ffc43c1b.jpg",
    "92ad6fb187519c58788fbd38ef9d3b4d.jpg",
    "959677461370aa862dc5024464b5326a.jpg",
    "99b5b88a7bcfd17105854f511279af79.jpg",
    "9a3b6732a87203bb0a3eee0f46325d95.jpg",
    "a588efcd69768d100e9a315edb69cc5e.jpg",
    "a63b916acd9a9d82cc174d1448054ef5.jpg",
    "b2a18ca7fc696e4ddf1da47eb5cfd681.jpg",
    "b8671d9d0dc2dbb4c0ee8afb4e798dbc.jpg",
    "b94bb0110a127b3c6a2b3ca02bd83fbc.jpg",
    "bdd92123c1ce3fe3e1ee2728d081e74a.jpg",
    "bede3108f2a2e80495c0525080b72c77.jpg",
    "c104731e2779191b366742578a0de595.jpg",
    "c5ab6ad9b9f9345e692b7f3313a1abdb.jpg",
    "c66a6f5ace87bbe2f0da8a5ad01fcfb0.jpg",
    "ca5d5132a963cf8be03b1687d90ec8f3.jpg",
    "d4efcfdfc18cab8e4934a618085beffd.jpg",
    "d66eb6e2a3c4dd8652e43d9004bfbcb9.jpg",
    "d78e6fbab6f2efdf465d13114b3ada64.jpg",
    "d944165474802ea6c4df9cbb7e0196f3.jpg",
    "dc28f64587e9f93bae186cbdbf72f595.jpg",
    "e08ddd99fb0cbdf1b0323fb0516ab5be.jpg",
    "e3c245e2388551302173a828947b6920.jpg",
    "ec6fc42d36a9a215e70a9194e40025c3.jpg",
    "eee3f1b09b65b355ff3e3c0cb2fcaa16.jpg",
    "f0b3dbdf2c33c5000727d99a2882f484.jpg",
    "f2cb159e7e3ec419601408dfb11659a2.jpg",
    "f2f265aaaf60cb67db75e1b30f93847e.jpg",
    "f359d1e0267068f127260e49f70cdf05.jpg",
    "f55a78f260390575a16ff4cb5338c2df.jpg",
    "fd7b7ea6ca2e5b50198729b99a5973a5.jpg",
    "ffc535f9800d1e41de59a4d9f4383c26.jpg"
  ];

  const NEVERLAND_Z_STEP = 190;
  const NEVERLAND_FIRST_ITEM_Z = 2660;
  const NEVERLAND_LAST_ITEM_DEPTH = NEVERLAND_FIRST_ITEM_Z + (NEVERLAND_MEDIA.length - 1) * NEVERLAND_Z_STEP;
  const NEVERLAND_END_DEPTH = NEVERLAND_LAST_ITEM_DEPTH + 2050;
  const NEVERLAND_MAX_DEPTH = NEVERLAND_END_DEPTH + 1100;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const memePath = "./assets/мемы/";
  const isMobile = window.matchMedia("(max-width: 760px)").matches;

  function revealImageWhenLoaded(figure, image) {
    const reveal = () => figure.classList.add("is-loaded");
    if (image.complete) {
      reveal();
      return;
    }
    image.addEventListener("load", reveal, { once: true });
    image.addEventListener("error", reveal, { once: true });
  }

  const neverlandItems = NEVERLAND_MEDIA.map((file, index) => {
    const column = index % 6;
    const row = Math.floor(index / 7);
    const drift = row % 2 ? -52 : 52;
    return {
      file,
      src: memePath + file,
      x: (column - 2.5) * 184 + drift,
      y: ((index * 5) % 8 - 3.5) * 68 + (row % 3) * 30,
      z: -NEVERLAND_FIRST_ITEM_Z - index * NEVERLAND_Z_STEP,
      rotate: ((index * 37) % 24) - 12,
      rotateY: ((index * 29) % 30) - 15,
      width: 145 + ((index * 41) % 72)
    };
  });

  if (isMobile && mobileFeed) {
    mobileFeed.innerHTML = [
      '<header class="neverlandMobileHead"><h2>Мой Neverland</h2><p>личный архив вайба, мемов и случайных смыслов</p></header>',
      '<div class="neverlandMobileFeed"></div>',
      '<div class="neverlandMobileEnd"><span>vibe check passed</span><a href="https://t.me/annademeshko" target="_blank" rel="noreferrer">Написать в Telegram</a></div>'
    ].join("");

    const feed = mobileFeed.querySelector(".neverlandMobileFeed");
    NEVERLAND_MEDIA.forEach((file, index) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      figure.className = "neverlandMobileItem";
      image.src = memePath + file;
      image.alt = "";
      image.loading = index < 4 ? "eager" : "lazy";
      image.decoding = "async";
      figure.appendChild(image);
      feed.appendChild(figure);
      revealImageWhenLoaded(figure, image);
    });
    return;
  }

  mobileFeed.remove();

  const offsets = neverlandItems.map(() => ({ x: 0, y: 0 }));
  let activeDrag = null;

  const figures = neverlandItems.map((item, index) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    figure.className = "neverlandItem";
    figure.dataset.index = String(index);
    figure.style.width = `${item.width}px`;
    image.src = item.src;
    image.alt = "";
    image.loading = index < 8 ? "eager" : "lazy";
    image.decoding = "async";
    figure.appendChild(image);
    scene.appendChild(figure);
    revealImageWhenLoaded(figure, image);
    return { figure, item };
  });

  let ticking = false;

  function getDepth() {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    return clamp(window.scrollY / scrollable, 0, 1) * NEVERLAND_MAX_DEPTH;
  }

  function render() {
    const depth = getDepth();
    const endProgress = clamp((depth - NEVERLAND_END_DEPTH) / 760, 0, 1);

    if (title) {
      title.style.opacity = Math.max(0, 1 - depth / 1200).toFixed(3);
      title.style.transform = `translate(-50%, -50%) translateY(${-Math.min(80, depth / 18)}px) scale(${Math.max(0.86, 1 - depth / 6000)})`;
      title.style.pointerEvents = depth < 980 ? "auto" : "none";
    }

    figures.forEach(({ figure, item }, index) => {
      const manualOffset = offsets[index];
      const z = item.z + depth;
      const visible = z > -2600 && z < 1050;
      const fadeIn = clamp((z + 2600) / 900, 0, 1);
      const fadeOut = clamp((980 - z) / 320, 0, 1);
      const opacity = visible ? fadeIn * fadeOut : 0;
      const scale = z > 600 ? 1 + (z - 600) / 520 : 1;

      figure.style.opacity = opacity.toFixed(3);
      figure.style.transform = `translate(-50%, -50%) translate3d(${item.x + manualOffset.x}px, ${item.y + manualOffset.y}px, ${z}px) rotateY(${item.rotateY}deg) rotate(${item.rotate}deg) scale(${scale})`;
    });

    if (endCard) {
      endCard.style.opacity = endProgress.toFixed(3);
      endCard.style.pointerEvents = endProgress > 0.72 ? "auto" : "none";
      endCard.style.transform = `translate(-50%, -50%) translateY(${(1 - endProgress) * 34}px) scale(${0.92 + endProgress * 0.08})`;
    }

    if (progressLabel) {
      progressLabel.textContent = `${Math.round((depth / NEVERLAND_MAX_DEPTH) * 100)}%`;
    }

    ticking = false;
  }

  function requestRender() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }

  scene.addEventListener("pointerdown", (event) => {
    const figure = event.target.closest(".neverlandItem");
    if (!figure) {
      return;
    }

    const index = Number(figure.dataset.index);
    if (!Number.isFinite(index)) {
      return;
    }

    activeDrag = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offsets[index].x,
      originY: offsets[index].y
    };
    figure.classList.add("neverlandItem--dragging");
    figure.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  scene.addEventListener("pointermove", (event) => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) {
      return;
    }

    offsets[activeDrag.index] = {
      x: activeDrag.originX + event.clientX - activeDrag.startX,
      y: activeDrag.originY + event.clientY - activeDrag.startY
    };
    requestRender();
  });

  function endDrag(event) {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) {
      return;
    }

    const figure = figures[activeDrag.index]?.figure;
    if (figure) {
      figure.classList.remove("neverlandItem--dragging");
      if (figure.hasPointerCapture(event.pointerId)) {
        figure.releasePointerCapture(event.pointerId);
      }
    }
    activeDrag = null;
  }

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  scene.addEventListener("pointerup", endDrag);
  scene.addEventListener("pointercancel", endDrag);
  render();
})();
