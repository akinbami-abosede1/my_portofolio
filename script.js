/* ==========================================================
   Portfolio interactions: mobile menu, active link,
   header shadow, image fallbacks, footer year
   ========================================================== */
(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));

  /* ---------- Mobile menu ---------- */
  const setMenu = (open) => {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close the menu after choosing a link
    navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

    // Close with Escape and return focus to the button
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });

    // Close when clicking outside the header
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) setMenu(false);
    });

    // Reset when resizing up to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 880) setMenu(false);
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Highlight the current section in the nav ---------- */
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Image fallbacks ----------
     If an image file is missing, hide the broken image and show the
     labelled placeholder. When the file exists, hide the placeholder. */
  document.querySelectorAll(".media img").forEach((img) => {
    const figure = img.closest(".media");
    if (!figure) return;

    const showImage = () => {
      img.classList.remove("is-missing");
      figure.classList.add("has-image");
    };
    const showPlaceholder = () => {
      img.classList.add("is-missing");
      figure.classList.remove("has-image");
    };

    img.addEventListener("load", () => (img.naturalWidth > 0 ? showImage() : showPlaceholder()));
    img.addEventListener("error", showPlaceholder);

    // Handle images that finished loading before this script ran
    if (img.complete && img.naturalWidth > 0) showImage();
    else if (img.complete && img.naturalWidth === 0 && img.loading !== "lazy") showPlaceholder();
  });

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();