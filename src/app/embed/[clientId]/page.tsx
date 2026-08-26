// src/app/embed/[clientId]/page.tsx
// Phase 2 — Embed Router Engine.
//
// Renders ONLY the interactive widgets of an industry site — the Price
// Estimator and the Booking Modal — with a transparent container so the whole
// thing drops cleanly into a host page's <iframe>. No navbar, hero,
// testimonials, or footer: this is the "estimate & book" surface meant for
// third-party / partner embeds (e.g. a property portal embedding the widget).
//
// The [clientId] path segment resolves to a registered industry preset
// (cleaning / hvac), falling back to the default preset for unknown ids.
//
// One-line test snippet — paste into any HTML page (clientId = "cleaning"):
// <iframe src="/embed/cleaning" title="Estimate & Book" style="border:0;width:100%;min-height:640px;background:transparent" loading="lazy"></iframe>

import { PRESETS, DEFAULT_PRESET_ID } from "../../../config/presets";
import type { IndustryConfig } from "../../../config/types";
import { EmbedClient } from "./embed-client";

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  // Resolve the tenant's industry preset from the URL segment; default fallback.
  const config: IndustryConfig = PRESETS[clientId] ?? PRESETS[DEFAULT_PRESET_ID];

  return (
    <main
      data-embed-root
      className="min-h-screen w-full bg-transparent p-0 m-0 font-sans"
    >
      <EmbedClient config={config} />
    </main>
  );
}
