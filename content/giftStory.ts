/**
 * "Follow a gift": a short guided story through the /preview demo that shows
 * one gift travelling from a donor to a child's care and back to the donor as
 * honest impact. Content as data so it is easy to edit and translate.
 *
 * Voice: warm, plain, honest. Everything here is sample data in a demo; the
 * story never claims a feature the demo does not show.
 */

export type GiftStoryView = "donor" | "steward" | "admin" | "student";

export type GiftStoryStep = {
  id: string;
  /** lucide icon key, mapped in GiftStory.tsx. */
  icon: "handCoins" | "truck" | "stamp" | "fileHeart" | "heart" | "sparkles";
  title: string;
  body: string;
  view: GiftStoryView;
  /** Tab to open on that screen, if any. */
  tab?: string;
  /** data-tour-id of the element to highlight. */
  spotlight?: string;
  /** "approved": waits until the visitor signs off the hospital trip. */
  gate: "next" | "approved" | "done";
  hint?: string;
};

export const giftStorySteps: GiftStoryStep[] = [
  {
    id: "gift",
    icon: "handCoins",
    title: "A gift arrives",
    body: "Jordan gives every month. Part of every gift is set aside for medical care: urgent treatment, and the journey to reach it.",
    view: "donor",
    tab: "overview",
    spotlight: "donor-funds",
    gate: "next",
  },
  {
    id: "trip",
    icon: "truck",
    title: "Ong takes a boy to hospital",
    body: "In the village a boy needs a doctor. Ong, the steward, pays for the truck there and back, and logs it on his phone in baht, the same day.",
    view: "steward",
    tab: "money",
    spotlight: "wallet-W-07",
    gate: "next",
  },
  {
    id: "signoff",
    icon: "stamp",
    title: "A second person checks it",
    body: "Every spend is signed off by someone other than the person who spent it. You are the founder now: sign off the hospital trip.",
    view: "admin",
    tab: "finance",
    spotlight: "signoff-W-07",
    gate: "approved",
    hint: "Tap Sign off",
  },
  {
    id: "record",
    icon: "fileHeart",
    title: "Care becomes part of a record",
    body: "Visits like his are written into the child's own health record, like this one. Only the family and the people they allow can see it, and it is never sent to an AI. For a child with no papers, a record like this becomes a first, quiet proof that they exist.",
    view: "student",
    tab: "health",
    spotlight: "student-health",
    gate: "next",
  },
  {
    id: "impact",
    icon: "heart",
    title: "Jordan sees the difference",
    body: "Back with Jordan, the gift shows up as clinic visits supported. Never the boy's name, face or medical details. Those stay with his family.",
    view: "donor",
    tab: "overview",
    spotlight: "donor-impact",
    gate: "next",
  },
  {
    id: "done",
    icon: "sparkles",
    title: "One gift, end to end",
    body: "Money in, care given, checked by a second person, recorded for the child, and reported back honestly. That is the loop PRASM is building.",
    view: "donor",
    gate: "done",
  },
];
