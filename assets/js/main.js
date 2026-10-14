// ClerkBrain marketing site - small vanilla-JS helpers (no framework, no tracking).
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  // Scroll-reveal
  var revealed = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealed.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("visible"); });
  }
})();

// Screenshot viewer: opens a full-size screenshot over the page instead of a new tab.
(function () {
  "use strict";
  var links = document.querySelectorAll("a.zoom");
  if (!links.length) return;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Screenshot");
  box.hidden = true;
  box.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close screenshot">&times; Close</button>' +
    '<img class="lightbox-img" alt="">' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(box);

  var img = box.querySelector(".lightbox-img");
  var caption = box.querySelector(".lightbox-caption");
  var closeBtn = box.querySelector(".lightbox-close");
  var lastLink = null;

  function open(link) {
    var thumb = link.querySelector("img");
    img.src = link.getAttribute("href");
    img.alt = thumb ? thumb.alt : "";
    caption.textContent = thumb ? thumb.alt : "";
    lastLink = link;
    box.hidden = false;
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    img.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    if (lastLink) lastLink.focus();
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return; // keep "open in new tab" when asked for
      e.preventDefault();
      open(link);
    });
  });

  closeBtn.addEventListener("click", close);
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (!box.hidden && (e.key === "Escape" || e.key === "Tab")) {
      if (e.key === "Escape") close();
      else { e.preventDefault(); closeBtn.focus(); }
    }
  });
})();
