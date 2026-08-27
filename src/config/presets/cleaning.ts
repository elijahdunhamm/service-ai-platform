// src/config/presets/cleaning.ts
import type { IndustryConfig } from "../types";

/**
 * Preset for the cleaning industry ("Pull Up & Clean"). Every value here was
 * lifted verbatim from the previous hardcoded CleaningLayout.tsx so the shifted
 * layout renders identically.
 */
export const cleaningPreset: IndustryConfig = {
  id: "cleaning",
  name: "Cleaning",

  brand: {
    businessName: "Pull Up & Clean",
    tagline: "Residential & Commercial",
    logo: "/images/LOGO.PNG",
    heroImage: "/images/cleaning3.jpeg",
    commercialImage: "/images/cleaning2.jpeg",
    residentialImage:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1920&q=80",
    heroImageFallback:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    commercialImageFallback:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    phone: "(555) 010-0199",
    phoneHref: "tel:+15550100199",
    email: "info@pullupnclean.com",
    heroEyebrow: "Premier Mobile Cleaning Service",
    heroHeadline: "A Spotless Home Without Lifting a Finger.",
    heroSubhead:
      "Top-tier residential maid services and deep cleaning brought straight to your doorstep. We pull up, clean up, and leave your space sparkling.",
    footerBlurb:
      "Professional mobile residential and commercial cleaning services. Spotless results every time.",
    copyrightName: "Pull Up & Clean",
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
    { label: "Vetted & Background Checked", icon: "clock" },
    { label: "100% Satisfaction Guarantee", icon: "sparkles" },
  ],

  services: {
    residential: [
      {
        title: "Standard Royal Cleaning — 2 Hours",
        price: "$80",
        priceSuffix: "per clean",
        description:
          "Our classic Standard 2-Hour Royal Cleaning is fully customizable — you choose the areas of your home that matter most, and we make them shine.",
        features: [
          "Choose Your Priority Areas",
          "Kitchen & Bath Refresh",
          "Dusting, Vacuuming & Mopping",
        ],
      },
      {
        title: "Standard Royal Cleaning — 3 Hours",
        price: "$120",
        priceSuffix: "per clean",
        description:
          "A Standard 3-Hour Royal Cleaning gives your home more thorough coverage while still being tailored to your specific needs.",
        features: [
          "Extended Room Coverage",
          "Kitchen & Bath Detail",
          "High-Touch Surface Disinfection",
        ],
      },
      {
        title: "Standard Premium Royal Cleaning — 4 Hours",
        price: "$140",
        priceSuffix: "per clean",
        description:
          "Our Premium Royal Cleaning is designed for a more complete top-to-bottom refresh. With 4 hours of service we cover more ground at a premium finish.",
        features: [
          "Top-to-Bottom Deep Polish",
          "Inside Appliances & Fixtures",
          "Detail Baseboards & Trim",
        ],
      },
      {
        title: "Royal Deep Cleaning (Walk-Through Required)",
        price: "Free",
        priceSuffix: "estimate",
        description:
          "For homes that need extra attention beyond standard cleaning — inside ovens and fridges, baseboards, closets, and hard-to-reach spots. A quick walk-through gives you an exact quote.",
        features: [
          "Inside Oven & Fridge",
          "Detail Baseboard Scrub",
          "Personalized Walk-Through Quote",
        ],
      },
    ],
    commercial: [
      {
        title: "Offices & Coworking Spaces",
        description:
          "After-hours or daily janitorial services for desks, conference rooms, and common breakrooms.",
      },
      {
        title: "Retail & Showrooms",
        description:
          "Keep your sales floor pristine and inviting for customers with regular maintenance.",
      },
      {
        title: "Post-Construction & Turnover",
        description:
          "Dust and debris cleanup after renovations or property management tenant turnovers.",
      },
    ],
    addonsTitle: "Add-ons",
    addons: [
      {
        name: "Garbage Can Sanitation (Option 1)",
        price: "$25+",
        duration: "20 mins",
      },
      {
        name: "Garbage Can Sanitation (Option 2)",
        price: "Price varies / $45",
        duration: "45 mins",
      },
      {
        name: "Garbage Can Sanitation (Option 3)",
        price: "$60",
        duration: "60 mins",
      },
      {
        name: "Garbage Can Sanitation (Standard add-on with any cleaning service)",
        price: "$15",
        duration: "20 mins",
      },
      {
        name: "Home Declutter and Organization",
        price: "Free",
        duration: "15 mins",
      },
    ],
  },

  beforeAfter: {
    title: "Before & After Results",
    description:
      "Real transformations from our recent jobs. See the difference a Pull Up & Clean visit makes.",
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
        "Customized cleaning plans tailored to your home layout and family routine.",
      icon: "home",
    },
    commercial: {
      eyebrow: "Business & Facilities",
      title: "Commercial & Office Cleaning",
      description:
        "We also keep local offices, storefronts, and commercial facilities spotless. Flexible scheduled cleaning routines designed around your business operating hours.",
      icon: "building",
    },
    estimator: {
      eyebrow: "Transparent Pricing",
      title: "Calculate Your Service Quote",
      description:
        "No hidden fees. Customize your plan and see an estimate in real time.",
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
        "Real transformations from our recent jobs. Slide between before and after to see what a Pull Up & Clean visit can do.",
      icon: "sparkles",
    },
    serviceAreas: {
      eyebrow: "Where We Work",
      title: "Proudly Serving Your Neighborhood",
      description:
        "Mobile cleaning teams covering the San Joaquin Valley and East Bay. If your city is listed, we'll pull up to your door.",
      icon: "home",
    },
  },

  estimator: {
    currency: "$",
    baseRates: {
      "royal-2hr": 80,
      "royal-3hr": 120,
      "royal-4hr": 140,
      "royal-deep": 0,
    },
    // The Royal packages are flat, hour-based cleanings, so room add-ons are
    // zeroed to honor the exact reference pricing.
    bedRate: 0,
    bathRate: 0,
    minRooms: 1,
    defaultBedrooms: 2,
    defaultBathrooms: 1,
    defaultFrequency: "biweekly",
    serviceTypes: [
      { id: "royal-2hr", label: "Standard Royal Cleaning — 2 Hours" },
      { id: "royal-3hr", label: "Standard Royal Cleaning — 3 Hours" },
      { id: "royal-4hr", label: "Standard Premium Royal — 4 Hours" },
      { id: "royal-deep", label: "Royal Deep Cleaning (Walk-Through)" },
    ],
    frequencies: [
      { id: "one-time", label: "One-Time Service", multiplier: 1 },
      { id: "biweekly", label: "Bi-Weekly (Save 10%)", multiplier: 0.9 },
      { id: "weekly", label: "Weekly Clean (Save 15%)", multiplier: 0.85 },
    ],
    copy: {
      title: "Royal Price Estimator",
      subtitle:
        "Pick your Royal package for a real-time, all-inclusive quote — no hidden fees.",
      serviceTypeLabel: "Service Type",
      bedroomsLabel: "Bedrooms",
      bathroomsLabel: "Bathrooms",
      frequencyLabel: "Frequency",
      estimatedLabel: "Estimated Price",
      perSuffix: "/ clean",
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
          "Pull Up & Clean has been a lifesaver for our busy household. Coming home to a spotless house every Friday is the best feeling!",
        name: "Sarah M.",
        role: "Homeowner · Verified Google Review",
        platform: "google",
        stars: 5,
      },
      {
        quote:
          "They handle our home cleaning bi-weekly and also take care of our small dental office. Punctual, thorough, and super trustworthy.",
        name: "David K.",
        role: "Residential & Business Client",
        platform: "google",
        stars: 5,
      },
      {
        quote:
          "The Royal Deep Cleaning was so detailed that our landlord refunded our security deposit without a single question.",
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
          "Our Royal cleanings start at $80 (2 hours), $120 (3 hours), and $140 (4 hours). Deep cleaning is quoted after a quick walk-through — use the Royal Price Estimator on our homepage for an instant estimate.",
      },
      {
        question: "Booking",
        answer:
          "You can book online in under a minute with our scheduler — just pick your date and an available time slot. You'll get an instant confirmation, and we'll send a reminder before your appointment.",
      },
      {
        question: "Services",
        answer:
          "We offer Standard Royal Cleaning (2, 3, or 4 hours), Royal Deep Cleaning (walk-through required), plus add-ons like Garbage Can Sanitation and Home Declutter & Organization.",
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

export default cleaningPreset;
