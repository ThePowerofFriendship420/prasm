/**
 * Impact stats, framed as what the community is building, not as a measure of
 * brokenness.
 *
 * Honest by construction: a stat marked `placeholder: true` never renders on
 * the live site (see components/StatCard.tsx and lib/visibility.ts). Previews
 * show it with a Sample label. To publish a real figure, replace the value,
 * remove `placeholder`, and add `asOf` (e.g. "Oct 2026") and `source`
 * (e.g. "PRASM medical records").
 */

export type Stat = {
  value: string;
  label: string;
  caption?: string;
  /** Not yet verified: hidden on the live site, labelled on previews. */
  placeholder?: boolean;
  /** When the figure was counted, e.g. "Oct 2026". */
  asOf?: string;
  /** Where it comes from, e.g. "PRASM medical records". */
  source?: string;
};

export const stats: Stat[] = [
  {
    value: "100%",
    label: "Solar-powered",
    caption: "Water and light run off the grid, on donated solar.",
  },
  {
    value: "40+",
    label: "Families supported",
    caption: "Households the project walks alongside.",
    placeholder: true,
  },
  {
    value: "120+",
    label: "Medical records built",
    caption: "Hand-written histories that also help prove identity.",
    placeholder: true,
  },
  {
    value: "30+",
    label: "Hospital visits covered",
    caption: "Care that would otherwise be out of reach.",
    placeholder: true,
  },
];
