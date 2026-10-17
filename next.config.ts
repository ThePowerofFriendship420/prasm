import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller), WebP fallback. Next 16 defaults to WebP only.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
