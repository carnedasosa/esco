import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF/WebP: la foto dell'hero (LCP su mobile) pesa molto meno del JPEG.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
