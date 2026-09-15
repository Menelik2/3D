import type { NextConfig } from "next";

const ONE_YEAR = 60 * 60 * 24 * 365;
const THIRTY_ONE_DAYS = 60 * 60 * 24 * 31;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384, 512],
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
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
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
      {
        source: "/brand/:path*",
        headers: longCache,
      },
    ];
  },
};

export default nextConfig;
