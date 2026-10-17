import type { ImageKey } from "@/lib/images";

/** Dependency-free content blocks rendered by <FieldNoteBody>. */
export type FieldNoteBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }
  /** A photo from lib/images.ts, full width within the text column. */
  | { type: "image"; key: ImageKey; caption?: string }
  /** Two to six photos in a grid, with one shared caption. */
  | { type: "gallery"; keys: ImageKey[]; caption?: string };

export type FieldNote = {
  slug: string;
  title: string;
  /** ISO date for sorting + <time>. */
  date: string;
  /** Human display date. */
  displayDate: string;
  tag?: string;
  excerpt: string;
  heroImage: ImageKey;
  featured?: boolean;
  body: FieldNoteBlock[];
};
