/**
 * "Our supporters" — public donor recognition.
 *
 * Honest by construction: every profile below is an illustrative sample
 * (`sample: true`), shown on previews with a Sample label and never on the
 * live site. Add real, consented supporters without the flag; they appear
 * everywhere. Publishing a
 * person's name needs their permission; use initials or "Anonymous" when they
 * prefer privacy, and never list an amount someone hasn't agreed to share.
 * Recognition is by tier, not by dollar figure.
 */

export const supportersIntro = {
  eyebrow: "Our supporters",
  title: "The people making this possible",
  lede: "PRASM runs on the generosity of a small circle of supporters. With gratitude, we honor the ones whose giving makes the biggest difference for the community.",
};

export type Supporter = {
  name: string;
  /** Illustrative only: hidden on the live site, labelled on previews. */
  sample?: boolean;
  blurb: string;
  since?: string;
  location?: string;
};

export type SupporterTier = {
  key: string;
  title: string;
  subtitle: string;
  supporters: Supporter[];
};

export const supporterTiers: SupporterTier[] = [
  {
    key: "founding",
    title: "Founding Circle",
    subtitle: "Lead supporters whose early belief got PRASM started.",
    supporters: [
      {
        sample: true,
        name: "The Park Family",
        blurb: "Backed the first year of medical care and the solar that powers the village pump.",
        since: "2024",
        location: "Seoul",
      },
      {
        sample: true,
        name: "Anonymous",
        blurb: "A founding patron who prefers to stay unnamed, funding urgent treatment when it is needed most.",
        since: "2024",
      },
    ],
  },
  {
    key: "patrons",
    title: "Patrons",
    subtitle: "Major gifts that fund care, education, and the systems that keep the village self-reliant.",
    supporters: [
      { sample: true, name: "M. Tanaka", blurb: "Sponsors learning materials and a volunteer teacher.", since: "2025", location: "Tokyo" },
      { sample: true, name: "Hana Community Fund", blurb: "Annual gift toward water and food resilience.", since: "2025" },
      { sample: true, name: "J. & R. Mendoza", blurb: "Cover transport for patients reaching the hospital.", since: "2026", location: "California" },
    ],
  },
  {
    key: "sustainers",
    title: "Monthly sustainers",
    subtitle: "Our Patreon community, keeping support steady month after month.",
    supporters: [
      { sample: true, name: "A. Lee", blurb: "Monthly supporter since the start." },
      { sample: true, name: "S. Wright", blurb: "Monthly supporter." },
      { sample: true, name: "K. Nilsson", blurb: "Monthly supporter." },
      { sample: true, name: "Anonymous", blurb: "Monthly supporter." },
      { sample: true, name: "D. Okafor", blurb: "Monthly supporter." },
    ],
  },
];

export const supportersOutro = {
  title: "Join them",
  body: "Every gift, one-time or monthly, keeps a family well, a child in school, and the village standing on its own. Prefer to stay anonymous, or want your name listed? Just let us know.",
};

/**
 * Supporters who may appear on this deployment: real ones everywhere, samples
 * only on previews.
 */
export function visibleTiers(showSamples: boolean): SupporterTier[] {
  return supporterTiers
    .map((t) => ({
      ...t,
      supporters: t.supporters.filter((s) => showSamples || !s.sample),
    }))
    .filter((t) => t.supporters.length > 0);
}
