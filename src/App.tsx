import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation } from "react-router-dom";
import { PRESETS, DEFAULT_PRESET_ID } from "./config/presets";
import { resolveRootTenantId } from "./config/resolveTenant";
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
 * Tenant served at the site root, derived from the hostname the deploy is
 * served under (see resolveTenant.ts) so a new site needs no build-time
 * configuration. VITE_DEFAULT_TENANT stays available as an explicit override
 * for hosts that identify no tenant, e.g. a Netlify preview URL.
 */
const ROOT_TENANT_ID = resolveRootTenantId(
  typeof window === "undefined" ? "" : window.location.hostname,
  import.meta.env.VITE_DEFAULT_TENANT as string | undefined
);

const rootPreset = (): IndustryConfig => PRESETS[ROOT_TENANT_ID] ?? PRESETS[DEFAULT_PRESET_ID];

/** Renders a tenant with the layout its preset asks for. */
function TenantSite({ config }: { config: IndustryConfig }) {
  return config.layout === "idreamofcleaning" ? (
    <IdreamofcleaningLayout config={config} />
  ) : (
    <CleaningLayout config={config} />
  );
}

/**
 * Resolve the active tenant preset for a given pathname so the document title
 * reflects the tenant actually being viewed. Every tenant-scoped route carries
 * the tenant in its first or second path segment (/:tenantId, /embed/:tenantId,
 * /admin/:tenantId), so one lookup covers them all; anything unrecognized is
 * the root tenant.
 */
function resolvePresetForPath(pathname: string): IndustryConfig {
  const segments = pathname.split("/").filter(Boolean);
  const candidate = segments[0] === "embed" || segments[0] === "admin" ? segments[1] : segments[0];
  return (candidate && PRESETS[candidate]) || rootPreset();
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

/** /:tenantId — any registered preset; unknown ids fall back to the root tenant. */
function TenantRoute() {
  const { tenantId } = useParams();
  return <TenantSite config={(tenantId && PRESETS[tenantId]) || rootPreset()} />;
}

function EmbedWrapper() {
  const { clientId } = useParams();
  return <EmbedClient config={(clientId && PRESETS[clientId]) || rootPreset()} />;
}

/**
 * Tenant-aware admin route. Resolves the /admin/:tenantId param against the
 * registered presets. Unknown/missing tenantIds fall back to the root tenant so
 * the dashboard never renders without a valid preset.
 */
function AdminRoute() {
  const { tenantId } = useParams();
  return <AdminDashboard tenantId={tenantId && PRESETS[tenantId] ? tenantId : ROOT_TENANT_ID} />;
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
          {/* Site root — the tenant this deploy's hostname resolves to */}
          <Route path="/" element={<TenantSite config={rootPreset()} />} />

          {/* Dynamic Embed Route for Clients */}
          <Route path="/embed/:clientId" element={<EmbedWrapper />} />

          {/* Admin Dashboard Routes: /admin defaults to the root tenant, /admin/:tenantId scopes per tenant */}
          <Route path="/admin" element={<Navigate to={`/admin/${ROOT_TENANT_ID}`} replace />} />
          <Route path="/admin/:tenantId" element={<AdminRoute />} />

          {/* Every registered tenant is reachable at its own path, e.g. /detailing */}
          <Route path="/:tenantId" element={<TenantRoute />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
