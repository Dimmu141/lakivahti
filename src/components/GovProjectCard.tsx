"use client";

import type { GovProject } from "@/lib/gov-projects-service";
import { PREP_PHASE_LABELS, PREP_PHASE_COLORS } from "@/lib/gov-projects-service";

function formatDate(d: string | null): string {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric", year: "numeric" });
}

export default function GovProjectCard({ project }: { project: GovProject }) {
  const phaseLabel = project.prepPhase
    ? (PREP_PHASE_LABELS[project.prepPhase] ?? project.prepPhase)
    : "Valmistelussa";
  const phaseColor = project.prepPhase
    ? (PREP_PHASE_COLORS[project.prepPhase] ?? "var(--text-muted)")
    : "var(--text-muted)";

  return (
    <a
      href={project.hankeikkunaUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl p-4 mb-3 transition-all"
      style={{
        background: "var(--bg-card)",
        border: "1px solid rgba(255,255,255,0.04)",
        textDecoration: "none",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = "rgba(78,204,163,0.2)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.04)")
      }
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-mono text-xs font-semibold"
            style={{ color: "var(--accent-green)" }}
          >
            {project.tunnus}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: `color-mix(in srgb, ${phaseColor} 12%, transparent)`,
              color: phaseColor,
              border: `1px solid color-mix(in srgb, ${phaseColor} 25%, transparent)`,
            }}
          >
            {phaseLabel}
          </span>
          {project.isUrgent && (
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
        {project.completionDate && (
          <span className="text-xs shrink-0" style={{ color: "var(--text-faint)" }}>
            Tavoite: {formatDate(project.completionDate)}
          </span>
        )}
      </div>

      {/* Title */}
      <h2
        className="text-sm font-medium leading-snug mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {project.aliasFi ?? project.nameFi}
      </h2>

      {/* Description */}
      {project.descriptionFi && (
        <p
          className="text-xs leading-relaxed mb-3 line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.descriptionFi}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs" style={{ color: "var(--text-muted)" }}>
        <div className="flex items-center gap-3 flex-wrap">
          {project.ministry && <span>{project.ministry}</span>}
          {project.responsibleMinister && (
            <>
              <span>·</span>
              <span>{project.responsibleMinister}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {project.heNumbers.length > 0 && (
            <span style={{ color: "var(--accent-green)" }}>
              → HE {project.heNumbers[0]}
            </span>
          )}
          <span style={{ color: "var(--accent-green)", opacity: 0.6 }}>↗</span>
        </div>
      </div>
    </a>
  );
}
