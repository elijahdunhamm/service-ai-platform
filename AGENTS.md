# AGENTS.md

This repo is a config-driven, multi-tenant site. Read `README.md` before
changing it.

## Conventions

- **No hardcoded tenant content in components.** All brand copy, services,
  pricing math, booking slots, and trust badges belong in an industry preset
  under `src/config/presets/<slug>.ts`, typed by `IndustryConfig`.
- **Tailwind theming:** `ThemeColors` stores *fully-written* class strings
  (`"bg-blue-600"`), never dynamically assembled like `` `bg-${c}-600` `` — the
  JIT cannot detect runtime-built classes. Update a preset's theme strings to
  change a tenant's colors.
- **Icons are referenced by string key** (`IconName` in `types.ts`); the layout
  resolves them via its `ICON_MAP`. Don't import icons into presets.
- **Keep `types.ts` dependency-free** — it must import no UI/icon libraries.
- **Build check:** run `npm run build` (runs `tsc`) and keep it green before
  opening a PR. `tsconfig` enforces `strict`, `noUnusedLocals`,
  `noUnusedParameters`.

## Git hygiene

- `dist/`, `node_modules/`, and `*.DS_Store` are build/environment artifacts —
  do not add new versions of them to commits. Prefer focused commits that stage
  only `src/` and docs. See `.gitignore`.
