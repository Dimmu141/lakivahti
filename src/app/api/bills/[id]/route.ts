import { NextRequest, NextResponse } from "next/server";
import { getBillById } from "@/lib/bills-service";
import { slugToBillId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const billId = slugToBillId(id);
  const bill = await getBillById(billId);

  if (!bill) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(bill);
}
