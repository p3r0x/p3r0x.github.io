(function () {
  const isHome =
    location.pathname === "/" ||
    location.pathname === "/index.html";

  if (!isHome) return;

  const backgrounds = [
    { type: "image", src: "/background/1.jpg" },
    { type: "video", src: "/background/2.mp4" }
  ];
  const chosen = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const introSrc = "/background/intro-opening.mp4";

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

    return video;
  }

  function playIntroOpening() {
    if (chosen.type !== "video") return;
    if (chosen.src !== "/background/2.mp4") return;

    const intro = document.createElement("div");
    intro.id = "intro-opening";
    intro.setAttribute("aria-hidden", "true");

    const video = document.createElement("video");
    video.id = "intro-opening-video";
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const source = document.createElement("source");
    source.src = introSrc;
    source.type = "video/mp4";
    video.appendChild(source);
    intro.appendChild(video);
    document.body.appendChild(intro);

    function hideIntro() {
      intro.classList.add("is-hidden");
      window.setTimeout(function () {
        intro.remove();
      }, 650);
    }

    video.addEventListener("ended", hideIntro, { once: true });
    video.addEventListener("error", hideIntro, { once: true });

    const play = video.play();
    if (play && typeof play.catch === "function") play.catch(hideIntro);

    window.setTimeout(hideIntro, 6200);
  }

  function applyBackground(background) {
    if (background.type === "video") {
      setVideoBackground(background.src);
      return;
    }

    setImageBackground(background.src);
  }

  const style = document.createElement("style");
  style.textContent = `
    #welcome-screen{
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
    }
    #welcome-screen::before{
      content:"";
      position:absolute;
      inset:0;
      background:rgba(255,255,255,0.12);
      pointer-events:none;
    }
    #intro-opening{
      position:fixed;
      inset:0;
      z-index:100000;
      background:transparent;
      overflow:hidden;
      opacity:1;
      transition:opacity 600ms ease, visibility 600ms ease;
    }
    #intro-opening.is-hidden{
      opacity:0;
      visibility:hidden;
      pointer-events:none;
    }
    #intro-opening video{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
      opacity:0.92;
      mix-blend-mode:screen;
      filter:contrast(1.08) saturate(1.08);
    }
    #intro-opening::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0, rgba(255,255,255,0) 54%),
        linear-gradient(to bottom, rgba(0,0,0,0.04), rgba(0,0,0,0.08));
      pointer-events:none;
    }
  `;
  document.head.appendChild(style);

  function injectWelcome() {
    if (document.getElementById("welcome-screen")) return;

    const section = document.createElement("section");
    section.id = "welcome-screen";
    document.body.insertBefore(section, document.body.firstChild);

    applyBackground(chosen);
    playIntroOpening();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectWelcome);
  } else {
    injectWelcome();
  }
})();
