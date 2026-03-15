import type { StageKey } from "../lib/constants";

interface BillSnapshot {
  documents: { docType: string }[];
  votes: unknown[];
  committees: { role: string; reportId: string | null }[];
  experts: unknown[];
  processingStageCode?: string | null;
}

/**
 * Map yleinenKasittelyvaiheKoodi to app stage.
 *
 *  VIR / ILM / LK             → submitted
 *  VIRVK                       → committee
 *  KASVK                       → hearing
 *  VKPLM                       → report
 *  VKPP / 1K / 2K              → plenary
 *  EVEK / TOIMEVEK             → voted  (parliament voted, bill sent to president)
 */
function stageFromCode(code: string): StageKey | null {
  if (["VIR", "ILM", "LK"].includes(code)) return "submitted";
  if (code === "VIRVK") return "committee";
  if (code === "KASVK") return "hearing";
  if (code === "VKPLM") return "report";
  if (["VKPP", "1K", "2K"].includes(code)) return "plenary";
  if (["EVEK", "TOIMEVEK"].includes(code)) return "voted";
  return null;
}

/** Derive current bill stage from its related records + processing stage code. */
export function detectStage(bill: BillSnapshot): StageKey {
  // Enacted — statute published in law gazette
  if (bill.documents.some((d) => d.docType === "saadoskokoelma")) return "enacted";

  const lead = bill.committees.find((c) => c.role === "lead");

  // Plenary vote recorded → "voted" (äänestetty)
  if (bill.votes.length > 0) return "voted";

  // Use the processing stage code as the primary signal when available.
  // It reflects the actual progress tracked in Eduskunta's own system.
  if (bill.processingStageCode) {
    const codeStage = stageFromCode(bill.processingStageCode);
    if (codeStage && codeStage !== "submitted") {
      // For "report" stage, also require a committee assignment with reportId
      // so we don't jump straight to "report" before the report is synced.
      if (codeStage === "report") {
        return lead?.reportId ? "report" : "hearing";
      }
      return codeStage;
    }
  }

  // Fallback: derive stage from DB relations
  if (lead?.reportId) return "report";

  if (lead) {
    // Committee assigned, no report yet:
    //   • expert hearings underway → "hearing"
    //   • no experts yet           → "committee"
    return bill.experts.length > 0 ? "hearing" : "committee";
  }

  if (bill.experts.length > 0) return "hearing";
  if (bill.committees.length > 0) return "committee";

  return "submitted";
}
