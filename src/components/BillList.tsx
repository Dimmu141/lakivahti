"use client";

import { useState, useMemo } from "react";
import StatsPanel from "./StatsPanel";
import FilterBar from "./FilterBar";
import BillCard from "./BillCard";
import type { SampleBill } from "@/lib/sample-data";

const PAGE_SIZE = 20;

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
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return initialBills
      .filter((b) => {
        if (stage && b.currentStage !== stage) return false;
        if (category && b.category !== category) return false;
        if (q) {
          const hay = [b.titleFi, b.id, ...b.keywords, b.sponsor, b.category, ...b.experts.map((e) => e.expertName)]
            .join(" ")
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.stageUpdatedAt).getTime() -
          new Date(a.stageUpdatedAt).getTime()
      );
  }, [initialBills, query, stage, category]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  function reset() {
    setQuery("");
    setStage("");
    setCategory("");
    setPage(1);
  }

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
        categories={initialCategories}
        onQueryChange={(v) => { setQuery(v); setPage(1); }}
        onStageChange={(v) => { setStage(v); setPage(1); }}
        onCategoryChange={(v) => { setCategory(v); setPage(1); }}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} lakihanketta
        </span>
        {(query || stage || category) && (
          <button
            onClick={reset}
            className="text-xs hover:underline"
            style={{ color: "var(--accent-red)" }}
          >
            Tyhjennä suodattimet ✕
          </button>
        )}
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
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(233,69,96,0.3)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-secondary)";
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
