import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicit caching model + Partial Pre-Rendering
  cacheComponents: true,
  // Instant Navigations: reusable shells + smarter partial prefetches
  partialPrefetching: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "oqipymvqqptjxiaeasgd.supabase.co" },
    ],
  },
};

export default nextConfig;
