"use client";

import { useState } from "react";
import { config } from "@/lib/config";
import { cn } from "@/lib/cn";
import { submitForm } from "@/lib/forms";

/**
 * Contact form with NO backend:
 *  - If a Formspree endpoint is configured, send it in place and thank the
 *    visitor on the page (no redirect to Formspree's own screen).
 *  - Otherwise, compose a mailto: with the message body.
 */
export function ContactForm({ className }: { className?: string }) {
  const endpoint = config.contact.formspree;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const field =
    "w-full rounded-[14px] border border-line bg-cream px-4 py-3 text-ink placeholder:text-stone/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400";
  const labelCls = "mb-1.5 block text-sm font-medium text-forest-700";

  const Fields = (
    <>
      <div>
        <label htmlFor="cf-name" className={labelCls}>
          Name
        </label>
        <input
          id="cf-name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="cf-email" className={labelCls}>
          Email
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          placeholder="you@email.com"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className={labelCls}>
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(field, "resize-y")}
          placeholder="How would you like to help, or what would you like to know?"
        />
      </div>
    </>
  );

  const submitCls =
    "inline-flex h-12 items-center justify-center rounded-[14px] bg-clay-600 px-7 font-medium text-cream shadow-soft transition-colors hover:bg-clay-700";

  if (endpoint && state === "sent") {
    return (
      <div
        role="status"
        className={cn(
          "rounded-[20px] border border-line bg-sand p-6",
          className,
        )}
      >
        <p className="font-display text-xl font-semibold text-forest-700">
          Thank you, {name.split(" ")[0] || "friend"}.
        </p>
        <p className="mt-2 text-stone">
          Your message has reached us. We&apos;ll reply to {email} soon.
        </p>
      </div>
    );
  }

  if (endpoint) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setState("sending");
          const ok = await submitForm(endpoint, {
            _subject: `Message from ${name || "the PRASM site"}`,
            name,
            email,
            message,
          });
          setState(ok ? "sent" : "error");
        }}
        className={cn("flex flex-col gap-5", className)}
      >
        {Fields}
        <button
          type="submit"
          disabled={state === "sending"}
          className={cn(submitCls, "self-start disabled:opacity-60")}
        >
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
        {state === "error" && (
          <p role="alert" className="text-sm text-clay-700">
            That didn&apos;t go through. Please try again, or email{" "}
            <a className="underline" href={`mailto:${config.contact.email}`}>
              {config.contact.email}
            </a>
            .
          </p>
        )}
      </form>
    );
  }

  // mailto fallback
  const mailto = `mailto:${config.contact.email}?subject=${encodeURIComponent(
    `Message from ${name || "the PRASM site"}`,
  )}&body=${encodeURIComponent(`${message}\n\nFrom ${name} (${email})`)}`;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {Fields}
      <a href={mailto} className={cn(submitCls, "self-start")}>
        Send message
      </a>
      <p className="text-sm text-stone">
        This opens your email app. You can also reach us directly at{" "}
        <a
          href={`mailto:${config.contact.email}`}
          className="text-clay-700 underline underline-offset-4"
        >
          {config.contact.email}
        </a>
        .
      </p>
    </div>
  );
}
