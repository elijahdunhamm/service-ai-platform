// src/config/presets/hvac.ts
import type { IndustryConfig } from "../types";

/**
 * Preset for the HVAC industry ("Summit Air Heating & Cooling"). Mirrors the
 * exact IndustryConfig schema used by the cleaning preset so the layout renders
 * a fully themed heating/cooling site from this single object.
 */
export const hvacPreset: IndustryConfig = {
  id: "hvac",
  name: "Heating & Cooling",

  brand: {
    businessName: "Summit Air Heating & Cooling",
    tagline: "Heating, Cooling & Air Quality",
    logo: "/images/LOGO.PNG",
    heroImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    commercialImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    residentialImage:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1920&q=80",
    heroImageFallback:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    commercialImageFallback:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    phone: "(555) 010-0420",
    phoneHref: "tel:+15550100420",
    email: "hello@summitair.example.com",
    heroEyebrow: "24/7 Licensed HVAC Technicians",
    heroHeadline: "Comfort In Every Season, Guaranteed.",
    heroSubhead:
      "Expert heating and cooling installation, repair, and maintenance — from tune-ups to full system replacements. Fast, clean, and done right the first time.",
    footerBlurb:
      "Professional residential and commercial HVAC services. Keep your home comfortable all year long.",
    copyrightName: "Summit Air Heating & Cooling",
  },

  theme: {
    primaryBg: "bg-cyan-600",
    primaryBgHover: "hover:bg-cyan-700",
    primaryText: "text-cyan-600",
    primaryLightBg: "bg-cyan-50",
    primaryLightBgHover: "hover:bg-cyan-50",
    primaryLightText: "text-cyan-700",
    primaryBorder: "border-cyan-600",
    primaryBorderHover: "hover:border-cyan-400",
    primarySoft: "text-cyan-100",
    primaryDeep: "text-cyan-400",
    primaryHoverText: "hover:text-cyan-600",
    footerBg: "bg-slate-900",
    footerBorder: "border-slate-800",
    footerHeading: "text-slate-200",
    footerMuted: "text-slate-400",
    footerBase: "text-slate-500",
  },

  navigation: {
    cta: "Book Service",
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
    { label: "Licensed & Certified", icon: "shield" },
    { label: "24/7 Emergency Service", icon: "clock" },
    { label: "100% Satisfaction Guarantee", icon: "sparkles" },
  ],

  services: {
    residential: [
      {
        title: "Seasonal Tune-Ups",
        description:
          "Keep your system running at peak efficiency with a comprehensive annual heating or cooling tune-up.",
        features: [
          "Full System Inspection",
          "Coil & Filter Cleaning",
          "Efficiency & Safety Check",
        ],
      },
      {
        title: "Diagnostics & Repairs",
        description:
          "Fast, accurate diagnosis of any heating or cooling problem — with upfront pricing before we start the work.",
        features: [
          "Refrigerant Leak Testing",
          "Thermostat & Wiring Checks",
          "Same-Day Repair Options",
        ],
      },
      {
        title: "System Replacements",
        description:
          "High-efficiency furnace and AC replacements sized and installed for your home's exact heating and cooling load.",
        features: [
          "Free Load Calculation",
          "Brand-Grade Equipment",
          "10-Year Warranty Coverage",
        ],
      },
    ],
    commercial: [
      {
        title: "Rooftop Units & RTUs",
        description:
          "Preventive maintenance and repair for rooftop units serving offices, retail, and multi-tenant buildings.",
      },
      {
        title: "Restaurant & Retail HVAC",
        description:
          "Keep kitchens cool and sales floors comfortable with priority service designed around your operating hours.",
      },
      {
        title: "Property Management Programs",
        description:
          "Scheduled inspections, filter programs, and priority dispatch for portfolios of any size.",
      },
    ],
    addonsTitle: "Add-ons",
    addons: [
      "Duct Cleaning & Sanitization",
      "Smart Thermostat Installation",
      "Air Purifier & Filtration Systems",
      "Indoor Air Quality Assessment",
      "UV Germicidal Light Systems",
      "Maintenance Plan Membership",
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
        beforeImage: "/images/before-after/furnace-before.svg",
        afterImage: "/images/before-after/furnace-after.svg",
        caption: "Furnace & duct cleaning",
      },
      {
        beforeImage: "/images/before-after/kitchen-before.svg",
        afterImage: "/images/before-after/kitchen-after.svg",
        caption: "Clean install workspace",
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
      eyebrow: "Home Comfort Experts",
      title: "Residential HVAC Services",
      description:
        "Heating, cooling, and air-quality solutions tailored to your home and budget.",
      icon: "home",
    },
    commercial: {
      eyebrow: "Business & Facilities",
      title: "Commercial HVAC Services",
      description:
        "We keep offices, restaurants, and commercial facilities comfortable with scheduled maintenance programs designed around your business hours.",
      icon: "building",
    },
    estimator: {
      eyebrow: "Transparent Pricing",
      title: "Estimate Your Service",
      description:
        "No hidden fees. Configure your service needs and see an estimate in real time.",
    },
    reviews: {
      title: "Trusted by Local Homeowners",
    },
    beforeAfter: {
      eyebrow: "See the Difference",
      title: "Before & After Results",
      description:
        "Real transformations from our recent jobs. See the difference a Summit Air technician visit makes.",
      icon: "sparkles",
    },
    serviceAreas: {
      eyebrow: "Where We Work",
      title: "Proudly Serving Your Neighborhood",
      description:
        "Licensed HVAC technicians serving homes and businesses across the region. If your city is listed, we've got you covered.",
      icon: "home",
    },
  },

  estimator: {
    currency: "$",
    baseRates: { tuneup: 89, repair: 159, replace: 249 },
    bedRate: 25,
    bathRate: 15,
    minRooms: 1,
    defaultBedrooms: 1,
    defaultBathrooms: 1,
    defaultFrequency: "seasonal",
    serviceTypes: [
      { id: "tuneup", label: "Seasonal Tune-Up" },
      { id: "repair", label: "Repair & Diagnostics" },
      { id: "replace", label: "System Replacement" },
    ],
    frequencies: [
      { id: "one-time", label: "One-Time Service", multiplier: 1 },
      { id: "seasonal", label: "Seasonal Plan (Save 5%)", multiplier: 0.95 },
      { id: "monthly", label: "Monthly Maintenance (Save 10%)", multiplier: 0.9 },
    ],
    copy: {
      title: "Instant Service Estimator",
      subtitle:
        "Select your system type and service needs for a real-time quote.",
      serviceTypeLabel: "Service Type",
      bedroomsLabel: "Zones",
      bathroomsLabel: "Thermostats",
      frequencyLabel: "Frequency",
      estimatedLabel: "Estimated Price",
      perSuffix: "/ visit",
      bookButton: "Book Service",
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
      photoLabel: "Attach a Photo (required)",
      photoHint: "Upload a photo of the equipment or area needing service.",
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
          "Summit Air had our furnace fixed the same afternoon we called. Upfront pricing, no surprises, and the tech was incredibly professional.",
        name: "Marcus W.",
        role: "Homeowner",
      },
      {
        quote:
          "They service both our store and our home. The seasonal maintenance plan has paid for itself — no breakdowns in three years.",
        name: "Rita L.",
        role: "Retail Owner & Homeowner",
      },
      {
        quote:
          "The new AC install was flawless — done in a day, area left spotless, and our energy bill dropped noticeably that summer.",
        name: "Daniel F.",
        role: "Homeowner",
      },
    ],
  },

  chat: {
    enabled: false,
    title: "Customer Support",
    greeting: "Hi! How can we help you today?",
    placeholder: "Type your question...",
    faqs: [
      {
        question: "Pricing",
        answer:
          "We offer free estimates on all installations and repairs. Call us for a quote tailored to your system.",
      },
      {
        question: "Booking",
        answer:
          "Book online using our scheduler or call us directly — we offer same-day service for emergencies.",
      },
      {
        question: "Services",
        answer:
          "We handle heating, cooling, maintenance plans, and air-quality solutions for homes and businesses.",
      },
      {
        question: "Hours",
        answer:
          "We're available 24/7 for emergencies and offer regular appointments during business hours.",
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

export default hvacPreset;