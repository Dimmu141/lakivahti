import Header from "@/components/Header";
import CommitteeCard from "@/components/CommitteeCard";
import { COMMITTEES } from "@/lib/constants";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getCommitteeCounts(): Promise<Record<string, number>> {
  try {
    const prisma = getPrisma();
    if (!prisma) return {};
    const rows = await prisma.committeeAssignment.groupBy({
      by: ["committeeCode"],
      _count: { billId: true },
    });
    return Object.fromEntries(rows.map((r) => [r.committeeCode, r._count.billId]));
  } catch {
    return {};
  }
}

export default async function ValiokunnatPage() {
  const counts = await getCommitteeCounts();
  const entries = Object.entries(COMMITTEES).sort((a, b) => (counts[b[0]] ?? 0) - (counts[a[0]] ?? 0));

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
            Valiokunnat
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Eduskunnan valiokunnat ja niiden käsittelemät lakihankkeet
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {entries.map(([code, name]) => (
            <CommitteeCard
              key={code}
              code={code}
              name={name}
              count={counts[code]}
            />
          ))}
        </div>
      </main>
    </>
  );
}
