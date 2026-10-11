/**
 * Contact + social channels. The email comes from lib/config.ts (one source
 * of truth); the Patreon URL can be set via env (see .env.local.example).
 */

import { config } from "@/lib/config";

export type SocialChannel = {
  key: "email" | "patreon";
  label: string;
  handle: string;
  href: string;
};

const email = config.contact.email;
const patreonUrl = process.env.NEXT_PUBLIC_PATREON_URL ?? "";

export const social = {
  email: {
    key: "email",
    label: "Email",
    handle: email,
    href: `mailto:${email}`,
  },
  patreon: {
    key: "patreon",
    label: "Patreon",
    handle: "PRASM",
    href: patreonUrl,
  },
} satisfies Record<string, SocialChannel>;

/** Channels shown in the footer / contact (Patreon only if configured). */
export const socialList: SocialChannel[] = [
  social.email,
  ...(patreonUrl ? [social.patreon] : []),
];
