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
} from "lucide-react";

// Image Paths (served from public/images/)
const LOGO_IMAGE = "/images/LOGO.PNG"; 
const HERO_IMAGE = "/images/cleaning3.jpeg"; 
const COMMERCIAL_IMAGE = "/images/cleaning2.jpeg";

const NAV_LINKS = [
  { label: "Residential", href: "#residential" },
  { label: "Commercial", href: "#commercial" },
  { label: "Estimate Tool", href: "#estimate" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const TRUST_BADGES = [
  { label: "Licensed & Insured", icon: ShieldCheck },
  { label: "Vetted & Background Checked", icon: Clock },
  { label: "100% Satisfaction Guarantee", icon: Sparkles },
];

const RESIDENTIAL_SERVICES = [
  {
    title: "Standard Home & Apartment Cleaning",
    description: "Recurring weekly, bi-weekly, or monthly cleaning to keep your living space spotless and fresh.",
    features: ["Kitchen & Bath Sanitization", "Dusting & Vacuuming", "Trash Removal & Linen Change"],
  },
  {
    title: "Deep Detail Cleaning",
    description: "A comprehensive top-to-bottom clean focusing on baseboards, appliance interiors, and hard-to-reach spots.",
    features: ["Inside Oven & Fridge", "Detail Baseboard Scrub", "High-Touch Surface Disinfection"],
  },
  {
    title: "Move-In / Move-Out Cleaning",
    description: "Ensure you get your security deposit back or step into a completely sanitized new home.",
    features: ["Cabinet & Closet Interior", "Deep Appliance Reset", "Full Fixture Polish"],
  },
];

const COMMERCIAL_SERVICES = [
  {
    title: "Offices & Coworking Spaces",
    description: "After-hours or daily janitorial services for desks, conference rooms, and common breakrooms.",
  },
  {
    title: "Retail & Showrooms",
    description: "Keep your sales floor pristine and inviting for customers with regular maintenance.",
  },
  {
    title: "Post-Construction & Turnover",
    description: "Dust and debris cleanup after renovations or property management tenant turnovers.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Pull Up & Clean has been a lifesaver for our busy household. Coming home to a spotless house every Friday is the best feeling!",
    name: "Sarah M.",
    role: "Homeowner",
  },
  {
    quote: "They handle our home cleaning bi-weekly and also take care of our small dental office. Punctual, thorough, and super trustworthy.",
    name: "David K.",
    role: "Residential & Business Client",
  },
  {
    quote: "The move-out clean was so detailed that our landlord refunded our security deposit without a single question.",
    name: "Jessica T.",
    role: "Apartment Tenant",
  },
];

/* Mock database of already taken slots */
const INITIAL_BOOKED_SLOTS: Record<string, string[]> = {
  "2026-09-01": ["09:00 AM", "01:00 PM"],
  "2026-09-02": ["11:00 AM", "03:00 PM"],
};

const DAILY_TIME_SLOTS = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];

/* ================= AUTOMATED SCHEDULING MODAL ================= */
function BookingModal({
  isOpen,
  onClose,
  estimatedPrice,
  serviceDetails,
  onBookingConfirmed,
}: {
  isOpen: boolean;
  onClose: () => void;
  estimatedPrice: number;
  serviceDetails: { serviceType: string; bedrooms: number; bathrooms: number; frequency: string };
  onBookingConfirmed: (booking: any) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-01");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [bookedSlots, setBookedSlots] = useState(INITIAL_BOOKED_SLOTS);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentDayBookings = bookedSlots[selectedDate] || [];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;

    const newBooking = {
      id: "BOOK-" + Math.floor(1000 + Math.random() * 9000),
      date: selectedDate,
      time: selectedTime,
      customerName,
      customerEmail,
      price: estimatedPrice,
      serviceDetails,
      createdAt: new Date().toISOString(),
    };

    setBookedSlots((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), selectedTime],
    }));

    onBookingConfirmed(newBooking);
    setIsSuccess(true);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setSelectedTime("");
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
            <h3 className="text-2xl font-bold text-slate-900">Appointment Confirmed!</h3>
            <p className="text-slate-600 text-sm mt-2">
              Automated AI verification logged your booking for <strong>{selectedDate}</strong> at{" "}
              <strong>{selectedTime}</strong>.
            </p>
            <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-700">
              <p><strong>Service:</strong> {serviceDetails.serviceType.toUpperCase()} Cleaning</p>
              <p><strong>Estimated Total:</strong> ${estimatedPrice}</p>
              <p><strong>Client:</strong> {customerName} ({customerEmail})</p>
            </div>
            <button
              onClick={resetAndClose}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
                <Sparkle className="h-3.5 w-3.5" /> Automated AI Scheduler
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Select Date & Available Time</h3>
              <p className="text-xs text-slate-500 mt-1">
                Conflicting slots are automatically disabled based on real-time availability.
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
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
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Available Time Windows</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DAILY_TIME_SLOTS.map((slot) => {
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
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {slot}
                      {isTaken && <span className="block text-[10px] font-normal text-slate-400">Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedTime}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Booking (${estimatedPrice})
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================= INTERACTIVE PRICE CALCULATOR ================= */
function PriceCalculator({ onOpenBooking }: { onOpenBooking: (details: any, price: number) => void }) {
  const [serviceType, setServiceType] = useState<"standard" | "deep" | "move">("standard");
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [frequency, setFrequency] = useState<"one-time" | "weekly" | "biweekly">("biweekly");

  const baseRates = { standard: 90, deep: 160, move: 210 };
  const bedRate = 25;
  const bathRate = 35;

  let total = baseRates[serviceType] + bedrooms * bedRate + bathrooms * bathRate;

  if (frequency === "weekly") total *= 0.85;
  if (frequency === "biweekly") total *= 0.90;

  const finalPrice = Math.round(total);

  const handleBookClick = () => {
    onOpenBooking({ serviceType, bedrooms, bathrooms, frequency }, finalPrice);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900">Instant Price Estimator</h3>
        <p className="text-sm text-slate-600 mt-1">Select your home size and service needs for a real-time quote.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Service Type</label>
          <div className="space-y-2">
            {[
              { id: "standard", label: "Standard Home Clean" },
              { id: "deep", label: "Deep Detail Clean" },
              { id: "move", label: "Move-In / Move-Out Clean" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setServiceType(s.id as any)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  serviceType === s.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Bedrooms</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
              >
                -
              </button>
              <span className="font-bold text-slate-900 w-8 text-center">{bedrooms}</span>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Bathrooms</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
              >
                -
              </button>
              <span className="font-bold text-slate-900 w-8 text-center">{bathrooms}</span>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-800"
            >
              <option value="one-time">One-Time Service</option>
              <option value="biweekly">Bi-Weekly (Save 10%)</option>
              <option value="weekly">Weekly Clean (Save 15%)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 rounded-2xl p-6">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Price</span>
          <div className="text-3xl font-extrabold text-blue-600">
            ${finalPrice} <span className="text-sm font-normal text-slate-500">/ cleaning</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBookClick}
          className="w-full sm:w-auto text-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

/* ================= MAIN LAYOUT ================= */
export default function CleaningLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeEstimate, setActiveEstimate] = useState<{ details: any; price: number }>({
    details: { serviceType: "standard", bedrooms: 2, bathrooms: 1, frequency: "biweekly" },
    price: 153,
  });
  
  const [, setAllBookings] = useState<any[]>([]);

  const handleOpenBooking = (details: any, price: number) => {
    setActiveEstimate({ details, price });
    setBookingModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking: any) => {
    setAllBookings((prev) => [...prev, newBooking]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        estimatedPrice={activeEstimate.price}
        serviceDetails={activeEstimate.details}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <img
              src={LOGO_IMAGE}
              alt="Pull Up & Clean Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="leading-tight">
              <span className="block font-bold text-slate-900 text-lg">Pull Up & Clean</span>
              <span className="block text-[11px] uppercase tracking-wider text-blue-600 font-semibold">
                Residential & Commercial
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-blue-600">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+15550100199"
              className="hidden items-center gap-1.5 text-sm font-semibold text-slate-700 sm:flex"
            >
              <Phone className="h-4 w-4 text-blue-600" />
              (555) 010-0199
            </a>
            <button
              onClick={() => setBookingModalOpen(true)}
              className="items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 inline-flex"
            >
              Book Now
            </button>
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
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-600"
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
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 mb-6">
              <Sparkle className="h-4 w-4" /> Premier Mobile Cleaning Service
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              A Spotless Home Without Lifting a Finger.
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Top-tier residential maid services and deep cleaning brought straight to your doorstep. We pull up, clean up, and leave your space sparkling.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#estimate"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg flex items-center gap-2"
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
              {TRUST_BADGES.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <badge.icon className="h-5 w-5 text-blue-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-600">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-xl border border-slate-200">
              <img
                src={HERO_IMAGE}
                alt="Clean modern living room"
                className="h-[420px] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESIDENTIAL SERVICES ================= */}
      <section id="residential" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-wider font-bold text-blue-600">Home Care Experts</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900">Residential Cleaning Services</p>
            <p className="mt-3 text-slate-600">
              Customized cleaning plans tailored to your home layout and family routine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {RESIDENTIAL_SERVICES.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <Home className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2.5 border-t border-slate-100 pt-6">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMMERCIAL SECTION ================= */}
      <section id="commercial" className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-lg border border-slate-200">
              <img
                src={COMMERCIAL_IMAGE}
                alt="Clean commercial office space"
                className="h-[380px] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600">Business & Facilities</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Commercial & Office Cleaning</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We also keep local offices, storefronts, and commercial facilities spotless. Flexible scheduled cleaning
              routines designed around your business operating hours.
            </p>

            <div className="mt-8 space-y-4">
              {COMMERCIAL_SERVICES.map((cService, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <Building2 className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{cService.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{cService.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= INSTANT ESTIMATOR SECTION ================= */}
      <section id="estimate" className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600">Transparent Pricing</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Calculate Your Service Quote</h2>
            <p className="mt-3 text-slate-600">No hidden fees. Customize your plan and see an estimate in real time.</p>
          </div>

          <PriceCalculator onOpenBooking={handleOpenBooking} />
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section id="reviews" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex justify-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Loved by Local Homeowners</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
                <Quote className="h-8 w-8 text-blue-100 absolute top-6 right-6" />
                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-8">
          <div>
            <span className="font-bold text-xl block mb-2">Pull Up & Clean</span>
            <p className="text-slate-400 text-sm leading-relaxed">
              Professional mobile residential and commercial cleaning services. Spotless results every time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm text-slate-200">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
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
          <div>
            <h4 className="font-semibold mb-3 text-sm text-slate-200">Contact Us</h4>
            <p className="text-sm text-slate-400 flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-blue-400" /> (555) 010-0199
            </p>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" /> info@pullupnclean.com
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-8 mt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Pull Up & Clean. All rights reserved.
        </div>
      </footer>
    </div>
  );
}