/**
 * The funds a gift can go to. One list, shared by the /give flow and the
 * donor portal demo, and named after the programs on /programs.
 */
export type FundSlug =
  | "where-needed-most"
  | "medical-care"
  | "education"
  | "sustainable-living"
  | "identity-records";

export type Fund = {
  slug: FundSlug;
  label: string;
  blurb: string;
  /** Planned funds are shown but cannot be chosen yet. */
  status: "open" | "planned";
};

export const funds: Fund[] = [
  {
    slug: "where-needed-most",
    label: "Where needed most",
    blurb: "Lets us respond to whatever is most urgent this month.",
    status: "open",
  },
  {
    slug: "medical-care",
    label: "Medical care & records",
    blurb:
      "Urgent treatment, the journey to hospital, and a written history for each patient.",
    status: "open",
  },
  {
    slug: "education",
    label: "Education",
    blurb: "Learning materials and volunteer teachers in the village.",
    status: "open",
  },
  {
    slug: "sustainable-living",
    label: "Sustainable living",
    blurb:
      "Solar, water, tools and food systems that keep the village self-reliant.",
    status: "open",
  },
  {
    slug: "identity-records",
    label: "Identity & records",
    blurb: "A dignified, portable record that helps a person prove they exist.",
    status: "planned",
  },
];

export const fundBySlug = (slug: FundSlug): Fund =>
  funds.find((f) => f.slug === slug) ?? funds[0];
