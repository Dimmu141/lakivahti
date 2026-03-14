import type { SampleExpert } from "@/lib/sample-data";
import { formatFinnishDate } from "@/lib/utils";

const POSITION_CONFIG = {
  for: { label: "Puolesta", color: "var(--accent-green)", bg: "rgba(78,204,163,0.1)", border: "rgba(78,204,163,0.2)" },
  against: { label: "Vastaan", color: "var(--accent-red)", bg: "rgba(233,69,96,0.1)", border: "rgba(233,69,96,0.2)" },
  neutral: { label: "Neutraali", color: "var(--accent-yellow)", bg: "rgba(255,201,71,0.1)", border: "rgba(255,201,71,0.2)" },
};

export default function ExpertCard({ expert }: { expert: SampleExpert }) {
  const posConfig = expert.position ? POSITION_CONFIG[expert.position] : null;

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: "var(--bg-inner)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {expert.expertName}
          </div>
          {expert.expertOrganization && (
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {expert.expertOrganization}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {posConfig && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: posConfig.bg,
                color: posConfig.color,
                border: `1px solid ${posConfig.border}`,
              }}
            >
              {posConfig.label}
            </span>
          )}
          {expert.hearingDate && (
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
              {formatFinnishDate(expert.hearingDate)}
            </span>
          )}
        </div>
      </div>

      {expert.summaryFi && (
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {expert.summaryFi}
        </p>
      )}
    </div>
  );
}
