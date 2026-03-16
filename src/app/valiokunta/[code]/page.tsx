import Header from "@/components/Header";
import BillCard from "@/components/BillCard";
import BackButton from "@/components/BackButton";
import { getBillsByCommittee } from "@/lib/bills-service";
import { COMMITTEES } from "@/lib/constants";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const name = COMMITTEES[code];
  if (!name) return { title: "Valiokuntaa ei löydy — Lakivahti" };
  return { title: `${code} ${name} — Lakivahti` };
}

export const dynamic = "force-dynamic";

export default async function ValiokunnaPage({ params }: Props) {
  const { code } = await params;
  const committeeName = COMMITTEES[code];
  if (!committeeName) notFound();

  const bills = await getBillsByCommittee(code);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto px-0 pt-0 pb-4">
          <BackButton />
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="font-mono text-2xl font-bold"
              style={{ color: "var(--accent-red)" }}
            >
              {code}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
            {committeeName}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {bills.length} lakihanketta käsittelyssä tai käsitelty
          </p>
        </div>

        {bills.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl"
            style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Ei lakihankkeita tässä valiokunnassa
            </p>
          </div>
        ) : (
          <div>
            {bills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
