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
  /**
   * Floating AI chat widget theming (OPTIONAL). These all default to the shared
   * "royal blue + gold" look in ChatWidget, so any tenant that omits them keeps
   * the original chatbot appearance verbatim. A tenant like idreamofcleaning can
   * override them to match its own palette without touching the shared widget.
   */
  /** Launcher button + header background gradient (inline CSS). */
  chatGradient?: string;
  /** Solid accent background for the user bubble + send button (class). */
  chatAccentBg?: string;
  /** Accent "soft" background for the launcher ping dot (class). */
  chatSoftBg?: string;
  /** Accent "soft" text for the header sparkle icon (class). */
  chatSoftText?: string;
  /** FAQ quick-chip hover state classes (full literal). */
  chatFaqHover?: string;
  /** Input focus ring classes (full literal). */
  chatInputFocus?: string;
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
  /** Professional stock background image used behind the residential services section. */
  residentialImage: string;
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
  /**
   * Optional image URL rendered INSTEAD of the Lucide icon (e.g. a brand/genie
   * stamp). When set, the layout shows this image in the icon slot rather than
   * resolving `icon` from the icon map. Kept optional so existing tenants are
   * unaffected.
   */
  iconImage?: string;
}

export interface ResidentialService {
  title: string;
  description: string;
  features: string[];
  /** Display price for the service (e.g. "$80"). */
  price?: string;
  /** Small label shown next to the price (e.g. "per clean"). */
  priceSuffix?: string;
  /**
   * Optional representative image for this service tier. When set and the
   * `showGallery` feature flag is on, the layout renders the service as a
   * large image "gallery grid" card instead of the default compact card.
   */
  image?: string;
}

export interface CommercialService {
  title: string;
  description: string;
  /** Optional included-task bullets (e.g. for a thorough commercial clean). */
  features?: string[];
}

/** A compact add-on offering listed alongside the service catalog. */
export interface Addon {
  name: string;
  /** Price display, e.g. "$25+", "Free". Omit/empty when price isn't fixed. */
  price?: string;
  /** Duration display, e.g. "20 mins". Omit/empty when not applicable. */
  duration?: string;
}

/**
 * Surface + typography theming tokens. Unlike `ThemeColors` (accent/footer
 * colors), these describe the *page surfaces* — backgrounds, borders, body text,
 * cards, inputs, overlay gradients — that the shared layout was previously
 * hardcoding (bg-slate-50, bg-white, text-slate-900, etc.).
 *
 * Every field is a *fully-written* Tailwind utility class string so the JIT can
 * detect it in the preset source. Light defaults (exposed as `lightSurface` in
 * `src/config/theme.ts`) reproduce the original layout verbatim, so any preset
 * that omits `surface` renders exactly as it did before.
 */
export interface ThemeSurface {
  /** Entire page background behind all sections. */
  surfaceBg: string;
  /** Card / panel / dropdown background. */
  cardBg: string;
  /** Card & primary section border. */
  cardBorder: string;
  /** Subtle divider / under-border. */
  borderSubtle: string;
  /** Headings & strong body text. */
  textPrimary: string;
  /** Secondary/medium text. */
  textSecondary: string;
  /** Standard body text. */
  textMuted: string;
  /** Subdued / tertiary text. */
  textSubtle: string;
  /** Very faint text (labels, icons that can recede). */
  textFaint: string;
  /** Header background (translucent). */
  headerBg: string;
  /** Header bottom border. */
  headerBorder: string;
  /** Nav link hover background. */
  navHoverBg: string;
  /** Mobile menu dropdown background. */
  mobileNavBg: string;
  /** Mobile menu dropdown border. */
  mobileNavBorder: string;
  /** Mobile menu link text. */
  mobileNavText: string;
  /** Hero section background. */
  heroBg: string;
  /** Secondary / outline action button styling. */
  secondaryButton: string;
  /** Background of framed images (hero/commercial). */
  imageFrameBg: string;
  /** Border of framed images. */
  imageFrameBorder: string;
  /** Gradient overlay over the residential section background image. */
  residentialOverlay: string;
  /** Alternative section band background (estimator). */
  sectionAltBg: string;
  /** Muted panel background (summary boxes, list items, pills). */
  mutedBg: string;
  /** Muted panel border. */
  mutedBorder: string;
  /** Input field background. */
  inputBg: string;
  /** Input field border. */
  inputBorder: string;
  /** Select dropdown background. */
  selectBg: string;
  /** Select dropdown text. */
  selectText: string;
  /** Stepper (- / +) button background. */
  stepBg: string;
  /** Stepper button hover background. */
  stepHoverBg: string;
  /** Stepper button text. */
  stepText: string;
  /** Booked (taken) time-slot background. */
  takenBg: string;
  /** Booked (taken) time-slot border. */
  takenBorder: string;
  /** Booked (taken) time-slot text. */
  takenText: string;
  /** Unselected time-slot background. */
  slotBg: string;
  /** Unselected time-slot text. */
  slotText: string;
  /** Unselected calculator option border. */
  optionBorder: string;
  /** Unselected calculator option text. */
  optionText: string;
  /** Unselected calculator option hover background. */
  optionHoverBg: string;
  /** Upload drop-zone border. */
  uploadBorder: string;
  /** Upload drop-zone hover border. */
  uploadHoverBorder: string;
  /** Success confirmation circle. */
  successBadge: string;
  /** Booking modal close-button hover styling. */
  closeButton: string;
  /** Card hover shadow / intent. */
  cardHover: string;
  /** Overlay gradient over the full-width cinematic hero image. */
  heroOverlay: string;
  /** Overlay gradient over the full-width brand statement background image. */
  statementOverlay: string;
}

/** Font pairing, applied as Tailwind font-family utility classes. */
export interface ThemeFonts {
  /** Heading font family class (e.g. "font-display"). */
  heading: string;
  /** Body font family class (e.g. "font-body"). */
  body: string;
}

/** One before/after image pair shown as a "results" card. */
export interface BeforeAfterResult {
  beforeImage: string;
  afterImage: string;
  /** Optional short caption describing the transformation. */
  caption?: string;
}

/** Config for the "Before & After Results" section. */
export interface BeforeAfterConfig {
  title: string;
  description?: string;
  /** Badge label shown on each "before" image. */
  beforeLabel: string;
  /** Badge label shown on each "after" image. */
  afterLabel: string;
  results: BeforeAfterResult[];
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
  /** Label for the customer service-address field. */
  addressLabel: string;
  /** Placeholder text for the service-address field. */
  addressPlaceholder: string;
  confirmButton: string;
  /** Label for the required media (photo/video) upload field. */
  mediaLabel: string;
  /** Helper hint under the media upload field. */
  mediaHint: string;
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
  beforeAfter: SectionHeading;
  serviceAreas: SectionHeading;
  /** Optional heading copy for the craftsmanship spotlight section. */
  craftsmanship?: SectionHeading;
  /** Optional heading copy for the full-width brand statement section. */
  statement?: SectionHeading;
}

/**
 * "Craftsmanship spotlight" — a full-width, large close-up image of the
 * detailing process paired with short evocative copy. Feature-flagged off for
 * light tenants so they render identically.
 */
export interface CraftsmanshipConfig {
  eyebrow: string;
  title: string;
  description: string;
  /** Large close-up detailing-process image. */
  image: string;
  /** Optional supporting bullet points. */
  bullets?: string[];
  /** Optional headline stat (e.g. "500+" / "happy clients"). */
  stat?: { value: string; label: string };
}

/**
 * Full-width brand statement / featured testimonial — a powerful quote or
 * mission statement on a dark section with an optional subtle background image.
 */
export interface StatementConfig {
  eyebrow?: string;
  quote: string;
  /** Attribution name. */
  name: string;
  /** Attribution role/title. */
  role: string;
  /** Optional subtle background image layered under an overlay. */
  backgroundImage?: string;
}

/** Boolean feature flags controlling which sections render. */
export interface FeatureFlags {
  showResidential: boolean;
  showCommercial: boolean;
  showEstimator: boolean;
  showReviews: boolean;
  /** Enables the Before & After results section. */
  showBeforeAfter: boolean;
  /** Enables the "Where We Work" service-area section. */
  showServiceAreas: boolean;
  /** Enables the booking modal + header booking CTA. */
  showBooking: boolean;
  /** Enables the contact/footer contact block. */
  showContact: boolean;
  /** Enables the craftsmanship spotlight section. Default OFF. */
  showCraftsmanship: boolean;
  /** Enables the full-width brand statement section. Default OFF. */
  showStatement: boolean;
  /** Renders services as a large image "gallery grid". Default OFF. */
  showGallery: boolean;
}

/** One customer-support FAQ item used by the floating chat widget. */
export interface Faq {
  question: string;
  answer: string;
}

/** Customer media upload storage configuration. */
export interface StorageConfig {
  /**
   * Supabase Storage bucket used for customer-uploaded booking media
   * (images/videos). Supplied via config so components never hardcode a bucket.
   */
  bucket: string;
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

/** Optional "About Us" section (config-driven body copy, rendered verbatim). */
export interface AboutConfig {
  eyebrow?: string;
  title: string;
  /** Short optional intro line under the heading. */
  description?: string;
  /** Full paragraphs of the About Us body copy (rendered verbatim). */
  paragraphs: string[];
}

/**
 * Optional page-load intro / loader animation, drawn in the tenant's brand
 * theme (e.g. a genie riding a magic carpet flying across the screen). Only
 * rendered by tenant-specific layouts that opt in. Optional and default-OFF so
 * existing tenants (cleaning, hvac, detailing) are completely unaffected.
 */
export interface IntroAnimationConfig {
  /** Master switch: render the intro on initial page load only when true. */
  enabled: boolean;
  /**
   * Images to fly across the screen (e.g. genie poses). Defaults to the
   * preset's `genieImages` first entry, then `brand.logo` as a fallback.
   */
  images?: string[];
  /**
   * Brand-theme colors for the magic carpet (drawn as inline SVG, so these are
   * literal hex/rgba values derived from the tenant's theme). The `primary` /
   * `accent` pair should mirror the tenant's brand purple/magenta.
   */
  colors: {
    /** Deep shade — carpet body fill (e.g. deep purple). */
    primary: string;
    /** Bright accent — carpet fringe/tassels + glow (e.g. magenta). */
    accent: string;
    /** Highlight — light outline / sheen along the carpet. */
    highlight: string;
    /** Semi-transparent glow used behind the flying genie. */
    glow: string;
  };
  /** Approximate total animation duration in ms. Defaults to ~2600ms. */
  durationMs?: number;
}

/**
 * Options for the optional full-screen page loader / splash. Shows a centered
 * brand logo (e.g. the transparent genie logo) over a brand-tinted background
 * with a soft loading treatment, then unmounts cleanly after `durationMs` so it
 * never blocks the app. Respects `prefers-reduced-motion` (skips the animation;
 * shows a static logo briefly or content immediately). Default-OFF on
 * IndustryConfig so existing tenants are unaffected.
 */
export interface PageLoaderConfig {
  /** Master switch: render the full-screen loader on initial page load. */
  enabled: boolean;
  /** Logo shown centered. Defaults to the preset's `genieImages[0]`, then `brand.logo`. */
  logo?: string;
  /** Optional short tagline shown under the logo. */
  tagline?: string;
  /** Approximate display duration in ms before unmount. Defaults to ~2500ms. */
  durationMs?: number;
  /** Solid CSS background behind the splash (deep purple suits the genie theme). */
  background?: string;
  /** Brand-tinted CSS glow color haloed behind the logo. */
  glow?: string;
}
/** Full description of one tenant's site. */
export interface IndustryConfig {
  /** Stable slug identifying the preset (e.g. "cleaning"). */
  id: string;
  /** Human-friendly industry label (e.g. "Cleaning"). */
  name: string;
  brand: Brand;
  theme: ThemeColors;
  /**
   * Surface + typography theming. Optional: when omitted, `lightSurface` /
   * `defaultFonts` from `src/config/theme.ts` are used, reproducing the
   * original light look verbatim. Light tenants may omit this entirely.
   */
  surface?: ThemeSurface;
  /** Font pairing as Tailwind font-family classes (optional, light default). */
  fonts?: ThemeFonts;
  /** Optional craftsmanship spotlight section (feature-flagged). */
  craftsmanship?: CraftsmanshipConfig;
  /** Optional full-width brand statement section (feature-flagged). */
  statement?: StatementConfig;
  /** Optional "About Us" section (rendered by layouts that support it). */
  about?: AboutConfig;
  /** Hero layout overrides (optional, light stays split). */
  hero?: {
    /** Render a full-width cinematic hero with background image + overlay. */
    cinematic: boolean;
  };
  navigation: {
    links: NavLink[];
    cta: string;
  };
  trustBadges: TrustBadge[];
  services: {
    residential: ResidentialService[];
    commercial: CommercialService[];
    /** Heading shown above the add-ons list. */
    addonsTitle: string;
    /** Compact add-on offerings listed alongside the service catalog. */
    addons: Addon[];
  };
  beforeAfter: BeforeAfterConfig;
  /** Service area / location names served by this tenant (rendered as bullets). */
  serviceAreas: string[];
  sections: SectionCopy;
  estimator: EstimatorConfig;
  booking: BookingConfig;
  /** Customer media upload storage configuration. */
  storage: StorageConfig;
  /**
   * Optional decorative brand images (e.g. the tenant's genie pose set). Consumed
   * by tenant-specific layouts for alternating corner art. Optional so existing
   * tenants are unaffected.
   */
  genieImages?: string[];
  /**
   * Optional page-load intro animation (e.g. a themed genie flying on a magic
   * carpet). Rendered only by tenant layouts that opt in, and only when
   * `enabled`. Optional + default-OFF so existing tenants are unaffected.
   */
  intro?: IntroAnimationConfig;
  /**
   * Optional full-screen page loader / splash shown on app mount before the
   * site content becomes interactive. Config-driven and default-OFF on
   * IndustryConfig, so only tenants that opt in (e.g. I Dream of Cleaning)
   * render it. When both `loader` and `intro` are enabled the loader plays
   * first, then the intro, so the two full-screen overlays never stack.
   */
  loader?: PageLoaderConfig;
  /**
   * Optional mapping of service-area name -> background image path (e.g. a dark
   * city skyline) used to render service areas as skyline-backed location
   * cards. When present, tenant layouts that support location grids render each
   * service area as a rounded card with this background + a dark overlay.
   * Optional so tenants that only need simple bullet lists are unaffected.
   */
  serviceAreaImages?: Record<string, string>;
  testimonials: {
    rating: number;
    items: Testimonial[];
  };
  chat: ChatConfig;
  features: FeatureFlags;
  }
