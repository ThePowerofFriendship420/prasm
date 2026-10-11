/**
 * Founder page framing. The founder's substance is REAL and lives in
 * content/about.ts (founderStory) and content/home.ts (founderNote); this file
 * only adds page framing and recomposes approved themes.
 *
 * Per content/storyBank/people.ts this page refers to the founder by role,
 * and without a photo, until public attribution is confirmed. Do not add new
 * biographical claims here, and do not embellish the substance.
 */

export const founderHero = {
  eyebrow: "The founder",
  title: "It began with a doctor",
  lede: "PRASM was founded by a physician whose visits to Kayan refugee families began this work in the hills of Mae Hong Son, and who built the first records that let an undocumented child begin to prove they exist.",
};

export const founderApproach = {
  eyebrow: "How a doctor sees this",
  title: "Care, then proof, then dignity",
  lede: "The same instinct that treats a patient also documents them. For people with no papers, that record is the start of being seen.",
  points: [
    {
      title: "Care comes first",
      body: "The work began by paying for a sick child's care and the journey to reach it. Health is the ground everything else stands on.",
    },
    {
      title: "A record is proof",
      body: "Doctors are trained to build a history and hand a patient safely to the next. For a child with no papers, that record becomes a first proof of existence.",
    },
    {
      title: "Held in trust",
      body: "Identity is consented, protected, and never traded. Technology helps carry the work, but a person always decides.",
    },
  ],
};

export const founderCta = {
  title: "Stand with a doctor's promise",
  body: "Your gift covers care, keeps children learning, and helps build the records that let a person be seen.",
};
