// src/App.tsx
import CleaningLayout from "./components/CleaningLayout";
import { cleaningPreset } from "./config/presets/cleaning";

function App() {
  // The layout is fully config-driven. Swap `cleaningPreset` for any other
  // registered preset (e.g. `hvacPreset`) to re-skin the entire site.
  return <CleaningLayout config={cleaningPreset} />;
}
export default App;
