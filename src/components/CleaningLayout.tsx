import { useState } from "react";
import {
  Home,
  Building2,
  Phone,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Star,
  Quote,
  Mail,
  CheckCircle2,
  Sparkle,
  Check,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import {
  BookingModal,
  PriceCalculator,
  useTheme,
  type ServiceDetails,
  type BookedInfo,
} from "./booking";
import type { IconName, IndustryConfig } from "../config/types";
import { defaultPreset } from "../config/presets";
import Testimonials from "./Testimonials";
import ChatWidget from "./ChatWidget";
import BrandLogo from "./BrandLogo";

// Map icon-name strings to real lucide-react components. `types.ts` stays
// dependency-free of the icon library; every icon referenced by a preset is
// resolved here.
const ICON_MAP: Record<IconName, LucideIcon> = {
  home: Home,
  building: Building2,
  shield: ShieldCheck,
  clock: Clock,
  sparkles: Sparkles,
  sparkle: Sparkle,
  star: Star,
  quote: Quote,
  "check-circle": CheckCircle2,
};

/* ================= MAIN LAYOUT ================= */
/* ================= MAIN LAYOUT ================= */
export default function CleaningLayout({
  config = defaultPreset,
}: {
  config?: IndustryConfig;
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

  const ResIcon = config.sections.residential.icon
    ? ICON_MAP[config.sections.residential.icon]
    : Home;
  const ComIcon = config.sections.commercial.icon
    ? ICON_MAP[config.sections.commercial.icon]
    : Building2;

  // Cinematic hero: full-width background image + overlay, enabled via config.
  const cinematic = config.hero?.cinematic === true;

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

      {/* ================= HEADER ================= */}
      <header className={`sticky top-0 z-40 border-b ${S.headerBorder} ${S.headerBg} backdrop-blur`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <BrandLogo
              src={config.brand.logo}
              alt={`${config.brand.businessName} Logo`}
              className="h-10 w-auto"
            />
            <span className="leading-tight">
              <span className={`block font-bold ${F.heading} ${S.textPrimary} text-lg`}>
                {config.brand.businessName}
              </span>
              <span
                className={`block text-[11px] uppercase tracking-wider ${t.primaryText} font-semibold`}
              >
                {config.brand.tagline}
              </span>
            </span>
          </a>

          <nav className={`hidden items-center gap-1 text-sm font-medium ${S.textMuted} md:flex`}>
            {config.navigation.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 transition-colors ${t.primaryHoverText} ${S.navHoverBg}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={config.brand.phoneHref}
              className={`hidden items-center gap-1.5 whitespace-nowrap text-sm font-semibold ${S.textSecondary} sm:flex`}
            >
              <Phone className={`h-4 w-4 ${t.primaryText}`} />
              {config.brand.phone}
            </a>
            {f.showBooking && (
              <button
                onClick={() => setBookingModalOpen(true)}
                className={`items-center gap-1.5 rounded-xl ${t.primaryBg} px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${t.primaryBgHover} inline-flex`}
              >
                {config.navigation.cta}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${S.textMuted} md:hidden`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`border-b ${S.mobileNavBorder} ${S.mobileNavBg} px-6 py-4 md:hidden`}>
            <nav className={`flex flex-col gap-4 text-sm font-medium ${S.mobileNavText}`}>
              {config.navigation.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={t.primaryHoverText}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}
      {cinematic ? (
        <section className={`relative overflow-hidden py-24 md:py-36 border-b ${S.surfaceBg}`}>
          <img
            src={config.brand.heroImage}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = config.brand.heroImageFallback;
            }}
          />
          <div className={`absolute inset-0 ${S.heroOverlay}`} />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <div
                className={`inline-flex items-center gap-2 rounded-full ${t.primaryBg} px-3.5 py-1.5 text-xs font-semibold text-white mb-6`}
              >
                <Sparkle className="h-4 w-4" /> {config.brand.heroEyebrow}
              </div>
              <h1 className={`${F.heading} text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight`}>
                {config.brand.heroHeadline}
              </h1>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                {config.brand.heroSubhead}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#estimate"
                  className={`rounded-xl ${t.primaryBg} px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all ${t.primaryBgHover} hover:shadow-lg flex items-center gap-2`}
                >
                  Calculate Your Price <ArrowRight className="h-4 w-4" />
                </a>
                {f.showCommercial && (
                  <a
                    href="#commercial"
                    className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                  >
                    Commercial Services
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className={`relative overflow-hidden ${S.heroBg} py-16 md:py-24 border-b ${S.cardBorder}`}>
          <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full ${t.primaryLightBg} px-3.5 py-1.5 text-xs font-semibold ${t.primaryLightText} mb-6`}
              >
                <Sparkle className="h-4 w-4" /> {config.brand.heroEyebrow}
              </div>
              <h1 className={`${F.heading} text-4xl md:text-5xl font-extrabold tracking-tight ${S.textPrimary} leading-tight`}>
                {config.brand.heroHeadline}
              </h1>
              <p className={`mt-4 text-lg ${S.textMuted} leading-relaxed`}>
                {config.brand.heroSubhead}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#estimate"
                  className={`rounded-xl ${t.primaryBg} px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all ${t.primaryBgHover} hover:shadow-lg flex items-center gap-2`}
                >
                  Calculate Your Price <ArrowRight className="h-4 w-4" />
                </a>
                {f.showCommercial && (
                  <a
                    href="#commercial"
                    className={`rounded-xl ${S.secondaryButton} px-6 py-3.5 text-base font-semibold transition-colors`}
                  >
                    Commercial Services
                  </a>
                )}
              </div>

              <div className={`mt-10 grid grid-cols-3 gap-4 border-t ${S.borderSubtle} pt-6`}>
                {config.trustBadges.map((badge, idx) => {
                  const BadgeIcon = ICON_MAP[badge.icon] ?? ShieldCheck;
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <BadgeIcon className={`h-5 w-5 ${t.primaryText} shrink-0`} />
                      <span className={`text-xs font-medium ${S.textMuted}`}>
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className={`overflow-hidden rounded-3xl ${S.imageFrameBg} shadow-xl border ${S.imageFrameBorder}`}>
                <img
                  src={config.brand.heroImage}
                  alt="Clean modern living room"
                  fetchPriority="high"
                  className="h-[420px] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = config.brand.heroImageFallback;
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= CRAFTSMANSHIP SPOTLIGHT ================= */}
      {f.showCraftsmanship && config.craftsmanship && config.sections.craftsmanship && (
        <section id="craftsmanship" className={`py-20 ${S.surfaceBg}`}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="overflow-hidden rounded-3xl shadow-2xl border border-gold/20">
                <img
                  src={config.craftsmanship.image}
                  alt={config.sections.craftsmanship.title}
                  loading="lazy"
                  className="h-[540px] w-full object-cover"
                />
              </div>
              <div>
                <span className={`text-xs uppercase tracking-[0.2em] font-bold ${t.primaryText}`}>
                  {config.sections.craftsmanship.eyebrow ?? config.craftsmanship.eyebrow}
                </span>
                <h2 className={`mt-3 text-3xl md:text-4xl font-bold ${F.heading} ${S.textPrimary} leading-tight`}>
                  {config.sections.craftsmanship.title ?? config.craftsmanship.title}
                </h2>
                <p className={`mt-4 ${S.textMuted} leading-relaxed`}>
                  {config.craftsmanship.description}
                </p>
                {config.craftsmanship.bullets && config.craftsmanship.bullets.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {config.craftsmanship.bullets.map((bullet, i) => (
                      <li key={i} className={`flex items-center gap-3 text-sm font-medium ${S.textSecondary}`}>
                        <CheckCircle2 className={`h-5 w-5 ${t.primaryText} shrink-0`} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
                {config.craftsmanship.stat && (
                  <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-6 py-4">
                    <span className={`text-4xl font-extrabold ${F.heading} ${t.primaryText}`}>
                      {config.craftsmanship.stat.value}
                    </span>
                    <span className={`text-sm ${S.textMuted}`}>{config.craftsmanship.stat.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= RESIDENTIAL SERVICES / GALLERY GRID ================= */}
      {f.showResidential && (
        <section
          id="services"
          className={`relative overflow-hidden py-20 ${S.surfaceBg}`}
        >
          <img
            src={config.brand.residentialImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className={`absolute inset-0 ${S.residentialOverlay}`} />
          <div id="residential" className="relative mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.residential.eyebrow}
              </h2>
              <p className={`mt-2 text-3xl font-bold ${F.heading} ${S.textPrimary}`}>
                {config.sections.residential.title}
              </p>
              <p className={`mt-3 ${S.textMuted}`}>
                {config.sections.residential.description}
              </p>
            </div>

            {f.showGallery ? (
              <div className="grid gap-8 md:grid-cols-2">
                {config.services.residential.map((service, idx) => (
                  <div
                    key={idx}
                    className={`${S.cardBg} overflow-hidden rounded-3xl border ${S.cardBorder} shadow-lg transition-all ${S.cardHover}`}
                  >
                    {service.image && (
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {service.price && (
                          <span className={`absolute bottom-4 left-4 rounded-full ${t.primaryBg} px-4 py-1.5 text-sm font-bold text-white shadow-lg`}>
                            {service.price}
                            {service.priceSuffix && (
                              <span className="ml-1 text-xs font-medium opacity-90">{service.priceSuffix}</span>
                            )}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-7">
                      <h3 className={`text-2xl font-bold ${F.heading} ${S.textPrimary}`}>
                        {service.title}
                      </h3>
                      <p className={`mt-2 text-sm ${S.textMuted} leading-relaxed`}>
                        {service.description}
                      </p>
                      <ul className="mt-5 space-y-2 border-t border-gold/20 pt-5">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className={`flex items-center gap-2 text-sm font-medium ${S.textSecondary}`}>
                            <CheckCircle2 className={`h-4 w-4 ${t.primaryText} shrink-0`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="grid gap-8 sm:grid-cols-2">
                  {config.services.residential.map((service, idx) => (
                    <div
                      key={idx}
                      className={`${S.cardBg} rounded-2xl p-8 border ${S.cardBorder} shadow-sm transition-shadow ${S.cardHover}`}
                    >
                      <div
                        className={`h-12 w-12 rounded-xl ${t.primaryLightBg} flex items-center justify-center ${t.primaryText} mb-6`}
                      >
                        <ResIcon className="h-6 w-6" />
                      </div>
                      <h3 className={`text-xl font-bold ${F.heading} ${S.textPrimary} mb-1`}>
                        {service.title}
                      </h3>
                      {service.price && (
                        <p className="mb-2 flex items-baseline gap-1.5">
                          <span
                            className={`text-2xl font-extrabold ${t.primaryText}`}
                          >
                            {service.price}
                          </span>
                          {service.priceSuffix && (
                            <span className={`text-xs font-medium ${S.textSubtle}`}>
                              {service.priceSuffix}
                            </span>
                          )}
                        </p>
                      )}
                      <p className={`${S.textMuted} text-sm mb-6 leading-relaxed`}>
                        {service.description}
                      </p>
                      <ul className={`space-y-2.5 border-t ${S.borderSubtle} pt-6`}>
                        {service.features.map((feature, fIdx) => (
                          <li
                            key={fIdx}
                            className={`flex items-center gap-2 text-xs font-medium ${S.textSecondary}`}
                          >
                            <CheckCircle2
                              className={`h-4 w-4 ${t.primaryText} shrink-0`}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {config.services.addons.length > 0 && (
                  <aside
                    className={`h-fit rounded-2xl border ${t.primaryBorder} ${S.cardBg}/90 p-6 shadow-sm`}
                  >
                    <div className="mb-5 flex items-center gap-2">
                      <Sparkles className={`h-5 w-5 ${t.primaryText}`} />
                      <h4 className={`text-sm font-bold uppercase tracking-wider ${S.textSecondary}`}>
                        {config.services.addonsTitle}
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {config.services.addons.map((addon, idx) => (
                        <li
                          key={idx}
                          className={`flex items-center gap-2 text-sm font-medium ${S.textSecondary}`}
                        >
                          <Check className={`h-4 w-4 ${t.primaryText} shrink-0`} />
                          <span className="flex-1">{addon.name}</span>
                          {addon.duration && (
                            <span className={`shrink-0 text-xs ${S.textSubtle}`}>
                              {addon.duration}
                            </span>
                          )}
                          {addon.price && (
                            <span
                              className={`shrink-0 ${t.primaryText} font-semibold`}
                            >
                              {addon.price}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            )}

            {/* Add-ons below the gallery grid (so they stay visible on dark) */}
            {f.showGallery && config.services.addons.length > 0 && (
              <div
                className={`mt-10 mx-auto max-w-3xl rounded-2xl border ${t.primaryBorder} ${S.cardBg} p-6 shadow-sm`}
              >
                <div className="mb-5 flex items-center justify-center gap-2">
                  <Sparkles className={`h-5 w-5 ${t.primaryText}`} />
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${S.textSecondary}`}>
                    {config.services.addonsTitle}
                  </h4>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {config.services.addons.map((addon, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-2 text-sm font-medium ${S.textSecondary} rounded-xl ${S.mutedBg} border ${S.mutedBorder} px-4 py-3`}
                    >
                      <Check className={`h-4 w-4 ${t.primaryText} shrink-0`} />
                      <span className="flex-1">{addon.name}</span>
                      {addon.duration && (
                        <span className={`shrink-0 text-xs ${S.textSubtle}`}>
                          {addon.duration}
                        </span>
                      )}
                      {addon.price && (
                        <span className={`shrink-0 ${t.primaryText} font-semibold`}>
                          {addon.price}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= FULL-WIDTH BRAND STATEMENT ================= */}
      {f.showStatement && config.statement && (
        <section id="statement" className="relative overflow-hidden py-24 md:py-32">
          {config.statement.backgroundImage && (
            <img
              src={config.statement.backgroundImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className={`absolute inset-0 ${S.statementOverlay}`} />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <Quote className={`mx-auto h-12 w-12 ${t.primaryText} opacity-80`} />
            {config.statement.eyebrow && (
              <p className={`mt-6 text-xs uppercase tracking-[0.25em] font-bold ${t.primaryText}`}>
                {config.statement.eyebrow}
              </p>
            )}
            <blockquote className={`mt-6 text-2xl md:text-4xl font-semibold leading-snug ${F.heading} text-white`}>
              "{config.statement.quote}"
            </blockquote>
            <div className="mt-8">
              <p className="text-base font-bold text-white">{config.statement.name}</p>
              <p className="text-sm text-white/70">{config.statement.role}</p>
            </div>
          </div>
        </section>
      )}

      {/* ================= BEFORE & AFTER RESULTS ================= */}
      {f.showBeforeAfter && (
        <section
          id="results"
          className={`py-20 ${S.cardBg} border-t ${S.cardBorder}`}
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.beforeAfter.eyebrow}
              </span>
              <h2 className={`mt-2 text-3xl font-bold ${F.heading} ${S.textPrimary}`}>
                {config.sections.beforeAfter.title}
              </h2>
              <p className={`mt-3 ${S.textMuted}`}>
                {config.sections.beforeAfter.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {config.beforeAfter.results.map((result, idx) => (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-2xl border ${S.cardBorder} ${S.cardBg} shadow-sm`}
                >
                  <div className={`grid grid-cols-2 gap-1 ${S.mutedBg}`}>
                    <div className="relative">
                      <img
                        src={result.beforeImage}
                        alt={`${config.beforeAfter.beforeLabel}${result.caption ? ` — ${result.caption}` : ""}`}
                        loading="lazy"
                        className="h-44 w-full object-cover"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-slate-700/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                        {config.beforeAfter.beforeLabel}
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src={result.afterImage}
                        alt={`${config.beforeAfter.afterLabel}${result.caption ? ` — ${result.caption}` : ""}`}
                        loading="lazy"
                        className="h-44 w-full object-cover"
                      />
                      <span
                        className={`absolute left-2 top-2 rounded-full ${t.primaryBg} px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white`}
                      >
                        {config.beforeAfter.afterLabel}
                      </span>
                    </div>
                  </div>
                  {result.caption && (
                    <div className={`px-4 py-3 text-center text-sm font-semibold ${S.textSecondary}`}>
                      {result.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= WHERE WE WORK / SERVICE AREAS ================= */}
      {f.showServiceAreas && (
        <section
          id="service-areas"
          className={`py-20 ${S.surfaceBg} border-t ${S.cardBorder}`}
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.serviceAreas.eyebrow}
              </span>
              <h2 className={`mt-2 text-3xl font-bold ${F.heading} ${S.textPrimary}`}>
                {config.sections.serviceAreas.title}
              </h2>
              <p className={`mt-3 ${S.textMuted}`}>
                {config.sections.serviceAreas.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {config.serviceAreas.map((area, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 rounded-xl border ${S.cardBorder} ${S.cardBg} px-4 py-3 shadow-sm`}
                >
                  <MapPin className={`h-4 w-4 ${t.primaryText} shrink-0`} />
                  <span className={`text-sm font-medium ${S.selectText}`}>
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= COMMERCIAL SECTION ================= */}
      {f.showCommercial && (
        <section id="commercial" className={`py-20 ${S.cardBg} border-t ${S.cardBorder}`}>
          <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className={`overflow-hidden rounded-3xl ${S.imageFrameBg} shadow-lg border ${S.imageFrameBorder}`}>
                <img
                  src={config.brand.commercialImage}
                  alt="Clean commercial office space"
                  loading="lazy"
                  className="h-[380px] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = config.brand.commercialImageFallback;
                  }}
                />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.commercial.eyebrow}
              </span>
              <h2 className={`mt-2 text-3xl font-bold ${F.heading} ${S.textPrimary}`}>
                {config.sections.commercial.title}
              </h2>
              <p className={`mt-4 ${S.textMuted} leading-relaxed`}>
                {config.sections.commercial.description}
              </p>

              <div className="mt-8 space-y-4">
                {config.services.commercial.map((cService, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-4 p-4 rounded-xl ${S.mutedBg} border ${S.mutedBorder}`}
                  >
                    <ComIcon
                      className={`h-6 w-6 ${t.primaryText} shrink-0 mt-0.5`}
                    />
                    <div>
                      <h4 className={`font-bold ${F.heading} ${S.textPrimary} text-sm`}>
                        {cService.title}
                      </h4>
                      <p className={`text-xs ${S.textMuted} mt-1`}>
                        {cService.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= INSTANT ESTIMATOR SECTION ================= */}
      {f.showEstimator && (
        <section id="estimate" className={`py-20 ${S.sectionAltBg} border-t ${S.cardBorder}`}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.estimator.eyebrow}
              </span>
              <h2 className={`mt-2 text-3xl font-bold ${F.heading} ${S.textPrimary}`}>
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
      <footer
        id="contact"
        className={`${t.footerBg} text-white py-12 border-t ${t.footerBorder}`}
      >
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BrandLogo
                src={config.brand.logo}
                alt={`${config.brand.businessName} Logo`}
                className="h-10 w-auto"
              />
              <span className={`font-bold ${F.heading} text-xl`}>
                {config.brand.businessName}
              </span>
            </div>
            <p className={`${t.footerMuted} text-sm leading-relaxed`}>
              {config.brand.footerBlurb}
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 text-sm ${F.heading} ${t.footerHeading}`}>
              Quick Links
            </h4>
            <ul className={`space-y-2 text-sm ${t.footerMuted}`}>
              <li>
                <a href="#residential" className="hover:text-white">
                  Residential Cleaning
                </a>
              </li>
              <li>
                <a href="#commercial" className="hover:text-white">
                  Commercial Services
                </a>
              </li>
              <li>
                <a href="#estimate" className="hover:text-white">
                  Request an Estimate
                </a>
              </li>
            </ul>
          </div>
          {f.showContact && (
            <div>
              <h4 className={`font-semibold mb-3 text-sm ${F.heading} ${t.footerHeading}`}>
                Contact Us
              </h4>
              <p
                className={`text-sm ${t.footerMuted} flex items-center gap-2 mb-2`}
              >
                <Phone className={`h-4 w-4 ${t.primaryDeep}`} />{" "}
                {config.brand.phone}
              </p>
              <p className={`text-sm ${t.footerMuted} flex items-center gap-2`}>
                <Mail className={`h-4 w-4 ${t.primaryDeep}`} />{" "}
                {config.brand.email}
              </p>
            </div>
          )}
        </div>
        <div
          className={`mx-auto max-w-7xl px-6 pt-8 mt-8 border-t ${t.footerBorder} text-center text-xs ${t.footerBase}`}
        >
          © {new Date().getFullYear()} {config.brand.copyrightName}. All rights
          reserved.
        </div>
      </footer>

      {/* Floating AI support chat */}
      {config.chat.enabled && <ChatWidget config={config} />}
    </div>
  );
}
