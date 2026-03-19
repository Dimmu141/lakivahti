"use client";

import { useState } from "react";
import type { SampleExpert } from "@/lib/sample-data";
import { formatFinnishDate } from "@/lib/utils";

export default function ExpertCard({
  expert,
  reportUrl,
}: {
  expert: SampleExpert;
  reportUrl?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSummary = !!expert.summaryFi;

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: "var(--bg-inner)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="flex items-start justify-between gap-2 cursor-pointer"
        onClick={() => hasSummary && setExpanded(!expanded)}
        role={hasSummary ? "button" : undefined}
        tabIndex={hasSummary ? 0 : undefined}
        onKeyDown={(e) => {
          if (hasSummary && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <div className="min-w-0">
          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {expert.expertName}
          </div>
          {expert.expertOrganization && (
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {expert.expertOrganization}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {expert.hearingDate && (
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
              {formatFinnishDate(expert.hearingDate)}
            </span>
          )}
          {hasSummary && (
            <span
              className="text-xs transition-transform"
              style={{
                color: "var(--text-muted)",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          )}
        </div>
      </div>

      {/* Expandable summary */}
      {expanded && expert.summaryFi && (
        <div
          className="mt-2.5 pt-2.5 text-sm leading-relaxed"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "var(--text-secondary)",
          }}
        >
          {expert.summaryFi}
          <div className="flex gap-3 mt-2">
            {expert.documentUrl && (
              <a
                href={expert.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ color: "var(--accent-green)" }}
                onClick={(e) => e.stopPropagation()}
              >
                Lausunto kokonaisuudessaan ↗
              </a>
            )}
            {reportUrl && (
              <a
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ color: "var(--accent-green)" }}
                onClick={(e) => e.stopPropagation()}
              >
                Katso mietintö ↗
              </a>
            )}
          </div>
        </div>
      )}

      {/* Non-expandable: show report link inline */}
      {!hasSummary && reportUrl && (
        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline"
            style={{ color: "var(--accent-green)" }}
          >
            Katso mietintö ↗
          </a>
        </div>
      )}
    </div>
  );
}
