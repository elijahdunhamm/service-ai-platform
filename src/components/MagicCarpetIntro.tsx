// src/components/MagicCarpetIntro.tsx
//
// Optional page-load intro animation for tenants that opt in via the
// `IndustryConfig.intro` field (default-OFF). It shows the brand genie flying
// across the screen riding a magic carpet that is drawn entirely as inline SVG
// in the tenant's theme colors (purple/magenta for I Dream of Cleaning).
//
// Behaviour:
//  - Acts as a brief, decorative full-screen overlay on FIRST page load only
//    (module-level guard so SPA route changes never replay it).
//  - pointer-events: none on every layer -> the overlay never blocks scrolling,
//    clicking, or the booking chat. It is purely cosmetic.
//  - Auto-hides after `durationMs` (default ~2600ms) and unmounts itself.
//  - Respects `prefers-reduced-motion`: such users get no overlay at all and
//    jump straight to the page content.
//  - All animation is CSS keyframe-driven (see src/index.css) — no JS animation
//    library, no extra dependency.
import { useEffect, useState } from "react";
import type { IndustryConfig } from "../config/types";

// Play at most once per page load. A genuine full browser reload resets this
// module, so the intro naturally reappears on the next fresh load.
let introPlayed = false;

export default function MagicCarpetIntro({ config }: { config: IndustryConfig }) {
  const intro = config.intro;
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const duration = intro?.durationMs ?? 2600;

  // Resolve which genie image flies across the screen (config-driven only).
  const genie =
    (intro?.images && intro.images[0]) ||
    (config.genieImages && config.genieImages[0]) ||
    config.brand.logo;

  useEffect(() => {
    // Reduced-motion users: no animation, immediate content.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      introPlayed = true;
      setMounted(false);
      return;
    }
    // Otherwise fly for `duration`, fade out, then unmount.
    const doneTimer = setTimeout(() => setExiting(true), duration);
    const unmountTimer = setTimeout(() => {
      introPlayed = true;
      setMounted(false);
    }, duration + 650); // 650ms matches the overlay fade-out transition
    return () => {
      clearTimeout(doneTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration]);

  if (!intro?.enabled || introPlayed || !mounted) return null;

  const c = intro.colors;

  return (
    <div
      className={`intro-overlay${exiting ? " intro-overlay--exit" : ""}`}
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle at 50% 40%, ${c.glow}, rgba(255,255,255,0) 55%)`,
      }}
    >
      <div
        className="intro-rider"
        style={{ animationDuration: `${duration}ms` }}
      >
        {/* Soft glow disc + trailing sparkles behind the flying genie */}
        <div
          className="intro-rider__glow"
          style={{ background: `radial-gradient(circle, ${c.glow}, rgba(255,255,255,0) 70%)` }}
        />
        <img
          className="intro-rider__genie"
          src={genie}
          alt=""
          draggable={false}
        />
        {/* Magic carpet — inline SVG, themed entirely by config colors */}
        <svg
          className="intro-rider__carpet"
          viewBox="0 0 320 104"
          role="presentation"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="carpetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.primary} />
              <stop offset="45%" stopColor={c.accent} stopOpacity="0.85" />
              <stop offset="100%" stopColor={c.primary} />
            </linearGradient>
          </defs>
          {/* Carpet body — rounded loom with gently angled ends */}
          <path
            d="M36 52 C62 30 112 26 160 26 C208 26 258 30 284 52 C258 74 208 78 160 78 C112 78 62 74 36 52 Z"
            fill="url(#carpetGrad)"
            stroke={c.highlight}
            strokeWidth="2.5"
          />
          {/* Inner loom lines (magenta stitching) */}
          <path
            d="M56 52 C86 40 234 40 264 52"
            fill="none"
            stroke={c.highlight}
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M52 62 C86 70 234 70 268 62"
            fill="none"
            stroke={c.accent}
            strokeWidth="2"
            opacity="0.6"
          />
          {/* Left tassels */}
          <g stroke={c.accent} strokeWidth="3" strokeLinecap="round">
            <path d="M28 56 L10 46" />
            <path d="M30 48 L12 34" />
            <path d="M34 42 L18 24" />
            <path d="M36 64 L20 74" />
            <path d="M30 60 L14 66" />
          </g>
          {/* Right tassels */}
          <g stroke={c.accent} strokeWidth="3" strokeLinecap="round">
            <path d="M292 56 L310 46" />
            <path d="M290 48 L308 34" />
            <path d="M286 42 L302 24" />
            <path d="M284 64 L300 74" />
            <path d="M290 60 L306 66" />
          </g>
        </svg>
      </div>
    </div>
  );
}
