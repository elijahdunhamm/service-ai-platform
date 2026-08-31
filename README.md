# service-ai-platform (pullupnclean)

A Vite + React 19 + Tailwind multi-tenant site. Each tenant (industry) is
described by a single **preset** — a plain-data object that fully defines the
site's content, pricing math, services, booking rules, and Tailwind theme. The
layout renders entirely from whatever preset is passed to it; no content is
hardcoded in the UI.

## Architecture

```
src/
  config/
    types.ts                  # strict IndustryConfig contract
    presets/
      cleaning.ts             # "Pull Up & Clean" (default tenant)
      landscaping.ts          # example second tenant (proves multi-tenant)
      index.ts                # PRESETS registry + defaultPreset
  components/
    CleaningLayout.tsx        # config-driven layout (accepts an IndustryConfig)
  App.tsx                     # renders <CleaningLayout config={cleaningPreset} />
```

### Adding a tenant

Create `src/config/presets/<slug>.ts` exporting an `IndustryConfig`, then
register it in `src/config/presets/index.ts`. Point `App.tsx` at
`<CleaningLayout config={myPreset} />` (or look it up from `PRESETS` by id).

### Theming nuance

Tailwind's JIT only emits classes it finds literally in source, so a preset
cannot build class names like `bg-${color}-600` at runtime. Instead,
`ThemeColors` carries **fully-written utility class strings** (e.g.
`primaryBg: "bg-blue-600"`). Because the preset lives in `src/**`, Tailwind
scans and generates them. Change a color family by editing a preset's theme
strings — never by composing classes dynamically.

## Managing site images (config-driven)

All site images are referenced from the config **presets** — never hardcoded in
components. Each image lives in one of two places:

- a local file under `public/images/...` (e.g. `/images/LOGO.PNG`), served
  directly by Vite, or
- a hosted URL (e.g. an Unsplash `https://images.unsplash.com/...` address).

The relevant config fields (in `src/config/types.ts`, set per preset) are:

- `brand.logo`, `brand.heroImage`, `brand.commercialImage`,
  `brand.residentialImage` (+ `heroImageFallback`,
  `commercialImageFallback`)
- `beforeAfter.results[].beforeImage` / `afterImage` (before/after pairs)

To replace an image:

1. Drop the new file under `public/images/` (e.g.
   `public/images/herobanner.jpg`), or grab a hosted URL.
2. Update the corresponding path/URL in
   `src/config/presets/cleaning.ts` or `src/config/presets/hvac.ts`.

No component code changes are needed — the layout renders purely from whatever
preset is active. After any image change, rebuild (`npm run build`) to make sure
the new public asset is emitted.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc && vite build` (must pass green before PRs)

Node 22+ is required (`.nvmrc`, `engines`). Vite 8 bundles with rolldown, and
older npm versions skip its native binding, which makes `vite build` fail on
startup.

## Deploying

### Netlify

`netlify.toml` holds the whole config: `npm run build` → publish `dist`,
`NODE_VERSION=22`, and a catch-all `/* → /index.html 200` rewrite so
`/detailing`, `/idreamofcleaning`, `/embed/:clientId` and `/admin/:tenantId`
survive a hard reload. Connect the repo and set the site's environment
variables:

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | for bookings | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | for bookings | Supabase anon key |
| `VITE_DEFAULT_TENANT` | rarely | Override for the root tenant; see below |

Keep these in the site's settings rather than in `netlify.toml`, so the same
repo can back several deploys. (Netlify gives `netlify.toml` precedence over
UI-declared variables, so a value committed there could not be overridden per
site.) `VITE_*` values are inlined at build time, so changing one requires a
redeploy.

Without the Supabase pair the site still builds and renders; bookings are not
persisted and `/admin` shows an empty list.

## Which tenant a deploy serves at `/`

Resolved from the hostname at runtime by `src/config/resolveTenant.ts`, so a
new site needs no build-time configuration — point a domain at the build and
the matching tenant renders. First match wins:

1. `VITE_DEFAULT_TENANT`, when set to a registered preset id.
2. A preset whose `domains` list contains the hostname or a parent of it
   (`www.` and preview subdomains match too).
3. A preset whose id appears as a hostname label, ignoring punctuation — this
   is what makes `idreamofcleaning.netlify.app` and `i-dream-of-cleaning.com`
   resolve with nothing configured anywhere.
4. `DEFAULT_PRESET_ID` (`cleaning`).

So: name the Netlify site after the preset id, or add the custom domain to that
preset's `domains`. Reach for `VITE_DEFAULT_TENANT` only when the hostname says
nothing useful (a `random-name-123.netlify.app` deploy). Every tenant also stays
reachable by path — `/idreamofcleaning`, `/detailing` — on any deploy.

### Vercel

`vercel.json` provides the equivalent SPA rewrite; the same environment
variables apply.

## Notes

- `src/components/CleaningAiFeatures.tsx` is currently unreferenced legacy
  code and is not part of the config architecture.
