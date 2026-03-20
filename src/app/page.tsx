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
import { getRecentGovProjects, PREP_PHASE_LABELS } from "@/lib/gov-projects-service";
import { STAGES } from "@/lib/constants";
import { billIdToSlug, formatFinnishDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ bills, total }, stageCounts, categories, recentActivity, upcomingVotes, recentGovProjects] =
    await Promise.all([
      getBills({ limit: 200 }),
      getStageCounts(),
      getCategories(),
      getRecentActivity(8),
      getUpcomingVotes(8),
      getRecentGovProjects(5),
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

        {/* ── Valmistelussa ── */}
        {recentGovProjects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2
                  className="text-xs uppercase tracking-widest font-semibold"
                  style={{ color: "var(--accent-green)" }}
                >
                  Valmistelussa
                </h2>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                  — ministeriöissä
                </span>
              </div>
              <Link
                href="/hankkeet"
                className="text-xs hover:underline"
                style={{ color: "var(--accent-green)" }}
              >
                Kaikki hankkeet →
              </Link>
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(78,204,163,0.08)",
              }}
            >
              {recentGovProjects.map((proj, i) => {
                const phaseLabel = proj.prepPhase
                  ? (PREP_PHASE_LABELS[proj.prepPhase] ?? proj.prepPhase)
                  : "Valmistelussa";
                return (
                  <a
                    key={proj.uuid}
                    href={proj.hankeikkunaUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    style={{
                      borderBottom:
                        i < recentGovProjects.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : undefined,
                      textDecoration: "none",
                    }}
                  >
                    <span
                      className="text-xs px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        background: "rgba(78,204,163,0.1)",
                        color: "var(--accent-green)",
                        minWidth: "110px",
                        textAlign: "center",
                      }}
                    >
                      {phaseLabel}
                    </span>
                    <span
                      className="text-xs font-mono shrink-0 hidden sm:inline"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {proj.tunnus}
                    </span>
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {proj.aliasFi ?? proj.nameFi}
                    </span>
                    {proj.ministry && (
                      <span
                        className="text-xs shrink-0 hidden md:inline"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {proj.ministry.replace("ministeriö", "min.").replace("Ministeriö", "Min.")}
                      </span>
                    )}
                    <span style={{ color: "var(--accent-green)", opacity: 0.5, fontSize: "10px" }}>↗</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Full filterable list ── */}
        <div className="mb-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <h2
            className="text-xs uppercase tracking-widest font-semibold mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Kaikki lakihankkeet
          </h2>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            Hae, suodata ja selaa kaikkia eduskunnan käsittelyssä olevia hankkeita
          </p>
        </div>
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
