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
    minimumCacheTTL: THIRTY_ONE_DAYS,
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
    const longCache = [
      {
        key: "Cache-Control",
        value: `public, max-age=${ONE_YEAR}, immutable`,
      },
    ];

    return [
      // Next.js image optimizer output
      {
        source: "/_next/image",
        headers: [
          ...longCache,
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
      // Brand assets under /public/brand
      {
        source: "/brand/:path*",
        headers: longCache,
      },
    ];
  },
};

export default nextConfig;
