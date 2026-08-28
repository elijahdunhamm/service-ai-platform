import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import CleaningLayout from "./components/CleaningLayout";
import { cleaningPreset } from "./config/presets/cleaning";
import { detailingPreset } from "./config/presets/detailing";
import { PRESETS, DEFAULT_PRESET_ID } from "./config/presets";
import { EmbedClient } from "./app/embed/[clientId]/embed-client";
import AdminDashboard from "./pages/AdminDashboard";

function EmbedWrapper() {
  const { clientId } = useParams();
  const config =
    clientId === "detailing" ? detailingPreset : cleaningPreset;
  return <EmbedClient config={config} />;
}

/**
 * Tenant-aware admin route. Resolves the /admin/:tenantId param against the
 * registered presets. Unknown/missing tenantIds fall back to the default
 * (cleaning) tenant so the dashboard never renders without a valid preset.
 */
function AdminRoute() {
  const { tenantId } = useParams();
  const id = tenantId && PRESETS[tenantId] ? tenantId : DEFAULT_PRESET_ID;
  return <AdminDashboard tenantId={id} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website Route */}
        <Route path="/" element={<CleaningLayout config={cleaningPreset} />} />

        {/* Car Detailing Tenant Route */}
        <Route
          path="/detailing"
          element={<CleaningLayout config={detailingPreset} />}
        />

        {/* Dynamic Embed Route for Clients */}
        <Route path="/embed/:clientId" element={<EmbedWrapper />} />

        {/* Admin Dashboard Routes: /admin defaults to cleaning, /admin/:tenantId scopes per tenant */}
        <Route path="/admin" element={<Navigate to={`/admin/${DEFAULT_PRESET_ID}`} replace />} />
        <Route path="/admin/:tenantId" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
