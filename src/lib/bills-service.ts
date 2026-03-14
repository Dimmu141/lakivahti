import { prisma } from "./db";
import { SAMPLE_BILLS, type SampleBill } from "./sample-data";

export interface BillsQuery {
  stage?: string;
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface BillsResult {
  bills: SampleBill[];
  total: number;
  page: number;
  totalPages: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToSampleBill(bill: any): SampleBill {
  return {
    id: bill.id,
    billType: bill.billType,
    billNumber: bill.billNumber,
    billYear: bill.billYear,
    titleFi: bill.titleFi,
    summaryFi: bill.summaryFi ?? "",
    category: bill.category ?? "Muu",
    currentStage: bill.currentStage,
    submittedDate: bill.submittedDate?.toISOString().split("T")[0] ?? "",
    stageUpdatedAt:
      bill.stageUpdatedAt?.toISOString().split("T")[0] ??
      bill.updatedAt?.toISOString().split("T")[0] ??
      "",
    sponsor: bill.sponsor ?? "",
    urgency: (bill.urgency ?? "normal") as "high" | "normal" | "low",
    keywords: bill.keywords ?? [],
    eduskuntaUrl: bill.eduskuntaUrl ?? "",
    committees: (bill.committees ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) => ({
        committeeCode: c.committeeCode,
        committeeNameFi: c.committeeNameFi,
        role: c.role as "lead" | "statement",
        reportId: c.reportId ?? null,
        reportDate: c.reportDate?.toISOString().split("T")[0] ?? null,
      })
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    experts: (bill.experts ?? []).map((e: any) => ({
      id: e.id,
      expertName: e.expertName,
      expertOrganization: e.expertOrganization ?? null,
      hearingDate: e.hearingDate?.toISOString().split("T")[0] ?? null,
      position: (e.position ?? null) as "for" | "against" | "neutral" | null,
      summaryFi: e.summaryFi ?? null,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    votes: (bill.votes ?? []).map((v: any) => ({
      id: v.id,
      voteDate: v.voteDate?.toISOString() ?? "",
      votesFor: v.votesFor,
      votesAgainst: v.votesAgainst,
      votesAbsent: v.votesAbsent,
      votesEmpty: v.votesEmpty,
      result: (v.result ?? "rejected") as "passed" | "rejected",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mpVotes: (v.mpVotes ?? []).map((mp: any) => ({
        mpName: mp.mpName,
        party: mp.party,
        voteValue: mp.voteValue as "Jaa" | "Ei" | "Poissa" | "Tyhjää",
      })),
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    documents: (bill.documents ?? []).map((d: any) => ({
      id: d.id,
      docType: d.docType,
      titleFi: d.titleFi ?? "",
      publishedDate: d.publishedDate?.toISOString().split("T")[0] ?? "",
      eduskuntaUrl: d.eduskuntaUrl ?? "",
    })),
  };
}

/** Returns bills from DB with filtering/pagination. Falls back to sample data if DB is unavailable. */
export async function getBills(query: BillsQuery = {}): Promise<BillsResult> {
  const { stage, category, q, page = 1, limit = 100 } = query;

  try {
    if (!prisma) throw new Error("no db");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (stage) where.currentStage = stage;
    if (category) where.category = category;
    if (q) {
      where.OR = [
        { titleFi: { contains: q, mode: "insensitive" } },
        { summaryFi: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, bills] = await Promise.all([
      prisma.bill.count({ where }),
      prisma.bill.findMany({
        where,
        include: { committees: true },
        orderBy: { stageUpdatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      bills: bills.map(dbToSampleBill),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    // DB unavailable — serve sample data
    const filtered = SAMPLE_BILLS.filter((b) => {
      if (stage && b.currentStage !== stage) return false;
      if (category && b.category !== category) return false;
      if (q) {
        const hay = [b.titleFi, b.id, ...b.keywords, b.category]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    const start = (page - 1) * limit;
    return {
      bills: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }
}

/** Returns a single bill with all related data. Falls back to sample data. */
export async function getBillById(billId: string): Promise<SampleBill | null> {
  try {
    if (!prisma) throw new Error("no db");
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        committees: true,
        experts: true,
        votes: { include: { mpVotes: true } },
        documents: true,
      },
    });
    if (!bill) return null;
    return dbToSampleBill(bill);
  } catch {
    return SAMPLE_BILLS.find((b) => b.id === billId) ?? null;
  }
}

/** Returns stage counts. Falls back to sample data counts. */
export async function getStageCounts(): Promise<Record<string, number>> {
  try {
    if (!prisma) throw new Error("no db");
    const rows = await prisma.bill.groupBy({
      by: ["currentStage"],
      _count: { id: true },
    });
    return Object.fromEntries(rows.map((r) => [r.currentStage, r._count.id]));
  } catch {
    return SAMPLE_BILLS.reduce(
      (acc, b) => {
        acc[b.currentStage] = (acc[b.currentStage] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }
}

/** Returns all distinct categories. */
export async function getCategories(): Promise<string[]> {
  try {
    if (!prisma) throw new Error("no db");
    const rows = await prisma.bill.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { category: { not: null } },
      orderBy: { category: "asc" },
    });
    return rows.map((r) => r.category!).filter(Boolean);
  } catch {
    return [...new Set(SAMPLE_BILLS.map((b) => b.category))].sort();
  }
}
