import {
  Star,
  Check,
} from "lucide-react";
import type { IndustryConfig, Testimonial } from "../config/types";
import { lightSurface, defaultFonts } from "../config/theme";

/** Renders a single review card with stars + a Google/Yelp platform badge. */
function PlatformBadge({ platform }: { platform?: "google" | "yelp" }) {
  if (platform === "yelp") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FF1A1A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        Yelp
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700 shadow-sm">
      <span className="flex items-center">
        <span className="font-bold text-[#4285F4]">G</span>
        <span className="font-bold text-[#EA4335]">o</span>
        <span className="font-bold text-[#FBBC05]">o</span>
        <span className="font-bold text-[#4285F4]">g</span>
        <span className="font-bold text-[#34A853]">l</span>
        <span className="font-bold text-[#EA4335]">e</span>
      </span>
    </span>
  );
}

function Stars({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-0.5 ${className ?? ""}`}
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count ? "fill-gold text-gold" : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  item,
  defaultRating,
  S,
  F,
}: {
  item: Testimonial;
  defaultRating: number;
  S: typeof lightSurface;
  F: typeof defaultFonts;
}) {
  const stars = item.stars ?? defaultRating;
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border ${S.cardBorder} ${S.cardBg} p-6 shadow-sm transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${S.cardHover}`}>
      <div className="flex items-center justify-between">
        <Stars count={Math.min(5, Math.max(1, stars))} />
        <PlatformBadge platform={item.platform} />
      </div>
      <p className={`flex-1 text-sm leading-relaxed ${S.textMuted}`}>
        "{item.quote}"
      </p>
      <div className={`border-t ${S.borderSubtle} pt-4`}>
        <p className={`text-sm font-bold ${F.heading} ${S.textPrimary}`}>{item.name}</p>
        <p className={`text-xs ${S.textSubtle}`}>{item.role}</p>
      </div>
    </div>
  );
}

/**
 * Responsive "Google & Yelp Testimonials" section.
 * Content is fully config-driven (config.testimonials + config.sections.reviews).
 */
export default function Testimonials({ config }: { config: IndustryConfig }) {
  const { rating, items } = config.testimonials;
  const heading = config.sections.reviews;
  const S = config.surface ?? lightSurface;
  const F = config.fonts ?? defaultFonts;

  return (
    <section
      id="reviews"
      className={`border-t ${S.cardBorder} ${S.surfaceBg} py-20`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-3 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-gold text-gold"
              />
            ))}
          </div>
          <h2 className={`text-3xl font-bold ${F.heading} ${S.textPrimary}`}>{heading.title}</h2>
          {heading.description && (
            <p className={`mt-3 ${S.textMuted}`}>{heading.description}</p>
          )}
          <p className={`mt-3 inline-flex items-center gap-1.5 rounded-full ${S.cardBg} px-3 py-1 text-xs font-semibold ${S.textMuted} shadow-sm`}>
            <Check className="h-3.5 w-3.5 text-royal" />
            Rated {rating}.0 on Google &amp; Yelp
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <ReviewCard key={idx} item={item} defaultRating={rating} S={S} F={F} />
          ))}
        </div>
      </div>
    </section>
  );
}
