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
    presale:      "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=216",   // Direct add-to-cart: Founding Membership contract (Mindbody, Site ID 7396, prodid 216)
    birthday:     "#",   // Birthday party booking
    lapLanes:     "#",   // Lap lane reservation
    danceStudio:  "#",   // Dance studio booking
    membership:   "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=216",   // Direct add-to-cart: Founding Membership
  },

  /* -- 2) PRICING -----------------------------------------------------------
     Enter numbers only (no “$”). The site fills in the “$”, works out the
     savings, and shows the regular price struck through automatically. */
  pricing: {
    currency: "$",

    // Regular rates (standard pricing after the founding deal)
    regularDown:     299,   // up-front enrollment fee
    regularMonthly:  129,   // monthly — FULL access (gym + pool)
    gymOnlyMonthly:  99,    // monthly — gym only (no pool)

    // Founding-member deal (first 500): $99 down + $99/mo FULL access,
    // locked for the first year, then rolls to the regular $129/mo.
    foundingDown:    99,
    foundingMonthly: 99,
    introMonths:     12,    // how long the founding rate is locked before it
                            //   rolls to regularMonthly

    // Scarcity
    foundingSpots:   500,   // how many founding memberships exist
    spotsRemaining:  null,  // OPTIONAL: set a number (e.g. 137) to show a
                            // “X of 500 claimed” progress bar. Leave null to hide.
  },

  /* -- 3) IMAGES  (file name -> put a matching file in assets/images/) --------
     Example: save your pool photo as  assets/images/pool.jpg  */
  images: {
    exterior:    "assets/images/exterior.jpg",
    pool:        "assets/images/pool.jpg",
    basketball:  "assets/images/basketball.jpg",
    dance:       "assets/images/dance.jpg",
    // Booking card photos (can reuse the amenity photos above)
    bookLapLanes:   "assets/images/pool.jpg",
    bookDance:      "assets/images/dance.jpg",
  },

  /* -- 3b) PARTY REQUEST FORM ------------------------------------------------
     The birthday-party form on parties.html sends every request to Switchboard
     OS, where it appears under Leads on the dashboard and triggers a "new lead"
     notification. This needs no setup — it reuses the same backend and client
     slug as the chat widget below.

     OPTIONAL second copy by email: paste a Web3Forms access key (free, from
     https://web3forms.com, created with the `recipient` address) and each
     request is also emailed straight to that inbox. Leave it blank to rely on
     the dashboard notification alone.

     If the dashboard can't be reached, the form falls back to opening the
     visitor's email app addressed to `recipient`, so no enquiry is ever lost. */
  partyForm: {
    web3formsKey: "",                              // optional — see above
    recipient:    "pkearney.atlantis@gmail.com",   // fallback / email copy
    subject:      "New birthday party request — Atlantis Sports Club",
    // Leave blank to reuse the chat widget's apiBase + clientSlug below.
    apiBase:      "",
    clientSlug:   "",
  },

  /* -- 4) OPENING DATE & DETAILS -------------------------------------------- */
  openingDate: "2027-07-07T09:00:00",   // drives the countdown
  openingLabel: "July 7, 2027",

  contact: {
    email: "pkearney.atlantis@gmail.com",
    phone: "(508) 862-2535",  // leave "" to hide
    addressLine1: "35 Scudder Ave",
    addressLine2: "Hyannis, MA 02601",
    venue: "",  // optional building/host name — leave "" to hide
    mapEmbed: "https://www.google.com/maps?q=35+Scudder+Ave,+Hyannis,+MA+02601&output=embed",
    mapLink:  "https://www.google.com/maps/search/?api=1&query=35+Scudder+Ave+Hyannis+MA+02601",
  },

  social: {
    instagram: "",
    facebook:  "https://www.facebook.com/ATLANTISSPORTSCLUBANDSPAHYANNIS/",
  },

  /* -- 5) AI CHAT WIDGET (Switchboard OS) ----------------------------------- */
  chat: {
    clientSlug: "atlantis-sports-club",              // your Switchboard OS client
    apiBase:    "https://switchboard-os.vercel.app", // Switchboard backend
    title:      "Atlantis Sports Club",              // shown in the chat header
    greeting:   "Hi! How can I help you?",           // proactive bubble + first message
  },
};
