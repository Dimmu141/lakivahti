import Header from "@/components/Header";
import Link from "next/link";
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
            <Link key={code} href={`/valiokunta/${code}`}>
              <div
                className="rounded-xl px-5 py-4 flex items-center justify-between transition-all cursor-pointer"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold w-12" style={{ color: "var(--accent-red)" }}>
                    {code}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {name}
                  </span>
                </div>
                {counts[code] !== undefined && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                  >
                    {counts[code]} hanketta
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
