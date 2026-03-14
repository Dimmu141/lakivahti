import type { SampleVote } from "@/lib/sample-data";
import { formatFinnishDate } from "@/lib/utils";

export default function VoteBar({ vote }: { vote: SampleVote }) {
  const total = vote.votesFor + vote.votesAgainst + vote.votesAbsent + vote.votesEmpty;
  const forPct = total > 0 ? (vote.votesFor / total) * 100 : 0;
  const againstPct = total > 0 ? (vote.votesAgainst / total) * 100 : 0;
  const absentPct = total > 0 ? (vote.votesAbsent / total) * 100 : 0;
  const emptyPct = total > 0 ? (vote.votesEmpty / total) * 100 : 0;

  const passed = vote.result === "passed";

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--bg-inner)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ color: passed ? "var(--accent-green)" : "var(--accent-red)" }}
          >
            {passed ? "✓ Hyväksytty" : "✗ Hylätty"}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {formatFinnishDate(vote.voteDate)}
          </span>
        </div>
        <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
          {vote.id}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-bold font-mono" style={{ color: "var(--accent-green)" }}>
          {vote.votesFor}
        </span>
        <span className="text-lg font-mono" style={{ color: "var(--text-muted)" }}>–</span>
        <span className="text-3xl font-bold font-mono" style={{ color: "var(--accent-red)" }}>
          {vote.votesAgainst}
        </span>
        <span className="text-sm ml-2" style={{ color: "var(--text-muted)" }}>
          ({vote.votesAbsent} poissa, {vote.votesEmpty} tyhjää)
        </span>
      </div>

      {/* Bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-px">
        <div style={{ width: `${forPct}%`, background: "var(--accent-green)" }} />
        <div style={{ width: `${againstPct}%`, background: "var(--accent-red)" }} />
        <div style={{ width: `${absentPct}%`, background: "rgba(255,255,255,0.15)" }} />
        {emptyPct > 0 && (
          <div style={{ width: `${emptyPct}%`, background: "rgba(255,255,255,0.08)" }} />
        )}
      </div>

      <div
        className="flex gap-4 mt-2 text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        <span style={{ color: "var(--accent-green)" }}>▪ Jaa {vote.votesFor}</span>
        <span style={{ color: "var(--accent-red)" }}>▪ Ei {vote.votesAgainst}</span>
        <span>▪ Poissa {vote.votesAbsent}</span>
        {vote.votesEmpty > 0 && <span>▪ Tyhjää {vote.votesEmpty}</span>}
      </div>
    </div>
  );
}
