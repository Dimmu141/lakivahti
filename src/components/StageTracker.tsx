import { STAGES } from "@/lib/constants";

const STAGE_KEYS = STAGES.map((s) => s.key);

interface StageTrackerProps {
  currentStage: string;
}

export default function StageTracker({ currentStage }: StageTrackerProps) {
  const currentIndex = STAGE_KEYS.indexOf(currentStage as typeof STAGE_KEYS[number]);

  return (
    <div className="w-full">
      <div className="flex items-start">
        {STAGES.map((stage, i) => {
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={stage.key} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div
                  className="absolute top-3.5 h-px"
                  style={{
                    left: "50%",
                    right: "-50%",
                    background: isPast || isCurrent
                      ? "linear-gradient(90deg, var(--accent-green), var(--accent-green))"
                      : "rgba(255,255,255,0.08)",
                  }}
                />
              )}

              {/* Circle */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs z-10 relative transition-all"
                style={{
                  background: isCurrent
                    ? "var(--accent-red)"
                    : isPast
                    ? "var(--accent-green)"
                    : "var(--bg-inner)",
                  border: isFuture ? "1px solid rgba(255,255,255,0.12)" : "none",
                  boxShadow: isCurrent ? "0 0 12px rgba(233,69,96,0.5)" : "none",
                }}
              >
                {isPast ? (
                  <span style={{ color: "var(--bg-base)" }}>✓</span>
                ) : isCurrent ? (
                  <span className="text-white">●</span>
                ) : (
                  <span style={{ color: "var(--text-faint)", fontSize: "10px" }}>{i + 1}</span>
                )}
              </div>

              {/* Label */}
              <div
                className="mt-1.5 text-center text-xs leading-tight px-0.5"
                style={{
                  color: isCurrent
                    ? "var(--accent-red)"
                    : isPast
                    ? "var(--accent-green)"
                    : "var(--text-faint)",
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
