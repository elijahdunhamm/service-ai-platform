import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import CleaningLayout from "./components/CleaningLayout";
import { cleaningPreset } from "./config/presets/cleaning";
import { detailingPreset } from "./config/presets/detailing";
import { PRESETS, DEFAULT_PRESET_ID } from "./config/presets";
import { EmbedClient } from "./app/embed/[clientId]/embed-client";
import AdminDashboard from "./pages/AdminDashboard";

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

function EmbedWrapper() {
  const { clientId } = useParams();
  const config =
    clientId === "detailing" ? detailingPreset : cleaningPreset;
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website Route — serves the configured default tenant */}
        <Route
          path="/"
          element={<CleaningLayout config={DEFAULT_TENANT_ID === "detailing" ? detailingPreset : cleaningPreset} />}
        />

        {/* Car Detailing Tenant Route */}
        <Route path="/detailing" element={<CleaningLayout config={detailingPreset} />} />

        {/* Dynamic Embed Route for Clients */}
        <Route path="/embed/:clientId" element={<EmbedWrapper />} />

        {/* Admin Dashboard Routes: /admin defaults to configured tenant, /admin/:tenantId scopes per tenant */}
        <Route path="/admin" element={<Navigate to={`/admin/${DEFAULT_TENANT_ID}`} replace />} />
        <Route path="/admin/:tenantId" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
