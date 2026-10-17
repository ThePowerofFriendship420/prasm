/**
 * Whether sample and placeholder content may be shown.
 *
 * True on Vercel preview deployments and in local development, so the founder
 * can see, clearly labelled, where real figures and names will go. False on the
 * live site and in any environment we don't recognise: it fails closed, so
 * nothing invented can reach www.prasm.life by accident.
 *
 * Read at build/render time on the server. Pages using it are prerendered per
 * deployment, and Vercel sets VERCEL_ENV during the build.
 */
export const showSamples =
  process.env.VERCEL_ENV === "preview" ||
  process.env.NODE_ENV === "development";
