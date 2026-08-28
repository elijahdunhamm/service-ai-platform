// src/config/theme.ts
// Light-theme surface + font defaults for the shared layout. These reproduce the
// original hardcoded light surfaces verbatim so any preset that omits `surface`
// / `fonts` renders exactly as it did before the theming refactor. Dark / luxury
// tenants override these in their preset with fully-written Tailwind class
// strings.
import type { ThemeSurface, ThemeFonts } from "./types";

export const lightSurface: ThemeSurface = {
  surfaceBg: "bg-slate-50",
  cardBg: "bg-white",
  cardBorder: "border-slate-200",
  borderSubtle: "border-slate-100",
  textPrimary: "text-slate-900",
  textSecondary: "text-slate-700",
  textMuted: "text-slate-600",
  textSubtle: "text-slate-500",
  textFaint: "text-slate-400",
  headerBg: "bg-white/95",
  headerBorder: "border-slate-200",
  navHoverBg: "hover:bg-slate-100",
  mobileNavBg: "bg-white",
  mobileNavBorder: "border-slate-200",
  mobileNavText: "text-slate-700",
  heroBg: "bg-white",
  secondaryButton:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  imageFrameBg: "bg-slate-100",
  imageFrameBorder: "border-slate-200",
  residentialOverlay: "bg-gradient-to-b from-white/85 via-white/70 to-white/85",
  sectionAltBg: "bg-slate-100",
  mutedBg: "bg-slate-50",
  mutedBorder: "border-slate-100",
  inputBg: "bg-slate-50",
  inputBorder: "border-slate-200",
  selectBg: "bg-white",
  selectText: "text-slate-800",
  stepBg: "bg-slate-100",
  stepHoverBg: "hover:bg-slate-200",
  stepText: "text-slate-800",
  takenBg: "bg-slate-100",
  takenBorder: "border-slate-200",
  takenText: "text-slate-400",
  slotBg: "bg-white",
  slotText: "text-slate-700",
  optionBorder: "border-slate-200",
  optionText: "text-slate-700",
  optionHoverBg: "hover:bg-slate-50",
  uploadBorder: "border-slate-300",
  uploadHoverBorder: "hover:border-royal",
  successBadge: "bg-green-100 text-green-600",
  closeButton: "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
  cardHover: "hover:shadow-md",
  heroOverlay:
    "bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40",
  statementOverlay: "bg-slate-900/85",
};

export const defaultFonts: ThemeFonts = {
  heading: "font-sans",
  body: "font-sans",
};
