// src/components/CleaningAiFeatures.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Calculator,
  Building2,
  Droplets,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Plus,
  FlaskConical,
  Timer,
  ClipboardList,
  ClipboardCheck,
  TrendingUp,
  Layers,
  Trash2,
  Wind,
  Sparkles,
  Zap,
  RotateCcw,
  Loader2,
  Clock,
} from "lucide-react";

/* =============================================================================
   SHARED TYPES
============================================================================= */

type FacilityType = "office" | "medical" | "retail" | "industrial" | "education";
type Frequency = "daily" | "weekly" | "biweekly" | "monthly" | "onetime";

interface FacilityMeta {
  label: string;
  ratePerSqFt: number;
  scopeNote: string;
}

interface FrequencyMeta {
  label: string;
  visitsPerMonth: number;
  multiplier: number;
  isOneTime: boolean;
}

interface AddOnDef {
  id: string;
  label: string;
  description: string;
  flatFee: number;
  perSqFt: number;
  extraHours: number;
}

const FACILITIES: Record<FacilityType, FacilityMeta> = {
  office: {
    label: "Office",
    ratePerSqFt: 0.12,
    scopeNote: "workstations, break rooms, conference rooms, and common areas",
  },
  medical: {
    label: "Medical / Healthcare",
    ratePerSqFt: 0.19,
    scopeNote: "patient areas, exam rooms, and high-touch clinical surfaces (CDC-aligned protocols)",
  },
  retail: {
    label: "Retail",
    ratePerSqFt: 0.14,
    scopeNote: "sales floor, fitting rooms, entryways, and checkout zones",
  },
  industrial: {
    label: "Industrial / Warehouse",
    ratePerSqFt: 0.1,
    scopeNote: "warehouse floors, loading docks, and break areas",
  },
  education: {
    label: "Educational",
    ratePerSqFt: 0.13,
    scopeNote: "classrooms, hallways, cafeterias, and restrooms",
  },
};

const FREQUENCIES: Record<Frequency, FrequencyMeta> = {
  daily: { label: "Daily", visitsPerMonth: 22, multiplier: 0.85, isOneTime: false },
  weekly: { label: "Weekly", visitsPerMonth: 4, multiplier: 0.92, isOneTime: false },
  biweekly: { label: "Bi-Weekly", visitsPerMonth: 2, multiplier: 0.96, isOneTime: false },
  monthly: { label: "Monthly", visitsPerMonth: 1, multiplier: 1, isOneTime: false },
  onetime: { label: "One-Time", visitsPerMonth: 1, multiplier: 1.1, isOneTime: true },
};

const ADDONS: AddOnDef[] = [
  {
    id: "floorCare",
    label: "Floor Stripping & Waxing",
    description: "Strip, seal, and refinish hard-surface flooring",
    flatFee: 0,
    perSqFt: 0.05,
    extraHours: 0,
  },
  {
    id: "windows",
    label: "Interior Window Cleaning",
    description: "Interior glass, sills, and partitions cleaned streak-free",
    flatFee: 150,
    perSqFt: 0,
    extraHours: 1.5,
  },
  {
    id: "carpet",
    label: "Carpet Extraction",
    description: "Hot-water extraction for carpeted areas",
    flatFee: 0,
    perSqFt: 0.08,
    extraHours: 0,
  },
  {
    id: "restroom",
    label: "Restroom Sanitization Upgrade",
    description: "Hospital-grade disinfection of restroom fixtures",
    flatFee: 75,
    perSqFt: 0,
    extraHours: 0.5,
  },
  {
    id: "disinfection",
    label: "Electrostatic Disinfection Fogging",
    description: "Electrostatic application of EPA-registered disinfectant",
    flatFee: 0,
    perSqFt: 0.1,
    extraHours: 0,
  },
  {
    id: "trash",
    label: "Trash & Recycling Management",
    description: "Interior bin service plus dumpster-area upkeep",
    flatFee: 60,
    perSqFt: 0,
    extraHours: 0.25,
  },
];

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/* =============================================================================
   FEATURE 1 — AI INSTANT QUOTE & SCOPE ESTIMATOR
============================================================================= */

interface QuoteResult {
  perVisitTotal: number;
  monthlyTotal: number | null;
  crewSize: number;
  hoursPerVisit: number;
  scopeLines: string[];
  addonLines: string[];
}

function computeQuote(
  sqft: number,
  facilityType: FacilityType,
  frequency: Frequency,
  selectedAddons: Set<string>
): QuoteResult {
  const facility = FACILITIES[facilityType];
  const freq = FREQUENCIES[frequency];

  const basePerVisit = sqft * facility.ratePerSqFt;
  const activeAddons = ADDONS.filter((addon) => selectedAddons.has(addon.id));

  const addonsPerVisit = activeAddons.reduce(
    (sum, addon) => sum + addon.flatFee + addon.perSqFt * sqft,
    0
  );

  const perVisitTotal = Math.round((basePerVisit + addonsPerVisit) * freq.multiplier);
  const monthlyTotal = freq.isOneTime ? null : Math.round(perVisitTotal * freq.visitsPerMonth);

  const baseHours = sqft / 2500;
  const addonHours = activeAddons.reduce((sum, addon) => {
    const sqftHours = addon.perSqFt > 0 ? sqft / (addon.id === "floorCare" ? 1200 : 1500) : 0;
    return sum + addon.extraHours + sqftHours;
  }, 0);
  const totalHours = Math.max(1, baseHours + addonHours);
  const crewSize = Math.max(1, Math.ceil(totalHours / 3));
  const hoursPerVisit = Math.round((totalHours / crewSize) * 4) / 4;

  const scopeLines = [
    `${freq.label} cleaning of ${sqft.toLocaleString()} sq ft covering ${facility.scopeNote}`,
    `Estimated crew: ${crewSize} cleaner${crewSize > 1 ? "s" : ""}, approx. ${hoursPerVisit} hrs per visit`,
  ];

  const addonLines = activeAddons.map((addon) => addon.description);

  return { perVisitTotal, monthlyTotal, crewSize, hoursPerVisit, scopeLines, addonLines };
}

export function AiQuoteEstimator() {
  const [sqft, setSqft] = useState<number>(5000);
  const [facilityType, setFacilityType] = useState<FacilityType>("office");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set(["trash"]));

  const quote = useMemo(
    () => computeQuote(sqft, facilityType, frequency, selectedAddons),
    [sqft, facilityType, frequency, selectedAddons]
  );

  function toggleAddon(id: string) {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Calculator className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-100">
            <Sparkles className="h-3 w-3" /> AI-Powered
          </p>
          <h3 className="font-semibold text-white">Instant Quote &amp; Scope Estimator</h3>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label htmlFor="sqft-input" className="mb-1.5 block text-sm font-medium text-slate-700">
              Square footage
            </label>
            <div className="flex items-center gap-3">
              <input
                id="sqft-input"
                type="range"
                min={500}
                max={100000}
                step={500}
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="h-2 w-full accent-indigo-600"
              />
              <span className="w-24 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-right font-mono text-sm text-slate-700">
                {sqft.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="facility-select" className="mb-1.5 block text-sm font-medium text-slate-700">
              Facility type
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                id="facility-select"
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value as FacilityType)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
              >
                {(Object.keys(FACILITIES) as FacilityType[]).map((key) => (
                  <option key={key} value={key}>
                    {FACILITIES[key].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Cleaning frequency</span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FREQUENCIES) as Frequency[]).map((key) => {
                const active = key === frequency;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFrequency(key)}
                    className={`rounded-lg border-2 px-2 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-indigo-200"
                    }`}
                  >
                    {FREQUENCIES[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Add-on services</span>
            <div className="space-y-2">
              {ADDONS.map((addon) => {
                const checked = selectedAddons.has(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      checked ? "border-indigo-300 bg-indigo-50/60" : "border-slate-200 hover:border-indigo-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(addon.id)}
                      className="mt-0.5 h-4 w-4 accent-indigo-600"
                    />
                    <span>
                      <span className="block font-medium text-slate-800">{addon.label}</span>
                      <span className="block text-xs text-slate-500">{addon.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl bg-slate-900 p-5 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Estimated price</p>
          <div className="mt-1 flex items-end gap-2">
            <span className="font-mono text-4xl font-bold">{formatCurrency(quote.perVisitTotal)}</span>
            <span className="mb-1 text-sm text-slate-400">/ visit</span>
          </div>
          {quote.monthlyTotal !== null && (
            <p className="mt-1 text-sm text-slate-400">
              &asymp; {formatCurrency(quote.monthlyTotal)} / month
            </p>
          )}

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <ClipboardList className="h-3.5 w-3.5" /> Scope of work
            </p>
            <ul className="space-y-1.5 text-sm text-slate-200">
              {quote.scopeLines.map((line) => (
                <li key={line} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{line}</span>
                </li>
              ))}
              {quote.addonLines.map((line) => (
                <li key={line} className="flex gap-2">
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-500">
            <TrendingUp className="h-3.5 w-3.5" />
            Recurring contracts lock in the frequency discount shown above.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   FEATURE 2 — SMART STAIN & SURFACE DIAGNOSTIC AI
============================================================================= */

type SurfaceType =
  | "carpet"
  | "hardwood"
  | "tile-grout"
  | "stainless-steel"
  | "upholstery"
  | "concrete"
  | "laminate";

type StainCategory =
  | "coffee-tea"
  | "ink"
  | "blood-protein"
  | "grease-oil"
  | "rust"
  | "mold-mildew"
  | "gum-wax"
  | "wine-juice"
  | "unknown";

interface StainProfile {
  label: string;
  chemical: string;
  method: string;
  ppe: string[];
  warnings: string[];
  baseMinutes: number;
  urgency: "low" | "medium" | "high";
}

interface SurfaceAdjustment {
  label: string;
  note: string;
  multiplier: number;
}

const SURFACE_OPTIONS: Record<SurfaceType, SurfaceAdjustment> = {
  carpet: {
    label: "Carpet",
    note: "Extract with a hot-water extraction unit set to a manufacturer-safe temperature, then groom the pile in one direction.",
    multiplier: 1.2,
  },
  hardwood: {
    label: "Hardwood",
    note: "Use minimal moisture and a pH-neutral, wood-safe solution to protect the finish.",
    multiplier: 1.0,
  },
  "tile-grout": {
    label: "Tile & Grout",
    note: "Agitate grout lines with a stiff nylon brush; a grout sealer touch-up may be needed afterward.",
    multiplier: 1.3,
  },
  "stainless-steel": {
    label: "Stainless Steel",
    note: "Wipe with the grain of the brushed finish to avoid visible scratching.",
    multiplier: 0.8,
  },
  upholstery: {
    label: "Upholstery",
    note: "Pre-test on a hidden seam and use light pressure — over-wetting fabric can cause rings.",
    multiplier: 1.15,
  },
  concrete: {
    label: "Concrete",
    note: "Concrete is porous — expect a longer dwell time and consider a sealant reapplication if staining recurs.",
    multiplier: 1.4,
  },
  laminate: {
    label: "Laminate",
    note: "Avoid soaking seams; wipe promptly and dry to prevent moisture damage.",
    multiplier: 0.9,
  },
};

const STAIN_PROFILES: Record<StainCategory, StainProfile> = {
  "coffee-tea": {
    label: "Coffee / Tea",
    chemical: "Enzyme-based pre-treatment followed by a mild alkaline detergent",
    method: "Blot from the outside in, apply the pre-treatment, agitate gently, then extract or wipe clean.",
    ppe: ["Nitrile gloves"],
    warnings: ["Avoid hot water on tannin stains — heat can set the stain instead of lifting it."],
    baseMinutes: 15,
    urgency: "low",
  },
  ink: {
    label: "Ink",
    chemical: "70% isopropyl alcohol or a dedicated solvent-based ink remover",
    method: "Blot repeatedly with an alcohol-dampened cloth, working inward. Never rub outward from the edge.",
    ppe: ["Nitrile gloves", "Ventilated area"],
    warnings: ["Test in an inconspicuous area first — solvents can affect some dyes and finishes."],
    baseMinutes: 20,
    urgency: "medium",
  },
  "blood-protein": {
    label: "Blood / Protein-Based",
    chemical: "Cold-water, enzymatic protein-digesting cleaner",
    method: "Flush with cold water first, apply the enzymatic cleaner, allow it to dwell, then blot clean.",
    ppe: ["Nitrile gloves", "Eye protection"],
    warnings: [
      "Never use hot water — it cooks the protein and can set the stain permanently.",
      "Follow your facility's bloodborne pathogen handling procedure if applicable.",
    ],
    baseMinutes: 25,
    urgency: "high",
  },
  "grease-oil": {
    label: "Grease / Oil",
    chemical: "Citrus-based degreaser, after an absorbent powder pre-treatment",
    method: "Absorb excess with cornstarch or baking soda, apply the degreaser, agitate, then rinse or extract.",
    ppe: ["Nitrile gloves", "Ventilated area"],
    warnings: ["Degreased hard floors can be slippery — cordon the area off until fully dry."],
    baseMinutes: 20,
    urgency: "medium",
  },
  rust: {
    label: "Rust",
    chemical: "Oxalic-acid-based, surface-safe rust remover",
    method: "Apply directly, allow the labeled dwell time, agitate with a soft brush, then rinse thoroughly.",
    ppe: ["Nitrile gloves", "Eye protection", "Ventilated area"],
    warnings: [
      "Never mix with chlorine bleach — the combination can release hazardous fumes.",
      "Rinse completely; leftover residue can damage some finishes over time.",
    ],
    baseMinutes: 30,
    urgency: "medium",
  },
  "mold-mildew": {
    label: "Mold / Mildew",
    chemical: "EPA-registered mold and mildew disinfectant cleaner",
    method: "Apply, allow the full label contact time, scrub, then HEPA-vacuum or wipe the area dry.",
    ppe: ["N95 respirator or better", "Nitrile gloves", "Eye protection", "Ventilated area"],
    warnings: [
      "Never mix bleach-based products with ammonia-based cleaners.",
      "If the affected area is larger than roughly 10 sq ft, recommend a specialized remediation assessment.",
    ],
    baseMinutes: 35,
    urgency: "high",
  },
  "gum-wax": {
    label: "Gum / Wax",
    chemical: "Freezing agent (ice pack or aerosol freeze spray)",
    method: "Harden the deposit with cold, gently lift it with a plastic scraper, then spot-clean residue with a citrus solvent.",
    ppe: ["Nitrile gloves"],
    warnings: ["Avoid metal scrapers on finished or soft surfaces — they can scratch."],
    baseMinutes: 15,
    urgency: "low",
  },
  "wine-juice": {
    label: "Wine / Juice",
    chemical: "Oxygenated (peroxide-based) stain remover with a mild detergent",
    method: "Blot excess liquid, apply the oxygenated cleaner, let it dwell briefly, then blot and rinse.",
    ppe: ["Nitrile gloves"],
    warnings: ["Avoid bleach on colored fabrics or materials — check colorfastness first."],
    baseMinutes: 18,
    urgency: "low",
  },
  unknown: {
    label: "Unidentified / Other",
    chemical: "pH-neutral general-purpose cleaner as a first, safe pass",
    method: "Test a small area, blot rather than rub, and reassess before applying a stronger treatment.",
    ppe: ["Nitrile gloves"],
    warnings: ["Unidentified stains should always be spot-tested in an inconspicuous area first."],
    baseMinutes: 20,
    urgency: "low",
  },
};

const KEYWORD_MAP: Array<{ pattern: RegExp; category: StainCategory }> = [
  { pattern: /coffee|tea|tannin/i, category: "coffee-tea" },
  { pattern: /ink|pen|marker/i, category: "ink" },
  { pattern: /blood/i, category: "blood-protein" },
  { pattern: /grease|oil|food/i, category: "grease-oil" },
  { pattern: /rust/i, category: "rust" },
  { pattern: /mold|mildew|musty/i, category: "mold-mildew" },
  { pattern: /gum|wax|candle/i, category: "gum-wax" },
  { pattern: /wine|juice|soda/i, category: "wine-juice" },
];

interface Diagnosis {
  chemical: string;
  method: string;
  ppe: string[];
  warnings: string[];
  estimatedMinutes: number;
  urgency: "low" | "medium" | "high";
}

function getDiagnosis(surface: SurfaceType, category: StainCategory): Diagnosis {
  const profile = STAIN_PROFILES[category];
  const adjustment = SURFACE_OPTIONS[surface];
  return {
    chemical: profile.chemical,
    method: `${profile.method} ${adjustment.note}`,
    ppe: profile.ppe,
    warnings: profile.warnings,
    estimatedMinutes: Math.round(profile.baseMinutes * adjustment.multiplier),
    urgency: profile.urgency,
  };
}

const URGENCY_STYLES: Record<Diagnosis["urgency"], { label: string; classes: string }> = {
  low: { label: "Low urgency", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { label: "Medium urgency", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  high: { label: "High urgency", classes: "bg-rose-50 text-rose-700 border-rose-200" },
};

export function StainDiagnosticAI() {
  const [surface, setSurface] = useState<SurfaceType>("carpet");
  const [category, setCategory] = useState<StainCategory>("coffee-tea");
  const [description, setDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  useEffect(() => {
    const match = KEYWORD_MAP.find((entry) => entry.pattern.test(description));
    if (match) setCategory(match.category);
  }, [description]);

  function runDiagnostic() {
    setIsAnalyzing(true);
    setDiagnosis(null);
    window.setTimeout(() => {
      setDiagnosis(getDiagnosis(surface, category));
      setIsAnalyzing(false);
    }, 700);
  }

  const urgencyStyle = diagnosis ? URGENCY_STYLES[diagnosis.urgency] : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <FlaskConical className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-100">
            <Sparkles className="h-3 w-3" /> AI-Powered
          </p>
          <h3 className="font-semibold text-white">Smart Stain &amp; Surface Diagnostic</h3>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <label htmlFor="surface-select" className="mb-1.5 block text-sm font-medium text-slate-700">
            Surface type
          </label>
          <select
            id="surface-select"
            value={surface}
            onChange={(e) => setSurface(e.target.value as SurfaceType)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-violet-400 focus:outline-none"
          >
            {(Object.keys(SURFACE_OPTIONS) as SurfaceType[]).map((key) => (
              <option key={key} value={key}>
                {SURFACE_OPTIONS[key].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="stain-select" className="mb-1.5 block text-sm font-medium text-slate-700">
            Stain / symptom category
          </label>
          <select
            id="stain-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as StainCategory)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-violet-400 focus:outline-none"
          >
            {(Object.keys(STAIN_PROFILES) as StainCategory[]).map((key) => (
              <option key={key} value={key}>
                {STAIN_PROFILES[key].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description-input" className="mb-1.5 block text-sm font-medium text-slate-700">
            Describe what you see <span className="font-normal text-slate-400">(optional — auto-detects category)</span>
          </label>
          <input
            id="description-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. dark ring near the breakroom coffee station"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-violet-400 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={runDiagnostic}
          disabled={isAnalyzing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing surface data&hellip;
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" /> Run Diagnostic
            </>
          )}
        </button>

        {diagnosis && urgencyStyle && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${urgencyStyle.classes}`}>
                {urgencyStyle.label}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <Timer className="h-4 w-4 text-slate-400" />
                ~{diagnosis.estimatedMinutes} min
              </span>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FlaskConical className="h-3.5 w-3.5" /> Recommended treatment
              </p>
              <p className="text-sm text-slate-700">{diagnosis.chemical}</p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Method</p>
              <p className="text-sm text-slate-700">{diagnosis.method}</p>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5" /> Safety protocol
              </p>
              <div className="flex flex-wrap gap-1.5">
                {diagnosis.ppe.map((item) => (
                  <span key={item} className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600 border border-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {diagnosis.warnings.map((warning) => (
                <div key={warning} className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span className="text-xs text-amber-800">{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =============================================================================
   FEATURE 3 — AUTOMATED QUALITY AUDIT & INSPECTION ASSISTANT
============================================================================= */

interface AuditCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AUDIT_CATEGORIES: AuditCategory[] = [
  { id: "floors", label: "Floors & Surfaces", icon: Layers },
  { id: "restrooms", label: "Restrooms & Sanitation", icon: Droplets },
  { id: "trash", label: "Trash & Recycling", icon: Trash2 },
  { id: "glass", label: "Windows & Glass", icon: Sparkles },
  { id: "highTouch", label: "Dusting & High-Touch Points", icon: ShieldCheck },
  { id: "odor", label: "Odor & Air Quality", icon: Wind },
  { id: "compliance", label: "Safety & Compliance Signage", icon: ShieldAlert },
];

type ScoreMap = Record<string, number>;

function getComplianceStatus(percent: number): { label: string; classes: string } {
  if (percent >= 90) return { label: "Excellent", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (percent >= 75) return { label: "Good", classes: "bg-blue-50 text-blue-700 border-blue-200" };
  if (percent >= 60) return { label: "Needs Improvement", classes: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Critical", classes: "bg-rose-50 text-rose-700 border-rose-200" };
}

const INSPECTION_TIMES = ["9:00 AM", "1:00 PM", "4:00 PM"];

function buildInspectionDays(count: number): { label: string; dateLabel: string }[] {
  const days: { label: string; dateLabel: string }[] = [];
  const today = new Date();
  let added = 0;
  let offset = 1;
  while (added < count) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    offset += 1;
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    if (!isWeekend) {
      days.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateLabel: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
      added += 1;
    }
  }
  return days;
}

export function QualityAuditAssistant() {
  const [facilityName, setFacilityName] = useState<string>("");
  const [scores, setScores] = useState<ScoreMap>(() =>
    AUDIT_CATEGORIES.reduce<ScoreMap>((acc, cat) => {
      acc[cat.id] = 4;
      return acc;
    }, {})
  );
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  const [inspectionDays] = useState(() => buildInspectionDays(5));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [inspectionId, setInspectionId] = useState<string | null>(null);

  const overallPercent = useMemo(() => {
    const values = Object.values(scores);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    return Math.round((avg / 5) * 100);
  }, [scores]);

  const status = getComplianceStatus(overallPercent);

  const flaggedItems = useMemo(
    () => AUDIT_CATEGORIES.filter((cat) => scores[cat.id] <= 2),
    [scores]
  );

  function setScore(id: string, value: number) {
    setScores((prev) => ({ ...prev, [id]: value }));
    setReportGenerated(false);
  }

  function generateReport() {
    setReportGenerated(true);
  }

  function resetAudit() {
    setScores(
      AUDIT_CATEGORIES.reduce<ScoreMap>((acc, cat) => {
        acc[cat.id] = 4;
        return acc;
      }, {})
    );
    setFacilityName("");
    setReportGenerated(false);
  }

  function scheduleInspection() {
    if (selectedDay === null || !selectedTime) return;
    setIsScheduling(true);
    window.setTimeout(() => {
      setInspectionId(
        "AUD-" + Math.random().toString(36).slice(2, 7).toUpperCase()
      );
      setIsScheduling(false);
    }, 700);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <ClipboardCheck className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-100">
            <Sparkles className="h-3 w-3" /> AI-Powered
          </p>
          <h3 className="font-semibold text-white">Quality Audit &amp; Inspection Assistant</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="facility-name-input" className="mb-1.5 block text-sm font-medium text-slate-700">
            Facility name <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="facility-name-input"
            type="text"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            placeholder="e.g. Riverside Medical Plaza"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div className="space-y-3">
          {AUDIT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const value = scores[cat.id];
            return (
              <div key={cat.id} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
                  <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">{cat.label}</span>
                </span>
                <div className="flex shrink-0 gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`Score ${cat.label} as ${n} out of 5`}
                      onClick={() => setScore(cat.id, n)}
                      className={`h-6 w-6 rounded-md border text-[11px] font-semibold transition-colors ${
                        n <= value
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-slate-200 text-slate-400 hover:border-blue-300"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compliance score</p>
              <p className="font-mono text-3xl font-bold text-slate-900">{overallPercent}%</p>
            </div>
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${status.classes}`}>
              {status.label}
            </span>
          </div>

          {flaggedItems.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {flaggedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                  <span className="text-xs text-rose-700">{item.label} requires immediate attention</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={generateReport}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <ClipboardList className="h-4 w-4" /> Generate Report
            </button>
            <button
              type="button"
              onClick={resetAudit}
              aria-label="Reset audit"
              className="flex items-center justify-center rounded-lg border border-slate-200 px-3 text-slate-500 hover:bg-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {reportGenerated && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Report ready{facilityName ? ` for ${facilityName}` : ""} &mdash; generated {new Date().toLocaleDateString()}
              </p>
              <p className="mt-1">
                Overall score {overallPercent}% ({status.label}). {flaggedItems.length} item
                {flaggedItems.length === 1 ? "" : "s"} flagged for follow-up.
              </p>
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                Export report (PDF)
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-5">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" /> Book an on-site inspection
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {inspectionDays.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedDay(idx);
                  setInspectionId(null);
                }}
                className={`flex shrink-0 flex-col items-center rounded-lg border-2 px-3 py-2 text-xs font-mono transition-colors ${
                  selectedDay === idx ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-200"
                }`}
              >
                <span className="font-semibold">{day.label}</span>
                <span>{day.dateLabel}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {INSPECTION_TIMES.map((time) => (
              <button
                key={time}
                type="button"
                disabled={selectedDay === null}
                onClick={() => {
                  setSelectedTime(time);
                  setInspectionId(null);
                }}
                className={`rounded-lg border-2 py-2 text-xs font-mono transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  selectedTime === time ? "border-blue-500 bg-blue-500 text-white" : "border-slate-200 hover:border-blue-200"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={scheduleInspection}
            disabled={selectedDay === null || !selectedTime || isScheduling}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isScheduling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Scheduling&hellip;
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" /> Schedule Inspection
              </>
            )}
          </button>

          {inspectionId && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Inspection {inspectionId} confirmed for {inspectionDays[selectedDay!].label}{" "}
              {inspectionDays[selectedDay!].dateLabel} at {selectedTime}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}