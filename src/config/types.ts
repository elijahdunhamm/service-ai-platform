// src/config/types.ts
// Shared contract for "industry presets". A preset is a plain-data object that
// fully describes one tenant's site (brand, pricing math, services, theming,
// copy). The layout renders purely from whatever preset is passed in — no
// hardcoded content lives in the UI.

/**
 * Icon names are referenced by string key so that `types.ts` stays
 * dependency-free of any icon library. The layout maps each key to a real
 * lucide-react component.
 */
export type IconName =
  | "home"
  | "building"
  | "shield"
  | "clock"
  | "sparkles"
  | "sparkle"
  | "star"
  | "quote"
  | "check-circle";

/**
 * Theme colors are provided as *fully-written* Tailwind utility class strings
 * (e.g. "bg-blue-600", "hover:bg-blue-700"). This keeps the Tailwind JIT able
 * to detect them in the preset source files while letting each tenant pick its
 * own color family without any dynamic class-name construction.
 */
export interface ThemeColors {
  /** Solid accent background (primary CTAs, selected time slot). */
  primaryBg: string;
  /** Hover state for solid accent backgrounds. */
  primaryBgHover: string;
  /** Accent text and icon color. */
  primaryText: string;
  /** Soft accent background (eyebrow pills, icon boxes, selected option). */
  primaryLightBg: string;
  /** Hover background for light-accent interactive elements. */
  primaryLightBgHover: string;
  /** Text placed on soft accent backgrounds. */
  primaryLightText: string;
  /** Accent border (selected state). */
  primaryBorder: string;
  /** Border hover on light-accent interactive elements. */
  primaryBorderHover: string;
  /** Very soft accent (decorative quote icon). */
  primarySoft: string;
  /** Darker accent used on dark surfaces (footer icons). */
  primaryDeep: string;
  /** Hover text color for accent-tinted links (full literal class). */
  primaryHoverText: string;
  /** Footer background. */
  footerBg: string;
  /** Footer border color. */
  footerBorder: string;
  /** Footer heading text. */
  footerHeading: string;
  /** Footer muted body text. */
  footerMuted: string;
  /** Footer base/copyright text. */
  footerBase: string;
}

export interface Brand {
  /** Business / company display name. */
  businessName: string;
  /** Short subtitle shown under the name in the header. */
  tagline: string;
  /** Logo image path. */
  logo: string;
  /** Hero image path. */
  heroImage: string;
  /** Commercial section image path. */
  commercialImage: string;
  /** Fallback image used if the hero image fails to load. */
  heroImageFallback: string;
  /** Fallback image used if the commercial image fails to load. */
  commercialImageFallback: string;
  /** Formatted phone number for display. */
  phone: string;
  /** Clickable phone href (tel: link). */
  phoneHref: string;
  /** Contact email address. */
  email: string;
  /** Small pill label at the top of the hero. */
  heroEyebrow: string;
  /** Hero headline. */
  heroHeadline: string;
  /** Hero subhead paragraph. */
  heroSubhead: string;
  /** Footer blurb. */
  footerBlurb: string;
  /** Name used in the copyright line. */
  copyrightName: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface TrustBadge {
  label: string;
  icon: IconName;
}

export interface ResidentialService {
  title: string;
  description: string;
  features: string[];
  /** Display price for the service (e.g. "$80"). */
  price?: string;
  /** Small label shown next to the price (e.g. "per clean"). */
  priceSuffix?: string;
}

export interface CommercialService {
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Review platform badge to show (Google or Yelp). */
  platform?: "google" | "yelp";
  /** Star rating for this review (defaults to the section rating). */
  stars?: number;
}

/** Section header copy + optional icon, rendered above a content block. */
export interface SectionHeading {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: IconName;
}

export interface ServiceTypeOption {
  id: string;
  label: string;
}

export interface FrequencyOption {
  id: string;
  label: string;
  /** Multiplier applied to the base total for this frequency. */
  multiplier: number;
}

export interface EstimatorCopy {
  title: string;
  subtitle: string;
  serviceTypeLabel: string;
  bedroomsLabel: string;
  bathroomsLabel: string;
  frequencyLabel: string;
  estimatedLabel: string;
  perSuffix: string;
  bookButton: string;
}

/** Pricing model powering the interactive price estimator. */
export interface EstimatorConfig {
  /** Currency symbol prepended to prices. */
  currency: string;
  /** Base price per service-type id (keyed by ServiceTypeOption.id). */
  baseRates: Record<string, number>;
  /** Per-bedroom rate. */
  bedRate: number;
  /** Per-bathroom rate. */
  bathRate: number;
  /** Minimum value for the bedroom/bathroom steppers. */
  minRooms: number;
  /** Default stepper values on first render. */
  defaultBedrooms: number;
  defaultBathrooms: number;
  /** Default frequency id. */
  defaultFrequency: string;
  serviceTypes: ServiceTypeOption[];
  frequencies: FrequencyOption[];
  copy: EstimatorCopy;
}

export interface BookingCopy {
  schedulerBadge: string;
  title: string;
  subtitle: string;
  selectDateLabel: string;
  timeWindowLabel: string;
  bookedLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  confirmButton: string;
  /** Label for the required photo upload field. */
  photoLabel: string;
  /** Helper hint under the photo upload field. */
  photoHint: string;
  /** Confirm button price is appended as " ({currency}{price})". */
  doneButton: string;
  successTitle: string;
  /** Success body fragments around the highlighted {date} / {time}. */
  successTextBefore: string;
  successTextAt: string;
  serviceLabel: string;
  totalLabel: string;
  clientLabel: string;
  /** Summary row keys. */
}

/** Booking/scheduling modal configuration. */
export interface BookingConfig {
  timeSlots: string[];
  /** Mock seed of already-booked slots keyed by date string. */
  initialBookedSlots: Record<string, string[]>;
  /** Default date the date input is initialized to. */
  defaultDate: string;
  copy: BookingCopy;
}

export interface SectionCopy {
  residential: SectionHeading;
  commercial: SectionHeading;
  estimator: SectionHeading;
  reviews: SectionHeading;
}

/** Boolean feature flags controlling which sections render. */
export interface FeatureFlags {
  showResidential: boolean;
  showCommercial: boolean;
  showEstimator: boolean;
  showReviews: boolean;
  /** Enables the booking modal + header booking CTA. */
  showBooking: boolean;
  /** Enables the contact/footer contact block. */
  showContact: boolean;
}

/** One customer-support FAQ item used by the floating chat widget. */
export interface Faq {
  question: string;
  answer: string;
}

/** Config for the floating customer-support chat widget. */
export interface ChatConfig {
  enabled: boolean;
  title: string;
  greeting: string;
  placeholder: string;
  /** Rule-based FAQ list shown as quick replies in the chat drawer. */
  faqs: Faq[];
}

/** Full description of one tenant's site. */
export interface IndustryConfig {
  /** Stable slug identifying the preset (e.g. "cleaning"). */
  id: string;
  /** Human-friendly industry label (e.g. "Cleaning"). */
  name: string;
  brand: Brand;
  theme: ThemeColors;
  navigation: {
    links: NavLink[];
    cta: string;
  };
  trustBadges: TrustBadge[];
  services: {
    residential: ResidentialService[];
    commercial: CommercialService[];
  };
  sections: SectionCopy;
  estimator: EstimatorConfig;
  booking: BookingConfig;
  testimonials: {
    rating: number;
    items: Testimonial[];
  };
  chat: ChatConfig;
  features: FeatureFlags;
  }
