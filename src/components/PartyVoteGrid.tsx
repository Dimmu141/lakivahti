"use client";

import { useState } from "react";
import { PARTIES, COALITION_PARTIES, normalizePartyKey } from "@/lib/constants";
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
  isCoalition: boolean;
  mps: SampleMpVote[];
}

function PartyRow({ p }: { p: PartyBreakdown }) {
  const [expanded, setExpanded] = useState(false);
  const total = p.jaa + p.ei + p.poissa + p.tyhjaa;
  const jaaPct = total > 0 ? (p.jaa / total) * 100 : 0;
  const eiPct = total > 0 ? (p.ei / total) * 100 : 0;

  // Find majority vote for this party to detect dissidents
  const majorityVote = p.jaa >= p.ei ? "Jaa" : "Ei";

  return (
    <div>
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
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
        <span
          className="text-xs transition-transform shrink-0"
          style={{
            color: "var(--text-faint)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </div>

      {/* Expanded MP list */}
      {expanded && p.mps.length > 0 && (
        <div
          className="ml-12 mt-1.5 mb-2 rounded-lg p-2.5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
            {p.mps
              .sort((a, b) => {
                // Dissidents first, then by name
                const aDissent = a.voteValue !== majorityVote && a.voteValue !== "Poissa" && a.voteValue !== "Tyhjää" ? 0 : 1;
                const bDissent = b.voteValue !== majorityVote && b.voteValue !== "Poissa" && b.voteValue !== "Tyhjää" ? 0 : 1;
                if (aDissent !== bDissent) return aDissent - bDissent;
                return a.mpName.localeCompare(b.mpName, "fi");
              })
              .map((mp) => {
                const isDissent =
                  mp.voteValue !== majorityVote &&
                  mp.voteValue !== "Poissa" &&
                  mp.voteValue !== "Tyhjää";

                const voteColor =
                  mp.voteValue === "Jaa"
                    ? "var(--accent-green)"
                    : mp.voteValue === "Ei"
                    ? "var(--accent-red)"
                    : "var(--text-faint)";

                return (
                  <div
                    key={mp.mpName}
                    className="flex items-center justify-between py-0.5"
                  >
                    <span
                      className="text-xs truncate"
                      style={{
                        color: isDissent ? "var(--accent-yellow, #EAB308)" : "var(--text-secondary)",
                        fontWeight: isDissent ? 600 : 400,
                      }}
                    >
                      {isDissent && "⚠ "}{mp.mpName}
                    </span>
                    <span
                      className="text-xs font-mono shrink-0 ml-2"
                      style={{ color: voteColor }}
                    >
                      {mp.voteValue}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PartyVoteGrid({ mpVotes }: PartyVoteGridProps) {
  const byParty: Record<string, PartyBreakdown> = {};

  for (const v of mpVotes) {
    const partyKey = normalizePartyKey(v.party);
    if (!byParty[partyKey]) {
      const info = PARTIES[partyKey];
      byParty[partyKey] = {
        party: partyKey,
        name: info?.name ?? partyKey,
        color: info?.color ?? "#888",
        jaa: 0,
        ei: 0,
        poissa: 0,
        tyhjaa: 0,
        isCoalition: COALITION_PARTIES.has(partyKey),
        mps: [],
      };
    }
    const rec = byParty[partyKey];
    if (v.voteValue === "Jaa") rec.jaa++;
    else if (v.voteValue === "Ei") rec.ei++;
    else if (v.voteValue === "Poissa") rec.poissa++;
    else if (v.voteValue === "Tyhjää") rec.tyhjaa++;
    rec.mps.push(v);
  }

  const allParties = Object.values(byParty).sort((a, b) => b.jaa + b.ei - (a.jaa + a.ei));
  const coalition = allParties.filter((p) => p.isCoalition);
  const opposition = allParties.filter((p) => !p.isCoalition);

  // Calculate coalition/opposition totals
  const coalitionTotals = coalition.reduce(
    (acc, p) => ({ jaa: acc.jaa + p.jaa, ei: acc.ei + p.ei }),
    { jaa: 0, ei: 0 }
  );
  const oppositionTotals = opposition.reduce(
    (acc, p) => ({ jaa: acc.jaa + p.jaa, ei: acc.ei + p.ei }),
    { jaa: 0, ei: 0 }
  );

  const hasCoalitionData = coalition.length > 0 && opposition.length > 0;

  return (
    <div className="mt-4">
      {/* Coalition vs Opposition summary */}
      {hasCoalitionData && (
        <div
          className="flex gap-4 mb-4 p-3 rounded-lg"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex-1">
            <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Hallituspuolueet
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono" style={{ color: "var(--accent-green)" }}>
                {coalitionTotals.jaa}
              </span>
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>jaa</span>
              <span className="text-lg font-bold font-mono" style={{ color: "var(--accent-red)" }}>
                {coalitionTotals.ei}
              </span>
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>ei</span>
            </div>
          </div>
          <div
            className="w-px self-stretch"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="flex-1">
            <div className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Oppositio
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono" style={{ color: "var(--accent-green)" }}>
                {oppositionTotals.jaa}
              </span>
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>jaa</span>
              <span className="text-lg font-bold font-mono" style={{ color: "var(--accent-red)" }}>
                {oppositionTotals.ei}
              </span>
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>ei</span>
            </div>
          </div>
        </div>
      )}

      {/* Coalition parties */}
      {hasCoalitionData && coalition.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            Hallituspuolueet
          </h4>
          <div className="space-y-2">
            {coalition.map((p) => (
              <PartyRow key={p.party} p={p} />
            ))}
          </div>
        </div>
      )}

      {/* Opposition parties */}
      {hasCoalitionData && opposition.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            Oppositio
          </h4>
          <div className="space-y-2">
            {opposition.map((p) => (
              <PartyRow key={p.party} p={p} />
            ))}
          </div>
        </div>
      )}

      {/* Fallback: no coalition data — just list all */}
      {!hasCoalitionData && (
        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            Puolueittain
          </h4>
          <div className="space-y-2">
            {allParties.map((p) => (
              <PartyRow key={p.party} p={p} />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs mt-3" style={{ color: "var(--text-faint)" }}>
        Klikkaa puoluetta nähdäksesi yksittäiset äänestykset. ⚠ = äänesti puolueen enemmistöä vastaan.
      </p>
    </div>
  );
}
