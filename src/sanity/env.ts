export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-05'

// The project ID and dataset aren't secret (they're in every Sanity image URL), so they're
// committed as defaults. That way builds work without extra setup. Set the env vars to override,
// e.g. to point a preview build at a different dataset.
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || '2026-website-refresh'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tgbswiom'
