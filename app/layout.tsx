import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navigator } from "@/components/layout/navigator";
import { SparkleCursor } from "@/components/cursor/sparkle-cursor";
import { getAllProjects } from "@/lib/blog";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://me.seanoc.xyz"),
  title: {
    default: "Learning Blog - Minimal & Clean",
    template: "%s | Learning Blog",
  },
  description: "A minimal blog showcasing clean design and thoughtful typography. Explore projects, productivity tips, and life insights.",
  keywords: ["blog", "learning", "projects", "productivity", "development", "design"],
  authors: [{ name: "Sean O'Chang" }],
  creator: "Sean O'Chang",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seanoc.xyz",
    siteName: "Learning Blog",
    title: "Learning Blog - Minimal & Clean",
    description: "A minimal blog showcasing clean design and thoughtful typography. Explore projects, productivity tips, and life insights.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Learning Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Blog - Minimal & Clean",
    description: "A minimal blog showcasing clean design and thoughtful typography",
    images: ["/og-image.png"],
    creator: "@seanochang",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = getAllProjects();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SparkleCursor />
        <Navigator projects={projects} />
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
