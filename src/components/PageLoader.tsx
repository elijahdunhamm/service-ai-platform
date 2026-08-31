// src/components/PageLoader.tsx
//
// Full-screen page loader / splash shown on app mount before the site content
// becomes interactive. Renders the tenant's brand logo (e.g. the transparent
// genie logo for I Dream of Cleaning) centered on a brand-tinted background
// with a soft glow, gentle pulse and a shimmer loading bar — like a polished
// dashboard/splash loader. Fully config-driven via `IndustryConfig.loader`
// (default-OFF so other tenants are unaffected).
//
// Behaviour:
//  - Fixed full-screen overlay, high z-index (above everything).
//  - Shows for ~2.5s (`config.loader.durationMs`), then unmounts itself via
//    setState so it never blocks the rest of the app.
//  - Calls the optional `onDone` callback at unmount so the parent layout can
//    sequence the next overlay (e.g. the MagicCarpetIntro) after us.
//  - Respects `prefers-reduced-motion`: those users get a brief static logo
//    (no animation) before content renders.
//  - Plays at most once per page load (module-level guard), like the intro.
import { useEffect, useState } from "react";
import type { IndustryConfig } from "../config/types";

// Play at most once per page load. A genuine full browser reload resets this
// module so the splash naturally reappears on the next fresh load.
let loaderPlayed = false;

export default function PageLoader({
  config,
  onDone,
}: {
  config: IndustryConfig;
  onDone?: () => void;
}) {
  const loader = config.loader;
  const [show, setShow] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!loader?.enabled || loaderPlayed) {
      setShow(false);
      return;
    }
    // Reduced-motion users: no animation — just a brief static logo (or, even
    // safer, skip straight to content) so nothing flashes at them.
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);

    const duration = isReduced
      ? 400 // brief static logo only
      : (loader.durationMs ?? 2500);

    const doneTimer = setTimeout(() => {
      loaderPlayed = true;
      setShow(false);
      onDone?.();
    }, duration + (isReduced ? 0 : 350)); // +350ms lets the fade-out play

    return () => clearTimeout(doneTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader?.enabled, loader?.durationMs]);

  // Nothing to show (disabled / already played this page load).
  if (!loader?.enabled || loaderPlayed || !show) return null;

  const logo =
    loader.logo || (config.genieImages && config.genieImages[0]) || config.brand.logo;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`page-loader${reduced ? " page-loader--static" : ""}`}
      style={{ background: loader.background ?? "#12051f" }}
    >
      <div
        className="page-loader__glow"
        style={{
          background: `radial-gradient(circle, ${loader.glow ?? "rgba(178, 52, 235, 0.55)"}, rgba(255,255,255,0) 65%)`,
        }}
      />
      <div className="page-loader__logo">
        <img src={logo} alt="" className="page-loader__img" draggable={false} />
      </div>
      {loader.tagline && <p className="page-loader__tagline">{loader.tagline}</p>}
      <div className="page-loader__bar" aria-hidden="true">
        <span className="page-loader__bar-fill" />
      </div>
    </div>
  );
}
