import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { Footer } from "@/components/Footer";
import { getPublicSiteConfig } from "@/lib/data/site-settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "META Pictures | Every Frame Has a Story",
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
  ],
  openGraph: {
    title: "META Pictures | Every Frame Has a Story",
    description:
      "Creative film and media production company. We don't just film. We create cinema.",
    type: "website",
    siteName: "META Pictures",
    images: [{ url: "/brand/meta-logo.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "META Pictures | Every Frame Has a Story",
    description:
      "Creative film and media production company transforming ideas into cinematic experiences.",
    images: ["/brand/meta-logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/brand/meta-logo.jpg",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteChrome
          logoUrl={media.logoUrl}
          footer={<Footer contact={contact} social={social} />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
