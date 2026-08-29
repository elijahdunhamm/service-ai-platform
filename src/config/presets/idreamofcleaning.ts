// src/config/presets/idreamofcleaning.ts
import type { IndustryConfig } from "../types";

/**
 * Preset for "I Dream of Cleaning LLC" — a residential / small-commercial
 * cleaning brand (tenant id: "idreamofcleaning"). Mirrors the IndustryConfig
 * schema used by the existing cleaning / detailing presets so the shared layout
 * renders a fully themed cleaning site from this single object.
 *
 * All content was lifted from the reference site content doc
 * (/home/team/shared/idreamofcleaning-content.md). The reference screenshots
 * contain NO explicit prices — only the disclaimer below — so the numeric
 * service prices here are PLACEHOLDER estimates modeled on the cleaning preset's
 * base-price pattern. They need owner confirmation before going live.
 */
export const idreamofcleaningPreset: IndustryConfig = {
  id: "idreamofcleaning",
  name: "Cleaning",

  brand: {
    businessName: "I Dream of Cleaning LLC",
    tagline: "Residential & Small Commercial Cleaning",
    logo: "/images/idreamofcleaning-genie-logo.png",
    heroImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80",
    commercialImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
    residentialImage:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1920&q=80",
    heroImageFallback:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    commercialImageFallback:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    phone: "(555) 010-0231",
    phoneHref: "tel:+15550100231",
    email: "hello@idreamofcleaning.com",
    heroEyebrow: "Trusted House Cleaning Service",
    heroHeadline: "A Clean Home, Dreamed Into Reality.",
    heroSubhead:
      "I Dream of Cleaning LLC is your new trusted House Cleaning service — always high quality, with a great attention to detail. General, bedroom, bathroom, kitchen, and living-area cleaning with pet-friendly cleaners.",
    footerBlurb:
      "Professional residential and small commercial cleaning. Pet-friendly cleaners with a great attention to detail — spotless results every time.",
    copyrightName: "I Dream of Cleaning LLC",
  },

  theme: {
    primaryBg: "bg-royal",
    primaryBgHover: "hover:bg-royal-dark",
    primaryText: "text-royal",
    primaryLightBg: "bg-royal-light",
    primaryLightBgHover: "hover:bg-royal-light",
    primaryLightText: "text-royal-dark",
    primaryBorder: "border-royal",
    primaryBorderHover: "hover:border-gold",
    primarySoft: "text-royal-soft",
    primaryDeep: "text-gold",
    primaryHoverText: "hover:text-gold",
    footerBg: "bg-royal-dark",
    footerBorder: "border-royal-dark",
    footerHeading: "text-amber-50",
    footerMuted: "text-slate-300",
    footerBase: "text-slate-400",
  },

  navigation: {
    cta: "Book Now",
    links: [
      { label: "Services", href: "#services" },
      { label: "Results", href: "#results" },
      { label: "Locations", href: "#service-areas" },
      { label: "Commercial", href: "#commercial" },
      { label: "Estimate", href: "#estimate" },
      { label: "Reviews", href: "#reviews" },
      { label: "Contact", href: "#contact" },
    ],
  },

  trustBadges: [
    { label: "Licensed & Insured", icon: "shield" },
    { label: "Pet Friendly Cleaners", icon: "sparkles" },
    { label: "100% Satisfaction Guarantee", icon: "check-circle" },
  ],

  services: {
    residential: [
      {
        title: "House Cleaning",
        price: "$120",
        priceSuffix: "per visit (est.)",
        description:
          "Our House Cleaning service is always high quality with a great attention to detail. I Dream of Cleaning LLC is your new trusted House Cleaning service! We cover the general, bedroom, bathroom, kitchen, and living areas with pet-friendly cleaners.",
        features: [
          "General, Bedroom, Bathroom & Kitchen",
          "Living-Area Refresh",
          "Pet Friendly Cleaners",
        ],
      },
      {
        title: "General Cleaning",
        price: "$100",
        priceSuffix: "per visit (est.)",
        description:
          "A full-house general cleaning covering all areas of the home — dusting, vacuuming, mopping, and more, top to bottom.",
        features: [
          "Dust Surfaces & Furniture Tops",
          "Dust Baseboards, Chair Rails & Door Panels",
          "Vacuum Carpets & Damp Mop Floors",
          "Dust Blinds, Window Sills & Lock Ledges",
          "Dust & Clean Mirrors, Frames, Lamps & Shades",
          "Empty All Trash",
        ],
      },
      {
        title: "Bedrooms Cleaning",
        price: "$60",
        priceSuffix: "per visit (est.)",
        description:
          "A thorough bedroom clean — dusting, vacuuming, and bed linen care on request to leave your bedroom fresh and inviting.",
        features: [
          "Dust Surfaces & Furniture Tops",
          "Dust Baseboards, Chair Rails & Door Panels",
          "Vacuum Carpets & Damp Mop Floors",
          "Change Sheets (upon request)",
          "Make Beds (upon request)",
          "Empty Trash",
        ],
      },
      {
        title: "Bathroom Cleaning",
        price: "$50",
        priceSuffix: "per visit (est.)",
        description:
          "A detailed, disinfected bathroom clean — surfaces, showers, tubs, and toilets cleaned, disinfected, and left shining.",
        features: [
          "Clean & Disinfect Surfaces",
          "Clean, Disinfect & Shine Showers & Tubs",
          "Clean & Disinfect Toilets Inside & Out",
          "Clean & Disinfect Door Knobs & Switch Plates",
          "Shine Fixtures",
          "Vacuum & Damp Mop Floors",
        ],
      },
      {
        title: "Kitchens Cleaning",
        price: "$80",
        priceSuffix: "per visit (est.)",
        description:
          "A deep clean of the heart of your home — counter tops, appliances, sinks, and cabinets disinfected and polished.",
        features: [
          "Clean & Disinfect Counter Tops",
          "Clean Inside & Out of Microwave",
          "Shine Outside of Oven, Dishwasher & Fridge",
          "Clean & Disinfect Sink & Kitchen Table",
          "Spot Clean Cabinet Fronts",
          "Vacuum & Damp Mop Floors",
        ],
      },
      {
        title: "Deep Cleaning Services",
        price: "$200",
        priceSuffix: "per visit (est.)",
        description:
          "Everything included in our regular cleaning, plus a deeper top-to-bottom treatment of baseboards, doors, cabinets, and more.",
        features: [
          "Everything in Regular Cleaning, Plus:",
          "Damp Wipe Baseboards & Window Sills",
          "Damp Wipe Door Panels & Frames",
          "Vacuum Upholstered Furniture",
          "Remove Cobwebs",
          "Damp Wipe Kitchen & Bath Cabinets",
        ],
      },
      {
        title: "Move-In / Move-Out Cleaning",
        price: "$250",
        priceSuffix: "per visit (est.)",
        description:
          "A comprehensive deep clean that covers all the regular cleaning tasks combined with additional deep cleaning chores and a few extra services — ideal for moving day. Same thorough standard for move-outs as move-ins.",
        features: [
          "Oven Cleaning",
          "Fridge Cleaning",
          "Clean Inside of Cabinets",
          "Comprehensive Deep Cleaning Tasks",
          "All Regular Cleaning Tasks Included",
        ],
      },
      {
        title: "Customized Cleaning Services",
        price: "Custom",
        priceSuffix: "quote after consultation",
        description:
          "Only need specific areas cleaned? That's a Custom Cleaning. Customers choose this to save money when they don't need the whole house done — either by the hour based on budget, or by cleaning specific areas.",
        features: [
          "Choose the Areas You Need Cleaned",
          "Hire by the Hour Based on Your Budget, or",
          "Hire for Specific Areas of the House",
        ],
      },
      {
        title: "Air BnB Cleaning Services",
        price: "$150",
        priceSuffix: "per turnover (est.)",
        description:
          "Reliable turnover cleaning that keeps your listing guest-ready — beds made, dishes done, surfaces wiped, and inventory checked.",
        features: [
          "Making the Beds",
          "Cleaning & Putting Away Dishes",
          "Sweeping & Mopping Floors",
          "Vacuuming Carpets & Rugs",
          "Clean Toilets, Bathtubs & Showers",
          "Check for Damages & Report Low Inventory",
        ],
      },
      {
        title: "Ozone Generator Services",
        price: "$75",
        priceSuffix: "per treatment (est.)",
        description:
          "Ozone generator sanitization for areas that have suffered from smoke odors, mold, bacteria, and most viruses.",
        features: [
          "Removes Smoke Odors & Mold Affects",
          "Kills Bacteria & Most Viruses",
          "99.98% Bacteria Killing Rate",
        ],
      },
    ],
    commercial: [
      {
        title: "Small Commercial Business Cleaning",
        description:
          "A thorough, disinfected clean for small businesses — surfaces, showers, tubs, toilets, and fixtures left sparkling for your customers and staff.",
      },
      {
        title: "Offices & Reception Areas",
        description:
          "Recurring cleaning for offices, waiting areas, and shared spaces to keep your workplace presentable and professional.",
      },
      {
        title: "Retail & Storefronts",
        description:
          "Regular maintenance so your storefront and sales areas stay clean and inviting every day.",
      },
    ],
    addonsTitle: "House Cleaning Add-ons",
    addons: [
      {
        name: "Power Washing Services (concrete, brick, hard surfaces only)",
        price: "Quote",
        duration: "Varies",
      },
      {
        name: "Refrigerator Deep Cleaning",
        price: "$45",
        duration: "30 mins",
      },
      {
        name: "Stove Top / Oven Cleaning Services",
        price: "$40",
        duration: "30 mins",
      },
      {
        name: "Interior Window Cleaning",
        price: "$35",
        duration: "30 mins",
      },
    ],
  },

  beforeAfter: {
    title: "Before & After Results",
    description:
      "Real transformations from our recent jobs. See the difference an I Dream of Cleaning visit makes.",
    beforeLabel: "Before",
    afterLabel: "After",
    results: [
      {
        beforeImage: "/images/before-after/kitchen-before.jpg",
        afterImage: "/images/before-after/kitchen-after.jpg",
        caption: "Kitchen deep clean",
      },
      {
        beforeImage: "/images/before-after/living-before.jpg",
        afterImage: "/images/before-after/living-after.jpg",
        caption: "Living room refresh",
      },
      {
        beforeImage: "/images/before-after/bath-before.jpg",
        afterImage: "/images/before-after/bath-after.jpg",
        caption: "Bathroom detail",
      },
    ],
  },

  serviceAreas: [
    "Stockton",
    "Elk Grove",
    "Pleasanton",
    "Tracy",
    "Manteca",
    "Lathrop",
    "Modesto",
  ],

  sections: {
    residential: {
      eyebrow: "Home Care Experts",
      title: "Residential Cleaning Services",
      description:
        "Customized cleaning plans tailored to your home and routine. Our House Cleaning service is always high quality with a great attention to detail. Prices may vary depending on the square footage of the home or property, the number of bedrooms, and bathrooms.",
      icon: "home",
    },
    commercial: {
      eyebrow: "Business & Facilities",
      title: "Small Commercial Business Cleaning",
      description:
        "We also keep local offices, storefronts, and small commercial facilities spotless with the same detailed, disinfected standard we bring to your home.",
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
      description:
        "Real transformations from our recent jobs. Slide between before and after to see what an I Dream of Cleaning visit can do.",
      icon: "sparkles",
    },
    serviceAreas: {
      eyebrow: "Where We Work",
      title: "Proudly Serving Your Neighborhood",
      description:
        "Cleaning teams covering the San Joaquin Valley and East Bay. If your city is listed, we'll come to your door.",
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
      schedulerBadge: "Automated AI Scheduler",
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
          "Our house cleaning starts at $120, with general cleaning at $100, deep cleaning at $200, and move-in/move-out at $250. Prices may vary depending on the square footage of the home or property, the number of bedrooms, and bathrooms. Use the Service Price Estimator for an instant quote.",
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

  features: {
    showResidential: true,
    showCommercial: true,
    showEstimator: true,
    showReviews: true,
    showBeforeAfter: true,
    showServiceAreas: true,
    showBooking: true,
    showContact: true,
    showCraftsmanship: false,
    showStatement: false,
    showGallery: false,
  },
};

export default idreamofcleaningPreset;
