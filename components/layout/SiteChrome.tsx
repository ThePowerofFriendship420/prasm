"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Routes that run as full-screen apps, without the public site's chrome. */
const appRoutes = new Set(["/preview"]);

/**
 * Wraps the public site's header, footer, and floating buttons so app-style
 * routes (the /preview demo) can fill the screen like a real product.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (appRoutes.has(pathname)) return null;
  return <>{children}</>;
}
