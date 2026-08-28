// src/config/presets/detailing.ts
import type { IndustryConfig } from "../types";

/**
 * Preset for the premium automotive detailing industry ("Precision Auto
 * Detailing"). Mirrors the exact IndustryConfig schema used by the cleaning and
 * HVAC presets so the shared layout renders a fully themed detailing site from
 * this single object. All content here is config data — the UI stays generic.
 */
export const detailingPreset: IndustryConfig = {
  id: "detailing",
  name: "Car Detailing",

  brand: {
    businessName: "Precision Auto Detailing",
    tagline: "Premium Mobile Detailing",
    logo: "/images/detailing-logo.png",
    heroImage: "/images/detailing-hero.jpg",
    commercialImage: "/images/detailing-exterior-after.jpg",
    residentialImage: "/images/detailing-garage-bg.jpg",
    heroImageFallback: "/images/detailing-exterior-after.jpg",
    commercialImageFallback: "/images/detailing-interior-after.jpg",
    phone: "(555) 010-0220",
    phoneHref: "tel:+15550100220",
    email: "hello@precisiondetail.example.com",
    heroEyebrow: "Premier Mobile Auto Detailing",
    heroHeadline: "Showroom Shine, Delivered to Your Door.",
    heroSubhead:
      "Expert interior and exterior detailing brought straight to your home or office. We bring the garage-grade equipment and leave your vehicle showroom-fresh.",
    footerBlurb:
      "Professional mobile car detailing for interiors, exteriors, and paint correction. Showroom-quality results on your schedule.",
    copyrightName: "Precision Auto Detailing",
  },

  theme: {
    primaryBg: "bg-blue-600",
    primaryBgHover: "hover:bg-blue-700",
    primaryText: "text-blue-600",
    primaryLightBg: "bg-blue-50",
    primaryLightBgHover: "hover:bg-blue-50",
    primaryLightText: "text-blue-700",
    primaryBorder: "border-blue-600",
    primaryBorderHover: "hover:border-blue-400",
    primarySoft: "text-blue-100",
    primaryDeep: "text-blue-400",
    primaryHoverText: "hover:text-blue-600",
    footerBg: "bg-slate-950",
    footerBorder: "border-slate-900",
    footerHeading: "text-slate-200",
    footerMuted: "text-slate-400",
    footerBase: "text-slate-500",
  },

  navigation: {
    cta: "Book Detail",
    links: [
      { label: "Services", href: "#services" },
      { label: "Locations", href: "#service-areas" },
      { label: "Estimate", href: "#estimate" },
    ],
  },

  trustBadges: [
    { label: "Licensed & Insured", icon: "shield" },
    { label: "Certified Detail Technicians", icon: "sparkles" },
    { label: "100% Satisfaction Guarantee", icon: "check-circle" },
  ],

  services: {
    residential: [
      {
        title: "Basic Wash & Vac",
        price: "$45",
        priceSuffix: "· ~1 hr",
        description:
          "A quick exterior hand wash and interior vacuum to keep your daily driver fresh between full details.",
        features: [
          "Hand Wash & Dry",
          "Interior Vacuum",
          "Dusting of Dash & Console",
        ],
      },
      {
        title: "Full Interior Detail",
        price: "$120",
        priceSuffix: "· ~3 hrs",
        description:
          "A complete top-to-bottom interior restoration — shampooed carpets, conditioned leather, and every nook and cranny detailed.",
        features: [
          "Shampoo Carpets & Upholstery",
          "Leather Clean & Condition",
          "Steam Clean Vents & Crevices",
        ],
      },
      {
        title: "Exterior Wash & Wax",
        price: "$90",
        priceSuffix: "· ~2 hrs",
        description:
          "A thorough exterior wash, decontamination, and protective wax that restores gloss and guards your paint.",
        features: [
          "Hand Wash & Decontamination",
          "Clay Bar Treatment",
          "Machine Polish & Wax Sealant",
        ],
      },
      {
        title: "Premium Paint Correction & Ceramic Coating",
        price: "$350",
        priceSuffix: "· 6–8 hrs",
        description:
          "Our showroom flagship. Multi-stage paint correction removes swirls and scratches, sealed with a long-lasting ceramic coating.",
        features: [
          "Multi-Stage Paint Correction",
          "Ceramic Coating Protection",
          "Wheels, Trim & Glass Detail",
        ],
      },
    ],
    commercial: [
      {
        title: "Fleet Detailing Programs",
        description:
          "Recurring interior and exterior detailing for company vehicles, delivery fleets, and branded cars.",
      },
      {
        title: "Dealership Showroom Prep",
        description:
          "New-arrival and pre-delivery detailing that gets every unit lot-ready and shine-worthy.",
      },
      {
        title: "Rental & Ride-Share Refresh",
        description:
          "Quick-turn sanitization and full details for rentals and rideshare vehicles between customers.",
      },
    ],
    addonsTitle: "Add-ons",
    addons: [
      { name: "Pet Hair Removal", price: "$25+", duration: "30 mins" },
      { name: "Engine Bay Cleaning", price: "$40", duration: "30 mins" },
      { name: "Headlight Restoration", price: "$50", duration: "45 mins" },
      { name: "Odor Removal / Ozone Treatment", price: "$30", duration: "20 mins" },
    ],
  },

  beforeAfter: {
    title: "Before & After Results",
    description:
      "Real transformations from our recent details. See the difference a Precision visit makes.",
    beforeLabel: "Before",
    afterLabel: "After",
    results: [
      {
        beforeImage: "/images/detailing-exterior-before.jpg",
        afterImage: "/images/detailing-exterior-after.jpg",
        caption: "Exterior wash, polish & ceramic",
      },
      {
        beforeImage: "/images/detailing-interior-before.jpg",
        afterImage: "/images/detailing-interior-after.jpg",
        caption: "Full interior restoration",
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
      eyebrow: "Detailing Packages",
      title: "Premium Detailing Services",
      description:
        "From a quick freshen-up to full paint correction — tailored packages for every vehicle and budget.",
      icon: "sparkles",
    },
    commercial: {
      eyebrow: "Fleets & Businesses",
      title: "Commercial & Fleet Detailing",
      description:
        "We also keep company fleets, dealership lots, and rental vehicles showroom-ready. Flexible programs designed around your business schedule.",
      icon: "building",
    },
    estimator: {
      eyebrow: "Transparent Pricing",
      title: "Calculate Your Detail Quote",
      description:
        "No hidden fees. Pick your service and vehicle size to see an instant, accurate estimate.",
    },
    reviews: {
      title: "Google & Yelp Testimonials",
      description:
        "Real reviews from real car owners. Rated 5.0 by enthusiasts across the community.",
    },
    beforeAfter: {
      eyebrow: "See the Difference",
      title: "Before & After Results",
      description:
        "Real transformations from our recent details. Slide between before and after to see what Precision Auto Detailing can do.",
      icon: "sparkles",
    },
    serviceAreas: {
      eyebrow: "Where We Work",
      title: "Proudly Serving Your Neighborhood",
      description:
        "Mobile detailing teams covering the San Joaquin Valley and East Bay. If your city is listed, we'll come to you.",
      icon: "home",
    },
  },

  estimator: {
    currency: "$",
    baseRates: {
      interior: 120,
      exterior: 90,
      full: 299,
    },
    // Per-square-foot cost scaled by vehicle size, plus optional extras.
    bedRate: 20,
    bathRate: 10,
    minRooms: 1,
    defaultBedrooms: 1,
    defaultBathrooms: 0,
    defaultFrequency: "one-time",
    serviceTypes: [
      { id: "interior", label: "Interior Detail" },
      { id: "exterior", label: "Exterior Detail" },
      { id: "full", label: "Full Detail (Interior + Exterior)" },
    ],
    frequencies: [
      { id: "one-time", label: "One-Time Detail", multiplier: 1 },
      { id: "quarterly", label: "Quarterly Plan (Save 5%)", multiplier: 0.95 },
      { id: "monthly", label: "Monthly Plan (Save 10%)", multiplier: 0.9 },
    ],
    copy: {
      title: "Instant Detailing Estimator",
      subtitle:
        "Select your service and vehicle size for a real-time, all-inclusive quote — no hidden fees.",
      serviceTypeLabel: "Service Type",
      bedroomsLabel: "Vehicle Size",
      bathroomsLabel: "Extras",
      frequencyLabel: "Frequency",
      estimatedLabel: "Estimated Price",
      perSuffix: "/ detail",
      bookButton: "Book Detail",
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
      mediaLabel: "Attach Photos of Your Vehicle (required)",
      mediaHint:
        "Upload photos of your vehicle so our detailers can prep for your visit.",
      doneButton: "Done",
      successTitle: "Appointment Confirmed!",
      successTextBefore: "Your detailing appointment is confirmed for",
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
          "The ceramic coating on my truck is unreal — it's been two months and it still looks like the day they finished. Worth every penny.",
        name: "Maya R.",
        role: "Truck Owner · Verified Google Review",
        platform: "google",
        stars: 5,
      },
      {
        quote:
          "They came to my office, detailed my car over lunch, and I barely noticed they were here. Interior looks brand new.",
        name: "Tom H.",
        role: "Sedan Owner",
        platform: "google",
        stars: 5,
      },
      {
        quote:
          "My Labrador's fur and mud were everywhere. The pet-hair removal plus full interior detail truly transformed the SUV.",
        name: "Nina P.",
        role: "SUV Owner · Verified Yelp Review",
        platform: "yelp",
        stars: 5,
      },
      {
        quote:
          "Headlight restoration brought my old car's lights back to crystal clear. Incredibly professional and quick.",
        name: "Andre W.",
        role: "Car Enthusiast",
        platform: "google",
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
          "Details start at $45 (Basic Wash & Vac), $90 (Exterior Wash & Wax), $120 (Full Interior Detail), and $350 (Paint Correction & Ceramic Coating). Use our instant estimator for an accurate quote based on your vehicle size.",
      },
      {
        question: "Booking",
        answer:
          "Book online in under a minute with our scheduler — just pick your date and an available time slot. We come to you, and you'll get instant confirmation plus a reminder before your appointment.",
      },
      {
        question: "Services",
        answer:
          "We offer interior details, exterior wash & wax, premium paint correction & ceramic coating, plus add-ons like Pet Hair Removal, Engine Bay Cleaning, Headlight Restoration, and Odor/Ozone Treatment.",
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
  },
};

export default detailingPreset;
