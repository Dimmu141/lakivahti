import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lakivahti — Suomen lainsäädännön seuranta",
    template: "%s — Lakivahti",
  },
  description:
    "Seuraa hallituksen esitysten ja lakialoitteiden etenemistä eduskunnan käsittelyssä. Avoin data, reaaliaikainen seuranta.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakivahti.vercel.app"
  ),
  openGraph: {
    siteName: "Lakivahti",
    locale: "fi_FI",
    type: "website",
    title: "Lakivahti — Suomen lainsäädännön seuranta",
    description:
      "Seuraa hallituksen esitysten ja lakialoitteiden etenemistä eduskunnan käsittelyssä. Avoin data, reaaliaikainen seuranta.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Lakivahti — Suomen lainsäädännön seuranta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lakivahti — Suomen lainsäädännön seuranta",
    description:
      "Seuraa hallituksen esitysten ja lakialoitteiden etenemistä eduskunnan käsittelyssä.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fi" className={jetbrainsMono.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
