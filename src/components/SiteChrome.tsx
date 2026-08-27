"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export function SiteChrome({
  children,
  footer,
  logoUrl,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar logoUrl={logoUrl} />
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
