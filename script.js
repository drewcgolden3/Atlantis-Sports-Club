/* =============================================================================
   ATLANTIS SPORTS CLUB — behavior (multi-page)
   Injects the shared header + footer, fills pricing/contact from config.js,
   and wires up interactions. Each page sets <body data-page="..."> so the nav
   knows which link is active.
   ============================================================================ */
(function () {
  "use strict";
  var CFG = window.ATLANTIS_CONFIG || {};

  /* Copy that this file builds rather than reads from the page — the
     announcement bar and the pricing disclaimer both splice numbers from
     config.js into a sentence. The dictionary in assets/pt.js can't reach those
     because the numbers change, so they pick their own language here. */
  var LANG = (window.ASC_LANG === "pt") ? "pt" : "en";
  function t(en, pt) { return LANG === "pt" ? pt : en; }
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = document.body.getAttribute("data-page") || "home";

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- known-visitor id ----------
     Once someone has given us their details through any form on the site,
     Switchboard hands back the lead id it saved them under. Keeping it means a
     later click through to Mindbody can be attributed to that person rather
     than landing anonymously — which is what moves them along the pipeline
     without the club having to notice and do it by hand.

     Survives across pages by design: the form is usually on a different page
     from the booking link. Stored per client so a shared browser can't leak
     one club's lead id into another's. */
  var SB_LEAD_KEY = "sb_lead_" + ((CFG.chat && CFG.chat.clientSlug) || "atlantis-sports-club");

  function rememberLead(data) {
    try {
      if (data && data.id) localStorage.setItem(SB_LEAD_KEY, data.id);
    } catch (e) {}
    return data; // pass-through: callers keep using the parsed body as before
  }

  function sbLeadId() {
    try {
      return localStorage.getItem(SB_LEAD_KEY);
    } catch (e) {
      return null;
    }
  }

  /* ---------- campaign attribution ----------
     An ad link lands on the home page carrying ?utm_source=facebook, but the
     form is two pages later, by which point the URL is clean. So the tags are
     read on the first page of the visit and kept for the session, then sent
     with whatever the visitor eventually submits. First touch wins: a later
     untagged page never overwrites the ad that actually earned the visit. */
  var ATTRIBUTION = (function () {
    var KEY = "asc_attribution";
    var params = new URLSearchParams(window.location.search);
    var fromUrl = {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
      // Printed QR codes carry ?src=fitness-flyer so the dashboard can tell a
      // scan off a gym flyer from a scan off a radio ad. Kept for the whole
      // session like the utm tags, because the scan lands on /join but the
      // form they fill in is a page or two later.
      qr_source: params.get("src") || "",
      landing_path: window.location.pathname,
      referrer: document.referrer || "",
    };

    var stored = null;
    try { stored = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) {}

    // Keep what's stored, unless this page carries tags and the stored visit
    // didn't — someone who browsed organically then clicked an ad should be
    // credited to the ad.
    var useUrl = !stored ||
      (fromUrl.utm_source && !stored.utm_source) ||
      (fromUrl.qr_source && !stored.qr_source);
    var attribution = useUrl ? fromUrl : stored;

    if (useUrl) {
      try { sessionStorage.setItem(KEY, JSON.stringify(attribution)); } catch (e) {}
    }
    // Exposed so the chat widget can tag its page views the same way.
    window.ATLANTIS_ATTRIBUTION = attribution;
    return attribution;
  })();

  /* ---------- pricing helpers ----------
     Every membership price on this site is BIWEEKLY — 26 payments a year. The
     word "biweekly" is baked into the tokens below rather than left to each
     page's markup, because a stray "/month" on one page is the single most
     expensive mistake this site can make. */
  var pr = CFG.pricing || {};
  var cur = pr.currency || "$";
  function money(n) { return cur + Number(n).toLocaleString(); }
  var saveEnrollment = (pr.regularEnrollment || 0) - (pr.enrollment || 0);
  var priceValues = {
    // The three individual membership levels
    fitness:      money(pr.fitness),
    fitnessPool:  money(pr.fitnessPool),
    complete:     money(pr.complete),

    // Student rates (30% off) and their reduced enrollment
    studentFitness:     money(pr.studentFitness),
    studentFitnessPool: money(pr.studentFitnessPool),
    studentComplete:    money(pr.studentComplete),
    studentEnrollment:  money(pr.studentEnrollment),

    // Couples: per person, plus the pair total the card is actually charged.
    // The pair figure is derived rather than configured — a couples rate that
    // says "$44 each" next to a total that isn't $88 is a chargeback waiting
    // to happen, so there is only one number to keep correct.
    couplesFitnessEach:      money(pr.couplesFitnessEach),
    couplesFitnessPoolEach:  money(pr.couplesFitnessPoolEach),
    couplesCompleteEach:     money(pr.couplesCompleteEach),
    couplesFitnessPair:      money((pr.couplesFitnessEach || 0) * 2),
    couplesFitnessPoolPair:  money((pr.couplesFitnessPoolEach || 0) * 2),
    couplesCompletePair:     money((pr.couplesCompleteEach || 0) * 2),
    // Enrollment
    enrollment:        money(pr.enrollment),
    regularEnrollment: money(pr.regularEnrollment),
    saveEnrollment:    money(saveEnrollment),
    // Family. The saving figures are derived rather than configured — Paul wants
    // the value shown, and a hand-typed "save $780" that stops matching the
    // prices above is worse than not showing it at all.
    family:            money(pr.family),
    familyRegular:     money(pr.familyRegular),
    familyAdditional:  money(pr.familyAdditional),
    familyCovers:      String(pr.familyCovers || 4),
    // The bigger-household rates. Derived, so adding a dollar to the add-on
    // moves every button at once instead of leaving two of them stale.
    family5:           money((pr.family || 0) + (pr.familyAdditional || 0)),
    family6:           money((pr.family || 0) + (pr.familyAdditional || 0) * 2),
    familyCovers5:     String((pr.familyCovers || 4) + 1),
    familyCovers6:     String((pr.familyCovers || 4) + 2),
    familySave:        money((pr.familyRegular || 0) - (pr.family || 0)),
    familySaveYear:    money(((pr.familyRegular || 0) - (pr.family || 0)) * (pr.paymentsPerYear || 26)),

    // Billing cadence
    paymentsPerYear: String(pr.paymentsPerYear || 26),
    spots: Number(pr.foundingSpots || 500).toLocaleString(),
  };

  // The disclaimer Paul requires under every pricing table. Written once here
  // so it can never drift between pages.
  var PRICING_DISCLAIMER = t(
    "Membership dues are billed every two weeks. There are " +
      priceValues.paymentsPerYear + " biweekly payments each year. Certain programs, " +
      "services, and amenities may require additional fees or advance reservations. " +
      "Membership terms, operating hours, availability, and program schedules are " +
      "subject to change.",
    "As mensalidades são cobradas a cada duas semanas. São " +
      priceValues.paymentsPerYear + " pagamentos quinzenais por ano. Alguns programas, " +
      "serviços e estruturas podem exigir taxas adicionais ou reserva antecipada. " +
      "Condições do plano, horários de funcionamento, disponibilidade e grade de " +
      "programas estão sujeitos a alteração."
  );

  var NAV = [
    { key: "amenities",   label: "Fitness",         href: "amenities.html" },
    { key: "aquatics",    label: "Swim Lessons",    href: "aquatics.html" },
    { key: "training",    label: "Classes",         href: "training.html" },
    { key: "parties",     label: "Birthday Parties", href: "parties.html" },
    { key: "community",   label: "Community",       href: "community.html" },
    { key: "careers",     label: "Join the Team",   href: "careers.html" },
    { key: "location",    label: "Contact",         href: "location.html" },
  ];
  // On the home page, in-page links to #offer shouldn't reload the page.
  function pageHref(href) {
    return (page === "home" && href.indexOf("index.html#") === 0) ? href.slice("index.html".length) : href;
  }

  /* ============================================================= HEADER */
  // Two lengths of the same message: the full pitch has room on desktop, but on a
  // phone it ran to three lines and pushed the whole hero down the screen.
  var announceLong = t(
    "Founding Members — three levels from <em>" + priceValues.fitness +
      " biweekly</em>, plus " + priceValues.enrollment + " enrollment (reg. " +
      priceValues.regularEnrollment + "). Only " + priceValues.spots + " available.",
    "Sócios Fundadores — três níveis a partir de <em>" + priceValues.fitness +
      " quinzenais</em>, mais " + priceValues.enrollment + " de adesão (normal " +
      priceValues.regularEnrollment + "). Apenas " + priceValues.spots + " vagas."
  );
  var announceShort = t(
    "Founding Members — from <em>" + priceValues.fitness + " biweekly</em>.",
    "Sócios Fundadores — a partir de <em>" + priceValues.fitness + " quinzenais</em>."
  );

  var brand =
    '<a href="index.html" class="brand" aria-label="Atlantis Sports Clubs home">' +
      '<span class="brand__logo" role="img" aria-label="Atlantis Sports Clubs"></span>' +
    '</a>';

  function navLinks(cls) {
    return NAV.map(function (n) {
      var active = n.key === page ? ' class="is-active" aria-current="page"' : "";
      return '<a href="' + pageHref(n.href) + '"' + active + '>' + n.label + "</a>";
    }).join("");
  }

  // The presale lives on its own page now — the bar and the header CTA both
  // send visitors to the full offer, not to a section anchor.
  var offerHref = "memberships.html";
  var headerHTML =
    '<div class="announce">' +
      '<span class="announce__long">' + announceLong + '</span>' +
      '<span class="announce__short">' + announceShort + '</span>' +
      ' <a href="' + offerHref + '">' + t("See the deal", "Ver a oferta") + ' &rarr;</a></div>' +
    '<header class="nav" id="nav"><div class="nav__inner">' +
      brand +
      '<nav class="nav__links" aria-label="Primary">' + navLinks() + '</nav>' +
      // Language sits beside the join button, not buried in the menu — a
      // Portuguese speaker shouldn't have to read English to find it.
      '<span class="nav__lang" data-lang-toggle></span>' +
      '<a href="' + offerHref + '" class="btn btn--gold btn--sm nav__cta">Join Atlantis</a>' +
      '<button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</div>' +
    '<div class="nav__mobile" id="navMobile">' + navLinks() +
      '<a href="' + offerHref + '" class="btn btn--gold">Join Atlantis</a>' +
      '<span class="nav__lang nav__lang--mobile" data-lang-toggle></span>' +
    '</div></header>';

  var headerMount = $("#siteHeader");
  if (headerMount) headerMount.innerHTML = headerHTML;

  // The header is fixed and its height changes with the announcement bar's line
  // count, so publish the real measured height and let the layout key off it
  // instead of hard-coded padding that only happened to fit one breakpoint.
  function syncHeaderHeight() {
    if (!headerMount) return;
    var bar = $(".announce", headerMount);
    // .nav__inner, not .nav — the open mobile menu must not inflate the offset.
    var navEl = $(".nav__inner", headerMount);
    var h = (bar ? bar.offsetHeight : 0) + (navEl ? navEl.offsetHeight : 0);
    if (h) document.documentElement.style.setProperty("--header-h", h + "px");
  }
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight, { passive: true });
  window.addEventListener("orientationchange", syncHeaderHeight);
  // Fonts land after first paint and change the bar's wrap point.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeaderHeight);

  /* ============================================================= FOOTER */
  var footerHTML =
    '<div class="container footer__inner">' +
      '<div class="footer__brand">' +
        '<span class="brand__logo brand__logo--footer" role="img" aria-label="Atlantis Sports Clubs"></span>' +
        '<p>Opening <span data-opening-label>July 7, 2027</span> in Hyannis, MA.</p>' +
      '</div>' +
      '<nav class="footer__links" aria-label="Footer">' +
        NAV.map(function (n) { return '<a href="' + pageHref(n.href) + '">' + n.label + "</a>"; }).join("") +
      '</nav>' +
      '<div class="footer__contact">' +
        // Rendered from config rather than a hardcoded placeholder — a stale
        // address baked in here would show for real if the fill ever failed.
        '<a href="#" data-link="email" id="emailLink">' + ((CFG.contact && CFG.contact.email) || "") + '</a>' +
        '<p class="footer__phone" data-phone-wrap></p>' +
        '<div class="footer__social" id="footerSocial"></div>' +
      '</div>' +
    '</div>' +
    '<div class="footer__legal"><div class="container footer__legal-inner">' +
      '<span>&copy; <span id="year">2027</span> Atlantis Sports Club. All rights reserved.</span>' +
      '<span class="footer__credit">Website and lead capture by ' +
        '<a href="https://switchboardcompany.com" target="_blank" rel="noopener">The Switchboard Company</a>' +
      '</span>' +
    '</div></div>';

  var footerMount = $("#siteFooter");
  if (footerMount) footerMount.innerHTML = footerHTML;

  /* ============================================================= PRICING FILL */
  $all("[data-price]").forEach(function (el) {
    var key = el.getAttribute("data-price");
    if (priceValues[key] != null) el.textContent = priceValues[key];
  });

  // The required legal line under every pricing table. Any page that wants it
  // just drops <p class="disclaimer" data-disclaimer></p> and it fills itself,
  // so the wording stays identical everywhere it appears.
  $all("[data-disclaimer]").forEach(function (el) { el.textContent = PRICING_DISCLAIMER; });

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
  // A Portuguese page that says "July 7, 2027" reads like a half-finished
  // translation, so the date has its own label rather than being skipped.
  var openingLabel = t(CFG.openingLabel, CFG.openingLabelPt || CFG.openingLabel);
  $all("[data-opening-label]").forEach(function (el) { if (openingLabel) el.textContent = openingLabel; });

  if (CFG.contact) {
    var c = CFG.contact;
    // Every match, not just the first — the address appears on more than one
    // page and, on the presale page, more than once.
    if (c.addressLine1) $all("[data-addr1]").forEach(function (el) { el.textContent = c.addressLine1; });
    if (c.addressLine2) $all("[data-addr2]").forEach(function (el) { el.textContent = c.addressLine2; });
    // An empty venue has to clear the element, not leave whatever the markup
    // shipped with — otherwise removing it from config leaves it on the page.
    $all("[data-venue]").forEach(function (el) {
      el.textContent = c.venue || "";
      el.hidden = !c.venue;
    });

    var emailLink = $("#emailLink");
    if (emailLink && c.email) { emailLink.textContent = c.email; emailLink.href = "mailto:" + c.email; }

    var phoneWrap = $("[data-phone-wrap]");
    if (phoneWrap && c.phone) {
      var a = document.createElement("a");
      a.href = "tel:" + c.phone.replace(/[^0-9+]/g, "");
      a.textContent = c.phone;
      phoneWrap.appendChild(a);
    }
    // Contact cards on the location page — same values as the footer, so they
    // can never drift apart.
    var phoneCard = $("#contactPhone");
    if (phoneCard) {
      if (c.phone) {
        phoneCard.href = "tel:" + c.phone.replace(/[^0-9+]/g, "");
        $("[data-contact-phone]", phoneCard).textContent = c.phone;
      } else { phoneCard.hidden = true; }
    }
    var emailCard = $("#contactEmail");
    if (emailCard) {
      if (c.email) {
        emailCard.href = "mailto:" + c.email;
        $("[data-contact-email]", emailCard).textContent = c.email;
      } else { emailCard.hidden = true; }
    }
    var fbCard = $("#contactFacebook");
    if (fbCard) {
      var fb = (CFG.social || {}).facebook;
      if (fb) fbCard.href = fb; else fbCard.hidden = true;
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

  /* ============================================================= PARTY PACKAGE */
  var party = CFG.party || {};
  $all("[data-party]").forEach(function (el) {
    var key = el.getAttribute("data-party");
    if (key === "price" && party.startingPrice != null) el.textContent = money(party.startingPrice);
    if (key === "max" && party.maxGuests != null) el.textContent = String(party.maxGuests);
  });

  /* ============================================================= HOVER CLIPS
     Panes that play a short clip while the pointer is over them. Nothing is
     fetched until the first hover, so the page cost is unchanged for everyone
     who never touches it. */
  (function () {
    var panes = $all(".split-pane--video");
    if (!panes.length) return;
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;

    panes.forEach(function (pane) {
      var video = $("video", pane);
      if (!video) return;

      pane.addEventListener("mouseenter", function () {
        if (video.preload === "none") video.preload = "auto";
        var played = video.play();
        // Autoplay can still be refused; leave the still image up if it is.
        if (played && played.catch) played.catch(function () {});
        pane.classList.add("is-playing");
      });

      pane.addEventListener("mouseleave", function () {
        pane.classList.remove("is-playing");
        video.pause();
        // Back to the first frame so the next hover starts the clip again.
        try { video.currentTime = 0; } catch (e) {}
      });
    });
  })();

  /* ======================================================== FLYTHROUGHS
     Cinematic renders that play while on screen and pause off screen. With
     reduced motion the poster frame stays up and nothing is fetched. */
  (function () {
    var vids = $all("video[data-scrollplay]");
    if (!vids.length || reduceMotion || !("IntersectionObserver" in window)) return;

    var start = function (v) {
      if (v.preload === "none") v.preload = "auto";
      var played = v.play();
      if (played && played.catch) played.catch(function () {});
    };

    // A sliver on screen is enough to start. At 0.25 a tall frame below the
    // fold stayed unfetched — and therefore blank — until it was a quarter
    // visible, which on a first load reads as a broken page rather than a
    // deliberate one.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) start(en.target);
        else en.target.pause();
      });
    }, { threshold: 0.01 });

    vids.forEach(function (v) {
      // Already on the first screen: fetch and play now, don't wait to be told.
      if (v.getBoundingClientRect().top < window.innerHeight) start(v);
      io.observe(v);
    });
  })();

  /* ====================================================== SIGNUP FORMS
     The short name/email/phone forms — newsletter on the home page, swim-lesson
     interest on the aquatics page. Every one lands in the Leads list on the
     Switchboard OS dashboard, tagged by the interest and source the markup
     declares, so the club can tell a lesson enquiry from a mailing-list signup.
     The long party questionnaire has its own handler further down. */
  $all("form[data-signup]").forEach(function (form) {
    var msg = $("[data-signup-msg]", form);
    var btn = $("button[type=submit]", form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var field = function (n) {
        var el = form.querySelector("[name='" + n + "']");
        return el ? el.value.trim() : "";
      };
      var name = field("name"), email = field("email"), phone = field("phone");

      // An optional "what are you interested in" picker. Folded into the
      // interest line rather than posted as its own lead: /api/lead dedupes on
      // email inside a 10-minute window, so a visitor who wanted both classes
      // and personal training would have had their second form silently
      // swallowed as a duplicate.
      var choiceEl = form.querySelector("[data-signup-choice]");
      var choice = choiceEl ? choiceEl.value.trim() : "";

      var say = function (text, isError) {
        if (!msg) return;
        msg.textContent = text;
        msg.classList.toggle("is-error", !!isError);
      };

      if (!name || !email) { say("Please add your name and email.", true); return; }

      var sb = CFG.chat || {};
      var apiBase = sb.apiBase || "https://switchboard-os.vercel.app";
      var clientSlug = sb.clientSlug || "atlantis-sports-club";

      btn.disabled = true;
      var original = btn.textContent;
      btn.textContent = "Sending…";
      say("");

      fetch(apiBase + "/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSlug: clientSlug,
          name: name,
          email: email,
          phone: phone,
          interest: choice || form.getAttribute("data-signup-interest") || "Club updates",
          // Same QR labelling as the long forms, so a newsletter signup off a
          // printed sign is traceable to that sign.
          source: (form.getAttribute("data-signup-source") || "Website — Signup") +
                  (ATTRIBUTION.qr_source ? " (QR: " + ATTRIBUTION.qr_source + ")" : ""),
          notes: form.getAttribute("data-signup-notes") || "",
          utm_source: ATTRIBUTION.utm_source,
          utm_medium: ATTRIBUTION.utm_medium,
          utm_campaign: ATTRIBUTION.utm_campaign,
          utm_content: ATTRIBUTION.utm_content,
          utm_term: ATTRIBUTION.utm_term,
          landing_path: ATTRIBUTION.landing_path,
          referrer: ATTRIBUTION.referrer,
          company: field("company"),         // honeypot
        }),
      })
        .then(function (r) { return r.json(); })
        .then(rememberLead)
        .then(function (r) {
          if (!r || !r.ok) throw new Error("not recorded");
          form.reset();
          say(form.getAttribute("data-signup-done") || "You’re on the list — we’ll be in touch.");
          btn.textContent = "Thanks!";
          // Leave the button spent rather than re-armed: the same person
          // submitting twice is a duplicate the dashboard has to clean up.
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = original;
          say("Something went wrong — please try again, or call us.", true);
        });
    });
  });

  /* ====================================================== LEAD FORMS (long)
     The multi-field forms: Founders membership enquiries, job applications, and
     community partnership requests. One handler drives all three — the markup
     declares which config block pays for the email copy, what the lead's
     "interested in" line should be built from, and what to say when it lands.

     Everything reaches the Leads list on the Switchboard OS dashboard. If that
     call fails the answers are handed to the visitor's mail app instead, so an
     application is never silently lost. */
  $all("form[data-leadform]").forEach(function (form) {
    var msg = $("[data-leadform-msg]", form);
    var btn = $("button[type=submit]", form);
    var cfgKey = form.getAttribute("data-leadform-config") || "foundersForm";
    var cfg = CFG[cfgKey] || {};

    // The resume box is only shown when an email key is configured to carry it.
    // Without one there is nowhere for the file to go, and a file input that
    // silently drops the attachment is worse than no file input at all.
    var fileWrap = $("[data-leadform-file]", form);
    if (fileWrap && !cfg.web3formsKey) fileWrap.remove();

    function say(text, isError) {
      if (!msg) return;
      msg.textContent = text;
      msg.classList.toggle("is-error", !!isError);
    }

    // Every named field, keyed by its own label. The honeypot never travels.
    function answers() {
      var out = {};
      $all("input, textarea, select", form).forEach(function (f) {
        if (!f.name || f.name === "company" || f.type === "file") return;
        if (f.type === "checkbox") { if (f.checked) out[f.name] = f.value || "Yes"; return; }
        if (f.type === "radio") { if (f.checked) out[f.name] = f.value; return; }
        var v = (f.value || "").trim();
        if (v) out[f.name] = v;
      });
      return out;
    }

    function pick(data, re) {
      var key = Object.keys(data).filter(function (k) { return re.test(k); })[0];
      return key ? data[key] : "";
    }

    function mailtoFallback(data) {
      var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
      window.location.href = "mailto:" + encodeURIComponent(cfg.recipient || "") +
        "?subject=" + encodeURIComponent(cfg.subject || "Website enquiry") +
        "&body=" + encodeURIComponent(body);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = answers();
      var name = pick(data, /^(full name|name)$/i);
      var email = pick(data, /email/i);
      var phone = pick(data, /phone|telephone/i);

      if (!name || !email) { say("Please add your name and email.", true); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        say("That email doesn’t look right — mind checking it?", true); return;
      }

      // The dashboard's "interested in" column: a short readable summary built
      // from whichever fields this form says matter most.
      var interestFields = (form.getAttribute("data-leadform-interest-fields") || "")
        .split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      var interest = interestFields.map(function (k) { return data[k]; }).filter(Boolean).join(" · ") ||
        form.getAttribute("data-leadform-interest") || "Website enquiry";

      // Everything else becomes the note, so nothing the visitor typed is lost.
      var notes = Object.keys(data).filter(function (k) {
        return !/^(full name|name)$/i.test(k) && !/email/i.test(k) && !/phone|telephone/i.test(k) &&
               interestFields.indexOf(k) === -1;
      }).map(function (k) { return k + ": " + data[k]; }).join(" — ");

      var sb = CFG.chat || {};
      var apiBase = cfg.apiBase || sb.apiBase || "https://switchboard-os.vercel.app";
      var clientSlug = cfg.clientSlug || sb.clientSlug || "atlantis-sports-club";

      // A QR scan keeps its label all the way to the lead, so the dashboard can
      // show which flyer or sign the enquiry actually came from.
      var source = form.getAttribute("data-leadform-source") || "Website — Enquiry";
      if (ATTRIBUTION.qr_source) source += " (QR: " + ATTRIBUTION.qr_source + ")";

      btn.disabled = true;
      var original = btn.textContent;
      btn.textContent = "Sending…";
      say("");

      var toLead = fetch(apiBase + "/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSlug: clientSlug,
          name: name, email: email, phone: phone,
          interest: interest,
          source: source,
          notes: notes,
          utm_source: ATTRIBUTION.utm_source,
          utm_medium: ATTRIBUTION.utm_medium,
          utm_campaign: ATTRIBUTION.utm_campaign,
          utm_content: ATTRIBUTION.utm_content,
          utm_term: ATTRIBUTION.utm_term,
          landing_path: ATTRIBUTION.landing_path,
          referrer: ATTRIBUTION.referrer,
          company: (form.querySelector("[name=company]") || {}).value || "",
        }),
      }).then(function (r) { return r.json(); }).then(rememberLead);

      // Optional email copy. Sent as multipart when the form carries a file so
      // the resume travels with it; never blocks the visitor either way.
      var toEmail = Promise.resolve(null);
      if (cfg.web3formsKey) {
        var fileInput = form.querySelector("input[type=file]");
        var hasFile = fileInput && fileInput.files && fileInput.files.length;
        if (hasFile) {
          var fd = new FormData();
          fd.append("access_key", cfg.web3formsKey);
          fd.append("subject", cfg.subject || "Website enquiry");
          fd.append("from_name", "Atlantis Sports Club website");
          Object.keys(data).forEach(function (k) { fd.append(k, data[k]); });
          fd.append(fileInput.name || "Resume", fileInput.files[0]);
          toEmail = fetch("https://api.web3forms.com/submit", { method: "POST", body: fd })
            .catch(function () { return null; });
        } else {
          var payload = {
            access_key: cfg.web3formsKey,
            subject: cfg.subject || "Website enquiry",
            from_name: "Atlantis Sports Club website",
          };
          Object.keys(data).forEach(function (k) { payload[k] = data[k]; });
          toEmail = fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          }).catch(function () { return null; });
        }
      }

      var done = form.getAttribute("data-leadform-done") ||
        "Thank you — we’ve got your details and will be in touch shortly.";

      toLead
        .then(function (r) {
          if (!r || !r.ok) throw new Error("lead not recorded");
          return toEmail;
        })
        .then(function () {
          form.reset();
          say(done);
          btn.textContent = "Thanks!";
          // Left spent rather than re-armed — a second submit is a duplicate
          // the dashboard has to clean up by hand.
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = original;
          mailtoFallback(data);
          say(done);
        });
    });
  });

  /* ============================================================= LINKS (Mindbody) */
  var links = CFG.links || {};
  // Until the family-of-5 and -6 contracts exist in Mindbody, those buttons
  // send people to the family membership rather than nowhere — the club adds
  // the extra members on, exactly as it did before they had their own button.
  ["family5", "family6"].forEach(function (k) {
    if (!links[k] || links[k] === "#") links[k] = links.family;
  });
  $all("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    if (key === "map" || key === "email") return;
    var url = links[key];
    if (url && url !== "#") {
      el.href = url; el.target = "_blank"; el.rel = "noopener";
      // Count the handoff to the booking system. sendBeacon so the request
      // survives the tab losing focus, and never blocks the click either way.
      el.addEventListener("click", function () {
        var sb = CFG.chat || {};
        var payload = JSON.stringify({
          clientSlug: sb.clientSlug || "atlantis-sports-club",
          // Null for a visitor who never gave us their details — those clicks
          // still count, they just can't be tied to anyone.
          leadId: sbLeadId(),
          origin: "website",
          label: (el.textContent || "").trim().slice(0, 120),
          path: window.location.pathname,
          utm_source: ATTRIBUTION.utm_source,
          utm_medium: ATTRIBUTION.utm_medium,
          utm_campaign: ATTRIBUTION.utm_campaign,
          utm_content: ATTRIBUTION.utm_content,
        });
        var endpoint = (sb.apiBase || "https://switchboard-os.vercel.app") + "/api/booking-click";
        try {
          if (navigator.sendBeacon) {
            navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
          } else {
            fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: payload,
              keepalive: true,
            }).catch(function () {});
          }
        } catch (e) {}
      });
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
      // Solid bar while the panel is down — otherwise the white logo and burger
      // sit on bare hero video directly above an opaque white menu.
      if (nav) nav.classList.toggle("is-menu-open", open);
    });
    $all("a", mobile).forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        if (nav) nav.classList.remove("is-menu-open");
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
  // Skip the parallax on phones: the hero fills the screen there, so drifting the
  // content upward slid the buttons underneath the fixed header while they were
  // still tappable.
  var wideEnoughForParallax = window.matchMedia("(min-width: 761px)").matches;
  if (!reduceMotion && heroContent && wideEnoughForParallax) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = "translateY(" + (y * 0.18) + "px)";
        heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
        if (heroVideo) heroVideo.style.transform = "scale(" + (1 + y / 6000) + ")";
      }
    }, { passive: true });
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

    // Anything already on the first screen is shown outright rather than
    // observed. The 12% threshold is right for a section scrolled up into view,
    // but a tall block sitting just below the fold — a video frame, say — can
    // never satisfy it from a standing start, so it sat invisible until the
    // visitor happened to scroll. Landing on a page should never mean landing
    // on blank space.
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      else io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ============================================================= PARTY REQUEST
     One question per screen. Each answer is small and the next question only
     appears once the current one is filled — far higher completion than the
     same fields stacked into one long form. */
  var qform = $("#partyForm");
  if (qform) {
    var steps = $all("[data-qstep]", qform);
    var barFill = $("[data-qbar]", qform);
    var nowEl = $("[data-qnow]", qform), totalEl = $("[data-qtotal]", qform);
    var backBtn = $("[data-qback]", qform), nextBtn = $("[data-qnext]", qform);
    var submitBtn = $("[data-qsubmit]", qform), errEl = $("[data-qerr]", qform);
    var doneEl = $("[data-qdone]", qform);
    var at = 0;

    if (totalEl) totalEl.textContent = String(steps.length);

    // There's no club to hold a party in before opening day, so don't let the
    // date picker offer one. Falls back to "not in the past" if no date is set.
    (function () {
      var dateField = $('input[type="date"]', qform);
      if (!dateField) return;
      var opening = CFG.openingDate ? new Date(CFG.openingDate) : null;
      var earliest = opening && !isNaN(opening) && opening > new Date() ? opening : new Date();
      dateField.min = earliest.toISOString().slice(0, 10);
    })();

    function fieldsIn(step) { return $all("input, textarea, select", step); }

    function stepFilled(step) {
      var fields = fieldsIn(step);
      var required = fields.filter(function (f) { return f.required || f.type === "radio"; });
      if (!required.length) return true;                       // optional step
      if (required[0].type === "radio") {
        return required.some(function (f) { return f.checked; });
      }
      var v = (required[0].value || "").trim();
      if (!v) return false;
      if (required[0].type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (required[0].type === "tel") return v.replace(/\D/g, "").length >= 10;
      return true;
    }

    function messageFor(step) {
      var f = fieldsIn(step)[0];
      if (!f) return "Please answer to continue.";
      if (f.type === "radio") return "Pick one to continue.";
      if (f.type === "email") return "That email doesn’t look right — mind checking it?";
      if (f.type === "tel") return "Please enter a phone number we can reach you on.";
      if (f.type === "date") return "Please choose a date.";
      return "Please fill this in to continue.";
    }

    function render(entering) {
      steps.forEach(function (s, i) {
        s.hidden = i !== at;
        if (i === at && entering) {
          s.classList.remove("is-entering");
          void s.offsetWidth;                                   // restart the animation
          s.classList.add("is-entering");
        }
      });
      var last = at === steps.length - 1;
      if (backBtn) backBtn.hidden = at === 0;
      if (nextBtn) nextBtn.hidden = last;
      if (submitBtn) submitBtn.hidden = !last;
      if (nowEl) nowEl.textContent = String(at + 1);
      if (barFill) barFill.style.width = ((at + (last ? 1 : 0)) / steps.length * 100) + "%";
      if (errEl) errEl.textContent = "";
    }

    function focusStep() {
      var f = fieldsIn(steps[at])[0];
      if (f && f.type !== "radio") { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
    }

    function goNext() {
      if (!stepFilled(steps[at])) {
        if (errEl) errEl.textContent = messageFor(steps[at]);
        return;
      }
      if (at < steps.length - 1) { at++; render(true); focusStep(); }
    }
    function goBack() { if (at > 0) { at--; render(true); focusStep(); } }

    if (nextBtn) nextBtn.addEventListener("click", goNext);
    if (backBtn) backBtn.addEventListener("click", goBack);

    // Enter moves forward instead of submitting a half-filled form.
    qform.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      if (e.target.tagName === "TEXTAREA") return;
      if (at < steps.length - 1) { e.preventDefault(); goNext(); }
    });

    // Choosing an option is an answer — advance without a second click.
    qform.addEventListener("change", function (e) {
      if (e.target.type === "radio" && !reduceMotion) setTimeout(goNext, 260);
      else if (e.target.type === "radio") goNext();
    });

    function answers() {
      var out = {};
      steps.forEach(function (s) {
        fieldsIn(s).forEach(function (f) {
          if (f.type === "radio") { if (f.checked) out[f.name] = f.value; }
          else if ((f.value || "").trim()) out[f.name] = f.value.trim();
        });
      });
      return out;
    }

    // No access key configured yet → hand the answers to the visitor's mail app
    // so the enquiry reaches the inbox anyway rather than vanishing.
    function mailtoFallback(data, cfg) {
      var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
      var href = "mailto:" + encodeURIComponent(cfg.recipient) +
        "?subject=" + encodeURIComponent(cfg.subject || "Birthday party request") +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
    }

    qform.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!stepFilled(steps[at])) { if (errEl) errEl.textContent = messageFor(steps[at]); return; }

      var cfg = CFG.partyForm || {};
      var data = answers();
      var showDone = function () {
        steps.forEach(function (s) { s.hidden = true; });
        $(".qform__nav", qform).hidden = true;
        $(".qform__count", qform).hidden = true;
        if (barFill) barFill.style.width = "100%";
        if (errEl) errEl.textContent = "";
        if (doneEl) doneEl.hidden = false;
      };

      submitBtn.disabled = true;
      var original = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      // 1) Switchboard OS — the request lands in the Leads list on the dashboard
      //    and the club gets a "new lead" notification. Same backend the chat
      //    widget already reports to, so it reuses that client slug.
      var sb = CFG.chat || {};
      var apiBase = cfg.apiBase || sb.apiBase || "https://switchboard-os.vercel.app";
      var clientSlug = cfg.clientSlug || sb.clientSlug || "atlantis-sports-club";

      // One readable line for the dashboard's "interested in" column.
      var interest = ["Party type", "Guest count", "Preferred date"]
        .map(function (k) { return data[k]; })
        .filter(Boolean).join(" · ");
      var noteBits = [];
      if (data["Birthday age"]) noteBits.push("Turning " + data["Birthday age"]);
      if (data["Notes"]) noteBits.push(data["Notes"]);

      var toLead = fetch(apiBase + "/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSlug: clientSlug,
          name: data["Name"],
          email: data["Email"],
          phone: data["Phone"],
          interest: interest || "Birthday party",
          source: "Website — Party Form",
          notes: noteBits.join(" — "),
          // Every party request is worth the package price at minimum, so the
          // dashboard's pipeline total is money rather than a headcount.
          estimatedValue: (CFG.party && CFG.party.startingPrice) || null,
          utm_source: ATTRIBUTION.utm_source,
          utm_medium: ATTRIBUTION.utm_medium,
          utm_campaign: ATTRIBUTION.utm_campaign,
          utm_content: ATTRIBUTION.utm_content,
          utm_term: ATTRIBUTION.utm_term,
          landing_path: ATTRIBUTION.landing_path,
          referrer: ATTRIBUTION.referrer,
          company: "",                       // honeypot, always empty for a human
        }),
      }).then(function (r) { return r.json(); }).then(rememberLead);

      // 2) Optional second copy straight to the party inbox, if a Web3Forms key
      //    is configured. Never blocks the visitor: a rejected email must not
      //    make a successfully-recorded lead look like a failure.
      var toEmail = Promise.resolve(null);
      if (cfg.web3formsKey) {
        var payload = { access_key: cfg.web3formsKey, subject: cfg.subject, from_name: "Atlantis Sports Club website" };
        Object.keys(data).forEach(function (k) { payload[k] = data[k]; });
        toEmail = fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        }).catch(function () { return null; });
      }

      toLead
        .then(function (r) {
          if (!r || !r.ok) throw new Error("lead not recorded");
          return toEmail;
        })
        .then(function () { showDone(); })
        .catch(function () {
          // Couldn't record the lead — hand the answers to the visitor's mail
          // app and still confirm, rather than showing them a failure they
          // can't act on. The request reaches the club either way.
          submitBtn.disabled = false;
          submitBtn.textContent = original;
          mailtoFallback(data, cfg);
          showDone();
        });
    });

    render(false);
  }

  /* ================================================= YARMOUTH "OPEN NOW" POPUP
     Hyannis is a year out, so anyone who lands here wanting a club today is a
     sale for the Yarmouth location rather than a lost visitor. This offers them
     that, once, without hijacking the page the moment it loads.

     Deliberately restrained: it waits before appearing, remembers a dismissal
     for a fortnight, and the dismiss control says what it does rather than
     shaming the visitor for closing it. */
  (function () {
    var y = CFG.yarmouth || {};
    if (!y.enabled || !y.url) return;

    // The whole pitch is "come to Yarmouth while Hyannis is still being built",
    // which stops being true the moment Hyannis opens. Tied to openingDate by
    // default so moving the opening moves the popup with it — otherwise this
    // would quietly keep sending people away from a club that had just opened.
    var hideFrom = y.hideFrom || CFG.openingDate;
    if (hideFrom) {
      var endsAt = new Date(hideFrom).getTime();
      if (!isNaN(endsAt) && Date.now() >= endsAt) return;
    }

    var KEY = "asc_yarmouth_dismissed";
    try {
      var until = Number(localStorage.getItem(KEY) || 0);
      if (until && Date.now() < until) return;
    } catch (e) {}                                  // private mode — just show it

    function dismiss() {
      try {
        var days = Number(y.remindAfterDays || 14);
        localStorage.setItem(KEY, String(Date.now() + days * 864e5));
      } catch (e) {}
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () { overlay.remove(); }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    var lastFocus = null;
    var img = (CFG.images || {}).yarmouth;

    var overlay = document.createElement("div");
    overlay.className = "ypop";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "ypopTitle");

    var features = (y.features || []).map(function (f) {
      return "<li>" + f + "</li>";
    }).join("");

    overlay.innerHTML =
      '<div class="ypop__card">' +
        '<button class="ypop__close" type="button" aria-label="Close">&times;</button>' +
        (img ? '<div class="ypop__media"><img src="' + img + '" alt="The Atlantis Swim Club in South Yarmouth" /></div>' : "") +
        '<div class="ypop__body">' +
          '<p class="ypop__eyebrow"><span class="ypop__dot" aria-hidden="true"></span>' + (y.eyebrow || "Open Now") + "</p>" +
          '<h2 class="ypop__title" id="ypopTitle">' + (y.title || "") + "</h2>" +
          (y.tagline ? '<p class="ypop__tagline">' + y.tagline + "</p>" : "") +
          (y.intro ? '<p class="ypop__intro">' + y.intro + "</p>" : "") +
          (features ? '<ul class="ypop__list">' + features + "</ul>" : "") +
          '<a class="btn btn--gold btn--block ypop__cta" href="' + y.url + '" target="_blank" rel="noopener">' +
            (y.ctaLabel || "Join Yarmouth Today") + "</a>" +
          (y.ctaNote ? '<p class="ypop__note">' + y.ctaNote + "</p>" : "") +
          '<button class="ypop__dismiss" type="button">' + (y.dismissLabel || "No thanks") + "</button>" +
        "</div>" +
      "</div>";

    // The photo is optional. Until someone drops yarmouth.jpg into
    // assets/images/ the file 404s, and a broken <img> leaves a tall white gap
    // with alt text sitting where the picture should be — worse than no picture
    // at all. Drop the whole media block if it can't load.
    (function () {
      var media = overlay.querySelector(".ypop__media");
      if (!media) return;
      var im = media.querySelector("img");
      im.addEventListener("error", function () { media.remove(); });
    })();

    function open() {
      lastFocus = document.activeElement;
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";
      // Force a reflow rather than waiting on requestAnimationFrame: rAF does
      // not fire in a background tab, which left the overlay at opacity 0 while
      // the body was already scroll-locked — a visitor who opened the site in a
      // background tab came back to a page they couldn't scroll and couldn't
      // see why. A reflow starts the transition whatever the tab is doing.
      void overlay.offsetWidth;
      overlay.classList.add("is-open");
      var first = overlay.querySelector(".ypop__cta");
      if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }

      // The visitor going to Yarmouth is a win, not a bounce — record it the
      // same way a Mindbody handoff is recorded so it shows up alongside them.
      overlay.querySelector(".ypop__cta").addEventListener("click", function () {
        var sb = CFG.chat || {};
        try {
          navigator.sendBeacon(
            (sb.apiBase || "https://switchboard-os.vercel.app") + "/api/booking-click",
            new Blob([JSON.stringify({
              clientSlug: sb.clientSlug || "atlantis-sports-club",
              origin: "website",
              label: "Yarmouth popup — " + (y.ctaLabel || "Join Yarmouth"),
              path: window.location.pathname,
            })], { type: "application/json" })
          );
        } catch (e) {}
        dismiss();
      });
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) dismiss();          // click the scrim to close
    });
    overlay.querySelector(".ypop__close").addEventListener("click", dismiss);
    overlay.querySelector(".ypop__dismiss").addEventListener("click", dismiss);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) dismiss();
    });

    setTimeout(open, Math.max(0, Number(y.delaySeconds || 6)) * 1000);
  })();

  /* ============================================================= YEAR */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
