# Scheduled task — 26 Nov 2026

Two fixes. Both were diagnosed on 25 Nov; the diagnosis below is confirmed, so
verify it rather than re-investigating from scratch.

Site is static HTML/CSS/JS, no build step. `main` auto-deploys to
atlantissportsclubhyannis.com via GitHub Pages.

---

## Task 1 — form inputs are invisible on the white partner sections

`aquatics.html` and `training.html` now open on a section classed
`cine cine--lead cine--light` — a **white** background. The signup form inside
it is still styled for the dark background it used to sit on.

The base rules in `styles.css` (~line 1193) are dark-ground values:

```css
.signup__fields input {
  border: 1px solid rgba(125,211,252,.3);
  background: rgba(255,255,255,.08);
  color: #fff;
}
.signup__fields input::placeholder { color: rgba(224,242,254,.6); }
.signup__fields input:focus { border-color: var(--cyan-400); background: rgba(255,255,255,.14); }
```

The `.cine--light` block at the **end** of `styles.css` only overrides
`background` to `#fff`. So on a white panel **typed text is white on white and
completely invisible**, and the borders and placeholders are nearly invisible.
The invisible typed text is the serious part — the form reads as broken.

**Fix:** add rules under the existing `.cine--light` section at the end of
`styles.css`. Do **not** change the base `.signup__fields` rules — the dark
`.cine` sections further down the same two pages still depend on them.

- `.cine--light .signup__fields input` → `color: var(--color-fg)`,
  `border-color: var(--color-border)`
- `.cine--light .signup__fields input::placeholder` → `color: #7891a1`
  (matches `.field input::placeholder`, ~line 449)
- `.cine--light .signup__fields input:focus` → `border-color: var(--sky-500)`,
  `background: #fff`

Check the submit button and any helper text in that panel for the same problem
while you are in there.

## Task 2 — move the group fitness form to the top of `training.html`

`aquatics.html` is the pattern to copy. Its `#swim-lessons` section has a right
column:

```html
<div class="partner-col reveal">
  <figure class="partner-shot">…</figure>
  <div class="signup signup--panel" id="lesson-updates">…form…</div>
</div>
```

`training.html` has the equivalent photo in `#studio-ex`'s `.partner-col`, but
its form is still stranded in a separate section lower down:
`<section class="cine cine--split" id="interest">`, holding a `.cine__body`
(eyebrow "Be First in Line", title "Get class updates", two paragraphs) and
`<div class="signup signup--panel reveal" id="class-updates">`.

**Do:**

1. Move the `.signup--panel` (keep `id="class-updates"`) into `#studio-ex`'s
   `.partner-col`, directly after the `<figure class="partner-shot">`.
2. Keep the `<select>` inside it (Group fitness classes / Personal training /
   Both) and its `data-signup-*` attributes exactly as they are — they set the
   lead's Interest and Source in Switchboard OS.
3. Remove the now-empty `#interest` section. The hero button already targets
   `#class-updates`, so nothing should point at `#interest` — grep every
   `*.html` for `#interest` first and update anything that does.
4. Match `aquatics.html`: the panel there has no `reveal` class (its parent
   `.partner-col` carries it).

---

## Before committing

- **Asset versions.** Bump `styles.css?v=N` across every `*.html`. Bump
  `assets/pt.js?v=N` and `script.js?v=N` too if you change those files. They
  are currently at `styles.css?v=49`, `assets/pt.js?v=12`, `script.js?v=37`.
- **Portuguese.** `assets/pt.js` keys are the exact English text-node strings.
  If any visible English string changes, add or update its key. A `<strong>` or
  `<span>` inside a sentence splits it into separate text nodes, each needing
  its own key — that has bitten this site twice. Verify the file parses:
  `node -e "global.window={};require('./assets/pt.js');console.log(Object.keys(window.ASC_PT).length)"`
  (expect ~653, and no decrease).
- **No browser in the cloud run**, so verify structurally: grep that the form
  now sits inside `#studio-ex`, that `#interest` is gone and unreferenced, that
  the four new CSS rules exist, and that every page's asset version matches.

Commit and push to `main` (the site deploys from it — no PR). Delete this file
in the same commit. Leave a short summary of what changed and anything you
could not verify without a browser.
