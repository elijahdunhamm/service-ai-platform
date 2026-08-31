// src/components/booking.tsx
// Shared booking UI (PriceCalculator + BookingModal) extracted from
// CleaningLayout so the tenant layout modules can be code-split independently.
// Imported by CleaningLayout, IdreamofcleaningLayout, and the /embed route.
// Behavior is byte-for-byte identical to the original definitions.
import React, { useState } from "react";
import { Check, Sparkle, X } from "lucide-react";
import type { IndustryConfig } from "../config/types";
import { lightSurface, defaultFonts } from "../config/theme";
import { checkAvailability, createBooking, uploadBookingImage } from "../services/bookingService";

export interface ServiceDetails {
  serviceType: string;
  bedrooms: number;
  bathrooms: number;
  frequency: string;
  /** Selected add-on names (from config.services.addons) when already chosen. */
  addons?: string[];
}

export interface BookedInfo {
  id: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  price: number;
  serviceDetails: ServiceDetails;
  createdAt: string;
}

// Resolve a preset's surface + font theming, falling back to light defaults
// (byte-for-byte identical to the original hardcoded light theme) so light
// tenants that omit `surface`/`fonts` render unchanged.
export function useTheme(config: IndustryConfig) {
  return {
    t: config.theme,
    S: config.surface ?? lightSurface,
    F: config.fonts ?? defaultFonts,
  };
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
  estimatedPrice: _estimatedPrice,
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
  const { t, S, F } = useTheme(config);
  const b = config.booking;
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = toLocalDateString(new Date());
    return b.defaultDate >= today ? b.defaultDate : today;
  });
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>(
    b.initialBookedSlots
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Service-type + add-ons selection. The modal is also opened directly from
  // the hero/nav with the default service, so the customer can change it here.
  const [selectedServiceType, setSelectedServiceType] = useState<string>(
    serviceDetails.serviceType
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    serviceDetails.addons ?? []
  );

  // Recalculate the numeric estimate exactly like PriceCalculator so the number
  // stays consistent even when the modal is opened directly from the hero. The
  // estimate is SERVICE-BASED ONLY — add-ons' `price` fields are display strings
  // ("$45 (PLACEHOLDER)", "Quote"), not numbers, so they are NEVER added here.
  const baseRate = config.estimator.baseRates[selectedServiceType] ?? 0;
  const frequencyMultiplier =
    config.estimator.frequencies.find((f) => f.id === serviceDetails.frequency)
      ?.multiplier ?? 1;
  const modalPrice = Math.round(
    (baseRate +
      serviceDetails.bedrooms * config.estimator.bedRate +
      serviceDetails.bathrooms * config.estimator.bathRate) *
      frequencyMultiplier
  );
  const serviceLabel =
    config.estimator.serviceTypes.find((s) => s.id === selectedServiceType)
      ?.label ?? selectedServiceType;

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  if (!isOpen) return null;

  const currentDayBookings = bookedSlots[selectedDate] || [];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;

    if (!imageFile) {
      setError(
        b.copy.mediaLabel.includes("Video")
          ? "Please attach a photo or video of your space before confirming."
          : "Please attach a photo of your space before confirming."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      // Check availability FIRST (before uploading a photo that isn't needed
      // for a slot already taken). verified:false means the check errored —
      // never block on it: show a neutral notice and proceed, so valid
      // submissions are not falsely rejected as "already booked".
      const availability = await checkAvailability(config.id, selectedDate, selectedTime);

      // Hard-block ONLY when availability is genuinely verified as unavailable.
      if (availability.verified && !availability.available) {
        setError('This time slot is already booked. Please select another time.');
        setIsLoading(false);
        return;
      }

      let warningMessage: string | null = null;
      if (!availability.verified) {
        warningMessage =
          "We couldn't verify this slot's availability, but we'll attempt to save your booking.";
      }

      // Upload the media (defensively, never crashes the booking). Failure is a
      // non-blocking warning only — the booking proceeds without the upload.
      let imageUrl: string | undefined;
      const uploadResult = await uploadBookingImage(imageFile, config.storage.bucket);
      if (uploadResult.url) {
        imageUrl = uploadResult.url;
      } else {
        const uploadWarning =
          uploadResult.error ||
          "Your photo or video could not be uploaded, but your booking will still be saved.";
        warningMessage = warningMessage
          ? `${warningMessage} ${uploadWarning}`
          : uploadWarning;
      }
      if (warningMessage) {
        setWarning(warningMessage);
      }

      // Create the booking
      const bookingData = {
        tenantId: config.id,
        date: selectedDate,
        timeSlot: selectedTime,
        customerName,
        customerEmail,
        customerAddress,
        serviceType: selectedServiceType,
        estimatedPrice: modalPrice,
        imageUrl,
        // Newline-joined add-on names. Stored in the `addons` column when the
        // migration has run; the service layer degrades gracefully otherwise.
        addons: selectedAddons.length > 0 ? selectedAddons.join("\n") : undefined,
      };

      const result = await createBooking(bookingData);

      if (result.success && result.booking) {
        const newBooking: BookedInfo = {
          id: result.booking.id,
          date: selectedDate,
          time: selectedTime,
          customerName,
          customerEmail,
          price: modalPrice,
          serviceDetails: {
            ...serviceDetails,
            serviceType: selectedServiceType,
            addons: selectedAddons,
          },
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
    setCustomerAddress("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className={`${S.cardBg} rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border ${S.cardBorder} relative max-h-[90vh] overflow-y-auto`}>
        <button
          onClick={resetAndClose}
          className={`absolute top-5 right-5 p-2 rounded-full ${S.closeButton}`}
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className={`w-16 h-16 ${S.successBadge} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Check className="h-8 w-8" />
            </div>
            <h3 className={`${F.heading} text-2xl font-bold ${S.textPrimary}`}>
              {b.copy.successTitle}
            </h3>
            <p className={`${S.textMuted} text-sm mt-2`}>
              {b.copy.successTextBefore} <strong>{selectedDate}</strong>{" "}
              {b.copy.successTextAt} <strong>{selectedTime}</strong>.
            </p>
            <div className={`mt-6 ${S.mutedBg} p-4 rounded-2xl border ${S.cardBorder} text-left text-xs space-y-1.5 ${S.textSecondary}`}>
              <p>
                <strong>{b.copy.serviceLabel}:</strong>{" "}
                {serviceLabel} {config.name}
              </p>
              <p>
                <strong>{b.copy.totalLabel}:</strong>{" "}
                {config.estimator.currency}
                {modalPrice}
              </p>
              {selectedAddons.length > 0 && (
                <p>
                  <strong>Add-ons:</strong> {selectedAddons.join(", ")}
                </p>
              )}
              <p>
                <strong>{b.copy.clientLabel}:</strong> {customerName} (
                {customerEmail})
              </p>
              {customerAddress && (
                <p>
                  <strong>{b.copy.addressLabel}:</strong> {customerAddress}
                </p>
              )}
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
              <h3 className={`${F.heading} text-2xl font-bold ${S.textPrimary}`}>{b.copy.title}</h3>
              <p className={`text-xs ${S.textSubtle} mt-1`}>{b.copy.subtitle}</p>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className={`block text-xs font-bold uppercase ${S.textSecondary} mb-2`}>
                {config.estimator.copy.serviceTypeLabel}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {config.estimator.serviceTypes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedServiceType(s.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      selectedServiceType === s.id
                        ? `${t.primaryBorder} ${t.primaryLightBg} ${t.primaryLightText}`
                        : `border ${S.optionBorder} ${S.optionText} ${S.optionHoverBg}`
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className={`mt-2 text-xs ${S.textSubtle}`}>
                {config.estimator.currency}
                {modalPrice} / visit
              </p>
            </div>

            {/* Add-ons Multi-Select */}
            {config.services?.addons?.length > 0 && (
              <div>
                <label className={`block text-xs font-bold uppercase ${S.textSecondary} mb-2`}>
                  {config.services.addonsTitle}
                </label>
                <div className="space-y-2">
                  {config.services.addons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.name);
                    return (
                      <button
                        key={addon.name}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleAddon(addon.name)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                          isSelected
                            ? `${t.primaryBorder} ${t.primaryLightBg} ${t.primaryLightText}`
                            : `border ${S.optionBorder} ${S.optionText} ${S.optionHoverBg}`
                        }`}
                      >
                        <span className="block font-semibold">{addon.name}</span>
                        <span className={`block text-xs ${S.textSubtle}`}>
                          {[addon.price, addon.duration].filter(Boolean).join(" · ") ||
                            "Added to estimate"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className={`mt-2 text-xs ${S.textSubtle}`}>
                  Add-on prices are quoted separately and are not included in the
                  numeric estimate.
                </p>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className={`block text-xs font-bold uppercase ${S.textSecondary} mb-2`}>
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
                className={`w-full p-3 rounded-xl border ${S.inputBorder} text-sm font-medium ${S.inputBg}`}
                required
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className={`block text-xs font-bold uppercase ${S.textSecondary} mb-2`}>
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
                          ? `${S.takenBg} border ${S.takenBorder} ${S.takenText} cursor-not-allowed line-through`
                          : isSelected
                          ? `${t.primaryBg} text-white ${t.primaryBorder} shadow-md`
                          : `${S.slotBg} ${S.slotText} border ${S.optionBorder} ${t.primaryBorderHover} ${t.primaryLightBgHover}`
                      }`}
                    >
                      {slot}
                      {isTaken && (
                        <span className={`block text-[10px] font-normal ${S.takenText}`}>
                          {b.copy.bookedLabel}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className={`space-y-3 border-t ${S.borderSubtle} pt-4`}>
              <div>
                <label className={`block text-xs font-bold ${S.textSecondary} mb-1`}>
                  {b.copy.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={b.copy.namePlaceholder}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${S.inputBorder} text-sm ${S.cardBg}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold ${S.textSecondary} mb-1`}>
                  {b.copy.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  placeholder={b.copy.emailPlaceholder}
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${S.inputBorder} text-sm ${S.cardBg}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold ${S.textSecondary} mb-1`}>
                  {b.copy.addressLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={b.copy.addressPlaceholder}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${S.inputBorder} text-sm ${S.cardBg}`}
                />
              </div>
              {/* Mandatory photo upload */}
              <div>
                <label className={`block text-xs font-bold ${S.textSecondary} mb-1`}>
                  {b.copy.mediaLabel}
                </label>
                <label className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed ${S.uploadBorder} ${S.mutedBg} p-3 text-sm ${S.textMuted} transition-colors ${S.uploadHoverBorder}`}>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    required
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setImageFile(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {imagePreview ? (
                    imageFile?.type.startsWith("video/") ? (
                      <video
                        src={imagePreview}
                        className="h-14 w-14 rounded-lg object-cover shadow-sm"
                      />
                    ) : (
                      <img
                        src={imagePreview}
                        alt="Upload preview"
                        className="h-14 w-14 rounded-lg object-cover shadow-sm"
                      />
                    )
                  ) : null}
                  <span className="text-xs">
                    {imageFile ? imageFile.name : b.copy.mediaHint}
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
                  {modalPrice})
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
  const { t, S, F } = useTheme(config);
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
    <div className={`${S.cardBg} rounded-3xl p-6 sm:p-8 border ${S.cardBorder} shadow-xl max-w-3xl mx-auto`}>
      <div className="text-center mb-8">
        <h3 className={`${F.heading} text-2xl font-bold ${S.textPrimary}`}>{est.copy.title}</h3>
        <p className={`text-sm ${S.textMuted} mt-1`}>{est.copy.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider ${S.textSecondary} mb-2`}>
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
                    : `border ${S.optionBorder} ${S.optionText} ${S.optionHoverBg}`
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider ${S.textSecondary} mb-2`}>
              {est.copy.bedroomsLabel}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBedrooms(Math.max(est.minRooms, bedrooms - 1))}
                className={`w-10 h-10 rounded-xl ${S.stepBg} ${S.stepText} font-bold ${S.stepHoverBg}`}
              >
                -
              </button>
              <span className={`font-bold ${S.textPrimary} w-8 text-center`}>
                {bedrooms}
              </span>
              <button
                type="button"
                onClick={() => setBedrooms(bedrooms + 1)}
                className={`w-10 h-10 rounded-xl ${S.stepBg} ${S.stepText} font-bold ${S.stepHoverBg}`}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider ${S.textSecondary} mb-2`}>
              {est.copy.bathroomsLabel}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBathrooms(Math.max(est.minRooms, bathrooms - 1))}
                className={`w-10 h-10 rounded-xl ${S.stepBg} ${S.stepText} font-bold ${S.stepHoverBg}`}
              >
                -
              </button>
              <span className={`font-bold ${S.textPrimary} w-8 text-center`}>
                {bathrooms}
              </span>
              <button
                type="button"
                onClick={() => setBathrooms(bathrooms + 1)}
                className={`w-10 h-10 rounded-xl ${S.stepBg} ${S.stepText} font-bold ${S.stepHoverBg}`}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider ${S.textSecondary} mb-2`}>
              {est.copy.frequencyLabel}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={`w-full p-3 rounded-xl border ${S.inputBorder} text-sm font-medium ${S.selectBg} ${S.selectText}`}
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

      <div className={`mt-8 pt-6 border-t ${S.borderSubtle} flex flex-col sm:flex-row items-center justify-between gap-4 ${S.mutedBg} rounded-2xl p-6`}>
        <div>
          <span className={`text-xs font-semibold ${S.textSubtle} uppercase tracking-wider`}>
            {est.copy.estimatedLabel}
          </span>
          <div className={`text-3xl font-extrabold ${t.primaryText}`}>
            {est.currency}
            {total}{" "}
            <span className={`text-sm font-normal ${S.textSubtle}`}>
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

