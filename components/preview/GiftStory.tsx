"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { createPortal } from "react-dom";
import {
  HandCoins,
  Truck,
  Stamp,
  FileHeart,
  Heart,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  X,
  RotateCcw,
} from "lucide-react";
import { card } from "./ui";
import { requestTab } from "./demoNav";
import { useWallet, prepareGiftStoryEntry } from "./walletStore";
import { markTourSeen } from "./tourStore";
import { giftStorySteps, type GiftStoryStep } from "@/content/giftStory";
import { GIFT_STORY_ENTRY } from "@/content/stewardWallet";

const icons: Record<GiftStoryStep["icon"], ElementType> = {
  handCoins: HandCoins,
  truck: Truck,
  stamp: Stamp,
  fileHeart: FileHeart,
  heart: Heart,
  sparkles: Sparkles,
};

type Rect = { top: number; left: number; width: number; height: number };

/**
 * "Follow a gift": walks the visitor through one gift, from the donor portal
 * to the steward's hospital-trip spend, the founder's sign-off (which the
 * visitor does), the child's private record, and back to the donor's impact.
 * It switches screens and tabs itself and highlights what matters on each.
 * Non-modal: the real controls stay usable, so the sign-off is genuine.
 */
export function GiftStory({
  open,
  view,
  switchTo,
  onClose,
}: {
  open: boolean;
  view: string;
  switchTo: (target: string) => void;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  // The highlight, tagged with the element it belongs to, so a step without a
  // spotlight (or a stale one) simply doesn't render it.
  const [tracked, setTracked] = useState<{ id: string; rect: Rect } | null>(
    null,
  );
  const wallet = useWallet();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const step = giftStorySteps[idx];
  const signedOff =
    wallet.find((e) => e.id === GIFT_STORY_ENTRY.id)?.status === "approved";

  // A fresh run (the parent mounts this component per run, so idx starts at
  // 0): the hospital trip awaits sign-off, and the first-run tour stays out
  // of the way.
  useEffect(() => {
    if (!open) return;
    prepareGiftStoryEntry();
    markTourSeen();
  }, [open]);

  // Put the app on the step's screen and tab.
  useEffect(() => {
    if (!open) return;
    if (view !== step.view) switchTo(step.view);
    if (step.tab) requestTab(step.tab);
    titleRef.current?.focus();
    // view is read, not tracked: re-running on every view change would fight
    // a visitor who wanders to another screen mid-story.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idx]);

  // The sign-off step moves on by itself once the visitor signs off.
  useEffect(() => {
    if (open && step.gate === "approved" && signedOff) {
      const t = setTimeout(() => setIdx((i) => i + 1), 900);
      return () => clearTimeout(t);
    }
  }, [open, step.gate, signedOff]);

  // Find, reveal and track the highlighted element.
  useEffect(() => {
    const id = step.spotlight;
    if (!open || !id) return;
    let revealed = false;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour-id="${id}"]`);
      if (!el) {
        setTracked(null);
        return;
      }
      if (!revealed) {
        revealed = true;
        // Top of the screen, below the role header, so the story card at the
        // bottom never covers what it is pointing at.
        el.style.scrollMarginTop = "88px";
        el.scrollIntoView({ block: "start", behavior: "smooth" });
      }
      const r = el.getBoundingClientRect();
      setTracked((prev) =>
        prev &&
        prev.id === id &&
        Math.abs(prev.rect.top - r.top) < 0.5 &&
        Math.abs(prev.rect.left - r.left) < 0.5 &&
        Math.abs(prev.rect.width - r.width) < 0.5 &&
        Math.abs(prev.rect.height - r.height) < 0.5
          ? prev
          : {
              id,
              rect: {
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height,
              },
            },
      );
    };
    measure();
    const timer = window.setInterval(measure, 200);
    return () => window.clearInterval(timer);
  }, [open, idx, step.spotlight]);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const Icon = icons[step.icon];
  const last = step.gate === "done";
  const waiting = step.gate === "approved" && !signedOff;
  const pad = 8;
  const rect = tracked && tracked.id === step.spotlight ? tracked.rect : null;

  return createPortal(
    <>
      {rect && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[95] animate-tour-ring rounded-[16px] ring-4 ring-clay-500/70 ring-offset-2 ring-offset-cream transition-all duration-300"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          }}
        />
      )}
      <div
        role="dialog"
        aria-labelledby="gift-story-title"
        className={`fixed bottom-24 left-1/2 z-[96] w-[min(92vw,380px)] -translate-x-1/2 ${card} animate-tour-in p-5 shadow-lift`}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.12em] text-clay-700 uppercase">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-clay-50 text-clay-600">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            Follow a gift
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the story"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-sand hover:text-clay-700"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <h2
          id="gift-story-title"
          ref={titleRef}
          tabIndex={-1}
          className="mt-3 font-display text-lg font-semibold text-forest-700 outline-none"
        >
          {step.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">{step.body}</p>
        {waiting && step.hint && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-xs font-medium text-clay-700">
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            {step.hint}
          </p>
        )}
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-sand">
          <div
            className="h-full rounded-full bg-clay-600 transition-all duration-300"
            style={{ width: `${((idx + 1) / giftStorySteps.length) * 100}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="inline-flex h-10 items-center gap-1.5 rounded-[12px] border border-line px-3 text-sm font-medium text-forest-700 transition-colors hover:bg-sand disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
          {last ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  prepareGiftStoryEntry();
                  setIdx(0);
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-[12px] border border-line px-3 text-sm font-medium text-forest-700 transition-colors hover:bg-sand"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 items-center rounded-[12px] bg-clay-600 px-4 text-sm font-medium text-cream transition-colors hover:bg-clay-700"
              >
                Explore on my own
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIdx((i) => i + 1)}
              disabled={waiting}
              className="inline-flex h-10 items-center gap-1.5 rounded-[12px] bg-clay-600 px-4 text-sm font-medium text-cream transition-colors hover:bg-clay-700 disabled:opacity-50"
            >
              {waiting ? "Waiting for you" : "Next"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
