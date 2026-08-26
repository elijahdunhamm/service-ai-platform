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

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc && vite build` (must pass green before PRs)

## Notes

- `src/components/CleaningAiFeatures.tsx` is currently unreferenced legacy
  code and is not part of the config architecture.
