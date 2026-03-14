/**
 * Initial data load from the Eduskunta SQLite dump.
 *
 * Usage (run once to bootstrap the DB):
 *   npx tsx src/sync/initial-load.ts
 *
 * The dump is downloaded from:
 *   https://ekdb-dumps.s3.eu-north-1.amazonaws.com/v1/latest.eduskunta_data.sqlite
 *
 * Requires: better-sqlite3 (@types/better-sqlite3)
 *   npm install better-sqlite3 @types/better-sqlite3
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import path from "path";
import fs from "fs";
import https from "https";
import { prisma } from "../lib/db";
import { parseVaskiXml, isPrimaryBillType, getDocTypeFromTunnus } from "../lib/xml-parser";
import { detectStage } from "./detect-stage";
import { COMMITTEES } from "../lib/constants";

const DUMP_URL =
  "https://ekdb-dumps.s3.eu-north-1.amazonaws.com/v1/latest.eduskunta_data.sqlite";
const DUMP_PATH = path.join(process.cwd(), "tmp", "eduskunta.sqlite");

async function downloadDump(): Promise<void> {
  if (fs.existsSync(DUMP_PATH)) {
    console.log("[initial-load] SQLite dump already exists, skipping download.");
    return;
  }

  fs.mkdirSync(path.dirname(DUMP_PATH), { recursive: true });
  console.log(`[initial-load] Downloading SQLite dump from ${DUMP_URL}...`);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(DUMP_PATH);
    https
      .get(DUMP_URL, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("[initial-load] Download complete.");
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(DUMP_PATH, () => {});
        reject(err);
      });
  });
}

async function run() {
  if (!prisma) {
    console.error("[initial-load] No database connection. Set DATABASE_URL.");
    process.exit(1);
  }

  await downloadDump();

  // Dynamic import — better-sqlite3 is an optional dev dependency
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  const db = new Database(DUMP_PATH, { readonly: true });

  // ── MPs ────────────────────────────────────────────────────────────────────
  console.log("[initial-load] Loading MPs...");
  const mpRows = db
    .prepare("SELECT personId, firstname, lastname, party FROM MemberOfParliament")
    .all() as { personId: string; firstname: string; lastname: string; party: string }[];

  for (const mp of mpRows) {
    if (!mp.personId) continue;
    await prisma.mp.upsert({
      where: { id: mp.personId },
      update: { firstName: mp.firstname, lastName: mp.lastname, party: mp.party },
      create: {
        id: mp.personId,
        firstName: mp.firstname ?? "",
        lastName: mp.lastname ?? "",
        party: mp.party ?? "",
        isActive: true,
      },
    });
  }
  console.log(`[initial-load] Loaded ${mpRows.length} MPs`);

  // ── Bills from VaskiData ───────────────────────────────────────────────────
  const START_YEAR = 2023;
  console.log(`[initial-load] Loading bills from VaskiData (${START_YEAR}→)...`);
  const vaskiRows = db
    .prepare(
      "SELECT Id, XmlData, Created, Eduskuntatunnus FROM VaskiData WHERE Eduskuntatunnus IS NOT NULL"
    )
    .all() as { Id: string; XmlData: string; Created: string; Eduskuntatunnus: string }[];

  let billCount = 0;
  for (const row of vaskiRows) {
    const tunnus = row.Eduskuntatunnus?.trim();
    if (!tunnus) continue;

    const parsed = parseVaskiXml(row.XmlData ?? "");
    const typeCode = parsed.typeCode ?? getDocTypeFromTunnus(tunnus);
    if (!isPrimaryBillType(typeCode)) continue;

    const billNumber = parsed.billNumber ?? 0;
    const billYear = parsed.billYear ?? parseInt(tunnus.match(/\/(\d{4})\s/)?.[1] ?? "0", 10);
    if (billYear < START_YEAR) continue;
    const titleFi = parsed.titleFi ?? tunnus;
    const submittedDate = parsed.submittedDate ? new Date(parsed.submittedDate) : null;

    await prisma.bill.upsert({
      where: { id: tunnus },
      update: { titleFi, keywords: parsed.keywords, updatedAt: new Date() },
      create: {
        id: tunnus,
        billType: typeCode,
        billNumber,
        billYear,
        titleFi,
        keywords: parsed.keywords,
        category: "Muu",
        urgency: "normal",
        currentStage: "submitted",
        submittedDate,
        sponsor: parsed.sponsor,
        stageUpdatedAt: submittedDate ?? new Date(),
      },
    });

    // Primary document
    await prisma.document.upsert({
      where: { id: tunnus },
      update: {},
      create: {
        id: tunnus,
        billId: tunnus,
        docType: typeCode,
        titleFi,
        publishedDate: submittedDate,
      },
    });

    billCount++;
    if (billCount % 500 === 0) console.log(`[initial-load] ${billCount} bills...`);
  }
  console.log(`[initial-load] Loaded ${billCount} bills`);

  // ── Votes ──────────────────────────────────────────────────────────────────
  console.log(`[initial-load] Loading votes (${START_YEAR}→)...`);
  const voteRows = db
    .prepare(
      `SELECT AanestysId, IstuntoPvm, AanestysAlkuaika,
              AanestysTulosJaa, AanestysTulosEi, AanestysTulosTyhjia, AanestysTulosPoissa,
              AanestysValtiopaivaasia
       FROM SaliDBAanestys WHERE AanestysId IS NOT NULL AND IstuntoPvm >= '${START_YEAR}-01-01'`
    )
    .all() as {
      AanestysId: string;
      IstuntoPvm: string;
      AanestysAlkuaika: string;
      AanestysTulosJaa: string;
      AanestysTulosEi: string;
      AanestysTulosTyhjia: string;
      AanestysTulosPoissa: string;
      AanestysValtiopaivaasia: string;
    }[];

  let voteCount = 0;
  for (const v of voteRows) {
    const billId = v.AanestysValtiopaivaasia?.trim() || null;
    const bill = billId ? await prisma.bill.findUnique({ where: { id: billId } }) : null;

    const votesFor = parseInt(v.AanestysTulosJaa ?? "0", 10) || 0;
    const votesAgainst = parseInt(v.AanestysTulosEi ?? "0", 10) || 0;
    const votesEmpty = parseInt(v.AanestysTulosTyhjia ?? "0", 10) || 0;
    const votesAbsent = parseInt(v.AanestysTulosPoissa ?? "0", 10) || 0;

    await prisma.vote.upsert({
      where: { id: v.AanestysId },
      update: {},
      create: {
        id: v.AanestysId,
        billId: bill ? billId : null,
        voteDate: v.AanestysAlkuaika ? new Date(v.AanestysAlkuaika) : null,
        votesFor,
        votesAgainst,
        votesEmpty,
        votesAbsent,
        result: votesFor > votesAgainst ? "passed" : "rejected",
      },
    });
    voteCount++;
  }
  console.log(`[initial-load] Loaded ${voteCount} votes`);

  // ── MP votes ───────────────────────────────────────────────────────────────
  console.log(`[initial-load] Loading MP votes (${START_YEAR}→)...`);
  const mpVoteRows = db
    .prepare(
      `SELECT e.AanestysId, e.EdustajaHenkiloNumero, e.EdustajaEtunimi, e.EdustajaSukunimi,
              e.EdustajaRyhmaLyhenne, e.EdustajaAanestys
       FROM SaliDBAanestysEdustaja e
       INNER JOIN SaliDBAanestys a ON a.AanestysId = e.AanestysId
       WHERE e.AanestysId IS NOT NULL AND a.IstuntoPvm >= '${START_YEAR}-01-01'`
    )
    .all() as {
      AanestysId: string;
      EdustajaHenkiloNumero: string;
      EdustajaEtunimi: string;
      EdustajaSukunimi: string;
      EdustajaRyhmaLyhenne: string;
      EdustajaAanestys: string;
    }[];

  const partyMap: Record<string, string> = {
    sd: "SDP", kok: "KOK", ps: "PS", kesk: "KESK",
    vihr: "VIHR", vas: "VAS", rkp: "RKP", kd: "KD", liik: "LIIK",
  };

  let mpVoteCount = 0;
  for (const mv of mpVoteRows) {
    if (!mv.AanestysId || !mv.EdustajaHenkiloNumero) continue;
    const voteExists = await prisma.vote.findUnique({ where: { id: mv.AanestysId } });
    if (!voteExists) continue;

    const party = partyMap[mv.EdustajaRyhmaLyhenne?.toLowerCase()] ?? mv.EdustajaRyhmaLyhenne?.toUpperCase() ?? "";
    const voteVal = mv.EdustajaAanestys?.startsWith("Tyh") ? "Tyhjää" : (mv.EdustajaAanestys ?? "Poissa");

    await prisma.mpVote.upsert({
      where: { voteId_mpId: { voteId: mv.AanestysId, mpId: mv.EdustajaHenkiloNumero } },
      update: {},
      create: {
        voteId: mv.AanestysId,
        mpId: mv.EdustajaHenkiloNumero,
        mpName: `${mv.EdustajaEtunimi ?? ""} ${mv.EdustajaSukunimi ?? ""}`.trim(),
        party,
        voteValue: voteVal,
      },
    });
    mpVoteCount++;
    if (mpVoteCount % 10000 === 0) console.log(`[initial-load] ${mpVoteCount} MP votes...`);
  }
  console.log(`[initial-load] Loaded ${mpVoteCount} MP votes`);

  // ── Recalculate stages ─────────────────────────────────────────────────────
  console.log("[initial-load] Recalculating bill stages...");
  const bills = await prisma.bill.findMany({
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

  db.close();
  console.log("[initial-load] Complete!");
  void COMMITTEES; // suppress unused import warning
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
