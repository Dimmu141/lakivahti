"use client";

import { useState, useMemo } from "react";
import StatsPanel from "./StatsPanel";
import FilterBar from "./FilterBar";
import BillCard from "./BillCard";
import type { SampleBill } from "@/lib/sample-data";

const PAGE_SIZE = 20;

// Active stages rank first so politically relevant bills surface at the top.
// Terminal stages (voted, enacted) sink to the bottom.
const STAGE_PRIORITY: Record<string, number> = {
  plenary:   0,
  report:    1,
  hearing:   2,
  committee: 3,
  submitted: 4,
  voted:     5,
  enacted:   6,
};

type SortMode = "active" | "recent" | "submitted";

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: "active",    label: "Aktiiviset ensin" },
  { key: "recent",    label: "Uusin ensin" },
  { key: "submitted", label: "Annettu" },
];

interface BillListProps {
  initialBills: SampleBill[];
  initialStageCounts: Record<string, number>;
  initialCategories: string[];
}

export default function BillList({
  initialBills,
  initialStageCounts,
  initialCategories,
}: BillListProps) {
  const [query, setQuery]       = useState("");
  const [stage, setStage]       = useState("");
  const [category, setCategory] = useState("");
  const [billType, setBillType] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("active");
  const [page, setPage]         = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const result = initialBills.filter((b) => {
      if (stage    && b.currentStage !== stage)    return false;
      if (category && b.category     !== category) return false;
      if (billType && b.billType     !== billType) return false;
      if (q) {
        const hay = [
          b.titleFi, b.id, ...b.keywords, b.sponsor, b.category,
          ...b.experts.map((e) => e.expertName),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // Sort according to selected mode
    result.sort((a, b) => {
      if (sortMode === "active") {
        const ap = STAGE_PRIORITY[a.currentStage] ?? 9;
        const bp = STAGE_PRIORITY[b.currentStage] ?? 9;
        if (ap !== bp) return ap - bp;
        // Within same stage: most recently updated first
        return new Date(b.stageUpdatedAt).getTime() - new Date(a.stageUpdatedAt).getTime();
      }
      if (sortMode === "submitted") {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      }
      // "recent" — by stageUpdatedAt desc
      return new Date(b.stageUpdatedAt).getTime() - new Date(a.stageUpdatedAt).getTime();
    });

    return result;
  }, [initialBills, query, stage, category, billType, sortMode]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore   = paginated.length < filtered.length;

  function reset() {
    setQuery("");
    setStage("");
    setCategory("");
    setBillType("");
    setPage(1);
  }

  const hasFilters = query || stage || category || billType;

  return (
    <>
      <StatsPanel
        counts={initialStageCounts}
        activeStage={stage}
        onStageClick={(s) => { setStage(s); setPage(1); }}
      />

      <FilterBar
        query={query}
        stage={stage}
        category={category}
        billType={billType}
        categories={initialCategories}
        onQueryChange={(v)   => { setQuery(v);    setPage(1); }}
        onStageChange={(v)   => { setStage(v);    setPage(1); }}
        onCategoryChange={(v)=> { setCategory(v); setPage(1); }}
        onBillTypeChange={(v)=> { setBillType(v); setPage(1); }}
      />

      {/* Results bar: count + sort switcher + clear */}
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} lakihanketta
        </span>

        <div className="flex items-center gap-2">
          {/* Sort mode toggle */}
          <div
            className="flex rounded-lg overflow-hidden text-xs"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.key}
                onClick={() => setSortMode(o.key)}
                className="px-2.5 py-1 transition-colors"
                style={{
                  background: sortMode === o.key ? "rgba(233,69,96,0.2)" : "var(--bg-card)",
                  color: sortMode === o.key ? "var(--accent-red)" : "var(--text-muted)",
                  fontWeight: sortMode === o.key ? 600 : 400,
                  borderRight: o.key !== "submitted" ? "1px solid rgba(255,255,255,0.08)" : undefined,
                }}
              >
                {o.label}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              onClick={reset}
              className="text-xs hover:underline"
              style={{ color: "var(--accent-red)" }}
            >
              Tyhjennä ✕
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Ei tuloksia hakuehdoilla
          </p>
          <button
            onClick={reset}
            className="mt-3 text-xs hover:underline"
            style={{ color: "var(--accent-red)" }}
          >
            Tyhjennä suodattimet
          </button>
        </div>
      ) : (
        <>
          {paginated.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}

          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full py-3 rounded-xl text-sm transition-all mt-2"
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(233,69,96,0.3)";
                (e.currentTarget as HTMLElement).style.color       = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.color       = "var(--text-secondary)";
              }}
            >
              Lataa lisää ({filtered.length - paginated.length} jäljellä)
            </button>
          )}
        </>
      )}
    </>
  );
}
