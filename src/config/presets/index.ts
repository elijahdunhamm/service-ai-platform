// src/config/presets/index.ts
import type { IndustryConfig } from "../types";
import { cleaningPreset } from "./cleaning";
import { hvacPreset } from "./hvac";
import { detailingPreset } from "./detailing";

/** All registered industry presets, keyed by their stable id. */
export const PRESETS: Record<string, IndustryConfig> = {
  cleaning: cleaningPreset,
  hvac: hvacPreset,
  detailing: detailingPreset,
};

export const DEFAULT_PRESET_ID = "cleaning";
export const defaultPreset: IndustryConfig = cleaningPreset;

export { cleaningPreset, hvacPreset, detailingPreset };
export type { IndustryConfig };