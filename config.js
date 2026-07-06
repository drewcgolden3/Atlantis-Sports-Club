/* =============================================================================
   ATLANTIS SPORTS CLUB — SITE CONFIG
   -----------------------------------------------------------------------------
   This is the ONLY file you need to edit to go live. No coding required — just
   paste your links/text between the quotes.

   1) BOOKING & PRESALE LINKS
      Paste your Mindbody URLs below (replace the "#" between the quotes).
      In Mindbody:  Home  ▸  Manage  ▸  Widgets/Links  ▸  copy the link.
      Until you paste a real link, the button shows a friendly "coming soon"
      message instead of a broken page.

   2) IMAGES
      Drop your photos into the  assets/images/  folder using the EXACT file
      names listed under IMAGES below (e.g. pool.jpg). They appear automatically.
      No photo yet? A clean blue gradient placeholder shows in the meantime.

   3) OPENING DATE / GYM DETAILS
      Update the opening date, address, email, and phone at the bottom.
   ============================================================================ */

window.ATLANTIS_CONFIG = {

  /* -- 1) BOOKING & PRESALE LINKS (paste Mindbody URLs between the quotes) -- */
  links: {
    presale:      "#",   // Presale sign-up / checkout ($99 down, $99/mo)
    birthday:     "#",   // Birthday party booking
    lapLanes:     "#",   // Lap lane reservation
    danceStudio:  "#",   // Dance studio booking
    membership:   "#",   // General membership / waitlist
  },

  /* -- 2) IMAGES  (file name -> put a matching file in assets/images/) --------
     Example: to set the pool photo, save your image as
              assets/images/pool.jpg
     Recommended size: at least 1200px wide, landscape. JPG or WebP. */
  images: {
    pool:        "assets/images/pool.jpg",
    basketball:  "assets/images/basketball.jpg",
    dance:       "assets/images/dance.jpg",
    birthday:    "assets/images/birthday.jpg",
    // Booking card photos (can reuse the amenity photos above if you like)
    bookBirthday:   "assets/images/birthday.jpg",
    bookLapLanes:   "assets/images/pool.jpg",
    bookDance:      "assets/images/dance.jpg",
  },

  /* -- 3) OPENING DATE & DETAILS -------------------------------------------- */
  // Opening date for the countdown timer. Format: "YYYY-MM-DDTHH:MM:SS"
  openingDate: "2027-07-07T09:00:00",
  openingLabel: "July 7, 2027",

  // Presale pricing (shown on the presale banner + hero)
  presale: {
    down:    "$99",
    monthly: "$99",
    tagline: "Founding Member Presale",
  },

  // Contact & location
  contact: {
    email: "hello@atlantissportsclub.com",
    phone: "",  // e.g. "(508) 555-0199" — leave "" to hide
    addressLine1: "551 MA-6A",
    addressLine2: "East Sandwich, MA 02537",
    venue: "at Riverview School",
    // Google Maps embed — this default points to the address above.
    // To customize: Google Maps ▸ Share ▸ Embed a map ▸ copy the src URL.
    mapEmbed: "https://www.google.com/maps?q=551+MA-6A,+East+Sandwich,+MA+02537&output=embed",
    mapLink:  "https://www.google.com/maps/search/?api=1&query=551+MA-6A+East+Sandwich+MA+02537",
  },

  // Social links (leave "" to hide the icon)
  social: {
    instagram: "",
    facebook:  "",
  },
};
