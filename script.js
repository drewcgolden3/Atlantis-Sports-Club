/* =============================================================================
   ATLANTIS SPORTS CLUB — behavior (multi-page)
   Injects the shared header + footer, fills pricing/contact from config.js,
   and wires up interactions. Each page sets <body data-page="..."> so the nav
   knows which link is active.
   ============================================================================ */
(function () {
  "use strict";
  var CFG = window.ATLANTIS_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = document.body.getAttribute("data-page") || "home";

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- pricing helpers ---------- */
  var pr = CFG.pricing || {};
  var cur = pr.currency || "$";
  function money(n) { return cur + Number(n).toLocaleString(); }
  var saveDown = (pr.regularDown || 0) - (pr.foundingDown || 0);
  var saveMonthly = (pr.regularMonthly || 0) - (pr.foundingMonthly || 0);
  var priceValues = {
    foundingDown: money(pr.foundingDown),
    foundingMonthly: money(pr.foundingMonthly),
    regularDown: money(pr.regularDown),
    regularMonthly: money(pr.regularMonthly),
    saveDown: money(saveDown),
    saveMonthly: money(saveMonthly),
    spots: Number(pr.foundingSpots || 500).toLocaleString(),
  };

  var NAV = [
    { key: "presale",   label: "Presale",   href: "presale.html" },
    { key: "amenities", label: "Amenities", href: "amenities.html" },
    { key: "booking",   label: "Book",      href: "booking.html" },
    { key: "location",  label: "Location",  href: "location.html" },
  ];

  /* ============================================================= HEADER */
  var announceText =
    "Founding Member Presale — the first " + priceValues.spots +
    " lock in " + money(pr.foundingMonthly) + "/mo <em>for life</em>. Regularly " +
    money(pr.regularMonthly) + "/mo.";

  var brand =
    '<a href="index.html" class="brand" aria-label="Atlantis Sports Club home">' +
      '<span class="brand__mark" aria-hidden="true">' +
        '<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M2 22c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>' +
          '<path d="M2 27c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>' +
          '<path d="M16 4l3.2 6.5 7.2 1-5.2 5.1 1.2 7.1L16 20.4 9.4 23.7l1.2-7.1L5.4 11.5l7.2-1L16 4z"/>' +
        '</svg>' +
      '</span>' +
      '<span class="brand__text">Atlantis<span class="brand__sub">Sports Club</span></span>' +
    '</a>';

  function navLinks(cls) {
    return NAV.map(function (n) {
      var active = n.key === page ? ' class="is-active" aria-current="page"' : "";
      return '<a href="' + n.href + '"' + active + '>' + n.label + "</a>";
    }).join("");
  }

  var headerHTML =
    '<div class="announce"><span>' + announceText +
      ' <a href="presale.html">See the deal &rarr;</a></span></div>' +
    '<header class="nav" id="nav"><div class="nav__inner">' +
      brand +
      '<nav class="nav__links" aria-label="Primary">' + navLinks() + '</nav>' +
      '<a href="presale.html" class="btn btn--primary btn--sm nav__cta">Join the Presale</a>' +
      '<button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</div>' +
    '<div class="nav__mobile" id="navMobile">' + navLinks() +
      '<a href="presale.html" class="btn btn--primary">Join the Presale</a>' +
    '</div></header>';

  var headerMount = $("#siteHeader");
  if (headerMount) headerMount.innerHTML = headerHTML;

  /* ============================================================= FOOTER */
  var footerHTML =
    '<div class="container footer__inner">' +
      '<div class="footer__brand">' +
        '<span class="brand__text">Atlantis<span class="brand__sub">Sports Club</span></span>' +
        '<p>Opening <span data-opening-label>July 7, 2027</span> in East Sandwich, MA.</p>' +
      '</div>' +
      '<nav class="footer__links" aria-label="Footer">' +
        NAV.map(function (n) { return '<a href="' + n.href + '">' + n.label + "</a>"; }).join("") +
      '</nav>' +
      '<div class="footer__contact">' +
        '<a href="#" data-link="email" id="emailLink">hello@atlantissportsclub.com</a>' +
        '<p class="footer__phone" data-phone-wrap></p>' +
        '<div class="footer__social" id="footerSocial"></div>' +
      '</div>' +
    '</div>' +
    '<div class="footer__legal"><div class="container"><span>&copy; <span id="year">2027</span> Atlantis Sports Club. All rights reserved.</span></div></div>';

  var footerMount = $("#siteFooter");
  if (footerMount) footerMount.innerHTML = footerHTML;

  /* ============================================================= PRICING FILL */
  $all("[data-price]").forEach(function (el) {
    var key = el.getAttribute("data-price");
    if (priceValues[key] != null) el.textContent = priceValues[key];
  });

  // Scarcity progress bar (only if spotsRemaining is a number)
  (function () {
    var bar = $("#scarcityBar");
    if (!bar) return;
    var total = Number(pr.foundingSpots || 500);
    var remaining = pr.spotsRemaining;
    if (remaining == null || isNaN(Number(remaining))) { bar.remove(); return; }
    remaining = Number(remaining);
    var claimed = Math.max(0, total - remaining);
    var pct = Math.min(100, Math.round((claimed / total) * 100));
    var fill = $(".scarcity__fill", bar);
    var label = $(".scarcity__label", bar);
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = claimed.toLocaleString() + " of " + total.toLocaleString() +
      " founding spots claimed — only " + remaining.toLocaleString() + " left";
  })();

  /* ============================================================= CONFIG TEXT */
  $all("[data-opening-label]").forEach(function (el) { if (CFG.openingLabel) el.textContent = CFG.openingLabel; });

  if (CFG.contact) {
    var c = CFG.contact;
    if ($("[data-addr1]") && c.addressLine1) $("[data-addr1]").textContent = c.addressLine1;
    if ($("[data-addr2]") && c.addressLine2) $("[data-addr2]").textContent = c.addressLine2;
    if ($("[data-venue]") && c.venue) $("[data-venue]").textContent = c.venue;

    var emailLink = $("#emailLink");
    if (emailLink && c.email) { emailLink.textContent = c.email; emailLink.href = "mailto:" + c.email; }

    var phoneWrap = $("[data-phone-wrap]");
    if (phoneWrap && c.phone) {
      var a = document.createElement("a");
      a.href = "tel:" + c.phone.replace(/[^0-9+]/g, "");
      a.textContent = c.phone;
      phoneWrap.appendChild(a);
    }
    var mapFrame = $("#mapFrame");
    if (mapFrame && c.mapEmbed) mapFrame.src = c.mapEmbed;
    var dirBtn = $("#directionsBtn");
    if (dirBtn && c.mapLink) { dirBtn.href = c.mapLink; dirBtn.target = "_blank"; dirBtn.rel = "noopener"; }
  }

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
    probe.src = src;
  });

  /* ============================================================= LINKS (Mindbody) */
  var links = CFG.links || {};
  $all("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    if (key === "map" || key === "email") return;
    var url = links[key];
    if (url && url !== "#") {
      el.href = url; el.target = "_blank"; el.rel = "noopener";
    } else {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        toast("Booking opens soon — check back as we approach opening day!");
      });
    }
  });

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
      toastEl.style.opacity = "1"; toastEl.style.transform = "translateX(-50%) translateY(0)";
    });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () {
      toastEl.style.opacity = "0"; toastEl.style.transform = "translateX(-50%) translateY(20px)";
    }, 3600);
  }

  /* ============================================================= COUNTDOWN */
  var cdEls = { days: $('[data-cd="days"]'), hours: $('[data-cd="hours"]'), mins: $('[data-cd="mins"]'), secs: $('[data-cd="secs"]') };
  if (cdEls.days || cdEls.hours) {
    var target = new Date(CFG.openingDate || "2027-07-07T09:00:00").getTime();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var tick = function () {
      var diff = target - Date.now(); if (diff < 0) diff = 0;
      var d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
          m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
      if (cdEls.days) cdEls.days.textContent = d;
      if (cdEls.hours) cdEls.hours.textContent = pad(h);
      if (cdEls.mins) cdEls.mins.textContent = pad(m);
      if (cdEls.secs) cdEls.secs.textContent = pad(s);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ============================================================= NAV BEHAVIOR */
  var nav = $("#nav");
  if (nav) {
    var onScrollNav = function () { nav.classList.toggle("is-scrolled", window.scrollY > 40); };
    onScrollNav();
    window.addEventListener("scroll", onScrollNav, { passive: true });
  }
  var toggle = $("#navToggle"), mobile = $("#navMobile");
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

  /* ============================================================= HERO (home) */
  var glow = $("#heroGlow"), heroMedia = $("#heroMedia");
  if (glow && heroMedia && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    var raf = null, gx = 0, gy = 0;
    heroMedia.addEventListener("pointermove", function (e) {
      var rect = heroMedia.getBoundingClientRect();
      gx = e.clientX - rect.left; gy = e.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(function () {
        glow.style.transform = "translate(" + (gx - glow.offsetWidth / 2) + "px," + (gy - glow.offsetHeight / 2) + "px)";
        glow.style.opacity = "1"; raf = null;
      });
    });
    heroMedia.addEventListener("pointerleave", function () { glow.style.opacity = "0"; });
  } else if (glow) { glow.style.opacity = "0"; }

  var heroContent = $(".hero__content"), heroVideo = $("#heroVideo");
  if (!reduceMotion && heroContent) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = "translateY(" + (y * 0.18) + "px)";
        heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
        if (heroVideo) heroVideo.style.transform = "scale(" + (1 + y / 6000) + ")";
      }
    }, { passive: true });
  }

  var soundBtn = $("#soundToggle");
  if (soundBtn && heroVideo) {
    soundBtn.addEventListener("click", function () {
      heroVideo.muted = !heroVideo.muted;
      var on = !heroVideo.muted;
      soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); }
    });
  }

  /* ============================================================= REVEAL */
  var reveals = $all(".reveal, .amenity, .book-card, .plan, .section__head, .explore-card");
  if ("IntersectionObserver" in window && !reduceMotion) {
    reveals.forEach(function (el) { if (!el.classList.contains("reveal")) el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ============================================================= SIGNUP */
  var form = $("#signupForm");
  if (form) {
    var msg = $("#signupMsg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("#email", form);
      var val = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg.textContent = "Please enter a valid email address."; msg.classList.add("is-error"); input.focus(); return;
      }
      msg.classList.remove("is-error");
      msg.textContent = "You're on the list! We'll be in touch with presale details.";
      form.reset();
      var wl = (CFG.links && CFG.links.membership) || "";
      if (wl && wl !== "#") window.open(wl, "_blank", "noopener");
    });
  }

  /* ============================================================= YEAR */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
