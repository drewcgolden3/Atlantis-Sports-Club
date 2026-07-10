/* =============================================================================
   ATLANTIS SPORTS CLUB — SITE CONFIG
   -----------------------------------------------------------------------------
   This is the ONLY file you need to edit to go live. No coding required — just
   paste your links/text between the quotes.

   1) BOOKING & PRESALE LINKS  → paste your Mindbody URLs
   2) PRICING                  → the founding-member deal vs. regular price
   3) IMAGES                   → drop photos in assets/images/
   4) OPENING DATE / CONTACT   → date, address, email, phone
   ============================================================================ */

window.ATLANTIS_CONFIG = {

  /* -- 1) BOOKING & PRESALE LINKS (paste Mindbody URLs between the quotes) -- */
  links: {
    presale:      "#",   // Presale sign-up / checkout (founding-member deal)
    birthday:     "#",   // Birthday party booking
    lapLanes:     "#",   // Lap lane reservation
    danceStudio:  "#",   // Dance studio booking
    membership:   "#",   // General membership / waitlist
  },

  /* -- 2) PRICING -----------------------------------------------------------
     Enter numbers only (no “$”). The site fills in the “$”, works out the
     savings, and shows the regular price struck through automatically. */
  pricing: {
    currency: "$",

    // Regular membership (after presale / after the first 500)
    regularDown:     299,
    regularMonthly:  129,

    // Founding-member deal (first 500 only)
    foundingDown:    99,
    foundingMonthly: 99,

    // Scarcity
    foundingSpots:   500,   // how many founding memberships exist
    spotsRemaining:  null,  // OPTIONAL: set a number (e.g. 137) to show a
                            // “X of 500 claimed” progress bar. Leave null to hide.
  },

  /* -- 3) IMAGES  (file name -> put a matching file in assets/images/) --------
     Example: save your pool photo as  assets/images/pool.jpg  */
  images: {
    pool:        "assets/images/pool.jpg",
    basketball:  "assets/images/basketball.jpg",
    dance:       "assets/images/dance.jpg",
    birthday:    "assets/images/birthday.jpg",
    // Booking card photos (can reuse the amenity photos above)
    bookBirthday:   "assets/images/birthday.jpg",
    bookLapLanes:   "assets/images/pool.jpg",
    bookDance:      "assets/images/dance.jpg",
  },

  /* -- 4) OPENING DATE & DETAILS -------------------------------------------- */
  openingDate: "2027-07-07T09:00:00",   // drives the countdown
  openingLabel: "July 7, 2027",

  contact: {
    email: "hello@atlantissportsclub.com",
    phone: "",  // e.g. "(508) 555-0199" — leave "" to hide
    addressLine1: "551 MA-6A",
    addressLine2: "East Sandwich, MA 02537",
    venue: "at Riverview School",
    mapEmbed: "https://www.google.com/maps?q=551+MA-6A,+East+Sandwich,+MA+02537&output=embed",
    mapLink:  "https://www.google.com/maps/search/?api=1&query=551+MA-6A+East+Sandwich+MA+02537",
  },

  social: {
    instagram: "",
    facebook:  "",
  },
};
