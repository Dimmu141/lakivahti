import type { MetadataRoute } from "next";
import { getBills } from "@/lib/bills-service";
import { billIdToSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakivahti.vercel.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/valiokunnat`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/kansanedustajat`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/tietosuoja`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const { bills } = await getBills({ limit: 1000 });
    const billRoutes: MetadataRoute.Sitemap = bills.map((bill) => ({
      url: `${base}/laki/${billIdToSlug(bill.id)}`,
      lastModified: new Date(bill.stageUpdatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...billRoutes];
  } catch {
    return staticRoutes;
  }
}
