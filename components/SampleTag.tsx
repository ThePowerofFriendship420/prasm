/**
 * Marks illustrative content on preview deployments. Never reaches the live
 * site, because sample content is filtered out there (lib/visibility.ts).
 */
export function SampleTag() {
  return (
    <span className="rounded-full bg-gold-400/20 px-2 py-0.5 text-[0.625rem] font-semibold tracking-wide text-forest-700 uppercase">
      Sample
    </span>
  );
}
