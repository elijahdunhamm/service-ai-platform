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
    footerBg: "bg-slate-900",
    footerBorder: "border-slate-800",
    footerHeading: "text-slate-200",
    footerMuted: "text-slate-400",
    footerBase: "text-slate-500",
  },

  navigation: {
    cta: "Book Now",
    links: [
      { label: "Residential", href: "#residential" },
      { label: "Commercial", href: "#commercial" },
      { label: "Estimate Tool", href: "#estimate" },
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
        title: "Standard Home & Apartment Cleaning",
        description:
          "Recurring weekly, bi-weekly, or monthly cleaning to keep your living space spotless and fresh.",
        features: [
          "Kitchen & Bath Sanitization",
          "Dusting & Vacuuming",
          "Trash Removal & Linen Change",
        ],
      },
      {
        title: "Deep Detail Cleaning",
        description:
          "A comprehensive top-to-bottom clean focusing on baseboards, appliance interiors, and hard-to-reach spots.",
        features: [
          "Inside Oven & Fridge",
          "Detail Baseboard Scrub",
          "High-Touch Surface Disinfection",
        ],
      },
      {
        title: "Move-In / Move-Out Cleaning",
        description:
          "Ensure you get your security deposit back or step into a completely sanitized new home.",
        features: [
          "Cabinet & Closet Interior",
          "Deep Appliance Reset",
          "Full Fixture Polish",
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
  },

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
      title: "Loved by Local Homeowners",
    },
  },

  estimator: {
    currency: "$",
    baseRates: { standard: 90, deep: 160, move: 210 },
    bedRate: 25,
    bathRate: 35,
    minRooms: 1,
    defaultBedrooms: 2,
    defaultBathrooms: 1,
    defaultFrequency: "biweekly",
    serviceTypes: [
      { id: "standard", label: "Standard Home Clean" },
      { id: "deep", label: "Deep Detail Clean" },
      { id: "move", label: "Move-In / Move-Out Clean" },
    ],
    frequencies: [
      { id: "one-time", label: "One-Time Service", multiplier: 1 },
      { id: "biweekly", label: "Bi-Weekly (Save 10%)", multiplier: 0.9 },
      { id: "weekly", label: "Weekly Clean (Save 15%)", multiplier: 0.85 },
    ],
    copy: {
      title: "Instant Price Estimator",
      subtitle:
        "Select your home size and service needs for a real-time quote.",
      serviceTypeLabel: "Service Type",
      bedroomsLabel: "Bedrooms",
      bathroomsLabel: "Bathrooms",
      frequencyLabel: "Frequency",
      estimatedLabel: "Estimated Price",
      perSuffix: "/ cleaning",
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
      doneButton: "Done",
      successTitle: "Appointment Confirmed!",
      successTextBefore: "Automated AI verification logged your booking for",
      successTextAt: "at",
      serviceLabel: "Service",
      totalLabel: "Estimated Total",
      clientLabel: "Client",
    },
  },

  testimonials: {
    rating: 5,
    items: [
      {
        quote:
          "Pull Up & Clean has been a lifesaver for our busy household. Coming home to a spotless house every Friday is the best feeling!",
        name: "Sarah M.",
        role: "Homeowner",
      },
      {
        quote:
          "They handle our home cleaning bi-weekly and also take care of our small dental office. Punctual, thorough, and super trustworthy.",
        name: "David K.",
        role: "Residential & Business Client",
      },
      {
        quote:
          "The move-out clean was so detailed that our landlord refunded our security deposit without a single question.",
        name: "Jessica T.",
        role: "Apartment Tenant",
      },
    ],
  },

  features: {
    showResidential: true,
    showCommercial: true,
    showEstimator: true,
    showReviews: true,
    showBooking: true,
    showContact: true,
  },
};

export default cleaningPreset;
