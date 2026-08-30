// src/components/IdreamofcleaningLayout.tsx
//
// Dedicated editorial layout for the "I Dream of Cleaning LLC" tenant. The owner
// explicitly asked for a look that is DIFFERENT from the shared CleaningLayout
// used by the other tenants — modern, elegant, polished. This layout is fully
// config-driven: it consumes the same IndustryConfig preset (idreamofcleaning.ts)
// and hardcodes NO tenant content. Other tenants keep CleaningLayout untouched.
//
// Design language:
//  - Playfair Display serif headlines + Lato body, generous whitespace.
//  - Asymmetric / editorial hero with offset framed imagery and soft
//    purple->magenta gradient glows layered behind the photo.
//  - Services presented as numbered, editorial cards (01, 02, ...) with full
//    included-task lists — not the stock template grid.
//  - Plain-BLACK text; vivid purple / magenta used only as accents.
//  - Reuses BookingModal + PriceCalculator (shared components) so the existing
//    booking flow stays identical.

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  Building2,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import type { IndustryConfig } from "../config/types";
import { lightSurface, defaultFonts } from "../config/theme";
import { BookingModal, PriceCalculator } from "./CleaningLayout";
import Testimonials from "./Testimonials";
import ChatWidget from "./ChatWidget";
import BrandLogo from "./BrandLogo";

interface ServiceDetails {
  serviceType: string;
  bedrooms: number;
  bathrooms: number;
  frequency: string;
}

interface BookedInfo {
  id: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  price: number;
  serviceDetails: ServiceDetails;
  createdAt: string;
}

// Resolve the preset's surface + font theming with light defaults.
function useTheme(config: IndustryConfig) {
  return {
    t: config.theme,
    S: config.surface ?? lightSurface,
    F: config.fonts ?? defaultFonts,
  };
}

export default function IdreamofcleaningLayout({
  config,
}: {
  config: IndustryConfig;
}) {
  const { t, S, F } = useTheme(config);
  const f = config.features;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeEstimate, setActiveEstimate] = useState<{
    details: ServiceDetails;
    price: number;
  }>({
    details: {
      serviceType: config.estimator.serviceTypes[0]?.id ?? "",
      bedrooms: config.estimator.defaultBedrooms,
      bathrooms: config.estimator.defaultBathrooms,
      frequency: config.estimator.defaultFrequency,
    },
    price: 153,
  });

  const [, setAllBookings] = useState<BookedInfo[]>([]);

  const handleOpenBooking = (details: ServiceDetails, price: number) => {
    setActiveEstimate({ details, price });
    setBookingModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking: BookedInfo) => {
    setAllBookings((prev) => [...prev, newBooking]);
  };

  const ComIcon: LucideIcon = Building2;

  // Reveal-on-scroll for genie artwork. Observes every [data-reveal] element and
  // adds .is-visible once it enters the viewport, triggering the CSS fade/slide
  // in. Respects prefers-reduced-motion via CSS (see index.css). Decorative only.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${S.surfaceBg} ${F.body} ${S.textPrimary}`}>
      {f.showBooking && (
        <BookingModal
          config={config}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          estimatedPrice={activeEstimate.price}
          serviceDetails={activeEstimate.details}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* ================= HEADER — floating pill ================= */}
      {/* Sticky top with a translucent, blurred rounded container that floats
          above the hero (backdrop-blur + soft shadow + border). Entrance is a
          gentle slide-down via the [data-reveal] reveal (CSS). Keyboard users
          get a visible focus-visible ring on every link/button. */}
      <header className="sticky top-3 z-40 mt-2 px-3 sm:px-6">
        <div
          data-reveal
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-md sm:px-6 ${S.headerBg} ${S.headerBorder}`}
        >
          <a href="#top" className="flex items-center gap-3 focus-visible:rounded-lg">
            <BrandLogo
              src={config.brand.logo}
              alt={`${config.brand.businessName} Logo`}
              className="h-10 w-auto"
            />
            <span className="leading-tight">
              <span
                className={`block font-semibold ${F.heading} ${S.textPrimary} text-lg tracking-tight`}
              >
                {config.brand.businessName}
              </span>
              <span
                className={`block text-[11px] uppercase tracking-[0.18em] ${t.primaryLightText} font-semibold`}
              >
                {config.brand.tagline}
              </span>
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            className={`hidden items-center gap-1 text-sm font-medium ${S.textMuted} lg:flex`}
          >
            {config.navigation.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 font-medium text-sm ${S.textSecondary} transition-colors ${S.navHoverBg} ${t.primaryHoverText} focus-visible:ring-2 focus-visible:ring-dream focus-visible:ring-offset-2`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={config.brand.phoneHref}
              className={`hidden items-center gap-1.5 whitespace-nowrap text-sm font-semibold ${S.textSecondary} sm:flex focus-visible:rounded-full`}
            >
              <Phone className={`h-4 w-4 ${t.primaryText}`} />
              {config.brand.phone}
            </a>
            {f.showBooking && (
              <button
                onClick={() => setBookingModalOpen(true)}
                className={`inline-flex items-center gap-1.5 rounded-full ${t.primaryBg} px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-dream/25 transition-all ${t.primaryBgHover} hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dream-dark`}
              >
                <Calendar className="h-4 w-4" /> {config.navigation.cta}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className={`p-2 rounded-lg ${S.textMuted} lg:hidden focus-visible:ring-2 focus-visible:ring-dream focus-visible:ring-offset-2`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={`mx-auto mt-2 max-w-7xl rounded-2xl border shadow-xl backdrop-blur-md ${S.mobileNavBorder} ${S.mobileNavBg} px-6 py-4 lg:hidden`}
          >
            <nav
              aria-label="Mobile navigation"
              className={`flex flex-col gap-4 text-sm font-medium ${S.mobileNavText}`}
            >
              {config.navigation.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${t.primaryHoverText} focus-visible:rounded-lg`}
                >
                  {link.label}
                </a>
              ))}
              {f.showBooking && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setBookingModalOpen(true);
                  }}
                  className={`rounded-full ${t.primaryBg} px-5 py-2.5 text-sm font-bold text-white text-center ${t.primaryBgHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dream-dark`}
                >
                  {config.navigation.cta}
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* ================= EDITORIAL HERO ================= */}
      <section id="top" className={`relative overflow-hidden ${S.heroBg}`}>
        {/* soft purple -> magenta gradient glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-dream/25 to-dream-magenta/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-dream-magenta/20 to-dream/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-12">
            {/* Left — copy */}
            <div className="lg:col-span-7">
              <div
                className={`inline-flex items-center gap-2 rounded-full ${t.primaryLightBg} px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] ${t.primaryLightText} mb-7`}
              >
                <Sparkles className="h-4 w-4" /> {config.brand.heroEyebrow}
              </div>

              <h1
                className={`${F.heading} text-5xl md:text-6xl lg:text-7xl ${S.textPrimary} font-semibold leading-[1.02] tracking-tight whitespace-pre-line`}
              >
                {config.brand.heroHeadline}
              </h1>

              <p className={`mt-6 max-w-xl text-lg ${S.textMuted} leading-relaxed`}>
                {config.brand.heroSubhead}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className={`inline-flex items-center gap-2 rounded-full ${t.primaryBg} px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-dream/25 transition-all ${t.primaryBgHover} hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dream-dark`}
                >
                  {config.navigation.cta} <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#services"
                  className={`inline-flex items-center gap-2 rounded-full ${S.secondaryButton} px-7 py-3.5 text-base font-bold transition-colors focus-visible:ring-2 focus-visible:ring-dream focus-visible:ring-offset-2`}
                >
                  Explore Services
                </a>
              </div>

              {/* Trust badges */}
              <div
                className={`mt-12 grid grid-cols-1 gap-4 border-t ${S.borderSubtle} pt-8 sm:grid-cols-3 sm:gap-6`}
              >
                {config.trustBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {badge.iconImage ? (
                      <img
                        src={badge.iconImage}
                        alt=""
                        aria-hidden="true"
                        className="genie-hover h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${t.primaryLightBg}`}
                      >
                        <Check className={`h-5 w-5 ${t.primaryText}`} />
                      </span>
                    )}
                    <span className={`text-sm font-semibold ${S.textSecondary}`}>
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — artistic stacked/mosaic visual (chosen option B) */}
            {/* A layered composition: one large framed photo + two offset
                smaller cards, so the hero reads as a curated editorial collage
                rather than a single static frame. Uses only preset imagery
                (hero / commercial / genie), no hardcoded paths. */}
            <div className="lg:col-span-5">
              <div className="relative h-[440px] lg:h-[560px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-dream to-dream-magenta opacity-20 blur-xl"
                />
                {/* main framed photo */}
                <div
                  data-reveal
                  className={`absolute right-0 top-2 h-[80%] w-[88%] overflow-hidden rounded-[2rem] border ${S.imageFrameBorder} shadow-2xl ${S.imageFrameBg}`}
                >
                  <img
                    src={config.brand.heroImage}
                    alt={`${config.brand.businessName} — a bright, freshly cleaned interior`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = config.brand.heroImageFallback;
                    }}
                  />
                </div>
                {/* offset small card — lower-left, gently rotated */}
                <div
                  data-reveal
                  className="absolute bottom-4 left-0 h-[46%] w-[40%] -rotate-3 rounded-2xl border border-dream-pale bg-white p-1.5 shadow-xl"
                >
                  <img
                    src={config.brand.commercialImage}
                    alt="Meticulous detail cleaning, corner to corner"
                    className="h-full w-full rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src = config.brand.commercialImageFallback;
                    }}
                  />
                </div>
                {/* genie brand stamp — top-left mini card (decorative) */}
                {config.genieImages && config.genieImages[0] && (
                  <div
                    data-reveal
                    aria-hidden="true"
                    className="absolute left-[5%] top-0 h-16 w-16 rotate-6 overflow-hidden rounded-full border-2 border-white shadow-lg"
                  >
                    <img
                      src={config.genieImages[0]}
                      alt=""
                      className="genie-hover h-full w-full object-cover"
                    />
                  </div>
                )}
                {/* floating accent rating card */}
                <div
                  className={`absolute -bottom-5 right-[14%] rounded-2xl ${t.primaryBg} px-5 py-3.5 text-white shadow-xl`}
                >
                  <p className={`${F.heading} text-2xl font-semibold leading-none`}>
                    {config.testimonials.rating}
                    <span className="text-white/85">.0</span>
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                    Rated by your neighbors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES — NUMBERED EDITORIAL CARDS ================= */}
      {f.showResidential && (
        <section id="services" className={`relative py-24 ${S.surfaceBg}`}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span
                  className={`text-xs font-bold uppercase tracking-[0.2em] ${t.primaryText}`}
                >
                  {config.sections.residential.eyebrow}
                </span>
                <h2
                  className={`mt-3 text-4xl md:text-5xl font-semibold ${F.heading} ${S.textPrimary} tracking-tight`}
                >
                  {config.sections.residential.title}
                </h2>
                <p className={`mt-4 ${S.textMuted} leading-relaxed`}>
                  {config.sections.residential.description}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full border ${S.mutedBorder} bg-white px-5 py-2 text-sm font-semibold ${S.textSecondary}`}
              >
                {String(config.services.residential.length).padStart(2, "0")} services
              </span>
            </div>

            <div
              className={`grid gap-px overflow-hidden rounded-3xl border ${S.cardBorder} bg-dream-pale/50 sm:grid-cols-2`}
            >
              {config.services.residential.map((service, idx) => (
                <article
                  key={idx}
                  className={`group relative flex flex-col bg-white p-8 md:p-10 transition-shadow ${S.cardHover}`}
                >
                  <div className="mb-6 flex items-baseline justify-between gap-4">
                    <span
                      className={`${F.heading} text-5xl font-medium leading-none ${t.primaryText} opacity-20 transition-opacity group-hover:opacity-40`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {service.price && (
                      <span
                        className={`rounded-full ${t.primaryLightBg} px-3.5 py-1 text-xs font-bold ${t.primaryLightText}`}
                      >
                        {service.price}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-2xl font-semibold ${F.heading} ${S.textPrimary} leading-tight`}
                  >
                    {service.title}
                  </h3>
                  {service.priceSuffix && (
                    <span className={`mt-1 text-xs font-semibold ${t.primaryText}`}>
                      {service.priceSuffix}
                    </span>
                  )}
                  <p className={`mt-3 text-sm ${S.textMuted} leading-relaxed`}>
                    {service.description}
                  </p>

                  <ul
                    className={`mt-6 space-y-2 border-t ${S.borderSubtle} pt-6 pr-14 md:pr-20`}
                  >
                    {service.features.map((feature, fIdx) => (
                      <li
                        key={fIdx}
                        className={`flex items-start gap-2 text-sm font-medium ${S.textSecondary}`}
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 shrink-0 ${t.primaryText}`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Alternating genie corner art — "hugging" the card's
                      bottom-right edge. Cycles Pose 1 -> 2 -> 3 -> repeat by
                      card index. Reworked to blend naturally into the card:
                        - pulled further into the empty corner (bottom/right)
                          and sized down so it never crosses the last feature
                          line's tail;
                        - a radial gradient mask fades its top/left edge toward
                          the text area, leaving the outer corner opaque;
                        - reduced opacity + softened shadow (no harsh ring);
                        - right padding is reserved on the features list so no
                          text is ever obscured at any breakpoint.
                      Decorative only: pointer-events-none and aria-hidden. */}
                  {config.genieImages && config.genieImages.length > 0 && (
                    <div
                      data-reveal
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-2 -right-2"
                    >
                      <img
                        src={config.genieImages[idx % config.genieImages.length]}
                        alt=""
                        className="genie-hover h-20 w-20 rounded-2xl object-cover opacity-85 shadow-md transition-opacity duration-300 group-hover:opacity-100 md:h-24 md:w-24 [mask-image:radial-gradient(6.5rem_at_100%_100%,#000_45%,transparent_75%)]"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Add-ons */}
            {config.services.addons.length > 0 && (
              <div
                className={`mt-14 overflow-hidden rounded-3xl border ${t.primaryBorder} bg-gradient-to-br from-dream-soft to-dream-light p-8 md:p-12`}
              >
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${t.primaryBg} text-white`}
                  >
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <h4 className={`text-2xl font-semibold ${F.heading} ${S.textPrimary}`}>
                    {config.services.addonsTitle}
                  </h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {config.services.addons.map((addon, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border ${S.mutedBorder} bg-white p-5 shadow-sm`}
                    >
                      <p className={`text-sm font-bold ${S.textPrimary}`}>{addon.name}</p>
                      <div className="mt-3 flex flex-wrap items-baseline gap-2">
                        {addon.price && (
                          <span className={`text-sm font-bold ${t.primaryText}`}>
                            {addon.price}
                          </span>
                        )}
                        {addon.duration && (
                          <span className={`text-xs ${S.textSubtle}`}>
                            {addon.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className={`mt-6 text-xs ${S.textSubtle}`}>
                  Prices may vary depending on the square footage of the home or
                  property, the number of bedrooms, and bathrooms.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= COMMERCIAL ================= */}
      {f.showCommercial && (
        <section
          id="commercial"
          className={`py-24 ${S.cardBg} border-t ${S.cardBorder}`}
        >
          <div
            className={`mx-auto max-w-7xl px-6 grid items-center gap-14 lg:grid-cols-2`}
          >
            <div className="order-2 lg:order-1">
              <span
                className={`text-xs font-bold uppercase tracking-[0.2em] ${t.primaryText}`}
              >
                {config.sections.commercial.eyebrow}
              </span>
              <h2
                className={`mt-3 text-4xl font-semibold ${F.heading} ${S.textPrimary} tracking-tight`}
              >
                {config.sections.commercial.title}
              </h2>
              <p className={`mt-4 ${S.textMuted} leading-relaxed`}>
                {config.sections.commercial.description}
              </p>

              <div className="mt-9 space-y-6">
                {config.services.commercial.map((cService, idx) => (
                  <div
                    key={idx}
                    className={`rounded-3xl border ${S.mutedBorder} p-7 ${S.mutedBg}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${t.primaryLightBg}`}
                      >
                        <ComIcon className={`h-6 w-6 ${t.primaryText}`} />
                      </span>
                      <h4
                        className={`text-xl font-semibold ${F.heading} ${S.textPrimary}`}
                      >
                        {cService.title}
                      </h4>
                    </div>
                    <p className={`mt-4 text-sm ${S.textMuted} leading-relaxed`}>
                      {cService.description}
                    </p>
                    {cService.features && cService.features.length > 0 && (
                      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {cService.features.map((feature, fIdx) => (
                          <li
                            key={fIdx}
                            className={`flex items-start gap-2 text-sm font-medium ${S.textSecondary}`}
                          >
                            <Check
                              className={`mt-0.5 h-4 w-4 shrink-0 ${t.primaryText}`}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className={`absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-dream to-dream-magenta opacity-20 blur-xl`}
                />
                <div
                  className={`relative overflow-hidden rounded-[2rem] border ${S.imageFrameBorder} shadow-2xl ${S.imageFrameBg}`}
                >
                  <img
                    src={config.brand.commercialImage}
                    alt="Clean commercial space"
                    className="h-[420px] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = config.brand.commercialImageFallback;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= SERVICE AREAS (LOCATIONS) ================= */}
      {f.showServiceAreas && (
        <section
          id="service-areas"
          className={`py-24 ${S.surfaceBg} border-t ${S.cardBorder}`}
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-2xl">
              <span
                className={`text-xs font-bold uppercase tracking-[0.2em] ${t.primaryText}`}
              >
                {config.sections.serviceAreas.eyebrow}
              </span>
              <h2
                className={`mt-3 text-4xl font-semibold ${F.heading} ${S.textPrimary} tracking-tight`}
              >
                {config.sections.serviceAreas.title}
              </h2>
              <p className={`mt-3 ${S.textMuted}`}>
                {config.sections.serviceAreas.description}
              </p>
            </div>
            <div className="grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {config.serviceAreas.map((area, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 rounded-2xl border ${S.cardBorder} bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.primaryLightBg}`}
                  >
                    {config.genieImages && config.genieImages.length > 0 ? (
                      <img
                        src={config.genieImages[idx % config.genieImages.length]}
                        alt=""
                        aria-hidden="true"
                        className="genie-hover h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <MapPin className={`h-4 w-4 ${t.primaryText}`} />
                    )}
                  </span>
                  <span className={`text-sm font-semibold ${S.textPrimary}`}>
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= INSTANT ESTIMATOR ================= */}
      {f.showEstimator && (
        <section
          id="estimate"
          className={`relative overflow-hidden py-24 ${S.sectionAltBg} border-t ${S.cardBorder}`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/4 h-72 w-72 rounded-full bg-dream/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-dream-magenta/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span
                className={`text-xs font-bold uppercase tracking-[0.2em] ${t.primaryText}`}
              >
                {config.sections.estimator.eyebrow}
              </span>
              <h2
                className={`mt-3 text-4xl font-semibold ${F.heading} ${S.textPrimary} tracking-tight`}
              >
                {config.sections.estimator.title}
              </h2>
              <p className={`mt-3 ${S.textMuted}`}>
                {config.sections.estimator.description}
              </p>
            </div>

            <PriceCalculator config={config} onOpenBooking={handleOpenBooking} />
          </div>
        </section>
      )}

      {/* ================= REVIEWS ================= */}
      {f.showReviews && <Testimonials config={config} />}

      {/* ================= FOOTER ================= */}
      <footer id="contact" className={`${t.footerBg} py-16 border-t ${t.footerBorder}`}>
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo
                src={config.brand.logo}
                alt={`${config.brand.businessName} Logo`}
                className="h-10 w-auto"
              />
              <span className={`font-semibold ${F.heading} text-xl text-white`}>
                {config.brand.businessName}
              </span>
            </div>
            <p className={`${t.footerMuted} text-sm leading-relaxed`}>
              {config.brand.footerBlurb}
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 text-sm ${F.heading} ${t.footerHeading}`}>
              Explore
            </h4>
            <ul className={`space-y-2 text-sm ${t.footerMuted}`}>
              {config.navigation.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {f.showContact && (
            <div>
              <h4 className={`font-semibold mb-4 text-sm ${F.heading} ${t.footerHeading}`}>
                Contact Us
              </h4>
              <p className={`text-sm ${t.footerMuted} flex items-center gap-3 mb-3`}>
                <Phone className={`h-4 w-4 ${t.primaryDeep}`} /> {config.brand.phone}
              </p>
              <p className={`text-sm ${t.footerMuted} flex items-center gap-3`}>
                <Mail className={`h-4 w-4 ${t.primaryDeep}`} /> {config.brand.email}
              </p>
            </div>
          )}
        </div>
        <div
          className={`mx-auto max-w-7xl px-6 pt-8 mt-10 border-t ${t.footerBorder} text-center text-xs ${t.footerBase}`}
        >
          © {new Date().getFullYear()} {config.brand.copyrightName}. All rights
          reserved. · Prices may vary depending on the square footage of the home
          or property, the number of bedrooms, and bathrooms.
        </div>
      </footer>

      {/* Floating AI support chat */}
      {config.chat.enabled && <ChatWidget config={config} />}
    </div>
  );
}
