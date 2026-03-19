import { NextRequest, NextResponse } from "next/server";
import { getBillById } from "@/lib/bills-service";
import { slugToBillId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate slug format: TYPE-NUMBER-YEAR (e.g. "he-1-2025")
  if (!/^[a-zA-Z]{2,3}-\d{1,4}-\d{4}$/.test(id)) {
    return NextResponse.json({ error: "Invalid bill ID format" }, { status: 400 });
  }

  const billId = slugToBillId(id);
  const bill = await getBillById(billId);

  if (!bill) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(bill);
}
