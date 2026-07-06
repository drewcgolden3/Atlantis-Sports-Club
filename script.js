/* =============================================================================
   ATLANTIS SPORTS CLUB — behavior
   Reads window.ATLANTIS_CONFIG (config.js) and wires everything up.
   ============================================================================ */
(function () {
  "use strict";
  var CFG = window.ATLANTIS_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------- helpers -------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ============================================================= CONFIG TEXT */
  // Opening label
  $all("[data-opening-label]").forEach(function (el) {
    if (CFG.openingLabel) el.textContent = CFG.openingLabel;
  });
  // Presale pricing
  if (CFG.presale) {
    $all("[data-presale-down]").forEach(function (el) { if (CFG.presale.down) el.textContent = CFG.presale.down; });
    $all("[data-presale-monthly]").forEach(function (el) { if (CFG.presale.monthly) el.textContent = CFG.presale.monthly; });
  }
  // Contact / address
  if (CFG.contact) {
    var c = CFG.contact;
    if ($("[data-addr1]") && c.addressLine1) $("[data-addr1]").textContent = c.addressLine1;
    if ($("[data-addr2]") && c.addressLine2) $("[data-addr2]").textContent = c.addressLine2;
    if ($("[data-venue]") && c.venue) $("[data-venue]").textContent = c.venue;

    var emailLink = $("#emailLink");
    if (emailLink && c.email) { emailLink.textContent = c.email; emailLink.href = "mailto:" + c.email; }

    var phoneWrap = $("[data-phone-wrap]");
    if (phoneWrap) {
      if (c.phone) {
        var a = document.createElement("a");
        a.href = "tel:" + c.phone.replace(/[^0-9+]/g, "");
        a.textContent = c.phone;
        phoneWrap.appendChild(a);
      }
    }
    // Map embed
    var mapFrame = $("#mapFrame");
    if (mapFrame && c.mapEmbed) mapFrame.src = c.mapEmbed;
    var dirBtn = $("#directionsBtn");
    if (dirBtn && c.mapLink) { dirBtn.href = c.mapLink; dirBtn.target = "_blank"; dirBtn.rel = "noopener"; }
  }
  // Social
  if (CFG.social) {
    var social = $("#footerSocial");
    var icons = {
      instagram: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
      facebook: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.29-.04-1.3-.13-2.46-.13-2.43 0-4.09 1.48-4.09 4.21v2.35H7.7V13h2.75v8h3.05z"/></svg>'
    };
    if (social) {
      Object.keys(icons).forEach(function (key) {
        if (CFG.social[key]) {
          var a = document.createElement("a");
          a.href = CFG.social[key]; a.target = "_blank"; a.rel = "noopener";
          a.setAttribute("aria-label", key.charAt(0).toUpperCase() + key.slice(1));
          a.innerHTML = icons[key];
          social.appendChild(a);
        }
      });
    }
  }

  /* ============================================================= IMAGES */
  // For each element with data-img="key", look up CFG.images[key]. If the file
  // loads, use it as a background. If not, the CSS gradient placeholder stays.
  var imgMap = CFG.images || {};
  $all("[data-img]").forEach(function (el) {
    var key = el.getAttribute("data-img");
    var src = imgMap[key];
    if (!src) return;
    var target = el.querySelector(".amenity__media, .book-card__media") || el;
    var probe = new Image();
    probe.onload = function () {
      target.style.backgroundImage =
        "linear-gradient(180deg, rgba(4,27,43,0) 40%, rgba(4,27,43,.15) 100%), url('" + src + "')";
      el.classList.add("has-img");
    };
    probe.onerror = function () { /* keep gradient placeholder */ };
    probe.src = src;
  });

  /* ============================================================= LINKS */
  // Wire every [data-link="key"] to CFG.links[key]. If not set (still "#"),
  // clicking shows a friendly "coming soon" note instead of a dead link.
  var links = CFG.links || {};
  $all('[data-link]').forEach(function (el) {
    var key = el.getAttribute("data-link");
    if (key === "map" || key === "email") return; // handled above
    var url = links[key];
    if (url && url !== "#") {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        toast("Booking opens soon — check back as we approach opening day!");
      });
    }
  });

  /* -------- lightweight toast -------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.setAttribute("role", "status");
      toastEl.style.cssText =
        "position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(20px);" +
        "background:#082F49;color:#fff;padding:14px 22px;border-radius:999px;font-family:Barlow,sans-serif;" +
        "font-weight:600;box-shadow:0 20px 40px -12px rgba(8,47,73,.6);z-index:1000;opacity:0;" +
        "transition:opacity .3s ease, transform .3s ease;max-width:90vw;text-align:center;";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () {
      toastEl.style.opacity = "1";
      toastEl.style.transform = "translateX(-50%) translateY(0)";
    });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () {
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateX(-50%) translateY(20px)";
    }, 3600);
  }

  /* ============================================================= COUNTDOWN */
  var target = new Date(CFG.openingDate || "2027-07-07T09:00:00").getTime();
  var cd = {
    days: $('[data-cd="days"]'), hours: $('[data-cd="hours"]'),
    mins: $('[data-cd="mins"]'), secs: $('[data-cd="secs"]')
  };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tickCountdown() {
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if (cd.days) cd.days.textContent = d;
    if (cd.hours) cd.hours.textContent = pad(h);
    if (cd.mins) cd.mins.textContent = pad(m);
    if (cd.secs) cd.secs.textContent = pad(s);
  }
  if (cd.days) { tickCountdown(); setInterval(tickCountdown, 1000); }

  /* ============================================================= NAV */
  var nav = $("#nav");
  var onScrollNav = function () {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  // mobile menu
  var toggle = $("#navToggle");
  var mobile = $("#navMobile");
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $all("a", mobile).forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============================================================= HERO INTERACTIONS */
  // Cursor-following glow (skipped for reduced motion / touch)
  var glow = $("#heroGlow");
  var heroMedia = $("#heroMedia");
  if (glow && heroMedia && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    var raf = null, gx = 0, gy = 0;
    heroMedia.addEventListener("pointermove", function (e) {
      var rect = heroMedia.getBoundingClientRect();
      gx = e.clientX - rect.left; gy = e.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(function () {
        glow.style.transform = "translate(" + (gx - glow.offsetWidth / 2) + "px," + (gy - glow.offsetHeight / 2) + "px)";
        glow.style.opacity = "1";
        raf = null;
      });
    });
    heroMedia.addEventListener("pointerleave", function () { glow.style.opacity = "0"; });
  } else if (glow) {
    glow.style.opacity = "0";
  }

  // Subtle parallax on hero content while scrolling through the hero
  var heroContent = $(".hero__content");
  var heroVideo = $("#heroVideo");
  if (!reduceMotion && heroContent) {
    var parallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = "translateY(" + (y * 0.18) + "px)";
        heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
        if (heroVideo) heroVideo.style.transform = "scale(" + (1 + y / 6000) + ")";
      }
    };
    window.addEventListener("scroll", parallax, { passive: true });
  }

  // Sound toggle
  var soundBtn = $("#soundToggle");
  if (soundBtn && heroVideo) {
    soundBtn.addEventListener("click", function () {
      heroVideo.muted = !heroVideo.muted;
      var on = !heroVideo.muted;
      soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); }
    });
  }

  /* ============================================================= REVEAL ON SCROLL */
  var reveals = $all(".reveal, .amenity, .book-card, .price-card, .section__head");
  if ("IntersectionObserver" in window && !reduceMotion) {
    // ensure targets start hidden for the ones not already .reveal
    reveals.forEach(function (el) { if (!el.classList.contains("reveal")) { el.classList.add("reveal"); } });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ============================================================= SIGNUP FORM */
  var form = $("#signupForm");
  if (form) {
    var msg = $("#signupMsg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("#email", form);
      var val = (input.value || "").trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) {
        msg.textContent = "Please enter a valid email address.";
        msg.classList.add("is-error");
        input.focus();
        return;
      }
      msg.classList.remove("is-error");
      // If a membership/waitlist link exists, send them there; else confirm inline.
      var wl = (CFG.links && CFG.links.membership) || "";
      msg.textContent = "You're on the list! We'll be in touch with presale details. 🌊".replace("🌊", "");
      form.reset();
      if (wl && wl !== "#") { window.open(wl, "_blank", "noopener"); }
    });
  }

  /* ============================================================= FOOTER YEAR */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
