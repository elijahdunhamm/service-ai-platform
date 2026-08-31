// src/config/presets/idreamofcleaning.ts
import type { IndustryConfig } from "../types";

/**
 * Preset for "I Dream of Cleaning LLC" — a residential / small-commercial
 * cleaning brand (tenant id: "idreamofcleaning"). Rendered by the dedicated
 * IdreamofcleaningLayout (an editorial, distinctive presentation) which consumes
 * this single config object.
 *
 * BRAND (owner directive): vivid purple #b134eb + magenta #d234eb are the ACCENT
 * colors only. Body/headline text is plain BLACK for readability. Surrounding
 * shades (dark/deep/soft/light/pale) are derived to follow the client's genie
 * logo palette and are listed as assumptions for owner confirmation.
 *
 * All service copy was lifted verbatim from the owner's content doc
 * (/home/team/shared/idreamofcleaning-content.md) — the FULL included-task
 * catalog, feature-by-feature. The reference contains NO explicit prices, so the
 * numeric prices here are PLACEHOLDER estimates (kept from the earlier preset)
 * awaiting owner confirmation. The pricing disclaimer appears on every service.
 */
export const idreamofcleaningPreset: IndustryConfig = {
  id: "idreamofcleaning",
  name: "Cleaning",

  // The three owner-provided genie poses, used as decorative brand art. They
  // alternate (Pose 1 -> 2 -> 3 -> repeat) down the residential service cards
  // and are also swapped in for the AI-generated Lucide icons in the trust
  // badges + service-area summary cards so the genie becomes the brand stamp.
  genieImages: [
    "/images/idreamofcleaning-genie1.jpg",
    "/images/idreamofcleaning-genie2.jpg",
    "/images/idreamofcleaning-genie3.jpg",
  ],

  brand: {
    businessName: "I Dream of Cleaning LLC",
    tagline: "Residential & Small Commercial Cleaning",
    logo: "/images/idreamofcleaning-genie-logo.png",
    heroImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    commercialImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    residentialImage:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
    heroImageFallback:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    commercialImageFallback:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    phone: "(555) 010-0231",
    phoneHref: "tel:+15550100231",
    email: "hello@idreamofcleaning.com",
    heroEyebrow: "Trusted House Cleaning Service",
    heroHeadline: "A Clean Home,\nDreamed Into Reality.",
    heroSubhead:
      "I Dream of Cleaning LLC is your new trusted House Cleaning service — always high quality, with a great attention to detail. General, bedroom, bathroom, kitchen, and living-area cleaning with pet-friendly cleaners, plus small commercial care.",
    footerBlurb:
      "Professional residential and small commercial cleaning. Pet-friendly cleaners with a great attention to detail — spotless results every time.",
    copyrightName: "I Dream of Cleaning LLC",
  },

  // Vivid purple / magenta ACCENTS on plain-black text. Deep purple used for the
  // dark footer & dark surfaces. `surface` below carries the light page skin.
  theme: {
    primaryBg: "bg-dream",
    primaryBgHover: "hover:bg-dream-dark",
    primaryText: "text-dream",
    primaryLightBg: "bg-dream-soft",
    primaryLightBgHover: "hover:bg-dream-pale",
    primaryLightText: "text-dream-dark",
    primaryBorder: "border-dream",
    primaryBorderHover: "hover:border-dream-magenta",
    primarySoft: "text-dream-pale",
    primaryDeep: "text-dream-magenta",
    primaryHoverText: "hover:text-dream-dark",
    footerBg: "bg-dream-deep",
    footerBorder: "border-dream-deep",
    footerHeading: "text-white",
    footerMuted: "text-purple-100",
    footerBase: "text-white/60",
    // Floating AI chat widget — purple -> magenta gradient (vivid brand accent)
    // on a purple launcher/header, purple bubbles + send button, magenta ping
    // dot + header sparkle. These override the shared royal-blue defaults only
    // for this tenant; other tenants keep royal/gold.
    chatGradient: "linear-gradient(135deg, #b134eb, #d234eb)",
    chatAccentBg: "bg-dream",
    chatSoftBg: "bg-dream-magenta",
    chatSoftText: "text-dream-magenta",
    chatFaqHover: "hover:border-dream hover:text-dream",
    chatInputFocus: "focus:border-dream",
  },

  // Light, airy surfaces with plain-BLACK text (owner directive). Purple/magenta
  // appear only as accents, soft tints, and borders.
  surface: {
    surfaceBg: "bg-white",
    cardBg: "bg-white",
    cardBorder: "border-dream-pale",
    borderSubtle: "border-dream-pale/70",
    textPrimary: "text-black",
    textSecondary: "text-black/80",
    textMuted: "text-black/65",
    textSubtle: "text-black/60",
    textFaint: "text-black/50",
    headerBg: "bg-white/90",
    headerBorder: "border-dream-pale/80",
    navHoverBg: "hover:bg-dream-soft",
    mobileNavBg: "bg-white",
    mobileNavBorder: "border-dream-pale",
    mobileNavText: "text-black",
    heroBg: "bg-white",
    secondaryButton:
      "border border-black/20 bg-white text-black hover:bg-dream-soft",
    imageFrameBg: "bg-dream-soft",
    imageFrameBorder: "border-dream-pale",
    residentialOverlay: "bg-gradient-to-b from-white/90 via-white/80 to-white/90",
    sectionAltBg: "bg-dream-soft/50",
    mutedBg: "bg-dream-soft/50",
    mutedBorder: "border-dream-pale/70",
    inputBg: "bg-white",
    inputBorder: "border-black/20",
    selectBg: "bg-white",
    selectText: "text-black",
    stepBg: "bg-dream-soft",
    stepHoverBg: "hover:bg-dream-pale",
    stepText: "text-black",
    takenBg: "bg-black/5",
    takenBorder: "border-black/10",
    takenText: "text-black/40",
    slotBg: "bg-white",
    slotText: "text-black",
    optionBorder: "border-black/10",
    optionText: "text-black",
    optionHoverBg: "hover:bg-dream-soft",
    uploadBorder: "border-black/30",
    uploadHoverBorder: "hover:border-dream",
    successBadge: "bg-dream-soft text-dream-dark",
    closeButton: "text-black/50 hover:text-black hover:bg-dream-soft",
    cardHover: "hover:shadow-2xl hover:-translate-y-1",
    heroOverlay: "bg-gradient-to-r from-black/80 via-black/60 to-black/30",
    statementOverlay: "bg-dream-deep/90",
  },

  // Nunito — friendly, rounded sans chosen by the owner ("replace the font with
  // google font style nunito"). Applied to BOTH headings and body for this
  // tenant only; other tenants keep Playfair Display + Lato. Paragraph copy is
  // unchanged — only the typeface switches.
  fonts: {
    heading: "font-nunito",
    body: "font-nunito",
  },

  // Only links backed by real on-page sections + the booking CTA. "Results"
  // (before/after) was pruned — no owner-provided before/after content, only
  // placeholder stock images. Commercial is a real section (small commercial
  // cleaning). Locations renders but stays reachable from the footer.
  navigation: {
    cta: "Book Now",
    links: [
      { label: "Services", href: "#services" },
      { label: "Commercial", href: "#commercial" },
      { label: "Pricing", href: "#estimate" },
      { label: "Reviews", href: "#reviews" },
      { label: "Contact", href: "#contact" },
    ],
  },

  trustBadges: [
    {
      label: "Beauty Restored, Detail Observed",
      icon: "sparkles",
      iconImage: "/images/idreamofcleaning-genie1.jpg",
    },
    {
      label: "Pet Friendly Cleaners",
      icon: "shield",
      iconImage: "/images/idreamofcleaning-genie2.jpg",
    },
    {
      label: "100% Satisfaction Guarantee",
      icon: "check-circle",
      iconImage: "/images/idreamofcleaning-genie3.jpg",
    },
  ],

  services: {
    residential: [
      {
        title: "House Cleaning",
        price: "$120",
        priceSuffix: "per visit (PLACEHOLDER)",
        description:
          "Our House Cleaning service is always high quality with a great attention to detail. I Dream of Cleaning LLC is your new trusted House Cleaning service!",
        features: [
          "General Cleaning",
          "Bedroom Cleaning",
          "Bathroom Cleaning",
          "Kitchen Cleaning",
          "Living Area Cleaning",
          "Pet Friendly Cleaners",
          "Add-ons available: Power Washing (concrete, brick & hard surfaces only), Refrigerator Deep Cleaning, Stove Top / Oven Cleaning, Interior Window Cleaning",
        ],
      },
      {
        title: "General Cleaning",
        price: "$100",
        priceSuffix: "per visit (PLACEHOLDER)",
        description:
          "A full-house general cleaning covering all areas of the home, top to bottom.",
        features: [
          "All areas of the house",
          "Dust surfaces",
          "Dust and hand wipe furniture tops",
          "Dust baseboards, chair rails, and door panels",
          "Dust ceiling fans (within reach)",
          "Vacuum carpets",
          "Vacuum and damp mop floors",
          "Dust blinds, window sills, and lock ledges",
          "Dust furniture",
          "Dust picture frames",
          "Dust lamps and lamp shades",
          "Dust and clean mirrors",
          "Empty all trash",
        ],
      },
      {
        title: "Bedrooms Cleaning",
        price: "$60",
        priceSuffix: "per visit (PLACEHOLDER)",
        description:
          "A thorough bedroom clean — dusting, vacuuming, and bed-linen care on request to leave your bedroom fresh and inviting.",
        features: [
          "Dust surfaces",
          "Dust and hand wipe furniture tops",
          "Dust furniture",
          "Dust baseboards, chair rails, and door panels",
          "Dust blinds, window sills, and lock ledges",
          "Vacuum carpets",
          "Vacuum and damp mop floors (if non-carpet)",
          "Change sheets (upon request)",
          "Make beds (upon request)",
          "Empty trash",
        ],
      },
      {
        title: "Bathroom Cleaning",
        price: "$50",
        priceSuffix: "per visit (PLACEHOLDER)",
        description:
          "A detailed, disinfected bathroom clean — surfaces, showers, tubs, and toilets cleaned, disinfected, and left shining.",
        features: [
          "Dust surfaces",
          "Dust blinds, window sills, and lock ledges",
          "Dust cabinets, door panels, and baseboards",
          "Clean and disinfect surfaces",
          "Spot clean cabinet fronts",
          "Clean, disinfect, and shine showers and tubs",
          "Clean and disinfect toilets inside and out",
          "Clean and disinfect door knobs and switch plates",
          "Shine fixtures",
          "Vacuum and damp mop floors",
          "Empty trash",
        ],
      },
      {
        title: "Kitchens Cleaning",
        price: "$80",
        priceSuffix: "per visit (PLACEHOLDER)",
        description:
          "A deep clean of the heart of your home — counter tops, appliances, sinks, and cabinets disinfected and polished.",
        features: [
          "Dust surfaces",
          "Dust blinds, window sills, and lock ledges",
          "Dust chair rails, cabinets, door panels, and baseboards",
          "Dust top of refrigerator",
          "Clean and disinfect counter tops",
          "Spot clean cabinet fronts",
          "Clean and disinfect door knobs and switch plates",
          "Clean and disinfect sink",
          "Clean and disinfect microwave inside and out",
          "Clean, disinfect, and shine outside of oven and top of range",
          "Clean, disinfect, and shine outside of dishwasher",
          "Clean, disinfect, and shine outside of refrigerator",
          "Clean and disinfect kitchen table",
          "Vacuum and damp mop floors",
          "Empty trash",
        ],
      },
      {
        title: "Deep Cleaning Services",
        price: "$200",
        priceSuffix: "per visit (PLACEHOLDER)",
        description:
          "Everything included in our regular cleaning, plus a deeper top-to-bottom treatment of baseboards, doors, cabinets, and more.",
        features: [
          "Everything in regular cleaning, plus:",
          "Damp wipe baseboards and window sills",
          "Damp wipe door panels and frames",
          "Vacuum upholstered furniture",
          "Remove cobwebs",
          "Damp wipe kitchen and bathroom cabinets",
        ],
      },
      {
        title: "Move-In / Move-Out Cleaning",
        price: "$250",
        priceSuffix: "per visit (PLACEHOLDER)",
        description:
          "Move-in cleaning covers all the regular cleaning tasks in combination with additional deep cleaning chores and a few extra services — ideal for moving day. The same thorough standard applies to move-outs as to move-ins.",
        features: [
          "Oven cleaning",
          "Fridge cleaning",
          "Cleaning the inside of your cabinets",
          "A comprehensive list of thorough deep cleaning tasks",
          "All regular cleaning tasks included, plus extra services",
        ],
      },
      {
        title: "Customized Cleaning Services",
        price: "Custom",
        priceSuffix: "quote after consultation",
        description:
          "Only need specific areas cleaned? That's a Custom Cleaning. Customers choose it to save money when they don't need the whole house done — either by the hour based on budget, or by cleaning specific areas of the home. Each method has its advantages and disadvantages.",
        features: [
          "Hire for a certain amount of hours based on your budget, or",
          "Hire for cleaning certain areas of the house",
          "Save money by cleaning only what you need",
        ],
      },
      {
        title: "Air BnB Cleaning Services",
        price: "$150",
        priceSuffix: "per turnover (PLACEHOLDER)",
        description:
          "Reliable turnover cleaning that keeps your listing guest-ready — beds made, dishes done, surfaces wiped, and inventory checked.",
        features: [
          "Making the beds",
          "Cleaning and putting away the dishes",
          "Sweeping and mopping floors",
          "Vacuuming carpets and rugs",
          "Cleaning toilets, bathtubs, and showers",
          "Taking out the trash",
          "Wiping countertops, door handles, and light switches",
          "Checking for damages and reporting low inventory",
        ],
      },
      {
        title: "Ozone Generator Services",
        price: "$75",
        priceSuffix: "per treatment (PLACEHOLDER)",
        description:
          "Ozone generator sanitation for areas that have suffered from smoke odors, mold, bacteria, and most viruses.",
        features: [
          "Sanitize areas affected by smoke odors and mold",
          "Eliminates bacteria and most viruses",
          "99.98% bacteria killing rate",
        ],
      },
    ],
    commercial: [
      {
        title: "Small Commercial Business Cleaning",
        description:
          "A thorough, disinfected clean for small businesses — dusting, disinfection, and shine across surfaces, showers, tubs, toilets, and fixtures, left sparkling for your customers and staff.",
        features: [
          "Dust surfaces",
          "Dust blinds, window sills, and lock ledges",
          "Dust cabinets, door panels, and baseboards",
          "Clean and disinfect surfaces",
          "Spot clean cabinet fronts",
          "Clean, disinfect, and shine showers and tubs",
          "Clean and disinfect toilets inside and out",
          "Clean and disinfect door knobs and switch plates",
          "Shine fixtures",
          "Vacuum and damp mop floors",
          "Empty trash",
        ],
      },
    ],
    addonsTitle: "House Cleaning Add-ons",
    addons: [
      {
        name: "Power Washing Services (concrete, brick & hard surfaces only)",
        price: "Quote",
        duration: "Varies",
      },
      {
        name: "Refrigerator Deep Cleaning",
        price: "$45 (PLACEHOLDER)",
        duration: "30 mins",
      },
      {
        name: "Stove Top / Oven Cleaning Services",
        price: "$40 (PLACEHOLDER)",
        duration: "30 mins",
      },
      {
        name: "Interior Window Cleaning",
        price: "$35 (PLACEHOLDER)",
        duration: "30 mins",
      },
    ],
  },

  beforeAfter: {
    title: "Before & After Results",
    description: "Real transformations from our recent jobs.",
    beforeLabel: "Before",
    afterLabel: "After",
    results: [],
  },

  serviceAreas: [
    "Richmond",
    "Berkeley",
    "Albany",
    "El Cerrito",
    "Oakland",
    "Emeryville",
    "San Leandro",
    "Hayward",
    "Fremont",
    "Union City",
  ],

  // About Us — owner-provided copy, rendered verbatim on the page. Config-driven
  // so the editorial layout stays content-free of hardcoded tenant copy.
  about: {
    eyebrow: "About Us",
    title: "A Helping Hand With a Personal Touch",
    paragraphs: [
      "I Dream of Cleaning LLC is an owner operated housekeeping business founded in 2018 by Akilah Norris. Her small business company was created to lend a helping hand to individuals who have the desire to clean but may not have the time or energy with the hustle and bustle of life. With many clients now juggling work, children, marriage or just the everyday chores and necessity of running a complicated household, we are available to ease your load, relax your mind, and leave the cleaning to our professional staff of housekeepers. Our brand is based on the business principles of clear and frequent communication, establishing a friendly family rapport, schedule flexibility, quality work, attention to details, and good customer service. We aim to please and our business and workers are fully bonded & insured.",
    ],
  },

  sections: {
    residential: {
      eyebrow: "Our Cleaning Services",
      title: "A Service for Every Space",
      description:
        "From a quick freshen-up to a total deep clean, every visit is high quality with a great attention to detail. Prices may vary depending on the square footage of the home or property, the number of bedrooms, and bathrooms.",
      icon: "sparkles",
    },
    commercial: {
      eyebrow: "Business & Facilities",
      title: "Small Commercial Business Cleaning",
      description:
        "We keep local small businesses spotless with the same detailed, disinfected standard we bring to your home. Prices may vary depending on the square footage of the home or property, the number of bedrooms, and bathrooms.",
      icon: "building",
    },
    estimator: {
      eyebrow: "Transparent Pricing",
      title: "Calculate Your Service Quote",
      description:
        "No hidden fees. Customize your plan and see an estimate in real time. Prices may vary depending on the square footage of the home or property, the number of bedrooms, and bathrooms.",
    },
    reviews: {
      title: "Google & Yelp Testimonials",
      description:
        "Real reviews from real neighbors. Rated 5.0 by homeowners across the community.",
    },
    beforeAfter: {
      eyebrow: "See the Difference",
      title: "Before & After Results",
      description: "Real transformations from our recent jobs.",
      icon: "sparkles",
    },
    serviceAreas: {
      eyebrow: "Where We Work",
      title: "Proudly Serving Your Neighborhood",
      description:
        "Cleaning teams covering the San Francisco Bay Area. If your city is listed, we'll come to your door.",
      icon: "home",
    },
  },

  estimator: {
    currency: "$",
    baseRates: {
      "house-cleaning": 120,
      "general-cleaning": 100,
      "bedrooms": 60,
      "bathroom": 50,
      "kitchens": 80,
      "deep-cleaning": 200,
      "move-in-out": 250,
      "customized": 0,
      "airbnb": 150,
      "ozone": 75,
    },
    bedRate: 25,
    bathRate: 20,
    minRooms: 1,
    defaultBedrooms: 2,
    defaultBathrooms: 1,
    defaultFrequency: "biweekly",
    serviceTypes: [
      { id: "house-cleaning", label: "House Cleaning" },
      { id: "general-cleaning", label: "General Cleaning" },
      { id: "bedrooms", label: "Bedrooms Cleaning" },
      { id: "bathroom", label: "Bathroom Cleaning" },
      { id: "kitchens", label: "Kitchens Cleaning" },
      { id: "deep-cleaning", label: "Deep Cleaning" },
      { id: "move-in-out", label: "Move-In / Move-Out Cleaning" },
      { id: "customized", label: "Customized Cleaning" },
      { id: "airbnb", label: "Air BnB Cleaning" },
      { id: "ozone", label: "Ozone Generator" },
    ],
    frequencies: [
      { id: "one-time", label: "One-Time Service", multiplier: 1 },
      { id: "biweekly", label: "Bi-Weekly (Save 10%)", multiplier: 0.9 },
      { id: "weekly", label: "Weekly Clean (Save 15%)", multiplier: 0.85 },
    ],
    copy: {
      title: "Service Price Estimator",
      subtitle:
        "Pick your service for a real-time, all-inclusive quote — no hidden fees. Prices may vary depending on the square footage of the home or property, the number of bedrooms, and bathrooms.",
      serviceTypeLabel: "Service Type",
      bedroomsLabel: "Bedrooms",
      bathroomsLabel: "Bathrooms",
      frequencyLabel: "Frequency",
      estimatedLabel: "Estimated Price",
      perSuffix: "/ visit",
      bookButton: "Book Now",
    },
  },

  booking: {
    defaultDate: "2026-09-01",
    timeSlots: ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
    initialBookedSlots: {
      "2026-09-01": ["09:00 AM", "01:00 PM"],
      "2026-09-02": ["11:00 AM", "03:00 PM"],
    },
    copy: {
      schedulerBadge: "Book your cleaning now",
      title: "Select Date & Available Time",
      subtitle:
        "Conflicting slots are automatically disabled based on real-time availability.",
      selectDateLabel: "Select Date",
      timeWindowLabel: "Available Time Windows",
      bookedLabel: "Booked",
      nameLabel: "Your Full Name",
      namePlaceholder: "Jane Doe",
      emailLabel: "Email Address",
      emailPlaceholder: "jane@example.com",
      addressLabel: "Service Address",
      addressPlaceholder: "Street address where service is needed",
      confirmButton: "Confirm Booking",
      mediaLabel: "Attach a Photo or Video (required)",
      mediaHint: "Upload a photo or video of the area you'd like cleaned.",
      doneButton: "Done",
      successTitle: "Appointment Confirmed!",
      successTextBefore: "Automated AI verification logged your booking for",
      successTextAt: "at",
      serviceLabel: "Service",
      totalLabel: "Estimated Total",
      clientLabel: "Client",
    },
  },

  storage: {
    bucket: "clientimages",
  },

  testimonials: {
    rating: 5,
    items: [
      {
        quote:
          "I Dream of Cleaning takes such great care of our home. Coming home to a spotless house with everything exactly where it should be is the best feeling!",
        name: "Sarah M.",
        role: "Homeowner · Verified Google Review",
        platform: "google",
        stars: 5,
      },
      {
        quote:
          "They clean our home weekly and also handle our small dental office. Punctual, thorough, and super trustworthy.",
        name: "David K.",
        role: "Residential & Business Client",
        platform: "google",
        stars: 5,
      },
      {
        quote:
          "The deep clean was so detailed — baseboards, doors, and cabinets all done. Our place has never looked better.",
        name: "Jessica T.",
        role: "Apartment Tenant · Verified Yelp Review",
        platform: "yelp",
        stars: 5,
      },
      {
        quote:
          "Great service, very professional, would highly recommend to anyone!",
        name: "Dru Bedard",
        role: "Homeowner",
        platform: "google",
        stars: 5,
      },
      {
        quote:
          "The team left everything spotless and clean and worked efficiently. I would definitely recommend them.",
        name: "Brian",
        role: "Apartment Tenant",
        platform: "google",
        stars: 5,
      },
      {
        quote:
          "Great as always — wonderful job cleaning my home. Highly recommend!",
        name: "Shivam Vohra",
        role: "Homeowner",
        platform: "yelp",
        stars: 5,
      },
    ],
  },

  chat: {
    enabled: true,
    title: "Customer Support",
    greeting:
      "Hi there! 👋 How can we help you today? Pick a topic below or type your question.",
    placeholder: "Type your question...",
    faqs: [
      {
        question: "Pricing",
        answer:
          "Our house cleaning starts at $120, with general cleaning at $100, deep cleaning at $200, and move-in/move-out at $250 (all placeholder estimates). Prices may vary depending on the square footage of the home or property, the number of bedrooms, and bathrooms. Use the Service Price Estimator for an instant quote.",
      },
      {
        question: "Booking",
        answer:
          "You can book online in under a minute with our scheduler — just pick your date and an available time slot. You'll get an instant confirmation, and we'll send a reminder before your appointment.",
      },
      {
        question: "Services",
        answer:
          "We offer House Cleaning, General, Bedrooms, Bathrooms, Kitchens, Deep Cleaning, Move-In/Move-Out, Customized, Air BnB, and Ozone Generator services, plus add-ons like Power Washing, Refrigerator Deep Cleaning, Stove Top/Oven Cleaning, and Interior Window Cleaning.",
      },
      {
        question: "Hours",
        answer:
          "We operate Monday through Saturday, 8:00 AM to 4:00 PM. Book a time slot online and we'll be right on time!",
      },
    ],
  },

  // Page-load intro: the brand genie flies across the screen riding a magic
  // carpet drawn in the tenant's purple/magenta theme. Optional + default-OFF
  // on IndustryConfig, so only this tenant (and any that opt in) gets it.
  intro: {
    enabled: false,
    // Reuse the same genie poses used elsewhere (corner art, trust badges).
    images: [
      "/images/idreamofcleaning-genie1.jpg",
      "/images/idreamofcleaning-genie2.jpg",
      "/images/idreamofcleaning-genie3.jpg",
    ],
    // Colors derived from the dream palette (tailwind.config.js): deep purple
    // body, magenta fringe/glow, soft purple highlight — mirrors the brand.
    colors: {
      primary: "#8f1dc3", // dream.dark (carpet body)
      accent: "#d234eb", // dream.magenta (fringe + glow)
      highlight: "#e6c4fb", // dream.pale (outline / sheen)
      glow: "rgba(178, 52, 235, 0.55)", // purple glow behind the rider
    },
    durationMs: 2600,
  },
  // Full-screen page loader / splash shown on app mount before the site content
  // renders. GENIE-themed dashboard-style loader: the transparent genie logo
  // (brand.logo) centered on a deep purple background with a soft purple glow,
  // gentle pulse and a shimmer progress bar. Plays FIRST (before the magic-carpet
  // intro), then the existing MagicCarpetIntro flies the genie across — the two
  // full-screen overlays never stack. Default-OFF on IndustryConfig, so only this
  // tenant opts in. Respects prefers-reduced-motion (static logo briefly).
  loader: {
    enabled: true,
    logo: "/images/idreamofcleaning-genie-logo.png",
    tagline: "I Dream of Cleaning LLC",
    durationMs: 2500,
    background: "#ffffff", // white — loader reads clearly on a light splash
    glow: "rgba(178, 52, 235, 0.5)", // soft purple halo behind the genie on white
  },

  // Service-area -> city-skyline background image mapping for the location
  // grid. Each Bay Area city gets its own dark, atmospheric skyline so the
  // location cards render as rounded, skyline-backed dark cards with white
  // city names. Keep this in the preset (config-driven), never in the layout.
  serviceAreaImages: {
    Richmond: "/images/idreamofcleaning-skyline-richmond.png",
    Berkeley: "/images/idreamofcleaning-skyline-berkeley.png",
    Albany: "/images/idreamofcleaning-skyline-albany.png",
    "El Cerrito": "/images/idreamofcleaning-skyline-el-cerrito.png",
    Oakland: "/images/idreamofcleaning-skyline-oakland.png",
    Emeryville: "/images/idreamofcleaning-skyline-emeryville.png",
    "San Leandro": "/images/idreamofcleaning-skyline-san-leandro.png",
    Hayward: "/images/idreamofcleaning-skyline-hayward.png",
    Fremont: "/images/idreamofcleaning-skyline-fremont.png",
    "Union City": "/images/idreamofcleaning-skyline-union-city.png",
  },

  features: {
    showResidential: true,
    showCommercial: true,
    showEstimator: true,
    showReviews: true,
    showBeforeAfter: false,
    showServiceAreas: true,
    showBooking: true,
    showContact: true,
    showCraftsmanship: false,
    showStatement: false,
    showGallery: false,
  },
};

export default idreamofcleaningPreset;
