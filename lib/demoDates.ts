/**
 * Dates for /preview sample data, counted back from today so the demo always
 * looks current instead of frozen on the day it was written.
 *
 * Only for data the demo renders after sign-in (client side). Server-rendered
 * pages must not use these, or the build date and the visitor's date would
 * disagree during hydration.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

const ago = (days: number) => new Date(Date.now() - days * DAY_MS);

/** "Oct 9", or "Oct 9, 2026" with `year`. */
export function demoDate(daysAgo: number, opts: { year?: boolean } = {}) {
  return ago(daysAgo).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(opts.year ? { year: "numeric" } : {}),
  });
}

/** "Dec 2025": the month and year a number of days back. */
export function demoMonth(daysAgo: number) {
  return ago(daysAgo).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/** "Today, 09:12", "Yesterday, 17:40", or "Oct 7, 16:02". */
export function demoStamp(daysAgo: number, time: string) {
  if (daysAgo === 0) return `Today, ${time}`;
  if (daysAgo === 1) return `Yesterday, ${time}`;
  return `${demoDate(daysAgo)}, ${time}`;
}
