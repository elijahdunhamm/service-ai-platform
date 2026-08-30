import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation } from "react-router-dom";
import { cleaningPreset } from "./config/presets/cleaning";
import { detailingPreset } from "./config/presets/detailing";
import { PRESETS, DEFAULT_PRESET_ID } from "./config/presets";
import type { IndustryConfig } from "./config/types";

/**
 * Route components are lazy-loaded via dynamic import so each tenant route only
 * downloads the code it needs (Vite emits per-tenant chunks) instead of one
 * monolithic umbrella bundle. The two tenant layouts share the booking UI, which
 * lives in src/components/booking.tsx as its own chunk. Admin/embed routes are
 * also deferred so they never load unless visited.
 */
const CleaningLayout = lazy(() => import("./components/CleaningLayout"));
const IdreamofcleaningLayout = lazy(() => import("./components/IdreamofcleaningLayout"));
const EmbedClient = lazy(() =>
  import("./app/embed/[clientId]/embed-client").then((m) => ({ default: m.EmbedClient }))
);
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

/**
 * Default tenant served at the site root. Driven by the build-time env var
 * VITE_DEFAULT_TENANT (e.g. "detailing" for a dedicated brand deployment), and
 * falling back to the repo default (cleaning) when unset. This lets the SAME
 * multi-tenant build serve e.g. autodetaildemo at its root without changing
 * the default `pullupandclean` deployment. Registered ids only; unknown values
 * fall back to the repo default.
 */
const configuredDefault = import.meta.env.VITE_DEFAULT_TENANT as string | undefined;
const DEFAULT_TENANT_ID =
  configuredDefault && PRESETS[configuredDefault] ? configuredDefault : DEFAULT_PRESET_ID;

/**
 * Resolve the active tenant preset for a given pathname so the document title
 * reflects the tenant actually being viewed. Mirrors the route wiring below
 * (root default, /detailing, /idreamofcleaning, /embed/:clientId, /admin).
 * Falls back to the configured default tenant preset for any unknown path.
 */
function resolvePresetForPath(pathname: string): IndustryConfig {
  if (pathname.startsWith("/detailing")) return detailingPreset;
  if (pathname.startsWith("/idreamofcleaning")) return PRESETS.idreamofcleaning;
  if (pathname.startsWith("/embed/")) {
    const clientId = pathname.split("/")[2];
    if (clientId === "detailing") return detailingPreset;
    if (clientId === "idreamofcleaning") return PRESETS.idreamofcleaning;
    return cleaningPreset;
  }
  const adminMatch = pathname.match(/^\/admin\/([^/]+)/);
  if (adminMatch && PRESETS[adminMatch[1]]) return PRESETS[adminMatch[1]];
  return PRESETS[DEFAULT_TENANT_ID] ?? cleaningPreset;
}
/**
 * Keeps the browser document <title> in sync with the active tenant's
 * `businessName` (falling back to the preset's `name` if a preset ever lacks a
 * businessName). This replaces the stale hardcoded title in index.html so each
 * tenant shows its own brand in the browser tab.
 */
function DocumentTitle() {
  const { pathname } = useLocation();
  const config = resolvePresetForPath(pathname);
  useEffect(() => {
    document.title = config.brand.businessName || config.name;
  }, [config]);
  return null;
}
function EmbedWrapper() {
  const { clientId } = useParams();
  const config =
    clientId === "detailing"
      ? detailingPreset
      : clientId === "idreamofcleaning"
        ? PRESETS.idreamofcleaning
        : cleaningPreset;
  return <EmbedClient config={config} />;
}

/**
 * Tenant-aware admin route. Resolves the /admin/:tenantId param against the
 * registered presets. Unknown/missing tenantIds fall back to the configured
 * default tenant so the dashboard never renders without a valid preset.
 */
function AdminRoute() {
  const { tenantId } = useParams();
  const id = tenantId && PRESETS[tenantId] ? tenantId : DEFAULT_TENANT_ID;
  return <AdminDashboard tenantId={id} />;
}

// Minimal fallback shown briefly while a lazy route chunk loads. Purely
// cosmetic — no layout/theme logic, so it stays out of tenant styling.
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50" aria-busy="true">
      <div className="size-10 animate-spin rounded-full border-[3px] border-blue-900/15 border-t-blue-900" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DocumentTitle />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Main Website Route — serves the configured default tenant */}
          <Route
            path="/"
            element={
              DEFAULT_TENANT_ID === "idreamofcleaning" ? (
                <IdreamofcleaningLayout config={PRESETS.idreamofcleaning} />
              ) : (
                <CleaningLayout
                  config={PRESETS[DEFAULT_TENANT_ID] ?? cleaningPreset}
                />
              )
            }
          />

          {/* Car Detailing Tenant Route */}
          <Route path="/detailing" element={<CleaningLayout config={detailingPreset} />} />

          {/* I Dream of Cleaning Tenant Route — dedicated editorial layout */}
          <Route
            path="/idreamofcleaning"
            element={<IdreamofcleaningLayout config={PRESETS.idreamofcleaning} />}
          />

          {/* Dynamic Embed Route for Clients */}
          <Route path="/embed/:clientId" element={<EmbedWrapper />} />

          {/* Admin Dashboard Routes: /admin defaults to configured tenant, /admin/:tenantId scopes per tenant */}
          <Route path="/admin" element={<Navigate to={`/admin/${DEFAULT_TENANT_ID}`} replace />} />
          <Route path="/admin/:tenantId" element={<AdminRoute />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
