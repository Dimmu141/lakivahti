import type { StageKey } from "../lib/constants";

interface BillSnapshot {
  documents: { docType: string }[];
  votes: unknown[];
  committees: { role: string; reportId: string | null }[];
  experts: unknown[];
}

/** Derive current bill stage from its related records. */
export function detectStage(bill: BillSnapshot): StageKey {
  // Enacted — statute published in law gazette
  if (bill.documents.some((d) => d.docType === "saadoskokoelma")) return "enacted";

  const lead = bill.committees.find((c) => c.role === "lead");

  // Plenary vote recorded → "voted" (äänestetty)
  if (bill.votes.length > 0) return "voted";

  // Committee report published → "report" (mietintö)
  // Awaiting plenary scheduling. We cannot detect the "plenary" stage
  // from API data alone (no real-time session schedule available).
  if (lead?.reportId) return "report";

  // Committee assigned, report not yet published:
  //   • expert hearings underway → "hearing" (kuuleminen)
  //   • no experts yet          → "committee" (valiokunnassa)
  if (lead) {
    return bill.experts.length > 0 ? "hearing" : "committee";
  }

  // Expert hearings exist without a formal committee assignment record
  if (bill.experts.length > 0) return "hearing";

  // Committee assignment exists without a lead (edge case)
  if (bill.committees.length > 0) return "committee";

  return "submitted";
}
