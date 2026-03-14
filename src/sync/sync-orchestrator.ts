/**
 * Main sync orchestrator — called by /api/sync and the cron job.
 *
 * Runs: MPs → Bills → Votes (in that order so FK constraints are satisfied).
 */

import { syncMps } from "./sync-mps";
import { syncBills } from "./sync-bills";
import { syncVotes } from "./sync-votes";

export interface SyncResult {
  ok: boolean;
  timestamp: string;
  year: number;
  mps?: { upserted: number; errors: number };
  bills?: { upserted: number; committeesUpdated: number; errors: number };
  votes?: { upserted: number; mpVotes: number; errors: number };
  error?: string;
}

export async function runSync(options: {
  year?: number;
  skipMps?: boolean;
  incremental?: boolean;
} = {}): Promise<SyncResult> {
  const year = options.year ?? new Date().getFullYear();
  const timestamp = new Date().toISOString();
  console.log(`[sync] Starting sync for year ${year}...`);

  try {
    const mps = options.skipMps ? undefined : await syncMps();
    const bills = await syncBills({ year });
    const votes = await syncVotes({ year, incremental: options.incremental });

    console.log("[sync] Complete.");
    return { ok: true, timestamp, year, mps, bills, votes };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("[sync] Failed:", error);
    return { ok: false, timestamp, year, error };
  }
}
