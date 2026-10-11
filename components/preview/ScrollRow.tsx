"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A horizontal row of tab chips that scrolls sideways on small screens.
 *
 * Edges fade only while there is more to see in that direction, so a cut-off
 * chip reads as "swipe for more" rather than as a layout bug. The active chip
 * (aria-current="page") is kept in view when the tab changes.
 */
export function ScrollRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        left: el.scrollLeft > 2,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  // Keep the active chip visible when the tab changes. Only then: scrolling
  // re-renders this row (the edge fades), and re-centring on every render
  // would snap back a hand swipe or the guided tour's own scroll. Adjusts
  // scrollLeft directly rather than scrollIntoView, which could also scroll
  // the page vertically.
  const lastActive = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el || !active || active === lastActive.current) return;
    lastActive.current = active;
    const pad = 48;
    const start =
      active.getBoundingClientRect().left -
      el.getBoundingClientRect().left +
      el.scrollLeft;
    const end = start + active.offsetWidth;
    if (start - pad < el.scrollLeft) {
      el.scrollTo({ left: Math.max(0, start - pad), behavior: "smooth" });
    } else if (end + pad > el.scrollLeft + el.clientWidth) {
      el.scrollTo({ left: end + pad - el.clientWidth, behavior: "smooth" });
    }
  });

  const fade = "2.5rem";
  const mask = `linear-gradient(to right, ${
    edges.left ? `transparent, #000 ${fade}` : "#000"
  }, ${edges.right ? `#000 calc(100% - ${fade}), transparent` : "#000"})`;

  return (
    <div
      ref={ref}
      className={cn(
        "-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden",
        className,
      )}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {children}
    </div>
  );
}
