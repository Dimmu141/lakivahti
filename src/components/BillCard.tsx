"use client";

import Link from "next/link";
import { billIdToSlug, formatFinnishDate } from "@/lib/utils";
import { STAGES } from "@/lib/constants";
import type { SampleBill } from "@/lib/sample-data";

const URGENCY_COLORS: Record<string, string> = {
  high: "var(--accent-red)",
  normal: "var(--accent-green)",
  low: "var(--text-muted)",
};

const TYPE_COLORS: Record<string, string> = {
  HE: "#60a5fa",
  LA: "#a78bfa",
  KAA: "#fbbf24",
};

function StagePip({ stage }: { stage: string }) {
  const found = STAGES.find((s) => s.key === stage);
  if (!found) return null;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        background:
          stage === "enacted"
            ? "rgba(78,204,163,0.15)"
            : stage === "voted"
            ? "rgba(78,204,163,0.1)"
            : "rgba(255,255,255,0.06)",
        color:
          stage === "enacted" || stage === "voted"
            ? "var(--accent-green)"
            : "var(--text-secondary)",
        border: `1px solid ${
          stage === "enacted" || stage === "voted"
            ? "rgba(78,204,163,0.25)"
            : "rgba(255,255,255,0.08)"
        }`,
      }}
    >
      {found.icon} {found.label}
    </span>
  );
}

export default function BillCard({ bill }: { bill: SampleBill }) {
  const slug = billIdToSlug(bill.id);
  const typeColor = TYPE_COLORS[bill.billType] ?? "var(--text-secondary)";

  return (
    <Link href={`/laki/${slug}`}>
      <article
        className="rounded-xl p-4 mb-3 transition-all cursor-pointer"
        style={{
          background: "var(--bg-card)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "rgba(233,69,96,0.25)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.04)")
        }
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-mono text-sm font-semibold"
              style={{ color: typeColor }}
            >
              {bill.id}
            </span>
            <StagePip stage={bill.currentStage} />
            {bill.urgency === "high" && (
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(233,69,96,0.12)",
                  color: "var(--accent-red)",
                  border: "1px solid rgba(233,69,96,0.25)",
                }}
              >
                Kiireellinen
              </span>
            )}
          </div>
          <span
            className="text-xs shrink-0"
            style={{ color: "var(--text-muted)" }}
          >
            {formatFinnishDate(bill.stageUpdatedAt)}
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-sm font-medium leading-snug mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {bill.titleFi}
        </h2>

        {/* Summary */}
        {bill.summaryFi && (
          <p
            className="text-xs leading-relaxed mb-3 line-clamp-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {bill.summaryFi}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>{bill.category}</span>
            <span>·</span>
            <span>{bill.sponsor}</span>
            {bill.keywords.length > 0 && (
              <>
                <span>·</span>
                <span>
                  {bill.keywords.slice(0, 2).map((kw) => (
                    <span
                      key={kw}
                      className="mr-1 px-1.5 py-0.5 rounded text-xs"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            {bill.committees.length > 0 && (
              <span>🏛 {bill.committees[0].committeeCode}</span>
            )}
            {bill.experts.length > 0 && (
              <span>🎙 {bill.experts.length} asiantuntijaa</span>
            )}
            {bill.votes.length > 0 && (
              <span style={{ color: "var(--accent-green)" }}>
                ✓ {bill.votes[0].votesFor}–{bill.votes[0].votesAgainst}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
