import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oqipymvqqptjxiaeasgd.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
