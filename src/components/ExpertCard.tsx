import type { SampleExpert } from "@/lib/sample-data";
import { formatFinnishDate } from "@/lib/utils";

export default function ExpertCard({
  expert,
  reportUrl,
}: {
  expert: SampleExpert;
  reportUrl?: string | null;
}) {
  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: "var(--bg-inner)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
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
        <div className="flex items-center gap-3 shrink-0">
          {expert.hearingDate && (
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
              {formatFinnishDate(expert.hearingDate)}
            </span>
          )}
          {reportUrl && (
            <a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: "var(--accent-green)" }}
            >
              Katso mietintö →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
