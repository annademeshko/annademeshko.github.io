// "Now playing" ticker at the top of the page.
// Spotify scrobbles to Last.fm; this reads Last.fm's public recent-tracks API
// straight from the browser, so no server or Spotify secret is needed.
// Fill in LASTFM_USER and LASTFM_KEY to switch it on. Until then it stays hidden
// (add ?np-demo to the URL to preview it with a sample track).
(function () {
  var LASTFM_USER = "";   // your Last.fm username
  var LASTFM_KEY = "";    // your Last.fm API key (public, read-only)
  var POLL_MS = 30000;

  var demo = /[?&]np-demo\b/.test(location.search);
  if (!demo && (!LASTFM_USER || !LASTFM_KEY)) return;

  var isRu = (document.documentElement.lang || "").indexOf("ru") === 0;
  var T = {
    now: isRu ? "Сейчас играет" : "Now playing",
    last: isRu ? "Недавно слушала" : "Recently played"
  };

  var SPOTIFY = '<svg class="np-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>';

  var bar = document.createElement("a");
  bar.className = "now-playing";
  bar.target = "_blank";
  bar.rel = "noreferrer";
  bar.innerHTML =
    SPOTIFY +
    '<span class="np-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '<span class="np-window"><span class="np-track"><span class="np-text"></span><span class="np-text" aria-hidden="true"></span></span></span>';
  document.body.appendChild(bar);

  var texts = bar.querySelectorAll(".np-text");
  var trackEl = bar.querySelector(".np-track");
  var windowEl = bar.querySelector(".np-window");
  var current = "";

  function render(track) {
    if (!track) { bar.classList.remove("is-visible"); return; }
    var line = track.artist + " — " + track.name;
    var label = (track.playing ? T.now : T.last) + ": " + line;
    bar.classList.toggle("is-playing", track.playing);
    bar.setAttribute("aria-label", label);
    bar.title = label;
    bar.href = "https://open.spotify.com/search/" + encodeURIComponent(track.artist + " " + track.name);
    if (line !== current) {
      current = line;
      texts[0].textContent = line;
      texts[1].textContent = line;
      // Scroll only when the line is longer than its window.
      requestAnimationFrame(function () {
        var overflow = texts[0].scrollWidth > windowEl.clientWidth;
        bar.classList.toggle("is-scrolling", overflow);
        trackEl.style.setProperty("--np-duration", Math.max(8, texts[0].scrollWidth / 28) + "s");
      });
    }
    bar.classList.add("is-visible");
  }

  function load() {
    if (demo) {
      render({ artist: "Tame Impala", name: "The Less I Know The Better", playing: true });
      return;
    }
    var url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&format=json" +
      "&user=" + encodeURIComponent(LASTFM_USER) + "&api_key=" + encodeURIComponent(LASTFM_KEY);
    fetch(url)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var t = data && data.recenttracks && data.recenttracks.track && data.recenttracks.track[0];
        if (!t) { render(null); return; }
        render({
          artist: (t.artist && (t.artist["#text"] || t.artist.name)) || "",
          name: t.name || "",
          playing: !!(t["@attr"] && t["@attr"].nowplaying === "true")
        });
      })
      .catch(function () { /* keep whatever is shown */ });
  }

  load();
  if (!demo) {
    setInterval(function () { if (!document.hidden) load(); }, POLL_MS);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) load(); });
  }
})();
