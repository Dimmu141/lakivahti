import Header from "@/components/Header";
import BillList from "@/components/BillList";
import Link from "next/link";
import { getBills, getStageCounts, getCategories, getRecentActivity } from "@/lib/bills-service";
import { STAGES } from "@/lib/constants";
import { billIdToSlug, formatFinnishDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ bills }, stageCounts, categories, recentActivity] = await Promise.all([
    getBills({ limit: 200 }),
    getStageCounts(),
    getCategories(),
    getRecentActivity(8),
  ]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold tracking-tight mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Lakivahti
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Seuraa hallituksen esitysten ja lakialoitteiden etenemistä
            eduskunnan käsittelyssä
          </p>
        </div>

        {/* Recent activity */}
        {recentActivity.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>
              Viimeinen toiminta
            </h2>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              {recentActivity.map((bill, i) => {
                const stage = STAGES.find((s) => s.key === bill.currentStage);
                return (
                  <Link
                    key={bill.id}
                    href={`/laki/${billIdToSlug(bill.id)}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    style={{
                      borderBottom: i < recentActivity.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : undefined,
                    }}
                  >
                    <span
                      className="text-xs font-mono font-semibold w-24 shrink-0"
                      style={{ color: "var(--accent-red)" }}
                    >
                      {bill.id.replace(" vp", "")}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {stage?.icon} {stage?.label}
                    </span>
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {bill.titleFi}
                    </span>
                    <span className="text-xs shrink-0" style={{ color: "var(--text-faint)" }}>
                      {formatFinnishDate(bill.stageUpdatedAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <BillList
          initialBills={bills}
          initialStageCounts={stageCounts}
          initialCategories={categories}
        />
      </main>
    </>
  );
}
