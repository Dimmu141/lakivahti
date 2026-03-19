import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BillDetail from "@/components/BillDetail";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import { getBillById } from "@/lib/bills-service";
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
      <BillDetail bill={bill} />
    </>
  );
}
