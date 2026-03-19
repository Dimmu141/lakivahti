import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
    <html lang="fi">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
