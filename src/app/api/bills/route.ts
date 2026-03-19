import { NextRequest, NextResponse } from "next/server";
import { getBills, getStageCounts, getCategories } from "@/lib/bills-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const stage = searchParams.get("stage") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const rawLimit = parseInt(searchParams.get("limit") ?? "100", 10);
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(rawLimit, 500) : 100;

  const [result, stageCounts, categories] = await Promise.all([
    getBills({ stage, category, q, page, limit }),
    getStageCounts(),
    getCategories(),
  ]);

  return NextResponse.json({ ...result, stageCounts, categories });
}
