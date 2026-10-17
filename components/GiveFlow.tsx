"use client";

import { useState } from "react";
import { ArrowRight, CircleCheck, HeartHandshake, Mail } from "lucide-react";
import { config } from "@/lib/config";
import { cn } from "@/lib/cn";
import { funds, fundBySlug, type FundSlug } from "@/lib/giving/funds";
import { mailtoLink, submitForm } from "@/lib/forms";

type Frequency = "once" | "monthly";
type Recognition = "name" | "initials" | "anonymous";

const PRESETS = [25, 50, 100, 250];

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** A PayPal.me link with the amount filled in (paypal.me/handle/50USD). */
function paypalWithAmount(base: string, amount: number): string {
  return `${base.replace(/\/+$/, "")}/${amount}USD`;
}

/** Stripe Payment Links accept client_reference_id, so we learn the fund. */
function stripeWithRef(base: string, ref: string): string {
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}client_reference_id=${encodeURIComponent(ref)}`;
}

const chip = (active: boolean) =>
  cn(
    "inline-flex h-11 items-center justify-center rounded-[12px] border px-2 text-sm sm:px-4 font-medium transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-400",
    active
      ? "border-clay-600 bg-clay-600 text-cream"
      : "border-line bg-cream text-forest-700 hover:bg-sand",
  );

const field =
  "w-full rounded-[14px] border border-line bg-cream px-4 py-3 text-ink placeholder:text-stone/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400";

/**
 * The /give flow: how often, how much, and where it goes, then a way to pay.
 *
 * When a payment link is configured (Stripe, PayPal, Patreon) the last step
 * opens it. Until then, or for anyone who prefers it, the visitor leaves a
 * pledge: Formspree when configured, otherwise a prefilled email. Either way
 * no willing donor is lost while payment accounts are being set up.
 */
export function GiveFlow() {
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [preset, setPreset] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [fund, setFund] = useState<FundSlug>("where-needed-most");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recognition, setRecognition] = useState<Recognition>("name");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const customAmount = Math.round(Number(custom));
  const amount =
    preset ??
    (Number.isFinite(customAmount) && customAmount > 0 ? customAmount : 0);
  const chosen = fundBySlug(fund);
  const ref = `${fund}:${frequency}:${amount}`;
  const summary = `${usd(amount)}${frequency === "monthly" ? " a month" : ""} to ${chosen.label}`;

  // Payment options that are actually live for this frequency.
  const rails: { label: string; href: string }[] = [];
  if (amount > 0) {
    if (frequency === "monthly") {
      if (config.stripeMonthly.enabled)
        rails.push({
          label: `Give ${usd(amount)} a month by card`,
          href: stripeWithRef(config.stripeMonthly.url, ref),
        });
      if (config.links.patreon.enabled)
        rails.push({
          label: "Join monthly on Patreon",
          href: config.links.patreon.url,
        });
    } else {
      if (config.links.stripe.enabled)
        rails.push({
          label: `Give ${usd(amount)} by card`,
          href: stripeWithRef(config.links.stripe.url, ref),
        });
      if (config.links.paypal.enabled)
        rails.push({
          label: `Give ${usd(amount)} with PayPal`,
          href: paypalWithAmount(config.links.paypal.url, amount),
        });
    }
  }

  const pledgeBody = [
    `Pledge: ${summary}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Recognition: ${recognition === "name" ? "list my name" : recognition === "initials" ? "initials only" : "keep me anonymous"}`,
    note ? `Note: ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const sendPledge = async () => {
    if (!config.contact.formspree) return;
    setState("sending");
    const ok = await submitForm(config.contact.formspree, {
      _subject: `Pledge: ${summary}`,
      kind: "pledge",
      frequency,
      amount_usd: String(amount),
      fund: chosen.label,
      name,
      email,
      recognition,
      note,
    });
    setState(ok ? "sent" : "error");
  };

  const canPledge =
    amount > 0 && name.trim() !== "" && /\S+@\S+\.\S+/.test(email);

  if (state === "sent") {
    return (
      <div className="rounded-[24px] border border-line bg-cream p-8 text-center shadow-soft md:p-10">
        <CircleCheck
          className="mx-auto h-10 w-10 text-forest-600"
          aria-hidden
        />
        <h3 className="mt-4 text-h3">Thank you, {name.split(" ")[0]}.</h3>
        <p className="mx-auto mt-3 max-w-lg text-stone">
          Your pledge of <strong className="text-forest-700">{summary}</strong>{" "}
          has reached us. We&apos;ll email {email} within two days with a secure
          way to complete it, and a note on what it will do.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-line bg-cream p-6 shadow-soft md:p-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-7">
          {/* Frequency */}
          <fieldset>
            <legend className="text-sm font-semibold text-forest-700">
              How often?
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["monthly", "once"] as const).map((f) => (
                <label key={f} className={chip(frequency === f)}>
                  <input
                    type="radio"
                    name="give-frequency"
                    value={f}
                    checked={frequency === f}
                    onChange={() => setFrequency(f)}
                    className="sr-only"
                  />
                  {f === "monthly" ? "Monthly" : "Once"}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Amount */}
          <fieldset>
            <legend className="text-sm font-semibold text-forest-700">
              Amount (USD)
            </legend>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {PRESETS.map((p) => (
                <label key={p} className={chip(preset === p)}>
                  <input
                    type="radio"
                    name="give-amount"
                    value={p}
                    checked={preset === p}
                    onChange={() => {
                      setPreset(p);
                      setCustom("");
                    }}
                    className="sr-only"
                  />
                  {usd(p)}
                </label>
              ))}
            </div>
            <label className="mt-2 block">
              <span className="sr-only">Other amount in US dollars</span>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-stone">
                  $
                </span>
                <input
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value.replace(/[^\d]/g, ""));
                    setPreset(null);
                  }}
                  onFocus={() => setPreset(null)}
                  placeholder="Other amount"
                  className={cn(
                    field,
                    "pl-8",
                    preset === null && custom && "border-clay-600",
                  )}
                />
              </div>
            </label>
          </fieldset>

          {/* Fund */}
          <fieldset>
            <legend className="text-sm font-semibold text-forest-700">
              Where should it go?
            </legend>
            <div className="mt-3 space-y-2">
              {funds.map((f) => {
                const planned = f.status === "planned";
                const active = fund === f.slug;
                return (
                  <label
                    key={f.slug}
                    className={cn(
                      "flex items-start gap-3 rounded-[14px] border p-3.5 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-400",
                      planned
                        ? "cursor-not-allowed border-line bg-sand/40 opacity-70"
                        : active
                          ? "cursor-pointer border-clay-600 bg-clay-50"
                          : "cursor-pointer border-line bg-cream hover:bg-sand/60",
                    )}
                  >
                    <input
                      type="radio"
                      name="give-fund"
                      value={f.slug}
                      checked={active}
                      disabled={planned}
                      onChange={() => setFund(f.slug)}
                      className="mt-1 accent-clay-600"
                    />
                    <span>
                      <span className="flex flex-wrap items-center gap-2 font-medium text-forest-700">
                        {f.label}
                        {planned && (
                          <span className="rounded-full bg-forest-500/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-forest-700">
                            Coming
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-stone">
                        {f.blurb}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Pay or pledge */}
        <div className="flex flex-col rounded-[20px] bg-sand p-6 md:p-7">
          <p className="text-sm font-semibold tracking-wide text-clay-700 uppercase">
            Your gift
          </p>
          <p
            className="mt-2 font-display text-3xl font-semibold text-forest-700"
            aria-live="polite"
          >
            {amount > 0 ? summary : "Choose an amount"}
          </p>

          {rails.length > 0 && (
            <div className="mt-6 space-y-2">
              {rails.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-clay-600 px-6 font-medium text-cream shadow-soft transition-colors hover:bg-clay-700"
                >
                  {r.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              ))}
              <p className="pt-2 text-sm text-stone">
                Or leave a pledge and we&apos;ll be in touch:
              </p>
            </div>
          )}

          {rails.length === 0 && (
            <p className="mt-4 text-sm leading-relaxed text-stone">
              Online payment is being set up. Leave a pledge and we&apos;ll
              email you within two days with a secure way to give, and a note on
              what your gift will do.
            </p>
          )}

          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-forest-700">
                Your name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-forest-700">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={field}
                placeholder="you@email.com"
              />
            </label>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-forest-700">
                On our supporters page
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["name", "Name"],
                    ["initials", "Initials"],
                    ["anonymous", "Anonymous"],
                  ] as const
                ).map(([v, label]) => (
                  <label key={v} className={chip(recognition === v)}>
                    <input
                      type="radio"
                      name="give-recognition"
                      value={v}
                      checked={recognition === v}
                      onChange={() => setRecognition(v)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-forest-700">
                A note{" "}
                <span className="font-normal text-stone">(optional)</span>
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className={cn(field, "resize-y")}
              />
            </label>
          </div>

          <div className="mt-5">
            {config.contact.formspree ? (
              <button
                type="button"
                onClick={sendPledge}
                disabled={!canPledge || state === "sending"}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-forest-700 px-6 font-medium text-cream transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HeartHandshake className="h-4 w-4" aria-hidden />
                {state === "sending" ? "Sending…" : "Pledge this gift"}
              </button>
            ) : (
              <a
                href={
                  canPledge
                    ? mailtoLink(
                        config.contact.email,
                        `Pledge: ${summary}`,
                        pledgeBody,
                      )
                    : undefined
                }
                aria-disabled={!canPledge}
                className={cn(
                  "flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-forest-700 px-6 font-medium text-cream transition-colors hover:bg-forest-600",
                  !canPledge && "pointer-events-none opacity-50",
                )}
              >
                <Mail className="h-4 w-4" aria-hidden />
                Pledge by email
              </a>
            )}
            {state === "error" && (
              <p className="mt-2 text-sm text-clay-700" role="alert">
                That didn&apos;t go through. Please try again, or email{" "}
                <a
                  className="underline"
                  href={mailtoLink(
                    config.contact.email,
                    `Pledge: ${summary}`,
                    pledgeBody,
                  )}
                >
                  {config.contact.email}
                </a>
                .
              </p>
            )}
            {!config.contact.formspree && (
              <p className="mt-2 text-xs text-stone">
                Opens your email app with your pledge written out, ready to
                send.
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-stone">
              PRASM is not yet a registered charity, so gifts are not
              tax-deductible for now. We&apos;ll only list you the way you
              choose above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
