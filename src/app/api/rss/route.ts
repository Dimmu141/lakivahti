import { getBills } from "@/lib/bills-service";
import { billIdToSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STAGES_FI: Record<string, string> = {
  submitted: "Annettu",
  committee: "Valiokunnassa",
  hearing: "Kuuleminen",
  report: "Mietintö",
  plenary: "Täysistunto",
  voted: "Äänestetty",
  enacted: "Vahvistettu",
};

export async function GET() {
  const { bills } = await getBills({ limit: 50 });

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const items = bills
    .map((bill) => {
      const url = `${baseUrl}/laki/${billIdToSlug(bill.id)}`;
      const stage = STAGES_FI[bill.currentStage] ?? bill.currentStage;
      const pubDate = bill.stageUpdatedAt
        ? new Date(bill.stageUpdatedAt).toUTCString()
        : new Date().toUTCString();

      return `    <item>
      <title><![CDATA[${bill.id}: ${bill.titleFi}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[Vaihe: ${stage}. ${bill.summaryFi ?? ""}]]></description>
      <category>${bill.category}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Lakivahti — Suomen lainsäädännön seuranta</title>
    <link>${baseUrl}</link>
    <description>Seuraa hallituksen esitysten ja lakialoitteiden etenemistä eduskunnan käsittelyssä</description>
    <language>fi</language>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
