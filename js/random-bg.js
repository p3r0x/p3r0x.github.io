(function () {
  const imgs = [
    "/background/1.jpg",
    "/background/2.jpg"
  ];

  const img = imgs[Math.floor(Math.random() * imgs.length)];

  document.addEventListener("DOMContentLoaded", function () {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        background-image: url("${img}") !important;
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
        background-attachment: fixed;
      }
    `;
    document.head.appendChild(style);
  });
})();
