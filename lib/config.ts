/**
 * Env-backed runtime config. The site-wide Donate button always routes here
 * (the /give hub) rather than to any single processor, so one page controls
 * every method. Unconfigured methods are hidden in production but shown as
 * labeled placeholders in development so the slot is visible while building.
 */

export const PRIMARY_DONATE_HREF = "/give";

const isProd = process.env.NODE_ENV === "production";

// Each NEXT_PUBLIC_ value is read with a literal `process.env.NAME` so Next
// inlines it into browser code too. A lookup by variable name
// (process.env[key]) is NOT inlined and comes back empty in client components
// (node_modules/next/dist/docs/01-app/02-guides/environment-variables.md).
const clean = (v: string | undefined): string => (v ?? "").trim();

export type LinkMethod = {
  key: "patreon" | "stripe" | "paypal";
  url: string;
  enabled: boolean;
};

export type CryptoMethod = {
  symbol: string;
  label: string;
  network?: string;
  address: string;
  enabled: boolean;
};

const patreon = clean(process.env.NEXT_PUBLIC_PATREON_URL);
const stripe = clean(process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK);
const stripeMonthly = clean(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_LINK);
const paypal = clean(process.env.NEXT_PUBLIC_PAYPAL_ME);

const btc = clean(process.env.NEXT_PUBLIC_CRYPTO_BTC_ADDRESS);
const eth = clean(process.env.NEXT_PUBLIC_CRYPTO_ETH_ADDRESS);
const usdt = clean(process.env.NEXT_PUBLIC_CRYPTO_USDT_ADDRESS);
const usdtNetwork =
  clean(process.env.NEXT_PUBLIC_CRYPTO_USDT_NETWORK) || "TRC20";

const wuName = clean(process.env.NEXT_PUBLIC_WU_RECIPIENT_NAME);
const wuLocation = clean(process.env.NEXT_PUBLIC_WU_RECIPIENT_LOCATION);

// Optional hosted crypto-donation page (The Giving Block / Engiven / Coinbase
// Commerce): auto-converts to fiat and issues receipts. Just a URL.
const cryptoProcessorUrl = clean(process.env.NEXT_PUBLIC_CRYPTO_PROCESSOR_URL);
const cryptoProcessorName =
  clean(process.env.NEXT_PUBLIC_CRYPTO_PROCESSOR_NAME) ||
  "our crypto donation page";

// Bank transfer / wire is contact-first (we never publish account numbers), so
// it is a simple on/off flag rather than public values.
const bankTransferFlag = clean(
  process.env.NEXT_PUBLIC_BANK_TRANSFER,
).toLowerCase();

// Pre-launch preview: when on, donation methods that are not configured yet show
// a finished-looking demo whose final step is an honest "coming soon" (no real
// or sendable wallet address is ever shown). A method that IS configured always
// uses its real action, so going live is automatic, per method. Default on; set
// NEXT_PUBLIC_DONATIONS_PREVIEW=false to hide unconfigured methods instead.
const donationsPreview =
  clean(process.env.NEXT_PUBLIC_DONATIONS_PREVIEW) !== "false";

// Floating team login + the /preview internal demo. Default on; set
// NEXT_PUBLIC_INTERNAL_PREVIEW=false to hide.
const internalPreview =
  clean(process.env.NEXT_PUBLIC_INTERNAL_PREVIEW) !== "false";

export const config = {
  /** Show placeholder cards for unconfigured methods only outside production. */
  showPlaceholders: !isProd,

  /** Pre-launch demo for unconfigured donation methods (ends in "coming soon"). */
  donationsPreview,

  /** Show the floating team login and the /preview internal demo. */
  internalPreview,

  links: {
    patreon: { key: "patreon", url: patreon, enabled: !!patreon },
    stripe: { key: "stripe", url: stripe, enabled: !!stripe },
    paypal: { key: "paypal", url: paypal, enabled: !!paypal },
  } satisfies Record<LinkMethod["key"], LinkMethod>,

  /** Optional Stripe Payment Link for monthly gifts (the main link is one-time). */
  stripeMonthly: { url: stripeMonthly, enabled: !!stripeMonthly },

  crypto: [
    {
      symbol: "BTC",
      label: "Bitcoin",
      address: btc,
      enabled: !!btc,
    },
    {
      symbol: "ETH",
      label: "Ethereum",
      address: eth,
      enabled: !!eth,
    },
    {
      symbol: "USDT",
      label: "Tether",
      network: usdtNetwork,
      address: usdt,
      enabled: !!usdt,
    },
  ] satisfies CryptoMethod[],

  /** Hosted crypto-donation page (auto-convert + receipts). Link-out only. */
  cryptoProcessor: {
    url: cryptoProcessorUrl,
    name: cryptoProcessorName,
    enabled: !!cryptoProcessorUrl,
  },

  westernUnion: {
    name: wuName,
    location: wuLocation,
    enabled: !!(wuName && wuLocation),
  },

  /** Contact-first bank transfer / wire (details shared privately). */
  bankTransfer: {
    enabled: ["1", "true", "on", "yes"].includes(bankTransferFlag),
  },

  contact: {
    // Fixed in code on purpose, so a stale hosting env var can never show an old inbox.
    email: "prasmlife@gmail.com",
    formspree: clean(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT),
    newsletterAction: clean(process.env.NEXT_PUBLIC_NEWSLETTER_ACTION),
  },
} as const;

/** Should a method render at all? (Configured, in preview, or dev placeholders.) */
export function methodVisible(enabled: boolean): boolean {
  return enabled || config.donationsPreview || config.showPlaceholders;
}
