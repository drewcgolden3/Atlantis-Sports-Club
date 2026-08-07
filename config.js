/* =============================================================================
   ATLANTIS SPORTS CLUB — SITE CONFIG
   -----------------------------------------------------------------------------
   This is the ONLY file you need to edit to go live. No coding required — just
   paste your links/text between the quotes.

   1) MEMBERSHIP LINKS  → your three Mindbody contract URLs
   2) PRICING           → the three biweekly membership levels
   3) IMAGES            → drop photos in assets/images/
   4) FORMS             → where enquiries are sent
   5) OPENING / CONTACT → date, address, email, phone
   ============================================================================ */

window.ATLANTIS_CONFIG = {

  /* -- 1) BOOKING & MEMBERSHIP LINKS ---------------------------------------
     The three membership links are Mindbody pre-sale contracts on Site 7396.
       prodid 218 = Founding Gym Membership          ($49 biweekly)
       prodid 219 = Founding Gym + Pool Membership   ($69 biweekly)
       prodid 220 = Founding Total Access Membership ($99 biweekly)
     Each charges the $99 enrollment today, then bills every two weeks starting
     opening day. To swap a link, replace the number after "prodid=".         */
  links: {
    // Individual rates
    fitness:      "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=218",
    fitnessPool:  "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=219",
    complete:     "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=220",

    // Student rates — 30% off, $49 enrollment, valid student ID at check-in
    studentFitness:      "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=221",
    studentFitnessPool:  "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=222",
    studentComplete:     "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=223",

    // Couples rates — 10% off each, ONE $99 enrollment covers both. The contract
    // bills the pair total; the site shows the per-person figure beside it.
    couplesFitness:      "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=224",
    couplesFitnessPool:  "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=225",
    couplesComplete:     "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=226",

    // Kept so older links/buttons still work — points at the Complete membership.
    membership:   "https://clients.mindbodyonline.com/classic/ws?studioid=7396&stype=40&prodid=220",

    birthday:     "#",   // Birthday party booking
    lapLanes:     "#",   // Lap lane reservation
    danceStudio:  "#",   // Dance studio booking
  },

  /* -- 2) PRICING -----------------------------------------------------------
     Enter numbers only (no "$"). Every price on the site is billed EVERY TWO
     WEEKS — 26 payments a year. The site says so automatically and prints the
     required disclaimer under each pricing table.                            */
  pricing: {
    currency: "$",
    paymentsPerYear: 26,          // 26 biweekly payments — used in the disclaimer

    // One-time enrollment fee, charged when they join
    enrollment:        99,        // founding rate
    regularEnrollment: 299,       // the rate after the founding memberships are gone

    // The three individual membership levels (biweekly dues)
    fitness:      49,
    fitnessPool:  69,
    complete:     99,

    // Student rates — 30% off the individual rate, reduced enrollment.
    // Requires a valid student ID at check-in.
    studentEnrollment: 49,
    studentFitness:     34,
    studentFitnessPool: 49,
    studentComplete:    69,

    // Couples rates — 10% off each. Enter what ONE PERSON pays; the site works
    // out the pair total (what the card is actually charged) by doubling it, so
    // the two numbers can never drift apart. One $99 enrollment covers both.
    couplesFitnessEach:     44,
    couplesFitnessPoolEach: 62,
    couplesCompleteEach:    89,

    // Scarcity
    foundingSpots:   500,   // how many founding memberships exist
    spotsRemaining:  null,  // OPTIONAL: set a number (e.g. 137) to show a
                            // "X of 500 claimed" progress bar. Leave null to hide.
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

  /* -- 3c) BIRTHDAY PARTY PACKAGE ------------------------------------------- */
  party: {
    startingPrice: 749,   // "starting at" price shown on the page
    maxGuests: 20,        // package covers up to this many people
  },

  /* -- 4) FORMS -------------------------------------------------------------
     Every form on the site sends the enquiry to Switchboard OS, where it shows
     up under Leads on the dashboard and triggers a "new lead" notification.
     That needs no setup — it reuses the client slug from the chat widget below.

     OPTIONAL email copy: paste a Web3Forms access key (free, from
     https://web3forms.com, created with the address you want it sent to) and
     each enquiry is ALSO emailed to that inbox. Leave blank to rely on the
     dashboard alone. If the dashboard can't be reached, the form falls back to
     opening the visitor's email app, so no enquiry is ever lost.             */

  partyForm: {
    web3formsKey: "",                              // optional — see above
    recipient:    "pkearney.atlantis@gmail.com",   // fallback / email copy
    subject:      "New birthday party request — Atlantis Sports Club",
    apiBase:      "",   // leave blank to reuse the chat widget's settings
    clientSlug:   "",
  },

  /* Founders membership enquiries (couples, family, senior, student, and the
     short lead form on every membership page). */
  foundersForm: {
    web3formsKey: "",
    recipient:    "pkearney.atlantis@gmail.com",
    subject:      "New Founders membership enquiry — Atlantis Sports Club",
  },

  /* Job applications from the Join the Team page.

     RESUME UPLOADS: the site has no file storage of its own, so applicants are
     asked for a resume LINK (Google Drive, Dropbox, LinkedIn) — that always
     works and always reaches the dashboard.
     If you paste a Web3Forms key ABOVE on a plan that supports attachments, an
     optional "attach a file" box also appears on the form. Leave it blank and
     the file box stays hidden rather than promising an upload that won't send. */
  careersForm: {
    web3formsKey: "",
    recipient:    "pkearney.atlantis@gmail.com",
    subject:      "New job application — Atlantis Sports Club",
  },

  /* Community partnership enquiries. */
  communityForm: {
    web3formsKey: "",
    recipient:    "pkearney.atlantis@gmail.com",
    subject:      "New community partnership enquiry — Atlantis Sports Club",
  },

  /* -- 5) OPENING DATE & DETAILS -------------------------------------------- */
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

  /* -- 6) AI CHAT WIDGET (Switchboard OS) ----------------------------------- */
  chat: {
    clientSlug: "atlantis-sports-club",              // your Switchboard OS client
    apiBase:    "https://switchboard-os.vercel.app", // Switchboard backend
    title:      "Atlantis Sports Club",              // shown in the chat header
    greeting:   "Hi! How can I help you?",           // proactive bubble + first message
  },
};
