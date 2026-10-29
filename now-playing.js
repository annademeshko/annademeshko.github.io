// Playlist ticker: tracks from the "best songs ever" Spotify playlist, in order,
// scrolling one after another. Static list (first 100 tracks of the playlist),
// so no Spotify sign-in or server is needed. Clicking it opens the playlist.
// Desktop: pinned to the top centre. Mobile: sits under the contact icons in the intro.
(function () {
  var PLAYLIST = "https://open.spotify.com/playlist/14TdC0nbL1qSOms0uueJ5V";
  var TRACKS = [
    ["Ozzy Osbourne","No More Tears","7w6PJe5KBPyvuRYxFkPssC"],
    ["The Mamas & The Papas","California Dreamin'","4s6LhHAV5SEsOV0lC2tjvJ"],
    ["The Verve","Bitter Sweet Symphony","57iDDD9N9tTWe75x6qhStw"],
    ["David Bowie","Starman","0pQskrTITgmCMyr85tb9qq"],
    ["Led Zeppelin","Stairway to Heaven","5CQ30WqJwcep0pYcV4AMNc"],
    ["Radiohead","Karma Police","63OQupATfueTdZMWTxW03A"],
    ["A$AP Rocky, Imogen Heap, Clams Casino","I Smoked Away My Brain (I'm God x Demons Mashup)","3jnYCrF7UpSYAwwy1URW8d"],
    ["Society","All That We've Become","6a7xvSYIGz8Ax8fMZsSNTU"],
    ["Asia","Heat Of The Moment","1nmZ8yqKkfooOuYvtFctDp"],
    ["Nirvana","Heart-Shaped Box","11LmqTE2naFULdEP94AUBa"],
    ["A$AP Rocky","Trunks","4v2r3H6YEQIlxS4Z1njwoe"],
    ["Pixies","Where Is My Mind?","7wCmS9TTVUcIhRalDYFgPy"],
    ["The Rolling Stones","Paint It, Black","63T7DJ1AFDD6Bn8VzG6JE8"],
    ["Nirvana","About A Girl","2SHTKB8YYlawTGIuJ2b2ok"],
    ["Soundgarden","Black Hole Sun","4xdHI4eFNst0vTZuuKrWjr"],
    ["Radiohead","Creep","70LcF31zb1H0PyJoS1Sx1r"],
    ["Nirvana","The Man Who Sold The World","15VRO9CQwMpbqUYA7e6Hwg"],
    ["Lynyrd Skynyrd","Free Bird","5EWPGh7jbTNO2wakv8LjUI"],
    ["Guns N' Roses","November Rain","3YRCqOhFifThpSRFJ1VWFM"],
    ["Gorillaz, De La Soul","Feel Good Inc.","0d28khcov6AiegSCpG5TuT"],
    ["Creedence Clearwater Revival","Fortunate Son","4BP3uh0hFLFRb5cjsgLqDh"],
    ["Oasis","Wonderwall","5qqabIl2vWzo9ApSC317sa"],
    ["Guns N' Roses","Sweet Child O' Mine","7snQQk1zcKl8gZ92AnueZW"],
    ["AC/DC","Highway to Hell","2zYzyRzz6pRmhPzyfMEC8s"],
    ["Guns N' Roses","Knockin' On Heaven's Door","4JiEyzf0Md7KEFFGWDDdCr"],
    ["Guns N' Roses","Paradise City","6eN1f9KNmiWEhpE2RhQqB5"],
    ["The White Stripes","Seven Nation Army","3dPQuX8Gs42Y7b454ybpMR"],
    ["The Clash","Should I Stay or Should I Go","39shmbIHICJ2Wxnk1fPSdz"],
    ["Elton John","Rocket Man","3gdewACMIVMEWVbyb8O9sY"],
    ["Foster The People","Pumped Up Kicks","7w87IxuO7BDcJ3YUqCyMTT"],
    ["AC/DC","Back In Black","08mG3Y1vljYA6bvDt4Wqkj"],
    ["AC/DC","You Shook Me All Night Long","2SiXAy7TuUkycRVbbWDEpo"],
    ["Talking Heads","Psycho Killer","7dSCxR4LqkmxoBrq9MzVSD"],
    ["Led Zeppelin","Whole Lotta Love","0hCB0YR03f6AmQaHbwWDe8"],
    ["Billy Joel","Piano Man","70C4NyhjD5OZUMzvWZ3njJ"],
    ["The Police","Every Breath You Take","1JSTJqkT5qHq8MDJnJbRE1"],
    ["Don McLean","American Pie","1fDsrQ23eTAVFElUMaf38X"],
    ["Kansas","Carry on Wayward Son","4DMKwE2E2iYDKY01C335Uw"],
    ["The Police","Roxanne","3EYOJ48Et32uATr9ZmLnAo"],
    ["Creedence Clearwater Revival","Have You Ever Seen The Rain","2LawezPeJhN4AWuSB0GtAU"],
    ["Ozzy Osbourne","Crazy Train","7ACxUo21jtTHzy7ZEV56vU"],
    ["The Killers","Mr. Brightside","003vvx7Niy0yvhvHt4a68B"],
    ["Lenny Kravitz","Fly Away","1OxcIUqVmVYxT6427tbhDW"],
    ["Scorpions","Wind Of Change","3ovjw5HZZv43SxTwApooCM"],
    ["Rupert Holmes","Escape (The Pina Colada Song)","5IMtdHjJ1OtkxbGe4zfUxQ"],
    ["Weezer","Island In The Sun","2MLHyLy5z5l5YRp7momlgw"],
    ["Nickelback","How You Remind Me","0gmbgwZ8iqyMPmXefof8Yf"],
    ["Billy Idol","Rebel Yell","4TIJ7zSBNejpoIPaWpWRKc"],
    ["The Beatles","Hey Jude","3m7V717IKZqZLW5qUIOxdD"],
    ["Limp Bizkit","Behind Blue Eyes","1MTQHCpraD4S8g5PAFKzoj"],
    ["The Goo Goo Dolls","Iris","6Qyc6fS4DsZjB2mRW9DsQs"],
    ["Kings of Leon","Sex on Fire","0ntQJM78wzOLVeCUAW7Y45"],
    ["Derek & The Dominos","Layla","2kkvB3RNRzwjFdGhaUA0tz"],
    ["Creed","One Last Breath","42T2QQv3xgBlpQxaSP7lnK"],
    ["Prince","Purple Rain","1uvyZBs4IZYRebHIB1747m"],
    ["Oasis","Don't Look Back in Anger","0UvCh63URrLFcPkKt99hHd"],
    ["Green Day","Good Riddance (Time of Your Life)","6ORqU0bHbVCRjXm9AjyHyZ"],
    ["New Radicals","You Get What You Give","1Cwsd5xI8CajJz795oy4XF"],
    ["Guns N' Roses","Don't Cry","2N2yrmodOnVF10mKvItC9P"],
    ["Steppenwolf","Born To Be Wild","3lN8PP6R2IxbLP05QpYXng"],
    ["AC/DC","Shoot to Thrill","0C80GCp0mMuBzLf3EAXqxv"],
    ["Smash Mouth","All Star","3cfOd4CMv2snFaKAnMdnvK"],
    ["Pearl Jam","Black","5Xak5fmy089t0FYmh3VJiY"],
    ["ABBA","Gimme! Gimme! Gimme! (A Man After Midnight)","3vkQ5DAB1qQMYO4Mr9zJN6"],
    ["The Who","Baba O'Riley","3bHnoz2pfij19QUDhoLrcy"],
    ["The Rolling Stones","(I Can't Get No) Satisfaction","13KF3YaPAxbOYmMhFkT9ma"],
    ["The Rolling Stones","Sympathy For The Devil","1Ud6moTC0KyXMq1Oxfien0"],
    ["The Kinks","You Really Got Me","6tZdL3Zp8JgrfDbsSeSV1S"],
    ["Led Zeppelin","Black Dog","3qT4bUD1MaWpGrTwcvguhb"],
    ["The Rolling Stones","Start Me Up","7HKez549fwJQDzx3zLjHKC"],
    ["Ramones","Blitzkrieg Bop","4KcH1ZRV2W1q7Flq0QqC76"],
    ["The Beatles","Let It Be","7iN1s7xHE4ifF5povM6A48"],
    ["ABBA","Dancing Queen","0GjEhVFGZW8afUYGChu3Rr"],
    ["Creedence Clearwater Revival","Bad Moon Rising","20OFwXhEXf12DzwXmaV7fj"],
    ["Kings of Leon","Use Somebody","5VGlqQANWDKJFl0MBG3sg2"],
    ["blink-182","I Miss You","1oTo3ijRbaDAtrjJrGAPSw"],
    ["Counting Crows","Accidentally In Love","2Y6uY65ZwKl9WbVOvKyZg6"],
    ["Jimi Hendrix","All Along the Watchtower","2aoo2jlRnM3A0NyLQqMN2f"],
    ["The Clash","Rock the Casbah","56KqaFSGTb7ifpt16t5Y1N"],
    ["Lenny Kravitz","Are You Gonna Go My Way","45Ia1U4KtIjAPPU7Wv1Sea"],
    ["Ozzy Osbourne","Mama, I'm Coming Home","0S3gpZzlT9Hb7CCSV2owX7"],
    ["Ozzy Osbourne","I Don't Know","2lxq02Zit1kI8S0THAYkAZ"],
    ["Ozzy Osbourne","Goodbye to Romance","44iFQNDCVfv2WHPdn7Wy1R"],
    ["Ozzy Osbourne","Dee","5S9ROQ9y28eeWpyjfQVSQb"],
    ["Ozzy Osbourne","Suicide Solution","7vGOHxPXPDEc3YOyihLuPt"],
    ["Ozzy Osbourne","Mr. Crowley","2ov8L95QD25TLpZAZPYWXL"],
    ["Ozzy Osbourne","No Bone Movies","15lK1Uk4blchBRnr3n7vTl"],
    ["Ozzy Osbourne","Revelation (Mother Earth)","0VKMOwKyRKbw0HrNAXj0UI"],
    ["Ozzy Osbourne","Steal Away (The Night)","5BVb65SJkOp1djZlzJOxLT"],
    ["Ozzy Osbourne","You Looking at Me, Looking at You","7Alh3BJqPxg660dYZuL6YJ"],
    ["Ozzy Osbourne","You Said It All","2yK7y44yIknjKsfY0PTAAT"],
    ["Ozzy Osbourne","Mr. Tinkertrain","7hjIktpd4oMAnMvFymDZIt"]
  ];

  var isRu = (document.documentElement.lang || "").indexOf("ru") === 0;
  var SPOTIFY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>';

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var items = TRACKS.map(function (t) {
    return '<span class="np-item">' + esc(t[0]) + " — " + esc(t[1]) + "</span>";
  }).join('<span class="np-dot" aria-hidden="true">·</span>');

  var label = isRu ? "Открыть плейлист в Spotify" : "Open the playlist on Spotify";
  var ARROW = '<svg class="np-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // The whole ticker is one link to the playlist.
  var bar = document.createElement("a");
  bar.className = "now-playing";
  bar.href = PLAYLIST;
  bar.target = "_blank";
  bar.rel = "noreferrer";
  bar.setAttribute("aria-label", label);
  bar.innerHTML =
    '<span class="np-logo" aria-hidden="true">' + SPOTIFY + "</span>" +
    '<span class="np-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '<span class="np-window" aria-hidden="true"><span class="np-track">' +
      '<span class="np-run">' + items + '<span class="np-dot">·</span></span>' +
      '<span class="np-run">' + items + '<span class="np-dot">·</span></span>' +
    "</span></span>" + ARROW +
    '<span class="np-tip" aria-hidden="true">' + label + " ↗</span>";

  // Mobile: in the intro under the contact icons. Desktop: fixed to the top (CSS).
  var dock = document.querySelector(".intro .contact-dock");
  if (dock && dock.parentNode) dock.parentNode.insertBefore(bar, dock.nextSibling);
  else document.body.appendChild(bar);

  requestAnimationFrame(function () {
    var run = bar.querySelector(".np-run");
    bar.querySelector(".np-track").style.setProperty("--np-duration", Math.round(run.scrollWidth / 36) + "s");
    bar.classList.add("is-visible");
  });
})();
