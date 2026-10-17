/**
 * Central media registry: every photo on the site, with what it shows and
 * whether it may be published.
 *
 * TO ADD A PHOTO (see /public/images/placeholders/README.md):
 *   1. Put the original in media-originals/ (git-ignored, never committed).
 *   2. npm run photos:add -- media-originals/IMG_x.jpg village/name
 *      This turns it upright, strips all metadata (including GPS), resizes it
 *      and prints the entry to paste below.
 *   3. Fill in `people` and `consent` honestly, then npm run photos:check.
 *
 * Consent rules, enforced by <Figure> and photos:check:
 *   - people "none" or "incidental" (nobody identifiable) → consent "not-needed".
 *   - people "identifiable" needs a decision: "cleared" once the people shown
 *     (for children, their family) have agreed; "withheld" if not.
 *   - "pending" means the founder has not decided yet. photos:check lists
 *     these on every run so they cannot be forgotten.
 *   - "withheld" photos never render in production; a placeholder shows.
 */

export type People = "none" | "incidental" | "identifiable";
export type Consent = "not-needed" | "cleared" | "pending" | "withheld";

export type MediaRef = {
  src: string;
  alt: string;
  /** When true, render a branded placeholder slot instead of next/image. */
  placeholder?: boolean;
  /** Optional aspect ratio hint for the placeholder, e.g. "16/9". */
  ratio?: string;
  /** Who can be recognised in the photo. */
  people: People;
  /** True when a child appears, identifiable or not. */
  children?: boolean;
  consent: Consent;
  /** CSS object-position for cropping, e.g. "50% 30%". Defaults to centre. */
  focal?: string;
  /** Default caption, shown when a page doesn't pass its own. */
  caption?: string;
};

export const images = {
  villageLife: {
    src: "/images/village/daily-life.jpg",
    alt: "Children of the village lined up together on open ground by their homes.",
    placeholder: false,
    ratio: "4/3",
    people: "identifiable",
    children: true,
    consent: "pending",
  },
  villageGathering: {
    src: "/images/village/gathering.jpg",
    alt: "A volunteer handing out supplies to families during a visit to the village.",
    placeholder: false,
    ratio: "4/3",
    people: "identifiable",
    children: true,
    consent: "pending",
  },
  villageGarden: {
    src: "/images/village/garden.jpg",
    alt: "A hen and chicks foraging on a hillside path beside the bamboo homes.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villageDusk: {
    src: "/images/village/dusk.jpg",
    alt: "Tin and bamboo rooftops of the village nestled among the trees as dusk settles over the hills.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villageWoodfire: {
    src: "/images/village/woodfire.jpg",
    alt: "A fallen tree cut back beside the homes, with a village dog standing watch.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villageLane: {
    src: "/images/village/lane.jpg",
    alt: "Neighbours and children gathered along the village lane in the evening as cooking smoke drifts between the homes.",
    placeholder: false,
    ratio: "4/3",
    people: "identifiable",
    children: true,
    consent: "pending",
  },
  villageStreet: {
    src: "/images/village/street.jpg",
    alt: "A dirt road running through the off-grid village, past tin-roofed and bamboo homes under a monsoon sky.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villageHomes: {
    src: "/images/village/homes.jpg",
    alt: "Bamboo and timber homes set among fruit trees.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villageAnimals: {
    src: "/images/village/animals.jpg",
    alt: "Pigs in a timber pen, part of everyday village life.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villageFirewood: {
    src: "/images/village/firewood.jpg",
    alt: "Firewood stacked high against a stilt house, fuel for the kitchen fire.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villageSteps: {
    src: "/images/village/steps.jpg",
    alt: "Stone steps climbing a green hillside between homes, a water pipe running alongside.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villagePath: {
    src: "/images/village/path.jpg",
    alt: "A muddy lane winding between bamboo homes, with chickens wandering under the trees.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  villageDawn: {
    src: "/images/village/dawn.jpg",
    alt: "Blue tin rooftops half hidden in the forest at first light.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  forestCanopy: {
    src: "/images/village/canopy.jpg",
    alt: "Thick green forest on the hills above the village under a bright sky.",
    placeholder: false,
    ratio: "4/3",
    people: "none",
    consent: "not-needed",
  },
  founderPortrait: {
    src: "/images/founder/portrait.jpg",
    alt: "PRASM's founding team together in a village home.",
    placeholder: false,
    ratio: "4/3",
    people: "identifiable",
    consent: "pending",
  },
  needWar: {
    src: "/images/the-need/displacement.jpg",
    alt: "A volunteer handing out supplies as children of displaced families gather around.",
    placeholder: false,
    ratio: "16/10",
    people: "identifiable",
    children: true,
    consent: "pending",
  },
  programsMedical: {
    src: "/images/programs/medical-records.jpg",
    alt: "A young patient and companion at a hospital exam window, receiving medical paperwork.",
    placeholder: false,
    ratio: "4/5",
    people: "identifiable",
    children: true,
    consent: "pending",
  },
} as const satisfies Record<string, MediaRef>;

export type ImageKey = keyof typeof images;

/** True when this photo may render on the live site. */
export function isPublishable(media: MediaRef): boolean {
  if (media.people === "identifiable") return media.consent !== "withheld";
  return true;
}
