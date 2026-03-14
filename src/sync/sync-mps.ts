/**
 * Sync MemberOfParliament table → mps DB table.
 */

import { getPrisma } from "../lib/db";
import { fetchAllRows, MP_COL } from "../lib/eduskunta-api";

export async function syncMps(): Promise<{ upserted: number; errors: number }> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("No database connection");

  console.log("[sync-mps] Fetching MemberOfParliament...");
  const rows = await fetchAllRows("MemberOfParliament");
  console.log(`[sync-mps] Got ${rows.length} rows`);

  let upserted = 0;
  let errors = 0;

  for (const row of rows) {
    const personId = row[MP_COL.personId];
    if (!personId) continue;

    try {
      await prisma.mp.upsert({
        where: { id: personId },
        update: {
          firstName: row[MP_COL.firstname] ?? "",
          lastName: row[MP_COL.lastname] ?? "",
          party: row[MP_COL.party] ?? "",
        },
        create: {
          id: personId,
          firstName: row[MP_COL.firstname] ?? "",
          lastName: row[MP_COL.lastname] ?? "",
          party: row[MP_COL.party] ?? "",
          isActive: true,
        },
      });
      upserted++;
    } catch (e) {
      console.error(`[sync-mps] Error upserting MP ${personId}:`, e);
      errors++;
    }
  }

  console.log(`[sync-mps] Done: ${upserted} upserted, ${errors} errors`);
  return { upserted, errors };
}
