import { PARTIES } from "@/lib/constants";
import type { SampleMpVote } from "@/lib/sample-data";

interface PartyVoteGridProps {
  mpVotes: SampleMpVote[];
}

interface PartyBreakdown {
  party: string;
  name: string;
  color: string;
  jaa: number;
  ei: number;
  poissa: number;
  tyhjaa: number;
}

export default function PartyVoteGrid({ mpVotes }: PartyVoteGridProps) {
  const byParty: Record<string, PartyBreakdown> = {};

  for (const v of mpVotes) {
    if (!byParty[v.party]) {
      const info = PARTIES[v.party];
      byParty[v.party] = {
        party: v.party,
        name: info?.name ?? v.party,
        color: info?.color ?? "#888",
        jaa: 0,
        ei: 0,
        poissa: 0,
        tyhjaa: 0,
      };
    }
    const rec = byParty[v.party];
    if (v.voteValue === "Jaa") rec.jaa++;
    else if (v.voteValue === "Ei") rec.ei++;
    else if (v.voteValue === "Poissa") rec.poissa++;
    else if (v.voteValue === "Tyhjää") rec.tyhjaa++;
  }

  const parties = Object.values(byParty).sort((a, b) => b.jaa + b.ei - (a.jaa + a.ei));

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
        Puolueittain
      </h4>
      <div className="space-y-2">
        {parties.map((p) => {
          const total = p.jaa + p.ei + p.poissa + p.tyhjaa;
          const jaaPct = total > 0 ? (p.jaa / total) * 100 : 0;
          const eiPct = total > 0 ? (p.ei / total) * 100 : 0;

          return (
            <div key={p.party} className="flex items-center gap-3">
              <div
                className="text-xs font-mono font-semibold w-10 shrink-0"
                style={{ color: p.color }}
              >
                {p.party}
              </div>
              <div className="flex-1 h-5 rounded overflow-hidden flex">
                {p.jaa > 0 && (
                  <div
                    className="flex items-center justify-center text-xs"
                    style={{
                      width: `${jaaPct}%`,
                      background: "var(--accent-green)",
                      color: "var(--bg-base)",
                      minWidth: p.jaa > 0 ? "18px" : "0",
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {p.jaa}
                  </div>
                )}
                {p.ei > 0 && (
                  <div
                    className="flex items-center justify-center text-xs"
                    style={{
                      width: `${eiPct}%`,
                      background: "var(--accent-red)",
                      color: "white",
                      minWidth: p.ei > 0 ? "18px" : "0",
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {p.ei}
                  </div>
                )}
                <div style={{ flex: 1, background: "rgba(255,255,255,0.04)" }} />
              </div>
              <div
                className="text-xs text-right w-16 shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                {p.jaa > 0 && (
                  <span style={{ color: "var(--accent-green)" }}>{p.jaa} jaa</span>
                )}
                {p.ei > 0 && (
                  <span style={{ color: "var(--accent-red)" }}>
                    {p.jaa > 0 ? " · " : ""}
                    {p.ei} ei
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
