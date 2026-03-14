import type { StageKey } from "./constants";

interface BillWithRelations {
  documents: { docType: string }[];
  votes: unknown[];
  committees: { role: string; reportId: string | null }[];
  experts: unknown[];
}

export function detectStage(bill: BillWithRelations): StageKey {
  if (bill.documents.some((d) => d.docType === "saadoskokoelma")) return "enacted";
  if (bill.votes.length > 0) return "voted";
  const leadCommittee = bill.committees.find((c) => c.role === "lead");
  if (leadCommittee?.reportId) return "report";
  if (bill.experts.length > 0) return "hearing";
  if (bill.committees.length > 0) return "committee";
  return "submitted";
}
