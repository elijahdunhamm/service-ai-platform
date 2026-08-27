import { useState } from "react";

/**
 * Config-driven brand logo with a consistent rounded treatment.
 *
 * The logo source is always pulled from the tenant preset (`config.brand.logo`),
 * never hardcoded. If the asset fails to load or is not configured yet, the
 * element hides itself gracefully (mirrors the previous inline `onError`
 * behavior, but state-driven so it survives re-renders).
 */
interface BrandLogoProps {
  /** Logo asset path from tenant config (`config.brand.logo`). */
  src?: string;
  alt: string;
  /** Sizing classes only (e.g. "h-10 w-auto") — rounding is applied here. */
  className?: string;
}

export default function BrandLogo({
  src,
  alt,
  className = "h-10 w-auto",
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      // rounded-2xl gives a square-ish logo a soft, consistent rounded crop
      // across header, footer, and admin branding.
      className={`rounded-2xl object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  );
}