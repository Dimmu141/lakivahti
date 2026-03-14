import type { StageKey } from "../lib/constants";

interface BillSnapshot {
  documents: { docType: string }[];
  votes: unknown[];
  committees: { role: string; reportId: string | null }[];
  experts: unknown[];
}

/** Derive current bill stage from its related records. */
export function detectStage(bill: BillSnapshot): StageKey {
  if (bill.documents.some((d) => d.docType === "saadoskokoelma")) return "enacted";
  if (bill.votes.length > 0) return "voted";
  const lead = bill.committees.find((c) => c.role === "lead");
  if (lead?.reportId) return "report";
  if (bill.experts.length > 0) return "hearing";
  if (bill.committees.length > 0) return "committee";
  return "submitted";
}
