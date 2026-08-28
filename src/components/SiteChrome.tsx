"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SplashScreen } from "@/components/SplashScreen";
import { LanguageProvider } from "@/lib/i18n/context";
import type { SocialConfig } from "@/lib/site-config";

export function SiteChrome({
  children,
  footer,
  logoUrl,
  social,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  logoUrl?: string;
  social?: SocialConfig;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <SplashScreen />
      <Navbar logoUrl={logoUrl} social={social} />
      <main className="flex-1 splash-site-main">{children}</main>
      {footer}
    </LanguageProvider>
  );
}
