import type { Metadata } from "next";
import { site } from "@/content/site";

const baseUrl = site.url;

/**
 * Build per-page metadata with sensible PRASM defaults + OpenGraph/Twitter.
 * The root layout sets the title template ("%s · PRASM Project").
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  article,
}: {
  title?: string;
  description?: string;
  path?: string;
  /** A page-specific social preview (defaults to the site card). */
  image?: { src: string; alt: string };
  /** Mark the page as an article with its publish date (ISO). */
  article?: { publishedTime: string };
}): Metadata {
  const desc = description ?? site.description;
  const url = new URL(path, baseUrl).toString();
  const ogImage = image
    ? { url: image.src, alt: image.alt }
    : {
        url: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${site.name} | ${site.tagline}`,
      };

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": new URL("/feed.xml", baseUrl).toString(),
      },
    },
    openGraph: {
      ...(article
        ? { type: "article" as const, publishedTime: article.publishedTime }
        : { type: "website" as const }),
      siteName: site.name,
      title: title ? `${title} · ${site.name}` : site.name,
      description: desc,
      url,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} · ${site.name}` : site.name,
      description: desc,
      images: [ogImage.url],
    },
  };
}
