import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  /**
   * Custom ISR-style lifetimes for Cache Components (`cacheLife('name')`).
   * CMS content relies primarily on on-demand `revalidateTag` from admin writes;
   * time-based revalidate is a safety net only.
   *
   * stale     — client can reuse without hitting the server
   * revalidate — server serves stale + refreshes in background (ISR)
   * expire    — hard expiry; next request waits for fresh data
   */
  cacheLife: {
    // Portfolio / journal lists & details (tag-invalidated on publish)
    cms: {
      stale: 300, // 5 min client
      revalidate: 3600, // 1 hour background ISR
      expire: 2592000, // 30 days
    },
    // FAQs, team, site settings (rarely change)
    cmsStatic: {
      stale: 600, // 10 min client
      revalidate: 86400, // 1 day background ISR
      expire: 31536000, // 1 year
    },
  },

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
