"use client";

import { useEffect } from "react";

/**
 * Lets a guided story open a specific tab on a screen ("the steward's Money
 * tab"), even when that screen is only just mounting. A request waits until a
 * screen that has that tab picks it up, then it is cleared.
 */
const EVENT = "prasm:open-tab";
let pending: string | null = null;

export function requestTab(tab: string) {
  pending = tab;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: tab }));
}

export function useRequestedTab<T extends string>(
  tabs: readonly T[],
  setTab: (t: T) => void,
) {
  useEffect(() => {
    const take = (t: string | null) => {
      if (t && (tabs as readonly string[]).includes(t)) {
        pending = null;
        setTab(t as T);
      }
    };
    take(pending);
    const onEvent = (e: Event) => take((e as CustomEvent<string>).detail);
    window.addEventListener(EVENT, onEvent);
    return () => window.removeEventListener(EVENT, onEvent);
  }, [tabs, setTab]);
}
