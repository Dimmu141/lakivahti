/**
 * Sync SaliDBAanestys + SaliDBAanestysEdustaja → votes + mp_votes tables.
 *
 * Fetches votes for a given parliamentary year (default: current year).
 * Links each vote to a bill via AanestysValtiopaivaasia which contains the
 * Eduskuntatunnus (e.g. "HE 1/2026 vp").
 */

import { getPrisma } from "../lib/db";
import {
  fetchTableRows,
  fetchAllRows,
  AANESTYS_COL,
  EDUSTAJA_COL,
} from "../lib/eduskunta-api";

/** Normalise party abbreviation to uppercase (API returns lowercase "sd" etc.) */
function normaliseParty(raw: string): string {
  const map: Record<string, string> = {
    sd: "SDP",
    kok: "KOK",
    ps: "PS",
    kesk: "KESK",
    vihr: "VIHR",
    vas: "VAS",
    rkp: "RKP",
    kd: "KD",
    liik: "LIIK",
  };
  return map[raw.toLowerCase()] ?? raw.toUpperCase();
}

function parseVoteValue(raw: string): string {
  // API values: "Jaa", "Ei", "Poissa", "Tyhjää"
  const v = raw.trim();
  if (v === "Jaa" || v === "Ei" || v === "Poissa") return v;
  if (v.startsWith("Tyh")) return "Tyhjää";
  return v || "Poissa";
}

export interface SyncVotesOptions {
  /** Fetch votes for this parliamentary year. Default: current year. */
  year?: number;
  /** If true, only fetch votes not yet in the DB (incremental). */
  incremental?: boolean;
}

export async function syncVotes(
  options: SyncVotesOptions = {}
): Promise<{ upserted: number; mpVotes: number; errors: number }> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("No database connection");

  const year = options.year ?? new Date().getFullYear();
  console.log(`[sync-votes] Fetching votes for year ${year}...`);

  // Fetch all vote rows for this parliamentary year
  const voteRows = await fetchAllRows("SaliDBAanestys", {
    columnName: "IstuntoVPVuosi",
    columnValue: String(year),
  });
  console.log(`[sync-votes] Got ${voteRows.length} vote rows`);

  let upserted = 0;
  let mpVotesInserted = 0;
  let errors = 0;

  for (const row of voteRows) {
    const aanestysId = row[AANESTYS_COL.AanestysId];
    if (!aanestysId) continue;

    // Skip if incremental and vote already exists
    if (options.incremental) {
      const existing = await prisma.vote.findUnique({ where: { id: aanestysId } });
      if (existing) continue;
    }

    const billId = row[AANESTYS_COL.AanestysValtiopaivaasia]?.trim() || null;
    const voteDateRaw = row[AANESTYS_COL.AanestysAlkuaika] || row[AANESTYS_COL.IstuntoPvm];
    const voteDate = voteDateRaw ? new Date(voteDateRaw) : null;

    const votesFor = parseInt(row[AANESTYS_COL.AanestysTulosJaa] ?? "0", 10) || 0;
    const votesAgainst = parseInt(row[AANESTYS_COL.AanestysTulosEi] ?? "0", 10) || 0;
    const votesEmpty = parseInt(row[AANESTYS_COL.AanestysTulosTyhjia] ?? "0", 10) || 0;
    const votesAbsent = parseInt(row[AANESTYS_COL.AanestysTulosPoissa] ?? "0", 10) || 0;
    const result = votesFor > votesAgainst ? "passed" : "rejected";

    try {
      // Verify bill exists if billId is set
      let resolvedBillId = billId;
      if (billId) {
        const bill = await prisma.bill.findUnique({ where: { id: billId } });
        if (!bill) resolvedBillId = null; // Don't create orphan vote
      }

      await prisma.vote.upsert({
        where: { id: aanestysId },
        update: {
          voteDate,
          votesFor,
          votesAgainst,
          votesEmpty,
          votesAbsent,
          result,
          ...(resolvedBillId && { billId: resolvedBillId }),
        },
        create: {
          id: aanestysId,
          billId: resolvedBillId,
          voteDate,
          votesFor,
          votesAgainst,
          votesEmpty,
          votesAbsent,
          result,
        },
      });
      upserted++;

      // Fetch individual MP votes for this vote
      const mpRows = await fetchTableRows("SaliDBAanestysEdustaja", {
        columnName: "AanestysId",
        columnValue: aanestysId,
        perPage: 100,
      });

      for (const mpRow of mpRows) {
        const mpId = mpRow[EDUSTAJA_COL.EdustajaHenkiloNumero];
        if (!mpId) continue;

        const firstName = mpRow[EDUSTAJA_COL.EdustajaEtunimi] ?? "";
        const lastName = mpRow[EDUSTAJA_COL.EdustajaSukunimi] ?? "";
        const party = normaliseParty(mpRow[EDUSTAJA_COL.EdustajaRyhmaLyhenne] ?? "");
        const voteValue = parseVoteValue(mpRow[EDUSTAJA_COL.EdustajaAanestys] ?? "Poissa");

        await prisma.mpVote.upsert({
          where: { voteId_mpId: { voteId: aanestysId, mpId } },
          update: { voteValue },
          create: {
            voteId: aanestysId,
            mpId,
            mpName: `${firstName} ${lastName}`.trim(),
            party,
            voteValue,
          },
        });
        mpVotesInserted++;
      }

      // Throttle
      await new Promise((r) => setTimeout(r, 100));
    } catch (e) {
      console.error(`[sync-votes] Error on vote ${aanestysId}:`, e);
      errors++;
    }
  }

  console.log(
    `[sync-votes] Done: ${upserted} votes, ${mpVotesInserted} MP votes, ${errors} errors`
  );
  return { upserted, mpVotes: mpVotesInserted, errors };
}
