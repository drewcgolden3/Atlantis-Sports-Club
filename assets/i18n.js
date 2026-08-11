/* =============================================================================
   ATLANTIS — PORTUGUESE TOGGLE
   -----------------------------------------------------------------------------
   Cape Cod has a large Brazilian community, so the site reads in Portuguese on
   request. There are no /pt/ pages: one set of HTML is translated in place from
   the dictionary below, and the choice is remembered across pages.

   HOW IT WORKS
   Every entry in DICT is keyed by the exact English text as it appears on the
   page. On load (and again whenever script.js injects the header, footer or the
   Yarmouth popup) the walker visits each text node, looks up its trimmed text,
   and swaps it. Nothing needs marking up in the HTML, which is what makes this
   maintainable — a new paragraph just needs a new dictionary entry.

   WHAT IS DELIBERATELY NOT TRANSLATED
   Prices, dates and anything else written by script.js from config.js. Those
   nodes carry data-price / data-opening-label, and the walker skips them, so a
   number can never drift between the two languages — there is still exactly one
   source of truth for money.

   ADDING OR FIXING A TRANSLATION
   Find the English string on the left, edit the Portuguese on the right. That's
   the whole job — no build step, no other file to touch.
   ============================================================================ */
(function () {
  "use strict";

  var STORE = "asc_lang";
  var DICT = window.ASC_PT || {};

  function current() {
    try { return localStorage.getItem(STORE) === "pt" ? "pt" : "en"; }
    catch (e) { return "en"; }
  }

  /* Nodes whose text is generated from config.js — prices, the opening date,
     the countdown. Translating these would fork the numbers. */
  function isGenerated(el) {
    while (el && el !== document.body) {
      if (el.nodeType === 1 && (
        el.hasAttribute("data-price") ||
        el.hasAttribute("data-opening-label") ||
        el.hasAttribute("data-cd") ||
        el.hasAttribute("data-addr1") ||
        el.hasAttribute("data-addr2")
      )) return true;
      el = el.parentNode;
    }
    return false;
  }

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };

  function translateNode(root) {
    if (!root || current() !== "pt") return;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS[n.parentNode.nodeName]) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (node) {
      if (isGenerated(node.parentNode)) return;
      var raw = node.nodeValue;
      var key = raw.trim().replace(/\s+/g, " ");
      var hit = DICT[key];
      if (!hit) return;
      // Keep the original leading/trailing whitespace so inline text that sits
      // beside a <strong> or a price span doesn't lose its spacing.
      node.nodeValue = raw.replace(key, hit).replace(raw.trim(), hit);
    });

    // Attributes people actually read or hear.
    var attrEls = root.querySelectorAll
      ? root.querySelectorAll("[placeholder],[aria-label],[alt],[title]")
      : [];
    Array.prototype.forEach.call(attrEls, function (el) {
      ["placeholder", "aria-label", "alt", "title"].forEach(function (a) {
        var v = el.getAttribute(a);
        if (v && DICT[v.trim()]) el.setAttribute(a, DICT[v.trim()]);
      });
    });
  }

  function applyLang() {
    var lang = current();
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    if (lang !== "pt") return;
    if (DICT[document.title]) document.title = DICT[document.title];
    translateNode(document.body);
  }

  /* The header, footer and the Yarmouth popup are injected by script.js after
     this runs, so translate them as they arrive rather than racing them. */
  function watch() {
    if (!window.MutationObserver) return;
    new MutationObserver(function (muts) {
      var sawNodes = false;
      muts.forEach(function (m) {
        if (m.addedNodes.length) sawNodes = true;
        if (current() !== "pt") return;
        Array.prototype.forEach.call(m.addedNodes, function (node) {
          if (node.nodeType === 1) translateNode(node);
          else if (node.nodeType === 3 && DICT[(node.nodeValue || "").trim()]) {
            node.nodeValue = DICT[node.nodeValue.trim()];
          }
        });
      });
      // The toggle host arrives with the injected header — build it whichever
      // language is active, or Portuguese visitors get no way back to English.
      if (sawNodes) buildToggle();
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------------------------------------------------------------- toggle --- */
  function setLang(lang) {
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    // A reload is the honest way to switch back to English: un-translating by
    // reversing the dictionary would mangle any text that had already changed.
    window.location.reload();
  }

  /* The header is injected by script.js, which may run after this file, so this
     is idempotent and gets called again by the observer as hosts appear. */
  function buildToggle() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-lang-toggle]"), buildOne);
  }

  function buildOne(host) {
    if (!host || host.firstChild) return;         // already built
    var lang = current();

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "langtog";
    btn.setAttribute("aria-label",
      lang === "pt" ? "Mudar idioma para inglês" : "Switch language to Portuguese");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>' +
      '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' +
      "</svg><span>" + (lang === "pt" ? "EN" : "PT") + "</span>";
    btn.addEventListener("click", function () { setLang(lang === "pt" ? "en" : "pt"); });
    host.appendChild(btn);
  }

  // Expose the active language so chat.js can open in the right one.
  window.ASC_LANG = current();

  function init() { applyLang(); buildToggle(); watch(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }

  window.ASC_I18N = { translate: translateNode, lang: current, set: setLang };
})();
