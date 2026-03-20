import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BillDetail from "@/components/BillDetail";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import { getBillById } from "@/lib/bills-service";
import { getGovProjectForBill } from "@/lib/gov-projects-service";
import { SAMPLE_BILLS } from "@/lib/sample-data";
import { slugToBillId, billIdToSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bill = await getBillById(slugToBillId(id));
  if (!bill) return { title: "Lakihanketta ei löydy — Lakivahti" };
  return {
    title: `${bill.id} — Lakivahti`,
    description: bill.summaryFi ?? bill.titleFi,
    openGraph: {
      title: `${bill.id}: ${bill.titleFi}`,
      description: bill.summaryFi ?? undefined,
      siteName: "Lakivahti",
    },
  };
}

export async function generateStaticParams() {
  return SAMPLE_BILLS.map((b) => ({ id: billIdToSlug(b.id) }));
}

export default async function BillPage({ params }: Props) {
  const { id } = await params;
  const bill = await getBillById(slugToBillId(id));
  if (!bill) notFound();

  const govProject = await getGovProjectForBill(bill.billType, bill.billNumber, bill.billYear);

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakivahti.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: bill.titleFi,
    identifier: bill.id,
    url: `${base}/laki/${billIdToSlug(bill.id)}`,
    dateCreated: bill.submittedDate,
    ...(bill.summaryFi && { description: bill.summaryFi }),
    ...(bill.keywords.length > 0 && { keywords: bill.keywords.join(", ") }),
    legislationPassedBy: {
      "@type": "Organization",
      name: "Suomen eduskunta",
      url: "https://eduskunta.fi",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        <BackButton />
      </div>
      {govProject && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-4">
          <a
            href={govProject.hankeikkunaUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:opacity-90"
            style={{
              background: "rgba(78,204,163,0.07)",
              border: "1px solid rgba(78,204,163,0.18)",
              textDecoration: "none",
            }}
          >
            <span className="text-xs font-medium shrink-0" style={{ color: "var(--accent-green)" }}>
              Valmistelu
            </span>
            <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-muted)" }}>
              {govProject.tunnus}
            </span>
            <span className="text-xs flex-1 truncate" style={{ color: "var(--text-secondary)" }}>
              {govProject.aliasFi ?? govProject.nameFi}
            </span>
            {govProject.ministry && (
              <span className="text-xs shrink-0 hidden sm:inline" style={{ color: "var(--text-faint)" }}>
                {govProject.ministry}
              </span>
            )}
            <span style={{ color: "var(--accent-green)", fontSize: "11px" }}>↗</span>
          </a>
        </div>
      )}
      <BillDetail bill={bill} />
    </>
  );
}
