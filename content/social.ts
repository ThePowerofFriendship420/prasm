/**
 * Contact + social channels. The email comes from lib/config.ts (one source
 * of truth); the Patreon URL can be set via env (see .env.local.example).
 */

import { config } from "@/lib/config";

export type SocialChannel = {
  key: "instagram" | "telegram" | "email" | "patreon";
  label: string;
  handle: string;
  href: string;
};

const instagramHandle = "@mahkha420";
const telegramHandle = "@mahkha420";
const email = config.contact.email;
const patreonUrl = process.env.NEXT_PUBLIC_PATREON_URL ?? "";

export const social = {
  instagram: {
    key: "instagram",
    label: "Instagram",
    handle: instagramHandle,
    href: `https://instagram.com/${instagramHandle.replace("@", "")}`,
  },
  telegram: {
    key: "telegram",
    label: "Telegram",
    handle: telegramHandle,
    href: `https://t.me/${telegramHandle.replace("@", "")}`,
  },
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
  social.instagram,
  social.telegram,
  social.email,
  ...(patreonUrl ? [social.patreon] : []),
];
