# Atlantis Sports Club — Coming Soon Website

A one-page launch site for Atlantis Sports Club (East Sandwich, MA) featuring an
interactive video hero, the Founding Member presale ($99 down / $99 a month), a
countdown to opening day, amenities, and Mindbody-ready booking sections.

Built as plain HTML/CSS/JS — **no build step, no dependencies.** Just upload the
folder to any web host (Netlify drag-and-drop, Squarespace, GoDaddy, Vercel, etc.).

---

## ✏️ Everything you'll edit lives in ONE file: `config.js`

Open `config.js` in any text editor. You never need to touch the HTML.

### 1. Add your Mindbody booking links
Find the `links` section and paste your Mindbody URLs between the quotes:

```js
links: {
  presale:     "https://clients.mindbodyonline.com/...",  // Presale checkout
  birthday:    "https://clients.mindbodyonline.com/...",  // Birthday parties
  lapLanes:    "https://clients.mindbodyonline.com/...",  // Lap lane booking
  danceStudio: "https://clients.mindbodyonline.com/...",  // Dance studio
  membership:  "https://clients.mindbodyonline.com/...",  // Waitlist / general
},
```

> Where to find these in Mindbody: **Manage → Widgets / Links**, copy the link,
> and paste it in. Until you add a real link, the button politely says
> "Booking opens soon" instead of going to a broken page.

### 2. Update the opening date & pricing
```js
openingDate: "2027-07-07T09:00:00",   // drives the live countdown
openingLabel: "July 7, 2027",
presale: { down: "$99", monthly: "$99", tagline: "Founding Member Presale" },
```

### 3. Contact & map
Update `contact.email`, `contact.phone`, and the address if needed. The Google
Map already points to 551 MA-6A, East Sandwich.

### 4. Social links
Add Instagram / Facebook URLs in `social` to show those icons in the footer
(leave them blank to hide).

---

## 🖼️ Adding photos

Drop image files into the **`assets/images/`** folder using these exact names:

| File name                     | Where it appears                    |
|-------------------------------|-------------------------------------|
| `pool.jpg`                    | Olympic-Size Pool amenity           |
| `basketball.jpg`              | Basketball Court amenity            |
| `dance.jpg`                   | Dance Studio amenity                |
| `birthday.jpg`                | Birthday Parties amenity            |
| `hero-poster.jpg`             | Still frame shown before the hero video loads |

That's it — they appear automatically. Until you add a photo, a clean blue
gradient placeholder is shown, so the site always looks finished.

- **Recommended:** at least 1200px wide, landscape, `.jpg` or `.webp`.
- Want to point a card at a different file name? Change the path in the
  `images` section of `config.js`.

---

## 🎬 The hero video

The interactive hero uses your facility walkthrough, already optimized for the
web and located at:

- `assets/video/hero.mp4`
- `assets/video/hero.webm`
- `assets/images/hero-poster.jpg` (poster still)

The Vimeo player controls and cursor from the original recording were cropped
out. To swap in a new video later, replace those files (keep the same names).
The hero also has a **sound toggle** (bottom-right) and reacts to cursor movement
and scroll.

---

## 🚀 Publishing

**Easiest (free):** go to [app.netlify.com/drop](https://app.netlify.com/drop)
and drag this whole `atlantis-sports-club` folder onto the page. You'll get a
live URL in seconds, and can connect your custom domain in Netlify's settings.

**Any host:** upload the folder contents to your web root (`public_html`, etc.).
`index.html` is the home page.

---

## Files at a glance
```
atlantis-sports-club/
├── index.html      ← page structure (no edits needed)
├── styles.css      ← visual design (no edits needed)
├── script.js       ← behavior (no edits needed)
├── config.js       ← ★ YOU EDIT THIS: links, images, date, contact
├── README.md       ← this guide
└── assets/
    ├── images/     ← drop your photos here
    └── video/      ← hero.mp4 / hero.webm
```
