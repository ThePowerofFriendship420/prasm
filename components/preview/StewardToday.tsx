"use client";

import { useState } from "react";
import {
  Sparkles,
  Sprout,
  Users,
  UserPlus,
  Wallet,
  NotebookPen,
  ArrowRight,
  CircleCheck,
} from "lucide-react";
import { card, thb } from "./ui";

type Target = "learners" | "enroll" | "sparks" | "money";

/** Time-of-day greeting. The steward view only renders after sign-in, in the
 *  browser, so reading the clock here cannot disagree with a server render. */
function greetingNow() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/**
 * The steward's home: what today looks like, and the one or two things that
 * need them, before any guide text. Each tile opens the tab that does the job.
 */
export function StewardToday({
  active,
  returning,
  sparksWaiting,
  newestSpark,
  balance,
  sessionsLogged,
  onGo,
  onStartSession,
}: {
  active: number;
  returning: number;
  sparksWaiting: number;
  newestSpark?: { learner: string; interest: string };
  balance: number;
  sessionsLogged: number;
  onGo: (tab: Target) => void;
  onStartSession?: () => void;
}) {
  const [greeting] = useState(greetingNow);

  const visitSteps = [
    "Gather a few children at the common spot",
    "Make sure a second trusted grown-up is there",
    "Hand over the tablet and let them ask anything",
  ];

  const tiles: {
    id: Target;
    icon: React.ElementType;
    value: string;
    label: string;
    accent?: boolean;
  }[] = [
    {
      id: "learners",
      icon: Users,
      value: String(active),
      label: `learners · ${returning} coming back`,
    },
    {
      id: "sparks",
      icon: Sprout,
      value: String(sparksWaiting),
      label: sparksWaiting === 1 ? "spark to follow up" : "sparks to follow up",
      accent: sparksWaiting > 0,
    },
    { id: "money", icon: Wallet, value: thb(balance), label: "money on hand" },
    {
      id: "enroll",
      icon: UserPlus,
      value: "Welcome",
      label: "add a new child",
    },
  ];

  return (
    <div className="mt-5 space-y-4">
      <div>
        <p className="text-sm text-stone">{greeting}, Ong</p>
        <h2 className="mt-0.5 font-display text-2xl font-semibold text-forest-700">
          Today&apos;s visit
        </h2>
      </div>

      {newestSpark && (
        <button
          type="button"
          onClick={() => onGo("sparks")}
          className="flex w-full animate-reveal items-center gap-3 rounded-[16px] border border-clay-300/50 bg-clay-50 p-4 text-left transition-colors hover:bg-clay-100/60"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-clay-600" />
          </span>
          <span className="flex-1 text-sm text-clay-700">
            <strong>{newestSpark.learner}</strong> lit up about{" "}
            <strong>{newestSpark.interest}</strong>. Suggest a follow-up.
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-clay-600" aria-hidden />
        </button>
      )}

      <div className={`${card} p-5`}>
        <ol className="space-y-2.5">
          {visitSteps.map((s, i) => (
            <li key={s} className="flex items-start gap-3 text-sm text-ink">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-500/10 text-[0.6875rem] font-semibold text-forest-700">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {onStartSession && (
            <button
              type="button"
              onClick={onStartSession}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-clay-600 px-4 py-3 text-sm font-medium text-cream shadow-soft transition-colors hover:bg-clay-700"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Start a learning session
            </button>
          )}
          <button
            type="button"
            onClick={() => onGo("learners")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-line bg-cream px-4 py-3 text-sm font-medium text-forest-700 transition-colors hover:bg-sand"
          >
            <NotebookPen className="h-4 w-4" aria-hidden />
            Write today&apos;s note
          </button>
        </div>
        {sessionsLogged > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-forest-700">
            <CircleCheck className="h-3.5 w-3.5 text-forest-600" aria-hidden />
            {sessionsLogged === 1
              ? "Today's note is written. Thank you."
              : `${sessionsLogged} notes written today. Thank you.`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onGo(t.id)}
              className={`${card} flex flex-col items-start p-4 text-left transition-colors hover:bg-sand/60 ${
                t.accent ? "border-clay-300/60" : ""
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-[10px] ${
                  t.accent
                    ? "bg-clay-600 text-cream"
                    : "bg-clay-50 text-clay-600"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="mt-3 font-display text-xl text-forest-700">
                {t.value}
              </span>
              <span className="mt-0.5 text-xs text-stone">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
