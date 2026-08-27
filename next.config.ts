import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components disabled until CMS has published content and
  // build-time validation is stable on Vercel. Re-enable later with
  // non-empty generateStaticParams + "use cache" data layer.
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
