"use client";

import { useSyncExternalStore } from "react";

/**
 * The founder's sign-offs in the demo: expenses approved, field captures
 * reviewed, and seed sparks approved. Persisted like the roster and the
 * cashbook, so a decision survives switching roles and reloads, every screen
 * that counts work (the "Needs you" list, the steward's sparks) agrees, and
 * the queue can actually reach zero. Demo only; reset clears it.
 */

export type Decisions = {
  signedOff: string[];
  reviewed: string[];
  approvedSparks: string[];
};

const KEY = "prasm.preview.decisions.v1";
const EMPTY: Decisions = { signedOff: [], reviewed: [], approvedSparks: [] };

let state: Decisions = EMPTY;
let ready = false;
const listeners = new Set<() => void>();

function read(): Decisions {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<Decisions>) };
  } catch {
    /* ignore */
  }
  return EMPTY;
}

function snapshot(): Decisions {
  if (!ready) {
    state = read();
    ready = true;
  }
  return state;
}

function update(next: Decisions) {
  state = next;
  ready = true;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

const add = (list: string[], id: string) =>
  list.includes(id) ? list : [...list, id];

export function useDecisions(): Decisions {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    snapshot,
    () => EMPTY,
  );
}

export function signOffExpense(id: string) {
  const s = snapshot();
  update({ ...s, signedOff: add(s.signedOff, id) });
}

export function markCaptureReviewed(id: string) {
  const s = snapshot();
  update({ ...s, reviewed: add(s.reviewed, id) });
}

export function approveSeedSpark(id: string) {
  const s = snapshot();
  update({ ...s, approvedSparks: add(s.approvedSparks, id) });
}

/** A seed spark's status once the founder's decisions are applied. */
export function effectiveSparkStatus<T extends string>(
  id: string,
  status: T,
  d: Decisions,
): T | "approved" {
  return status === "proposed" && d.approvedSparks.includes(id)
    ? "approved"
    : status;
}

export function resetDecisions() {
  update(EMPTY);
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
