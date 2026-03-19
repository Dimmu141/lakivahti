import Header from "@/components/Header";
import BillList from "@/components/BillList";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  getBills,
  getStageCounts,
  getCategories,
  getRecentActivity,
  getUpcomingVotes,
} from "@/lib/bills-service";
import { STAGES } from "@/lib/constants";
import { billIdToSlug, formatFinnishDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ bills, total }, stageCounts, categories, recentActivity, upcomingVotes] =
    await Promise.all([
      getBills({ limit: 200 }),
      getStageCounts(),
      getCategories(),
      getRecentActivity(8),
      getUpcomingVotes(8),
    ]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Hero ── */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold tracking-tight mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Lakivahti
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Seuraa hallituksen esitysten ja lakialoitteiden etenemistä
            eduskunnan käsittelyssä —{" "}
            <span style={{ color: "var(--text-muted)" }}>
              {total} hanketta seurannassa
            </span>
          </p>
        </div>

        {/* ── Tulossa äänestykseen ── */}
        {upcomingVotes.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "var(--accent-yellow)" }}
              >
                Tulossa äänestykseen
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "rgba(255,201,71,0.12)",
                  color: "var(--accent-yellow)",
                  border: "1px solid rgba(255,201,71,0.25)",
                }}
              >
                {upcomingVotes.length} hanketta
              </span>
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255,201,71,0.1)",
              }}
            >
              {upcomingVotes.map((bill, i) => {
                const stage = STAGES.find((s) => s.key === bill.currentStage);
                const isPlenary = bill.currentStage === "plenary";
                return (
                  <Link
                    key={bill.id}
                    href={`/laki/${billIdToSlug(bill.id)}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    style={{
                      borderBottom:
                        i < upcomingVotes.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : undefined,
                    }}
                  >
                    {/* Stage badge */}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded shrink-0 font-medium"
                      style={{
                        background: isPlenary
                          ? "rgba(255,201,71,0.15)"
                          : "rgba(255,255,255,0.06)",
                        color: isPlenary
                          ? "var(--accent-yellow)"
                          : "var(--text-secondary)",
                        border: isPlenary
                          ? "1px solid rgba(255,201,71,0.3)"
                          : "1px solid transparent",
                        minWidth: "80px",
                        textAlign: "center",
                      }}
                    >
                      {stage?.icon} {stage?.label}
                    </span>

                    {/* Bill ID */}
                    <span
                      className="text-xs font-mono font-semibold w-24 shrink-0"
                      style={{ color: "var(--accent-red)" }}
                    >
                      {bill.id.replace(" vp", "")}
                    </span>

                    {/* Title */}
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {bill.titleFi}
                    </span>

                    {/* Committee */}
                    {bill.committees[0] && (
                      <span
                        className="text-xs font-mono shrink-0 hidden sm:inline"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {bill.committees[0].committeeCode}
                      </span>
                    )}

                    {/* Date */}
                    <span
                      className="text-xs shrink-0"
                      style={{ color: "var(--text-faint)" }}
                    >
                      {formatFinnishDate(bill.stageUpdatedAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Käsittelyssä juuri nyt ── */}
        {recentActivity.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h2
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Käsittelyssä juuri nyt
              </h2>
              <span
                className="text-xs"
                style={{ color: "var(--text-faint)" }}
              >
                — viimeksi liikkuneet hankkeet
              </span>
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {recentActivity.map((bill, i) => {
                const stage = STAGES.find((s) => s.key === bill.currentStage);
                return (
                  <Link
                    key={bill.id}
                    href={`/laki/${billIdToSlug(bill.id)}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    style={{
                      borderBottom:
                        i < recentActivity.length - 1
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
                    <span
                      className="text-xs shrink-0"
                      style={{ color: "var(--text-faint)" }}
                    >
                      {formatFinnishDate(bill.stageUpdatedAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Full filterable list ── */}
        <BillList
          initialBills={bills}
          initialStageCounts={stageCounts}
          initialCategories={categories}
        />
      </main>
      <Footer />
    </>
  );
}
