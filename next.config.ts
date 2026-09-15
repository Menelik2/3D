import type { NextConfig } from "next";

const ONE_YEAR = 60 * 60 * 24 * 365;
const THIRTY_ONE_DAYS = 60 * 60 * 24 * 31;

const nextConfig: NextConfig = {
  // Cache Components disabled until CMS has published content and
  // build-time validation is stable on Vercel. Re-enable later with
  // non-empty generateStaticParams + "use cache" data layer.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384, 512],
    // How long the optimizer keeps a remote source before re-fetching (seconds).
    // Gallery + CMS assets are immutable object URLs → long TTL is safe.
    minimumCacheTTL: THIRTY_ONE_DAYS,
    // Prefer denser quality steps for gallery grids on mobile.
    qualities: [60, 75, 80, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oqipymvqqptjxiaeasgd.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      // Next.js image optimizer output — cache hard at the edge
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
          {
            key: "CDN-Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
      // Static brand / public assets
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
      {
        source: "/:path*\\.(?:jpg|jpeg|png|gif|webp|avif|ico|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
