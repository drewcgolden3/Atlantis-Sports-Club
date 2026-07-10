# Atlantis Sports Club — Coming Soon Website

A multi-page launch site for Atlantis Sports Club (East Sandwich, MA) with an
interactive video hero, a Founding-Member presale that highlights the discount
and urgency, a countdown to opening day, amenities, Mindbody-ready booking, and
location.

Built as plain HTML/CSS/JS — **no build step, no dependencies.** Upload the whole
folder to any web host (Netlify drag-and-drop, GoDaddy, Vercel, etc.).

---

## Pages

| File             | Page       | What it's for                                        |
|------------------|------------|------------------------------------------------------|
| `index.html`     | Home       | Video hero, the founding-member offer, explore links |
| `presale.html`   | Presale    | Full price comparison (founding vs. regular) + FAQ   |
| `amenities.html` | Amenities  | Pool, court, dance studio, birthday parties          |
| `booking.html`   | Book       | Birthday parties, lap lanes, dance studio (Mindbody) |
| `location.html`  | Location   | Address, map, directions                             |

The top navigation and footer are **shared automatically** across every page —
you never have to edit them. They're generated from `script.js`, and the current
page is highlighted based on the `data-page` attribute on each page's `<body>`.

---

## ✏️ Everything you'll edit lives in ONE file: `config.js`

Open `config.js` in any text editor. You never need to touch the HTML.

### 1. Mindbody booking links
Paste your Mindbody URLs into the `links` block. Until you do, the buttons show a
friendly "Booking opens soon" message instead of a broken page.

### 2. Pricing & the discount  ← NEW
```js
pricing: {
  currency: "$",
  regularDown:     299,   // regular enrollment
  regularMonthly:  129,   // regular monthly
  foundingDown:    99,    // founding-member enrollment (first 500)
  foundingMonthly: 99,    // founding-member monthly
  foundingSpots:   500,   // size of the founding group
  spotsRemaining:  null,  // set a number (e.g. 137) to show a live
                          //   "X of 500 claimed" progress bar; null hides it
}
```
Enter **numbers only** — the site adds the "$", strikes through the regular price,
and works out the savings ("Save $200 today + $30/mo") automatically everywhere.
Change a number once here and it updates on every page and in the top banner.

> **Want to crank up urgency?** Put a real number in `spotsRemaining` (e.g. `137`).
> A progress bar appears on the Home and Presale pages: *"363 of 500 founding
> spots claimed — only 137 left."* Update it as memberships sell.

### 3. Opening date & contact
Update `openingDate`, `openingLabel`, `contact` (email, phone, address), and
`social` links at the bottom of the file.

---

## 🖼️ Adding photos

Drop image files into **`assets/images/`** using these exact names:

| File name         | Where it appears                              |
|-------------------|-----------------------------------------------|
| `pool.jpg`        | Pool (amenities + home + booking)             |
| `basketball.jpg`  | Basketball court                              |
| `dance.jpg`       | Dance studio                                  |
| `birthday.jpg`    | Birthday parties                              |
| `hero-poster.jpg` | Still shown before the hero video loads       |

They appear automatically. Until then, a clean blue gradient placeholder shows,
so the site always looks finished. Recommended: 1200px+ wide, landscape, JPG/WebP.

---

## 🎬 The hero video

The home hero uses your facility walkthrough, already web-optimized and cropped to
remove the Vimeo player controls/cursor:

- `assets/video/hero.mp4`  •  `assets/video/hero.webm`  •  `assets/images/hero-poster.jpg`

To swap it later, replace those files (keep the same names).

---

## 🚀 Publishing

**Easiest (free):** drag this folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
**Any host:** upload the folder contents to your web root; `index.html` is the home page.

---

## Files at a glance
```
atlantis-sports-club/
├── index.html          Home
├── presale.html        Presale / pricing
├── amenities.html      Amenities
├── booking.html        Book
├── location.html       Location
├── styles.css          Visual design (no edits needed)
├── script.js           Shared header/footer + behavior (no edits needed)
├── config.js           ★ YOU EDIT THIS: links, pricing, images, date, contact
└── assets/
    ├── images/         drop your photos here
    └── video/          hero.mp4 / hero.webm
```
