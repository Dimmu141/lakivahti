import { STAGES } from "@/lib/constants";

interface StatsPanelProps {
  counts: Record<string, number>;
  activeStage: string;
  onStageClick: (stage: string) => void;
}

export default function StatsPanel({ counts, activeStage, onStageClick }: StatsPanelProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
      <button
        onClick={() => onStageClick("")}
        className="col-span-4 sm:col-span-1 rounded-lg p-3 text-left transition-all"
        style={{
          background: activeStage === "" ? "rgba(233,69,96,0.15)" : "var(--bg-card)",
          border: `1px solid ${activeStage === "" ? "rgba(233,69,96,0.4)" : "rgba(255,255,255,0.04)"}`,
        }}
      >
        <div
          className="text-2xl font-bold font-mono"
          style={{ color: "var(--accent-red)" }}
        >
          {total}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Kaikki
        </div>
      </button>

      {STAGES.map((stage) => {
        const count = counts[stage.key] ?? 0;
        const isActive = activeStage === stage.key;
        return (
          <button
            key={stage.key}
            onClick={() => onStageClick(stage.key)}
            className="rounded-lg p-3 text-left transition-all"
            style={{
              background: isActive ? "rgba(233,69,96,0.12)" : "var(--bg-card)",
              border: `1px solid ${isActive ? "rgba(233,69,96,0.35)" : "rgba(255,255,255,0.04)"}`,
            }}
          >
            <div
              className="text-xl font-bold font-mono"
              style={{ color: count > 0 ? "var(--text-primary)" : "var(--text-faint)" }}
            >
              {count}
            </div>
            <div className="text-xs mt-0.5 leading-tight" style={{ color: "var(--text-muted)" }}>
              {stage.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
