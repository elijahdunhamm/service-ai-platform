import React, { useState } from "react";
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
import type { IconName, IndustryConfig } from "../config/types";
import { defaultPreset } from "../config/presets";
import { checkAvailability, createBooking, uploadBookingImage } from "../services/bookingService";
import Testimonials from "./Testimonials";
import ChatWidget from "./ChatWidget";

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

/* ================= AUTOMATED SCHEDULING MODAL ================= */

/**
 * Returns a local-timezone YYYY-MM-DD string. Using toISOString() would give a
 * UTC date, which can disagree with the local date near midnight and make the
 * scheduler's min-date and booked-slot keys inconsistent. Everything in the
 * booking flow uses this same local date string.
 */
function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BookingModal({
  config,
  isOpen,
  onClose,
  estimatedPrice,
  serviceDetails,
  onBookingConfirmed,
}: {
  config: IndustryConfig;
  isOpen: boolean;
  onClose: () => void;
  estimatedPrice: number;
  serviceDetails: ServiceDetails;
  onBookingConfirmed: (booking: BookedInfo) => void;
}) {
  const t = config.theme;
  const b = config.booking;
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = toLocalDateString(new Date());
    return b.defaultDate >= today ? b.defaultDate : today;
  });
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>(
    b.initialBookedSlots
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDayBookings = bookedSlots[selectedDate] || [];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;
    if (!imageFile) {
      setError("Please attach a photo of your space before confirming.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      // Upload the required photo (defensively, never crashes the booking).
      let imageUrl: string | undefined;
      const uploadResult = await uploadBookingImage(imageFile);
      if (uploadResult.url) {
        imageUrl = uploadResult.url;
      } else {
        setWarning(
          uploadResult.error ||
            "Your photo could not be uploaded, but your booking will still be saved."
        );
      }
      // Check availability first
      const isAvailable = await checkAvailability(config.id, selectedDate, selectedTime);
      
      if (!isAvailable) {
        setError('This time slot is already booked. Please select another time.');
        setIsLoading(false);
        return;
      }

      // Create the booking
      const bookingData = {
        tenantId: config.id,
        date: selectedDate,
        timeSlot: selectedTime,
        customerName,
        customerEmail,
        serviceType: serviceDetails.serviceType,
        estimatedPrice,
        imageUrl,
      };

      const result = await createBooking(bookingData);

      if (result.success && result.booking) {
        const newBooking: BookedInfo = {
          id: result.booking.id,
          date: selectedDate,
          time: selectedTime,
          customerName,
          customerEmail,
          price: estimatedPrice,
          serviceDetails,
          createdAt: result.booking.createdAt,
        };

        setBookedSlots((prev) => ({
          ...prev,
          [selectedDate]: [...(prev[selectedDate] || []), selectedTime],
        }));

        onBookingConfirmed(newBooking);
        setIsSuccess(true);
      } else {
        setError(result.error || 'Failed to create booking. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setSelectedTime("");
    setWarning(null);
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {b.copy.successTitle}
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              {b.copy.successTextBefore} <strong>{selectedDate}</strong>{" "}
              {b.copy.successTextAt} <strong>{selectedTime}</strong>.
            </p>
            <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-700">
              <p>
                <strong>{b.copy.serviceLabel}:</strong>{" "}
                {serviceDetails.serviceType.toUpperCase()} {config.name}
              </p>
              <p>
                <strong>{b.copy.totalLabel}:</strong>{" "}
                {config.estimator.currency}
                {estimatedPrice}
              </p>
              <p>
                <strong>{b.copy.clientLabel}:</strong> {customerName} (
                {customerEmail})
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className={`mt-6 w-full py-3 text-white rounded-xl font-bold ${t.primaryBg} ${t.primaryBgHover}`}
            >
              {b.copy.doneButton}
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${t.primaryText} ${t.primaryLightBg} px-3 py-1 rounded-full mb-2`}
              >
                <Sparkle className="h-3.5 w-3.5" /> {b.copy.schedulerBadge}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{b.copy.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{b.copy.subtitle}</p>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                {b.copy.selectDateLabel}
              </label>
              <input
                type="date"
                value={selectedDate}
                min={toLocalDateString(new Date())}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50"
                required
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                {b.copy.timeWindowLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {b.timeSlots.map((slot) => {
                  const isTaken = currentDayBookings.includes(slot);
                  const isSelected = selectedTime === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-3 rounded-xl text-xs font-bold border text-center transition-all ${
                        isTaken
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through"
                          : isSelected
                          ? `${t.primaryBg} text-white ${t.primaryBorder} shadow-md`
                          : `bg-white text-slate-700 border-slate-200 ${t.primaryBorderHover} ${t.primaryLightBgHover}`
                      }`}
                    >
                      {slot}
                      {isTaken && (
                        <span className="block text-[10px] font-normal text-slate-400">
                          {b.copy.bookedLabel}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {b.copy.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={b.copy.namePlaceholder}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {b.copy.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  placeholder={b.copy.emailPlaceholder}
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              {/* Mandatory photo upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {b.copy.photoLabel}
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 transition-colors hover:border-royal">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setImageFile(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="h-14 w-14 rounded-lg object-cover shadow-sm"
                    />
                  ) : null}
                  <span className="text-xs">
                    {imageFile ? imageFile.name : b.copy.photoHint}
                  </span>
                </label>
              </div>
            </div>

            {warning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                {warning}
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={!selectedTime || isLoading}
              className={`w-full py-4 rounded-xl ${t.primaryBg} text-white font-bold text-sm shadow-md ${t.primaryBgHover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {b.copy.confirmButton} ({config.estimator.currency}
                  {estimatedPrice})
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================= INTERACTIVE PRICE CALCULATOR ================= */
export function PriceCalculator({
  config,
  onOpenBooking,
}: {
  config: IndustryConfig;
  onOpenBooking: (details: ServiceDetails, price: number) => void;
}) {
  const t = config.theme;
  const est = config.estimator;
  const [serviceType, setServiceType] = useState<string>(est.serviceTypes[0].id);
  const [bedrooms, setBedrooms] = useState<number>(est.defaultBedrooms);
  const [bathrooms, setBathrooms] = useState<number>(est.defaultBathrooms);
  const [frequency, setFrequency] = useState<string>(est.defaultFrequency);

  const selectedFrequency = est.frequencies.find((f) => f.id === frequency);
  const multiplier = selectedFrequency?.multiplier ?? 1;
  const baseRate = est.baseRates[serviceType] ?? 0;
  const total = Math.round(
    (baseRate + bedrooms * est.bedRate + bathrooms * est.bathRate) * multiplier
  );

  const handleBookClick = () => {
    onOpenBooking({ serviceType, bedrooms, bathrooms, frequency }, total);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900">{est.copy.title}</h3>
        <p className="text-sm text-slate-600 mt-1">{est.copy.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {est.copy.serviceTypeLabel}
          </label>
          <div className="space-y-2">
            {est.serviceTypes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setServiceType(s.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  serviceType === s.id
                    ? `${t.primaryBorder} ${t.primaryLightBg} ${t.primaryLightText}`
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {est.copy.bedroomsLabel}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBedrooms(Math.max(est.minRooms, bedrooms - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
              >
                -
              </button>
              <span className="font-bold text-slate-900 w-8 text-center">
                {bedrooms}
              </span>
              <button
                type="button"
                onClick={() => setBedrooms(bedrooms + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {est.copy.bathroomsLabel}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBathrooms(Math.max(est.minRooms, bathrooms - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
              >
                -
              </button>
              <span className="font-bold text-slate-900 w-8 text-center">
                {bathrooms}
              </span>
              <button
                type="button"
                onClick={() => setBathrooms(bathrooms + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              {est.copy.frequencyLabel}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-800"
            >
              {est.frequencies.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 rounded-2xl p-6">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {est.copy.estimatedLabel}
          </span>
          <div className={`text-3xl font-extrabold ${t.primaryText}`}>
            {est.currency}
            {total}{" "}
            <span className="text-sm font-normal text-slate-500">
              {est.copy.perSuffix}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBookClick}
          className={`w-full sm:w-auto text-center rounded-xl ${t.primaryBg} px-6 py-3.5 text-sm font-bold text-white ${t.primaryBgHover} shadow-md transition-colors`}
        >
          {est.copy.bookButton}
        </button>
      </div>
    </div>
  );
}

/* ================= MAIN LAYOUT ================= */
export default function CleaningLayout({
  config = defaultPreset,
}: {
  config?: IndustryConfig;
}) {
  const t = config.theme;
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <img
              src={config.brand.logo}
              alt={`${config.brand.businessName} Logo`}
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="leading-tight">
              <span className="block font-bold text-slate-900 text-lg">
                {config.brand.businessName}
              </span>
              <span
                className={`block text-[11px] uppercase tracking-wider ${t.primaryText} font-semibold`}
              >
                {config.brand.tagline}
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {config.navigation.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors ${t.primaryHoverText}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={config.brand.phoneHref}
              className="hidden items-center gap-1.5 text-sm font-semibold text-slate-700 sm:flex"
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
              className="p-2 text-slate-600 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-4 text-sm font-medium text-slate-700">
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
      <section className="relative overflow-hidden bg-white py-16 md:py-24 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full ${t.primaryLightBg} px-3.5 py-1.5 text-xs font-semibold ${t.primaryLightText} mb-6`}
            >
              <Sparkle className="h-4 w-4" /> {config.brand.heroEyebrow}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {config.brand.heroHeadline}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              {config.brand.heroSubhead}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#estimate"
                className={`rounded-xl ${t.primaryBg} px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all ${t.primaryBgHover} hover:shadow-lg flex items-center gap-2`}
              >
                Calculate Your Price <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#commercial"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Commercial Services
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
              {config.trustBadges.map((badge, idx) => {
                const BadgeIcon = ICON_MAP[badge.icon] ?? ShieldCheck;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <BadgeIcon className={`h-5 w-5 ${t.primaryText} shrink-0`} />
                    <span className="text-xs font-medium text-slate-600">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-xl border border-slate-200">
              <img
                src={config.brand.heroImage}
                alt="Clean modern living room"
                className="h-[420px] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = config.brand.heroImageFallback;
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESIDENTIAL SERVICES ================= */}
      {f.showResidential && (
        <section
          id="services"
          className="relative overflow-hidden py-20 bg-slate-50"
        >
          <img
            src={config.brand.residentialImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/75" />
          <div id="residential" className="relative mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.residential.eyebrow}
              </h2>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {config.sections.residential.title}
              </p>
              <p className="mt-3 text-slate-600">
                {config.sections.residential.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {config.services.residential.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`h-12 w-12 rounded-xl ${t.primaryLightBg} flex items-center justify-center ${t.primaryText} mb-6`}
                  >
                    <ResIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {service.title}
                  </h3>
                  {service.price && (
                    <p className="mb-2 flex items-baseline gap-1.5">
                      <span className={`text-2xl font-extrabold ${t.primaryText}`}>
                        {service.price}
                      </span>
                      {service.priceSuffix && (
                        <span className="text-xs font-medium text-slate-500">
                          {service.priceSuffix}
                        </span>
                      )}
                    </p>
                  )}
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2.5 border-t border-slate-100 pt-6">
                    {service.features.map((feature, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-center gap-2 text-xs font-medium text-slate-700"
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
              <div
                className={`mt-12 rounded-2xl border ${t.primaryBorder} bg-white/90 p-6 shadow-sm`}
              >
                <div className="mb-5 flex items-center gap-2">
                  <Sparkles className={`h-5 w-5 ${t.primaryText}`} />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    Add-ons
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {config.services.addons.map((addon, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700"
                    >
                      <Check className={`h-4 w-4 ${t.primaryText} shrink-0`} />
                      {addon}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= BEFORE & AFTER RESULTS ================= */}
      {f.showBeforeAfter && (
        <section
          id="results"
          className="py-20 bg-white border-t border-slate-200"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.beforeAfter.eyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {config.sections.beforeAfter.title}
              </h2>
              <p className="mt-3 text-slate-600">
                {config.sections.beforeAfter.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {config.beforeAfter.results.map((result, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-1 bg-slate-100">
                    <div className="relative">
                      <img
                        src={result.beforeImage}
                        alt={`Before${result.caption ? ` — ${result.caption}` : ""}`}
                        className="h-44 w-full object-cover"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-slate-700/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                        Before
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src={result.afterImage}
                        alt={`After${result.caption ? ` — ${result.caption}` : ""}`}
                        className="h-44 w-full object-cover"
                      />
                      <span
                        className={`absolute left-2 top-2 rounded-full ${t.primaryBg} px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white`}
                      >
                        After
                      </span>
                    </div>
                  </div>
                  {result.caption && (
                    <div className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
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
          className="py-20 bg-slate-50 border-t border-slate-200"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.serviceAreas.eyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {config.sections.serviceAreas.title}
              </h2>
              <p className="mt-3 text-slate-600">
                {config.sections.serviceAreas.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {config.serviceAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <MapPin className={`h-4 w-4 ${t.primaryText} shrink-0`} />
                  <span className="text-sm font-medium text-slate-800">
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
        <section id="commercial" className="py-20 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-lg border border-slate-200">
                <img
                  src={config.brand.commercialImage}
                  alt="Clean commercial office space"
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
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {config.sections.commercial.title}
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {config.sections.commercial.description}
              </p>

              <div className="mt-8 space-y-4">
                {config.services.commercial.map((cService, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <ComIcon
                      className={`h-6 w-6 ${t.primaryText} shrink-0 mt-0.5`}
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {cService.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
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
        <section id="estimate" className="py-20 bg-slate-100 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span
                className={`text-xs uppercase tracking-wider font-bold ${t.primaryText}`}
              >
                {config.sections.estimator.eyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {config.sections.estimator.title}
              </h2>
              <p className="mt-3 text-slate-600">
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
            <span className="font-bold text-xl block mb-2">
              {config.brand.businessName}
            </span>
            <p className={`${t.footerMuted} text-sm leading-relaxed`}>
              {config.brand.footerBlurb}
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 text-sm ${t.footerHeading}`}>
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
              <h4 className={`font-semibold mb-3 text-sm ${t.footerHeading}`}>
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
