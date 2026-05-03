(function () {
  const isHome =
    location.pathname === "/" ||
    location.pathname === "/index.html";

  if (isHome) return;

  const backgrounds = [
    { type: "image", src: "/background/1.jpg" },
    { type: "video", src: "/background/2.mp4" }
  ];

  const chosen = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  function removeVideoBackground() {
    const video = document.getElementById("site-video-bg");
    if (video) video.remove();
    document.body.classList.remove("has-video-background");
  }

  function setImageBackground(src) {
    removeVideoBackground();
    document.documentElement.style.setProperty("--bg-img", `url("${src}")`);
  }

  function setVideoBackground(src) {
    document.documentElement.style.setProperty("--bg-img", "none");
    document.body.classList.add("has-video-background");

    let video = document.getElementById("site-video-bg");
    if (!video) {
      video = document.createElement("video");
      video.id = "site-video-bg";
      video.className = "site-video-bg";
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("aria-hidden", "true");
      document.body.prepend(video);
    }

    if (video.dataset.src !== src) {
      video.dataset.src = src;
      video.innerHTML = "";

      const source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      video.appendChild(source);
      video.load();
    }

    const play = video.play();
    if (play && typeof play.catch === "function") play.catch(function () {});
  }

  function applyBackground(background) {
    if (background.type === "video") {
      setVideoBackground(background.src);
      return;
    }

    setImageBackground(background.src);
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    applyBackground(chosen);
  });
})();
