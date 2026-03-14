/**
 * Main sync orchestrator — called by /api/sync and the cron job.
 *
 * Runs: MPs → Bills → Votes (in that order so FK constraints are satisfied).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { syncMps } from "./sync-mps";
import { syncBills, recalculateStages } from "./sync-bills";
import { syncVotes } from "./sync-votes";

/** Earliest parliamentary year to fetch data for. */
export const SYNC_START_YEAR = 2024;

export interface SyncResult {
  ok: boolean;
  timestamp: string;
  years: number[];
  mps?: { upserted: number; errors: number };
  bills?: { upserted: number; committeesUpdated: number; errors: number };
  votes?: { upserted: number; mpVotes: number; errors: number };
  error?: string;
}

export async function runSync(options: {
  /** Sync a single year only. Defaults to all years from SYNC_START_YEAR to current. */
  year?: number;
  skipMps?: boolean;
  incremental?: boolean;
} = {}): Promise<SyncResult> {
  const currentYear = new Date().getFullYear();
  const years = options.year
    ? [options.year]
    : Array.from(
        { length: currentYear - SYNC_START_YEAR + 1 },
        (_, i) => SYNC_START_YEAR + i
      );

  const timestamp = new Date().toISOString();
  console.log(`[sync] Starting sync for years ${years.join(", ")}...`);

  try {
    const mps = options.skipMps ? undefined : await syncMps();

    let totalBills = { upserted: 0, committeesUpdated: 0, errors: 0 };
    let totalVotes = { upserted: 0, mpVotes: 0, errors: 0 };

    for (const year of years) {
      const b = await syncBills({ year });
      totalBills.upserted += b.upserted;
      totalBills.committeesUpdated += b.committeesUpdated;
      totalBills.errors += b.errors;

      const v = await syncVotes({ year, incremental: options.incremental });
      totalVotes.upserted += v.upserted;
      totalVotes.mpVotes += v.mpVotes;
      totalVotes.errors += v.errors;
    }

    // Recalculate stages AFTER all votes are synced so vote-linked stages
    // (voted, enacted) are correctly detected.
    console.log("[sync] Recalculating stages...");
    for (const year of years) {
      await recalculateStages(year);
    }

    console.log("[sync] Complete.");
    return { ok: true, timestamp, years, mps, bills: totalBills, votes: totalVotes };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("[sync] Failed:", error);
    return { ok: false, timestamp, years, error };
  }
}

// Entry point when run directly via `npm run sync`
if (process.argv[1] && process.argv[1].includes("sync-orchestrator")) {
  runSync().then((result) => {
    console.log("[sync] Result:", JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  });
}
