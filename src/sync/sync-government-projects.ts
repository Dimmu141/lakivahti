/**
 * Syncs Finnish government legislative projects from api.hankeikkuna.fi
 * into the government_projects table.
 *
 * Only syncs LAINSAADANTO type projects (legislation preparation) with
 * status KAYNNISSA (ongoing) or recently updated PAATTYNYT (ended).
 */

import { getPrisma } from "../lib/db";

const HANKEIKKUNA_BASE = "https://api.hankeikkuna.fi/api/v2";
const PAGE_SIZE = 100;

interface HankeKohde {
  uuid: string;
  tunnus: string;
  nimi: { fi: string; sv?: string; en?: string };
  alias?: { fi?: string; sv?: string };
  kuvaus?: { fi?: string; sv?: string };
  tila: string;
  valmisteluvaihe?: string;
  tyyppi: string;
  aloitusPaiva?: string;
  valmistumisPaiva?: string;
  asianumerot?: string[];
  asettajaUuid?: string;
  julkaisuaika?: string;
}

interface HankeResult {
  kohde: HankeKohde;
  lainsaadanto?: {
    tehtavaluokka?: string;
    heTiedot?: {
      heNumerot?: string[];
      kiireellinen?: boolean;
      vastuuministeri?: { fi?: string; sv?: string; en?: string } | string | null;
    };
  };
  asiasanat?: Array<{ fi?: string; sv?: string; en?: string }>;
}

/** Fetch and cache all ministries (asettajat) by UUID */
async function loadMinistries(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const res = await fetch(`${HANKEIKKUNA_BASE}/asettajat`);
    if (!res.ok) return map;
    const data = await res.json();
    for (const a of data ?? []) {
      if (a.uuid && a.nimi?.fi) {
        map.set(a.uuid, a.nimi.fi);
      }
    }
  } catch {
    // Non-fatal — ministry names will be null
  }
  return map;
}

/** POST to /kohteet/haku with cursor-based pagination */
async function fetchPage(
  searchAfter: string | null,
  tilaFilter: string[]
): Promise<{ results: HankeResult[]; nextCursor: string | null }> {
  const body: Record<string, unknown> = {
    size: PAGE_SIZE,
    tila: tilaFilter,
  };
  if (searchAfter) body.searchAfter = searchAfter;

  const res = await fetch(`${HANKEIKKUNA_BASE}/kohteet/haku`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Hankeikkuna API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const results: HankeResult[] = (data.result ?? []).filter(
    (r: HankeResult) =>
      r.kohde?.tyyppi === "LAINSAADANTO" ||
      r.lainsaadanto?.tehtavaluokka === "HALLITUKSEN_ESITYKSEN_VALMISTELU"
  );

  const nextCursor = data.searchAfter ?? null;
  return { results, nextCursor };
}

export async function syncGovernmentProjects(): Promise<{
  upserted: number;
  errors: number;
}> {
  const prisma = getPrisma()!;
  const ministries = await loadMinistries();

  let upserted = 0;
  let errors = 0;
  let cursor: string | null = null;
  let page = 0;

  console.log("[gov-sync] Starting government project sync...");

  do {
    page++;
    const { results, nextCursor } = await fetchPage(cursor, ["KAYNNISSA"]);
    cursor = nextCursor;

    for (const item of results) {
      try {
        const k = item.kohde;
        const he = item.lainsaadanto?.heTiedot;

        const ministry = k.asettajaUuid
          ? (ministries.get(k.asettajaUuid) ?? null)
          : null;

        const keywords = (item.asiasanat ?? [])
          .map((a) => a.fi)
          .filter((s): s is string => !!s);

        const hankeikkunaUrl = `https://valtioneuvosto.fi/hanke?tunnus=${encodeURIComponent(k.tunnus)}`;

        const rawMinister = he?.vastuuministeri;
        const responsibleMinister = rawMinister
          ? typeof rawMinister === "string"
            ? rawMinister
            : (rawMinister as { fi?: string }).fi ?? null
          : null;

        await prisma.governmentProject.upsert({
          where: { uuid: k.uuid },
          update: {
            tunnus: k.tunnus,
            nameFi: k.nimi?.fi ?? k.tunnus,
            nameSv: k.nimi?.sv ?? null,
            aliasFi: k.alias?.fi ?? null,
            descriptionFi: k.kuvaus?.fi ?? null,
            status: k.tila,
            prepPhase: k.valmisteluvaihe ?? null,
            ministry,
            startDate: k.aloitusPaiva ? new Date(k.aloitusPaiva) : null,
            completionDate: k.valmistumisPaiva ? new Date(k.valmistumisPaiva) : null,
            caseNumbers: k.asianumerot ?? [],
            heNumbers: he?.heNumerot ?? [],
            keywords,
            isUrgent: he?.kiireellinen ?? false,
            responsibleMinister,
            hankeikkunaUrl,
          },
          create: {
            uuid: k.uuid,
            tunnus: k.tunnus,
            nameFi: k.nimi?.fi ?? k.tunnus,
            nameSv: k.nimi?.sv ?? null,
            aliasFi: k.alias?.fi ?? null,
            descriptionFi: k.kuvaus?.fi ?? null,
            status: k.tila,
            prepPhase: k.valmisteluvaihe ?? null,
            ministry,
            startDate: k.aloitusPaiva ? new Date(k.aloitusPaiva) : null,
            completionDate: k.valmistumisPaiva ? new Date(k.valmistumisPaiva) : null,
            caseNumbers: k.asianumerot ?? [],
            heNumbers: he?.heNumerot ?? [],
            keywords,
            isUrgent: he?.kiireellinen ?? false,
            responsibleMinister,
            hankeikkunaUrl,
          },
        });
        upserted++;
      } catch (e) {
        errors++;
        console.error("[gov-sync] Error upserting project:", item.kohde?.tunnus, e);
      }
    }

    console.log(`[gov-sync] Page ${page}: processed ${results.length} projects (total: ${upserted})`);

    // Stop if no more results
    if (!cursor || results.length === 0) break;

    // Safety cap: max 20 pages (2000 projects) per sync
    if (page >= 20) {
      console.log("[gov-sync] Page cap reached, stopping.");
      break;
    }
  } while (cursor);

  console.log(`[gov-sync] Done. Upserted: ${upserted}, Errors: ${errors}`);
  return { upserted, errors };
}

// Entry point when run directly
if (process.argv[1] && process.argv[1].includes("sync-government-projects")) {
  import("dotenv").then(({ default: dotenv }) => {
    dotenv.config({ path: ".env.local" });
    return syncGovernmentProjects();
  }).then((result) => {
    console.log("[gov-sync] Result:", JSON.stringify(result, null, 2));
    process.exit(0);
  }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
