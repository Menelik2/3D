import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import "./splash.css";
import "./menu-animations.css";
import { SiteChrome } from "@/components/SiteChrome";
import { Footer } from "@/components/Footer";
import { getPublicSiteConfig } from "@/lib/data/site-settings";

/** Live CMS: always fetch fresh data (no redeploy needed after admin edits). */
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "META Pictures | Beyond the Frame",
    template: "%s | META Pictures",
  },
  description:
    "META Pictures is a creative film and media production company that transforms ideas into cinematic visual experiences. Music videos, commercials, weddings, documentaries and more.",
  keywords: [
    "film production",
    "cinematography",
    "music videos",
    "commercial films",
    "wedding films",
    "documentary",
    "META Pictures",
    "አማርኛ",
    "ፊልም",
  ],
  openGraph: {
    title: "META Pictures | Beyond the Frame",
    description:
      "Creative film and media production company. We don't just film. We create cinema.",
    type: "website",
    siteName: "META Pictures",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: "META Pictures" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "META Pictures | Beyond the Frame",
    description:
      "Creative film and media production company transforming ideas into cinematic experiences.",
    images: ["/brand/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/brand/meta-logo-sm.jpg",
    apple: "/brand/meta-logo.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { contact, social, media } = await getPublicSiteConfig();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoEthiopic.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteChrome
          logoUrl={media.logoUrl}
          social={social}
          footer={<Footer contact={contact} social={social} />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
