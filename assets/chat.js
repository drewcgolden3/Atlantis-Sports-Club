/* =============================================================================
   ATLANTIS SPORTS CLUB — branded AI chat widget
   Talks to the Switchboard OS backend (same /api/chat + /api/track the generic
   widget used), but styled to match the site and with a proactive greeting so
   visitors notice it. Config lives in config.js → chat { }.
   ============================================================================ */
(function () {
  "use strict";
  var CFG = (window.ATLANTIS_CONFIG && window.ATLANTIS_CONFIG.chat) || {};
  var clientSlug = CFG.clientSlug || "atlantis-sports-club";
  var apiBase = CFG.apiBase || "https://switchboard-os.vercel.app";
  var greeting = CFG.greeting || "Hi! How can I help you?";
  var title = CFG.title || "Atlantis Sports Club";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var BLUE = "#0284C7", BLUE_D = "#0369A1", INK = "#0B2233", SOFT = "#3E5B6E", LINE = "#E0F2FE";
  var GRAD = "linear-gradient(135deg," + BLUE + "," + BLUE_D + ")";
  var FONT = "'Barlow', system-ui, -apple-system, sans-serif";
  var CHAT_SVG = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></svg>';

  function css(el, s) { for (var k in s) el.style[k] = s[k]; }
  function isNarrow() { return window.matchMedia("(max-width: 760px)").matches; }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  /* page-view tracking — fire-and-forget, never blocks the page */
  try {
    fetch(apiBase + "/api/track", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign(
        { clientSlug: clientSlug, path: location.pathname, referrer: document.referrer || null },
        // Same campaign tags script.js captured on the first page of the visit,
        // so traffic and leads can be compared on one axis and a real
        // conversion rate per campaign becomes possible.
        window.ATLANTIS_ATTRIBUTION || {}
      )),
      keepalive: true,
    }).catch(function () {});
  } catch (e) {}

  var messages = [];
  var open = false;

  /* ---- launcher + pulse ring ---- */
  var ring = document.createElement("span");
  css(ring, { position: "fixed", right: "22px", bottom: "22px", width: "60px", height: "60px", borderRadius: "50%", background: BLUE, opacity: ".5", zIndex: "2147482999", pointerEvents: "none" });
  if (!reduce && ring.animate) ring.animate([{ transform: "scale(1)", opacity: .45 }, { transform: "scale(1.8)", opacity: 0 }], { duration: 2200, iterations: Infinity, easing: "ease-out" });
  else ring.style.display = "none";

  var launcher = document.createElement("button");
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Chat with Atlantis Sports Club");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = CHAT_SVG;
  css(launcher, { position: "fixed", right: "22px", bottom: "22px", width: "60px", height: "60px", borderRadius: "50%", border: "none", cursor: "pointer", background: GRAD, boxShadow: "0 12px 28px -8px rgba(2,132,199,.6)", zIndex: "2147483000", display: "grid", placeItems: "center", transition: "transform .2s ease" });
  launcher.onmouseenter = function () { launcher.style.transform = "scale(1.06)"; };
  launcher.onmouseleave = function () { launcher.style.transform = "scale(1)"; };

  /* ---- proactive greeting bubble ---- */
  var promo = document.createElement("div");
  promo.setAttribute("role", "status");
  css(promo, { position: "fixed", right: "22px", bottom: "94px", maxWidth: "252px", background: "#fff", color: INK, fontFamily: FONT, fontSize: "15px", fontWeight: "500", lineHeight: "1.4", padding: "14px 16px 14px 16px", borderRadius: "16px 16px 4px 16px", boxShadow: "0 18px 44px -12px rgba(8,47,73,.42)", zIndex: "2147483000", cursor: "pointer", opacity: "0", transform: "translateY(10px)", transition: "opacity .35s ease, transform .35s ease", display: "none" });
  var promoText = document.createElement("span");
  promoText.textContent = greeting;
  var promoX = document.createElement("button");
  promoX.type = "button"; promoX.setAttribute("aria-label", "Dismiss"); promoX.innerHTML = "&times;";
  css(promoX, { position: "absolute", top: "5px", right: "8px", border: "none", background: "transparent", color: SOFT, fontSize: "18px", lineHeight: "1", cursor: "pointer", padding: "2px 4px" });
  promo.appendChild(promoX); promo.appendChild(promoText);
  if (isNarrow()) css(promo, { maxWidth: "212px", fontSize: "14px", padding: "12px 14px", bottom: "88px" });

  /* ---- panel ---- */
  var panel = document.createElement("div");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat with Atlantis Sports Club");
  css(panel, { position: "fixed", right: "22px", bottom: "94px", width: "372px", maxWidth: "calc(100vw - 32px)", height: "524px", maxHeight: "calc(100vh - 130px)", background: "#fff", borderRadius: "18px", boxShadow: "0 26px 60px -16px rgba(8,47,73,.5)", display: "none", flexDirection: "column", overflow: "hidden", fontFamily: FONT, zIndex: "2147483001", border: "1px solid " + LINE });

  var head = document.createElement("div");
  css(head, { background: GRAD, color: "#fff", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" });
  head.innerHTML =
    '<span style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center;flex:none">' +
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></svg>' +
    '</span>' +
    '<span style="flex:1;min-width:0">' +
      '<span style="display:block;font-weight:700;font-size:15px;letter-spacing:.01em">' + esc(title) + '</span>' +
      '<span style="display:block;font-size:12px;opacity:.85">We usually reply in a few minutes</span>' +
    '</span>' +
    '<button class="asc-close" type="button" aria-label="Close chat" style="border:none;background:transparent;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:2px 6px">&times;</button>';

  var bodyEl = document.createElement("div");
  css(bodyEl, { flex: "1", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", background: "#F0F9FF" });

  var row = document.createElement("div");
  css(row, { display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid " + LINE, background: "#fff", alignItems: "center" });
  var input = document.createElement("input");
  input.type = "text"; input.placeholder = "Type your message…"; input.setAttribute("aria-label", "Message");
  css(input, { flex: "1", border: "1.5px solid " + LINE, borderRadius: "999px", padding: "10px 14px", fontSize: "14px", fontFamily: FONT, outline: "none", color: INK });
  input.onfocus = function () { input.style.borderColor = BLUE; };
  input.onblur = function () { input.style.borderColor = LINE; };
  var send = document.createElement("button");
  send.type = "button"; send.setAttribute("aria-label", "Send message");
  send.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  css(send, { border: "none", background: GRAD, color: "#fff", borderRadius: "50%", width: "42px", height: "42px", flex: "none", cursor: "pointer", display: "grid", placeItems: "center" });

  row.appendChild(input); row.appendChild(send);
  panel.appendChild(head); panel.appendChild(bodyEl); panel.appendChild(row);

  function addMsg(role, text) {
    var b = document.createElement("div");
    b.textContent = text;
    css(b, { maxWidth: "84%", padding: "10px 13px", fontSize: "14px", lineHeight: "1.45", whiteSpace: "pre-wrap", borderRadius: "14px", fontFamily: FONT });
    if (role === "user") css(b, { alignSelf: "flex-end", background: GRAD, color: "#fff", borderBottomRightRadius: "4px" });
    else css(b, { alignSelf: "flex-start", background: "#fff", color: INK, border: "1px solid " + LINE, borderBottomLeftRadius: "4px" });
    bodyEl.appendChild(b); bodyEl.scrollTop = bodyEl.scrollHeight;
    return b;
  }
  addMsg("assistant", greeting + "\nAsk me about pricing, hours, classes, or the founding presale.");

  /* ---- open / close ---- */
  function openPanel() { open = true; panel.style.display = "flex"; hidePromo(true); launcher.setAttribute("aria-expanded", "true"); setTimeout(function () { input.focus(); }, 60); }
  function closePanel() { open = false; panel.style.display = "none"; launcher.setAttribute("aria-expanded", "false"); }
  launcher.addEventListener("click", function () { open ? closePanel() : openPanel(); });
  head.querySelector(".asc-close").addEventListener("click", closePanel);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) closePanel(); });

  /* ---- send ---- */
  function doSend() {
    var t = input.value.trim(); if (!t) return;
    input.value = "";
    messages.push({ role: "user", content: t }); addMsg("user", t);
    var typing = addMsg("assistant", "…");
    fetch(apiBase + "/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientSlug: clientSlug, messages: messages }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        // The receptionist saved this visitor as a lead. Hold on to the id so a
        // later click through to Mindbody is attributed to them — same key
        // script.js uses for the site's forms.
        try { if (d.leadId) localStorage.setItem("sb_lead_" + clientSlug, d.leadId); } catch (e) {}
        var reply = d.reply || d.error || "Sorry, something went wrong."; typing.textContent = reply; messages.push({ role: "assistant", content: reply }); bodyEl.scrollTop = bodyEl.scrollHeight; })
      .catch(function () { typing.textContent = "Sorry, I couldn't reach us just now — please try again in a moment."; });
  }
  send.addEventListener("click", doSend);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") doSend(); });

  /* ---- proactive greeting ---- */
  function showPromo() {
    try { if (sessionStorage.getItem("asc_chat_seen")) return; } catch (e) {}
    if (open) return;
    promo.style.display = "block";
    requestAnimationFrame(function () { promo.style.opacity = "1"; promo.style.transform = "translateY(0)"; });
    // On a phone the bubble lands on top of the hero's primary CTA, so it retires
    // on its own rather than camping over the button until it's dismissed by hand.
    if (isNarrow()) setTimeout(function () { if (!open) hidePromo(false); }, 6000);
  }
  function hidePromo(remember) {
    promo.style.opacity = "0"; promo.style.transform = "translateY(10px)";
    setTimeout(function () { promo.style.display = "none"; }, 350);
    if (remember) { try { sessionStorage.setItem("asc_chat_seen", "1"); } catch (e) {} }
  }
  promoX.addEventListener("click", function (e) { e.stopPropagation(); hidePromo(true); });
  promo.addEventListener("click", openPanel);

  /* ---- mount ---- */
  document.body.appendChild(ring);
  document.body.appendChild(launcher);
  document.body.appendChild(promo);
  document.body.appendChild(panel);

  /* ---- phones: stay out of the hero ----
     A full-width hero CTA runs the whole width of a small screen, so a launcher
     pinned bottom-right lands on top of it. Hold the launcher back until the
     visitor has scrolled past the first screen, then bring it in for good. */
  if (isNarrow()) {
    var revealed = false;
    css(launcher, { opacity: "0", pointerEvents: "none", transition: "opacity .3s ease, transform .2s ease" });
    ring.style.display = "none";
    var revealLauncher = function () {
      if (revealed || window.scrollY < window.innerHeight * 0.75) return;
      revealed = true;
      css(launcher, { opacity: "1", pointerEvents: "auto" });
      if (!reduce) ring.style.display = "";
      window.removeEventListener("scroll", revealLauncher);
      setTimeout(showPromo, 600);
    };
    window.addEventListener("scroll", revealLauncher, { passive: true });
    revealLauncher();
  } else {
    setTimeout(showPromo, 1400);
  }
})();
