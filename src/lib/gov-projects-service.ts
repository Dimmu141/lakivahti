import { prisma } from "./db";

export interface GovProject {
  uuid: string;
  tunnus: string;
  nameFi: string;
  aliasFi: string | null;
  descriptionFi: string | null;
  status: string;
  prepPhase: string | null;
  ministry: string | null;
  startDate: string | null;
  completionDate: string | null;
  heNumbers: string[];
  keywords: string[];
  isUrgent: boolean;
  responsibleMinister: string | null;
  hankeikkunaUrl: string | null;
  updatedAt: string;
}

export const PREP_PHASE_LABELS: Record<string, string> = {
  PERUSVALMISTELU: "Perusvalmistelu",
  LAUSUNTOKIERROS: "Lausuntokierros",
  JATKOVALMISTELUSSA: "Jatkovalmistelussa",
  ESITTELYVALMIS: "Esittelyvalmis",
  LAINVALMISTELU: "Lainvalmistelu",
};

export const PREP_PHASE_COLORS: Record<string, string> = {
  PERUSVALMISTELU: "var(--text-muted)",
  LAUSUNTOKIERROS: "var(--accent-yellow)",
  JATKOVALMISTELUSSA: "var(--accent-green)",
  ESITTELYVALMIS: "var(--accent-red)",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToGovProject(p: any): GovProject {
  return {
    uuid: p.uuid,
    tunnus: p.tunnus,
    nameFi: p.nameFi,
    aliasFi: p.aliasFi ?? null,
    descriptionFi: p.descriptionFi ?? null,
    status: p.status,
    prepPhase: p.prepPhase ?? null,
    ministry: p.ministry ?? null,
    startDate: p.startDate?.toISOString().split("T")[0] ?? null,
    completionDate: p.completionDate?.toISOString().split("T")[0] ?? null,
    heNumbers: p.heNumbers ?? [],
    keywords: p.keywords ?? [],
    isUrgent: p.isUrgent ?? false,
    responsibleMinister: p.responsibleMinister ?? null,
    hankeikkunaUrl: p.hankeikkunaUrl ?? null,
    updatedAt: p.updatedAt?.toISOString().split("T")[0] ?? "",
  };
}

/** Get recent/active government projects for homepage */
export async function getRecentGovProjects(limit = 6): Promise<GovProject[]> {
  if (!prisma) return [];
  try {
    const rows = await prisma.governmentProject.findMany({
      where: { status: "KAYNNISSA" },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
    return rows.map(dbToGovProject);
  } catch {
    return [];
  }
}

/** Get all government projects with optional filters */
export async function getGovProjects(opts: {
  q?: string;
  prepPhase?: string;
  ministry?: string;
  limit?: number;
  page?: number;
} = {}): Promise<{ projects: GovProject[]; total: number }> {
  if (!prisma) return { projects: [], total: 0 };
  const { q, prepPhase, ministry, limit = 50, page = 1 } = opts;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: "KAYNNISSA" };
  if (prepPhase) where.prepPhase = prepPhase;
  if (ministry) where.ministry = { contains: ministry, mode: "insensitive" };
  if (q) {
    where.OR = [
      { nameFi: { contains: q, mode: "insensitive" } },
      { descriptionFi: { contains: q, mode: "insensitive" } },
      { aliasFi: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const [rows, total] = await Promise.all([
      prisma.governmentProject.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.governmentProject.count({ where }),
    ]);
    return { projects: rows.map(dbToGovProject), total };
  } catch {
    return { projects: [], total: 0 };
  }
}

/** Find a government project linked to a specific bill (by HE number) */
export async function getGovProjectForBill(
  billType: string,
  billNumber: number,
  billYear: number
): Promise<GovProject | null> {
  if (!prisma || billType !== "HE") return null;
  const heKey = `${billNumber}/${billYear}`;
  try {
    const row = await prisma.governmentProject.findFirst({
      where: {
        heNumbers: { has: heKey },
      },
    });
    return row ? dbToGovProject(row) : null;
  } catch {
    return null;
  }
}

/** Get unique ministries for filter dropdown */
export async function getMinistries(): Promise<string[]> {
  if (!prisma) return [];
  try {
    const rows = await prisma.governmentProject.findMany({
      where: { status: "KAYNNISSA", ministry: { not: null } },
      select: { ministry: true },
      distinct: ["ministry"],
      orderBy: { ministry: "asc" },
    });
    return rows.map((r) => r.ministry!).filter(Boolean);
  } catch {
    return [];
  }
}
