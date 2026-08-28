import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import CleaningLayout from "./components/CleaningLayout";
import { cleaningPreset } from "./config/presets/cleaning";
import { detailingPreset } from "./config/presets/detailing";
import { EmbedClient } from "./app/embed/[clientId]/embed-client";
import AdminDashboard from "./pages/AdminDashboard";

function EmbedWrapper() {
  const { clientId } = useParams();
  const config =
    clientId === "detailing" ? detailingPreset : cleaningPreset;
  return <EmbedClient config={config} />;
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

        {/* Admin Dashboard Route */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
