/**
 * Incremental bill sync: VaskiData → bills + committee_assignments + documents tables.
 *
 * Processes HE, LA, and KAA documents as primary bills.
 * Committee reports (HaVM, PuVM, etc.) are processed to update committee_assignments.
 */

import { getPrisma } from "../lib/db";
import { fetchTableRows, VASKI_COL } from "../lib/eduskunta-api";
import {
  parseVaskiXml,
  isPrimaryBillType,
  isCommitteeReport,
  isCommitteeStatement,
  committeeCodeFromReport,
  getDocTypeFromTunnus,
} from "../lib/xml-parser";
import { detectStage } from "./detect-stage";
import { COMMITTEES } from "../lib/constants";

/** Map keyword/title hints to categories */
function inferCategory(keywords: string[], title: string): string {
  const text = [...keywords, title].join(" ").toLowerCase();
  if (/puolustus|asevelvollisuus|sotilas|maanpuolustus/.test(text)) return "Puolustus";
  if (/vero|tulover|arvonlis|verotus/.test(text)) return "Verotus";
  if (/sosiaali|terveys|hyvinvointi|sairaus|eläke/.test(text)) return "Sosiaali- ja terveys";
  if (/koulutus|opetus|yliopisto|koulu/.test(text)) return "Koulutus";
  if (/ympäristö|ilmasto|energia|luonto/.test(text)) return "Ympäristö ja energia";
  if (/liikenne|tieliikenne|rautatie|lentolii/.test(text)) return "Liikenne";
  if (/talousarvio|budjetti|valtion talous/.test(text)) return "Talousarvio";
  if (/rikoslaki|rikos|rangaistus|poliisi/.test(text)) return "Sisäinen turvallisuus";
  if (/maahanmuutto|kansalaisuus|ulkomaalais/.test(text)) return "Maahanmuutto";
  if (/rakentamin|kaavoitus|maankäyttö/.test(text)) return "Ympäristö ja rakentaminen";
  if (/eläin|maatalous|metsä|kalastus/.test(text)) return "Maatalous ja eläimet";
  if (/tietosuoja|digitali|tieto|kyber/.test(text)) return "Digitalisaatio";
  if (/ulkopolitiikka|kansainvälinen|sopimus/.test(text)) return "Ulkopolitiikka";
  return "Muu";
}

function inferUrgency(tunnus: string, keywords: string[]): "high" | "normal" | "low" {
  const kw = keywords.join(" ").toLowerCase();
  if (/kiireellin/.test(kw) || /lisätalousarvio/.test(kw)) return "high";
  if (/turvallisuus|puolustus|hybridivaikutt/.test(kw)) return "high";
  return "normal";
}

export interface SyncBillsOptions {
  /** Fetch only documents newer than this timestamp (ISO string) */
  since?: string;
  /** Parliamentary year to sync. Default: current year. */
  year?: number;
  /** Limit rows fetched per page (max 100) */
  perPage?: number;
}

export interface SyncBillsResult {
  upserted: number;
  committeesUpdated: number;
  errors: number;
}

export async function syncBills(
  options: SyncBillsOptions = {}
): Promise<SyncBillsResult> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("No database connection");

  const year = options.year ?? new Date().getFullYear();
  console.log(`[sync-bills] Syncing bills for year ${year}...`);

  // Fetch one page at a time to stay within memory
  let page = 0;
  let upserted = 0;
  let committeesUpdated = 0;
  let errors = 0;

  while (true) {
    const rows = await fetchTableRows("VaskiData", {
      page,
      perPage: options.perPage ?? 100,
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      const tunnus = row[VASKI_COL.Eduskuntatunnus]?.trim();
      if (!tunnus) continue;

      // Filter by year
      if (!tunnus.includes(`/${year}`)) continue;

      const xml = row[VASKI_COL.XmlData] ?? "";
      const parsed = parseVaskiXml(xml);
      const typeCode = parsed.typeCode ?? getDocTypeFromTunnus(tunnus);

      try {
        if (isPrimaryBillType(typeCode)) {
          // ── Upsert bill ───────────────────────────────────────────────────
          const billNumber = parsed.billNumber ?? 0;
          const billYear = parsed.billYear ?? year;
          const titleFi = parsed.titleFi ?? tunnus;
          const keywords = parsed.keywords;
          const category = inferCategory(keywords, titleFi);
          const urgency = inferUrgency(tunnus, keywords);
          const submittedDate = parsed.submittedDate
            ? new Date(parsed.submittedDate)
            : null;
          const eduskuntaUrl = `https://www.eduskunta.fi/FI/vaski/${
            typeCode === "HE"
              ? "HallituksenEsitys"
              : typeCode === "LA"
              ? "Lakialoite"
              : "KansalaisAloite"
          }/Sivut/${typeCode}_${billNumber}+${billYear}.aspx`;

          await prisma.bill.upsert({
            where: { id: tunnus },
            update: {
              titleFi,
              keywords,
              category,
              urgency,
              submittedDate,
              eduskuntaUrl,
              updatedAt: new Date(),
            },
            create: {
              id: tunnus,
              billType: typeCode,
              billNumber,
              billYear,
              titleFi,
              keywords,
              category,
              urgency,
              currentStage: "submitted",
              submittedDate,
              sponsor: parsed.sponsor,
              eduskuntaUrl,
              stageUpdatedAt: submittedDate ?? new Date(),
            },
          });

          // Upsert primary document
          await prisma.document.upsert({
            where: { id: tunnus },
            update: {},
            create: {
              id: tunnus,
              billId: tunnus,
              docType: typeCode,
              titleFi: titleFi,
              publishedDate: submittedDate,
              eduskuntaUrl,
            },
          });

          upserted++;
        } else if (isCommitteeReport(tunnus)) {
          // ── Committee report: update committee_assignments ────────────────
          // Report tunnus format: "HaVM 3/2026 vp"
          // We need to find which bill this report belongs to.
          // The XML should contain the bill's EduskuntaTunnus in a reference field.
          const committeeCode = committeeCodeFromReport(tunnus);
          const committeeNameFi = committeeCode
            ? (COMMITTEES[committeeCode] ?? committeeCode)
            : "";

          // Try to find the parent bill in the XML
          const parentBillId = parsed.eduskuntaTunnus !== tunnus
            ? parsed.eduskuntaTunnus
            : null;

          if (parentBillId && committeeCode) {
            // Only proceed if the parent bill actually exists in the DB
            const parentExists = await prisma.bill.findUnique({
              where: { id: parentBillId },
              select: { id: true },
            });

            if (parentExists) {
              await prisma.committeeAssignment.upsert({
                where: { billId_committeeCode: { billId: parentBillId, committeeCode } },
                update: {
                  reportId: tunnus,
                  reportDate: parsed.submittedDate
                    ? new Date(parsed.submittedDate)
                    : undefined,
                },
                create: {
                  billId: parentBillId,
                  committeeCode,
                  committeeNameFi: committeeNameFi,
                  role: "lead",
                  reportId: tunnus,
                  reportDate: parsed.submittedDate
                    ? new Date(parsed.submittedDate)
                    : null,
                },
              });

              await prisma.document.upsert({
                where: { id: tunnus },
                update: {},
                create: {
                  id: tunnus,
                  billId: parentBillId,
                  docType: "mietinto",
                  titleFi: parsed.titleFi ?? tunnus,
                  publishedDate: parsed.submittedDate
                    ? new Date(parsed.submittedDate)
                    : null,
                  eduskuntaUrl: `https://www.eduskunta.fi/FI/vaski/Mietinto/Sivut/${tunnus.replace(" vp", "").replace(/\s+/g, "_")}.aspx`,
                },
              });

              committeesUpdated++;
            }
          } else if (committeeCode && !parentBillId) {
            // We have a report but can't link it yet — upsert as unlinked document
            await prisma.document.upsert({
              where: { id: tunnus },
              update: {},
              create: {
                id: tunnus,
                billId: null,
                docType: "mietinto",
                titleFi: parsed.titleFi ?? `${committeeNameFi} mietintö`,
                publishedDate: parsed.submittedDate
                  ? new Date(parsed.submittedDate)
                  : null,
              },
            });
          }
        } else if (isCommitteeStatement(tunnus)) {
          // Lausunto — store as document. Only link to parent bill if it
          // already exists in the DB; otherwise store unlinked (billId: null)
          // to avoid FK constraint violations.
          const rawParentId = parsed.eduskuntaTunnus !== tunnus
            ? parsed.eduskuntaTunnus
            : null;
          let parentBillId: string | null = null;
          if (rawParentId) {
            const exists = await prisma.bill.findUnique({
              where: { id: rawParentId },
              select: { id: true },
            });
            parentBillId = exists ? rawParentId : null;
          }
          await prisma.document.upsert({
            where: { id: tunnus },
            update: {},
            create: {
              id: tunnus,
              billId: parentBillId,
              docType: "lausunto",
              titleFi: parsed.titleFi ?? tunnus,
              publishedDate: parsed.submittedDate
                ? new Date(parsed.submittedDate)
                : null,
            },
          });
        }
      } catch (e) {
        console.error(`[sync-bills] Error on ${tunnus}:`, e);
        errors++;
      }
    }

    page++;
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(
    `[sync-bills] Done: ${upserted} bills, ${committeesUpdated} committee updates, ${errors} errors`
  );
  return { upserted, committeesUpdated, errors };
}

export async function recalculateStages(year: number) {
  const prisma = getPrisma();
  if (!prisma) return;
  const bills = await prisma.bill.findMany({
    where: { billYear: year },
    include: {
      documents: { select: { docType: true } },
      votes: { select: { id: true } },
      committees: { select: { role: true, reportId: true } },
      experts: { select: { id: true } },
    },
  });

  for (const bill of bills) {
    const stage = detectStage(bill);
    if (stage !== bill.currentStage) {
      await prisma.bill.update({
        where: { id: bill.id },
        data: { currentStage: stage, stageUpdatedAt: new Date() },
      });
    }
  }
}
