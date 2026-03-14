import { NextRequest, NextResponse } from "next/server";
import { runSync } from "@/sync/sync-orchestrator";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min — Vercel Pro only; remove for free tier

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-sync-key");
  if (!key || key !== process.env.SYNC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const year = typeof body.year === "number" ? body.year : undefined;
  const skipMps = body.skipMps === true;
  const incremental = body.incremental !== false; // default: true

  const result = await runSync({ year, skipMps, incremental });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

/** GET version for Vercel cron (cron jobs use GET) */
export async function GET(req: NextRequest) {
  // Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const auth = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runSync({ incremental: true, skipMps: true });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
