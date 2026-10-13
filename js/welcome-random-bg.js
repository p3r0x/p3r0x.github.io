(function () {
  const isHome =
    location.pathname === "/" ||
    location.pathname === "/index.html";

  if (!isHome) return;

  const images = ["/background/1.jpg", "/background/2.jpg"];
  const chosen = images[Math.floor(Math.random() * images.length)];

  function setTextStyleByImage(url) {
    const img = new Image();
    img.onload = function () {
      try {
        const w = 32, h = 32;
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;

        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          n++;
        }
        r /= n; g /= n; b /= n;

        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const lightText = luminance < 140;

        const el = document.getElementById("welcome-text");
        if (!el) return;

        el.style.color = lightText ? "rgba(255,255,255,0.94)" : "rgba(15,15,15,0.92)";
        el.style.textShadow = lightText
          ? "2px 2px 10px rgba(0,0,0,0.55)"
          : "2px 2px 10px rgba(255,255,255,0.75)";
      } catch (e) {
        const el = document.getElementById("welcome-text");
        if (el) {
          el.style.color = "rgba(255,255,255,0.94)";
          el.style.textShadow = "2px 2px 10px rgba(0,0,0,0.55)";
        }
      }
    };
    img.onerror = function () {
      const el = document.getElementById("welcome-text");
      if (el) {
        el.style.color = "rgba(255,255,255,0.94)";
        el.style.textShadow = "2px 2px 10px rgba(0,0,0,0.55)";
      }
    };
    img.src = url;
  }

  const style = document.createElement("style");
  style.textContent = `
    body{
      background-color:#f5f5f5;
      background-image:url("${chosen}");
      background-repeat:no-repeat;
      background-position:center top;
      background-size:cover;
      background-attachment:fixed;
    }
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
    #welcome-text{
      position:relative;
      font-size:3rem;
      font-weight:bold;
      white-space:nowrap;
      padding:0 16px;
      text-align:center;
      margin-top:-10vh;
    }
  `;
  document.head.appendChild(style);

  function injectWelcome() {
    if (document.getElementById("welcome-screen")) return;

    const section = document.createElement("section");
    section.id = "welcome-screen";
    section.innerHTML = `<div id="welcome-text"></div>`;
    document.body.insertBefore(section, document.body.firstChild);

    setTextStyleByImage(chosen);
    startTypewriter();
  }

  function startTypewriter() {
    const lines = ["格密码好难学啊", "分组密码也好难学啊", "椭圆曲线加密也好难学啊"];
    const el = document.getElementById("welcome-text");
    if (!el) return;

    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;

    let timerId = null;
    let running = false;

    function isInWelcome() {
      const welcome = document.getElementById("welcome-screen");
      return !!(welcome && window.scrollY < welcome.offsetHeight - 10);
    }

    function schedule(ms) {
      timerId = setTimeout(loop, ms);
    }

    function stopLoop() {
      if (timerId) clearTimeout(timerId);
      timerId = null;
      running = false;
    }

    function loop() {
      if (!isInWelcome()) {
        stopLoop();
        return;
      }

      running = true;

      const current = lines[lineIndex];

      if (!deleting) {
        el.textContent = current.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          deleting = true;
          schedule(1200);
          return;
        }
      } else {
        el.textContent = current.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
        }
      }

      schedule(deleting ? 100 : 150);
    }

    function maybeResume() {
      if (isInWelcome() && !running) loop();
    }

    schedule(500);
    window.addEventListener("scroll", maybeResume, { passive: true });
    window.addEventListener("resize", maybeResume);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectWelcome);
  } else {
    injectWelcome();
  }
})();
