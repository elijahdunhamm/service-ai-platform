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
import { BookingModal, PriceCalculator } from "./booking";
import Testimonials from "./Testimonials";
import ChatWidget from "./ChatWidget";
import BrandLogo from "./BrandLogo";
import MagicCarpetIntro from "./MagicCarpetIntro";
import PageLoader from "./PageLoader";

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

  // Sequencing between the two full-screen page overlays: the config-driven
  // PageLoader (genie splash, ~2.5s) plays FIRST, then the existing
  // MagicCarpetIntro flies the genie across. `loaderDone` flips when the loader
  // unmounts so the intro only mounts after the splash — the two overlays never
  // stack over each other. Tenants without `config.loader` (this layout is used
  // only by idreamofcleaning, which opts in) get the intro immediately.
  const loaderActive = config.loader?.enabled === true;
  const [loaderDone, setLoaderDone] = useState(false);
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
    <div className={`min-h-[100dvh] ${S.surfaceBg} ${F.body} ${S.textPrimary}`}>
      {/* Page-load overlays, sequenced so they never stack: the config-driven
          full-screen PageLoader (genie splash) plays first, then the
          MagicCarpetIntro flies the genie on the magic carpet. */}
      {loaderActive && <PageLoader config={config} onDone={() => setLoaderDone(true)} />}
      {(!loaderActive || loaderDone) && <MagicCarpetIntro config={config} />}
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
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border py-2.5 pl-4 pr-2.5 shadow-lg shadow-dream/10 backdrop-blur-md sm:pl-5 sm:pr-3 ${S.headerBg} ${S.headerBorder}`}
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
                className={`rounded-full px-4 py-2 font-medium text-sm ${S.textSecondary} transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${S.navHoverBg} ${t.primaryHoverText} active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-dream focus-visible:ring-offset-2`}
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
                className={`inline-flex items-center gap-1.5 rounded-full ${t.primaryBg} px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-dream/25 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${t.primaryBgHover} hover:-translate-y-0.5 hover:shadow-xl hover:shadow-dream/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dream-dark`}
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

      {/* ================= HERO — FULL-BLEED BACKGROUND ================= */}
      {/* The largest hero image (config.brand.heroImage) fills the section as a
          full-bleed background with a legibility overlay. Headline, subhead,
          copy and CTAs sit on top. (The previous offset photo-card collage was
          removed per owner direction; the page loader/intro logic is untouched.) */}
      <section id="top" className="relative isolate overflow-hidden">
        {/* full-bleed background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={config.brand.heroImage}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = config.brand.heroImageFallback;
            }}
          />
          {/* legibility overlay — darkens the image so white copy reads clearly */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center px-6 py-24 md:py-28 lg:py-32">
          <div className="max-w-2xl">
            {/* Hero stack is deliberately restrained: headline, subhead, CTAs.
                The config eyebrow pill + trust-badge row are REMOVED per owner
                direction (no decorative badge clutter) — elevation comes from
                spacing, type, and motion. Hero data keys (heroEyebrow,
                trustBadges) stay in the preset for schema fidelity. */}
            <h1
              className={`${F.heading} whitespace-pre-line text-5xl font-bold leading-[1.08] tracking-tight text-white text-balance md:text-6xl lg:text-7xl`}
            >
              {config.brand.heroHeadline}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              {config.brand.heroSubhead}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setBookingModalOpen(true)}
                className={`group inline-flex items-center gap-2 rounded-full ${t.primaryBg} px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-dream/25 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${t.primaryBgHover} hover:-translate-y-0.5 hover:shadow-xl hover:shadow-dream/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dream-dark`}
              >
                {config.navigation.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </button>
              <a
                href="#services"
                className={`inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`}
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT US ================= */}
      {config.about && (
        <section
          id="about"
          className={`relative overflow-hidden py-24 md:py-28 ${S.surfaceBg} border-t ${S.cardBorder}`}
        >
          {/* soft purple -> magenta glow accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-dream/15 to-dream-magenta/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Genie logo visual accent (decorative) */}
              {config.genieImages && config.genieImages[0] && (
                <div className="lg:col-span-3">
                  <div
                    data-reveal
                    aria-hidden="true"
                    className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-dream-pale bg-dream-soft shadow-lg shadow-dream/25 ring-1 ring-white/60"
                  >
                    <img
                      src={config.genieImages[0]}
                      alt=""
                      className="genie-hover h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div
                className={`${config.genieImages && config.genieImages[0] ? "lg:col-span-9" : "lg:col-span-12"}`}
              >
                <h2
                  className={`text-4xl font-bold ${F.heading} ${S.textPrimary} leading-tight tracking-tight text-balance md:text-5xl`}
                >
                  {config.about.title}
                </h2>
                {config.about.description && (
                  <p className={`mt-4 ${S.textMuted} leading-relaxed`}>
                    {config.about.description}
                  </p>
                )}
                <div className={`mt-6 space-y-5 ${S.textPrimary} leading-relaxed`}>
                  {config.about.paragraphs.map((copy, pIdx) => (
                    <p key={pIdx} className="text-base md:text-lg">
                      {copy}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
                  className={`mt-3 text-4xl font-bold md:text-5xl ${F.heading} ${S.textPrimary} leading-tight tracking-tight text-balance`}
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
                  className={`group relative flex flex-col border border-transparent bg-white p-5 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:border-dream-pale/80 md:p-6 ${S.cardHover}`}
                >
                  {/* Header row: nimble index + title on the left, price pill
                      (and suffix) tucked to the right — reads like a polished
                      menu entry rather than a big editorial block. */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-baseline gap-2.5">
                      <span
                        className={`${F.heading} text-sm font-extrabold leading-none tracking-[0.14em] ${t.primaryText} opacity-25 transition-opacity group-hover:opacity-50`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={`text-lg font-bold ${F.heading} ${S.textPrimary} leading-snug`}
                      >
                        {service.title}
                      </h3>
                    </div>
                    {(service.price || service.priceSuffix) && (
                      <div className="flex shrink-0 flex-col items-end gap-0.5 pl-3">
                        {service.price && (
                          <span
                            className={`rounded-full ${t.primaryLightBg} px-3 py-0.5 text-xs font-bold ${t.primaryLightText} ring-1 ring-dream-pale/70`}
                          >
                            {service.price}
                          </span>
                        )}
                        {service.priceSuffix && (
                          <span
                            className={`text-[11px] font-semibold ${t.primaryText}`}
                          >
                            {service.priceSuffix}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {service.description && (
                    <p className={`mt-2 text-sm ${S.textMuted} leading-relaxed`}>
                      {service.description}
                    </p>
                  )}
                  <ul
                    className={`mt-4 space-y-1.5 border-t ${S.borderSubtle} pt-4 pr-16 md:pr-20`}
                  >
                    {service.features.map((feature, fIdx) => (
                      <li
                        key={fIdx}
                        className={`flex items-start gap-2 text-sm font-medium ${S.textSecondary}`}
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${t.primaryText}`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Alternating genie corner art — "hugging" the card's
                      bottom-right edge. Cycles Pose 1 -> 2 -> 3 -> repeat by
                      card index. FULLY OPAQUE (owner request) — no opacity or
                      radial-gradient mask, so the genie shows 100% sharp and
                      crisp. Text safety is handled entirely by reserved padding:
                      the card keeps its bottom padding and the features list
                      reserves right padding (pr-16 md:pr-20) so no feature text
                      ever reaches the genie's horizontal span at any breakpoint.
                      Slight size + a crisp shadow keep it a sharp, fully-visible
                      brand stamp. Decorative only: pointer-events-none and
                      aria-hidden. */}
                  {config.genieImages && config.genieImages.length > 0 && (
                    <div
                      data-reveal
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-2 -right-2"
                    >
                      <img
                        src={config.genieImages[idx % config.genieImages.length]}
                        alt=""
                        loading="lazy"
                        className="genie-hover h-16 w-16 rounded-2xl object-cover shadow-md md:h-20 md:w-20"
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
                      className={`rounded-2xl border ${S.mutedBorder} bg-white p-4 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-dream-pale hover:shadow-md hover:shadow-dream/10`}
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
              <h2
                className={`text-4xl font-bold ${F.heading} ${S.textPrimary} leading-tight tracking-tight text-balance`}
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
                    className={`rounded-3xl border ${S.mutedBorder} p-7 ${S.mutedBg} transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-dream-pale/70 hover:shadow-lg hover:shadow-dream/10`}
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
                    loading="lazy"
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
              <h2
                className={`text-4xl font-bold ${F.heading} ${S.textPrimary} leading-tight tracking-tight text-balance`}
              >
                {config.sections.serviceAreas.title}
              </h2>
              <p className={`mt-3 ${S.textMuted}`}>
                {config.sections.serviceAreas.description}
              </p>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {config.serviceAreas.map((area, idx) => {
                const skyline = config.serviceAreaImages?.[area];
                return (
                  <div
                    key={idx}
                    className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-2xl hover:shadow-dream/20"
                  >
                    {skyline ? (
                      <>
                        {/* city skyline background + dark overlay for legibility */}
                        <img
                          src={skyline}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />
                      </>
                    ) : (
                      /* graceful fallback: brand-tinted gradient card */
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${t.primaryBorder} ${t.primarySoft}`}
                      />
                    )}
                    {/* city name rendered prominently in white */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <span className={`${F.heading} text-xl font-bold text-white drop-shadow-md`}>
                        {area}
                      </span>
                    </div>
                  </div>
                );
              })}
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
                className={`mt-3 text-4xl font-bold ${F.heading} ${S.textPrimary} leading-tight tracking-tight text-balance`}
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
          reserved. Prices may vary depending on the square footage of the home
          or property, the number of bedrooms, and bathrooms.
        </div>
      </footer>

      {/* Floating AI support chat */}
      {config.chat.enabled && <ChatWidget config={config} />}
    </div>
  );
}
