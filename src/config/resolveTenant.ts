// src/config/resolveTenant.ts
// Resolves which tenant a deploy serves at "/", from the hostname alone, so a
// new site needs no build-time configuration: point a domain at the build and
// the matching preset renders.
//
// Resolution order (first match wins):
//   1. VITE_DEFAULT_TENANT, when set to a registered preset id (explicit
//      override for a deploy whose hostname says nothing useful, e.g. a
//      Netlify preview URL).
//   2. A preset whose `domains` list contains the hostname (or a parent of it,
//      so "www." and preview subdomains match).
//   3. A preset whose id appears as a hostname label, ignoring punctuation —
//      this is what makes "idreamofcleaning.netlify.app" and
//      "i-dream-of-cleaning.com" resolve with no config at all.
//   4. DEFAULT_PRESET_ID.
import { PRESETS, DEFAULT_PRESET_ID } from "./presets";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const PRESET_ID_BY_NORMALIZED: Record<string, string> = Object.fromEntries(
  Object.keys(PRESETS).map((id) => [normalize(id), id])
);

/** True when `hostname` is `domain` itself or a subdomain of it. */
function hostMatchesDomain(hostname: string, domain: string): boolean {
  const host = hostname.toLowerCase();
  const target = domain.toLowerCase().replace(/^\.+|\.+$/g, "");
  return host === target || host.endsWith(`.${target}`);
}

/** The tenant a hostname identifies, or undefined when it identifies none. */
export function resolveTenantIdFromHostname(hostname: string): string | undefined {
  const host = hostname.toLowerCase();

  for (const [id, preset] of Object.entries(PRESETS)) {
    if (preset.domains?.some((domain) => hostMatchesDomain(host, domain))) return id;
  }

  for (const label of host.split(".")) {
    const id = PRESET_ID_BY_NORMALIZED[normalize(label)];
    if (id) return id;
  }

  return undefined;
}

/**
 * The tenant served at "/". `envDefault` is the optional VITE_DEFAULT_TENANT
 * override; unknown ids are ignored rather than breaking the deploy.
 */
export function resolveRootTenantId(hostname: string, envDefault?: string): string {
  if (envDefault && PRESETS[envDefault]) return envDefault;
  return resolveTenantIdFromHostname(hostname) ?? DEFAULT_PRESET_ID;
}
