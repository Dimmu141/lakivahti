/**
 * XML parser for Eduskunta VaskiData documents.
 *
 * The XML has complex namespaces (ns11:Siirto wrapper, met1:, asi:, etc).
 * We use targeted regex extraction against known element/attribute names
 * rather than a full namespace-aware DOM parse — this is more robust
 * to the schema variations between document types (HE, LA, KAA, reports).
 *
 * Field paths verified against live API responses (March 2026).
 */

export interface ParsedVaskiDoc {
  /** Human-readable bill ID, e.g. "HE 1/2026 vp" */
  eduskuntaTunnus: string | null;
  /** Short type code: "HE", "LA", "KAA", "HaVM", etc. */
  typeCode: string | null;
  /** Numeric bill number */
  billNumber: number | null;
  /** Parliamentary year */
  billYear: number | null;
  /** Finnish title */
  titleFi: string | null;
  /** Date string "YYYY-MM-DD" */
  submittedDate: string | null;
  /** Keywords from <met1:AiheTeksti> elements */
  keywords: string[];
  /** Sponsor: "Valtioneuvosto" for HE, or extracted name for LA */
  sponsor: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract text content of the first matching element (any namespace prefix). */
function extractText(xml: string, localName: string): string | null {
  // Matches <prefix:localName>…</prefix:localName> or <localName>…</localName>
  const re = new RegExp(
    `<(?:[^:>\\s]+:)?${localName}(?:\\s[^>]*)?>([^<]+)<\\/(?:[^:>\\s]+:)?${localName}>`,
    "i"
  );
  const m = xml.match(re);
  return m ? decodeXmlEntities(m[1].trim()) || null : null;
}

/** Extract text content of ALL matching elements. */
function extractAllText(xml: string, localName: string): string[] {
  const re = new RegExp(
    `<(?:[^:>\\s]+:)?${localName}(?:\\s[^>]*)?>([^<]+)<\\/(?:[^:>\\s]+:)?${localName}>`,
    "gi"
  );
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const v = decodeXmlEntities(m[1].trim());
    if (v) results.push(v);
  }
  return results;
}

/** Extract an XML attribute value: attrName="value" */
function extractAttr(xml: string, attrLocalName: string): string | null {
  // Match prefix:name="val" or name="val"
  const re = new RegExp(
    `(?:[^:>\\s]+:)?${attrLocalName}="([^"]*)"`,
    "i"
  );
  const m = xml.match(re);
  return m ? decodeXmlEntities(m[1].trim()) || null : null;
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// ─── Main parser ─────────────────────────────────────────────────────────────

export function parseVaskiXml(xml: string): ParsedVaskiDoc {
  if (!xml || xml.length < 10) {
    return empty();
  }

  // Eduskunta ID — from element or attribute
  const eduskuntaTunnus =
    extractText(xml, "EduskuntaTunnus") ??
    extractAttr(xml, "eduskuntaTunnus");

  // Type code: <met1:AsiakirjatyyppiKoodi>HE</met1:AsiakirjatyyppiKoodi>
  const typeCode = extractText(xml, "AsiakirjatyyppiKoodi");

  // Bill number
  const numStr =
    extractText(xml, "AsiakirjaNroTeksti") ??
    extractText(xml, "AsiakirjaNro");
  const billNumber = numStr ? parseInt(numStr, 10) || null : null;

  // Year — first ValtiopaivavuosiTeksti
  const yearStr = extractText(xml, "ValtiopaivavuosiTeksti");
  const billYear = yearStr ? parseInt(yearStr, 10) || null : null;

  // Title — NimekeTeksti is inside <met:Nimeke>
  const titleFi = extractText(xml, "NimekeTeksti");

  // Submitted date — attribute met1:laadintaPvm="2026-02-04" or element LaadintaPvmTeksti "04.02.2026"
  let submittedDate = extractAttr(xml, "laadintaPvm"); // YYYY-MM-DD already
  if (!submittedDate) {
    // Fallback: "04.02.2026" → "2026-02-04"
    const raw = extractText(xml, "LaadintaPvmTeksti");
    if (raw) {
      const parts = raw.split(".");
      if (parts.length === 3) {
        submittedDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }
  }

  // Keywords — all <met1:AiheTeksti> elements
  const keywords = [...new Set(extractAllText(xml, "AiheTeksti"))];

  // Sponsor
  let sponsor: string | null = null;
  if (typeCode === "HE") {
    sponsor = "Valtioneuvosto";
  } else if (typeCode === "KAA") {
    sponsor = "Kansalaisaloite";
  } else {
    // LA or other — try to extract author name
    const firstName = extractText(xml, "EtuNimi");
    const lastName = extractText(xml, "SukuNimi");
    if (firstName && lastName) {
      sponsor = `${firstName} ${lastName}`;
    } else if (lastName) {
      sponsor = lastName;
    }
  }

  return {
    eduskuntaTunnus,
    typeCode,
    billNumber,
    billYear,
    titleFi,
    submittedDate,
    keywords,
    sponsor,
  };
}

function empty(): ParsedVaskiDoc {
  return {
    eduskuntaTunnus: null,
    typeCode: null,
    billNumber: null,
    billYear: null,
    titleFi: null,
    submittedDate: null,
    keywords: [],
    sponsor: null,
  };
}

/** Given the Eduskuntatunnus, determine the document type prefix. */
export function getDocTypeFromTunnus(tunnus: string): string {
  const m = tunnus.match(/^([A-Za-z]+)\s/);
  return m ? m[1] : "muu";
}

/** True if this document is a "primary bill" (HE, LA, KAA) vs. a committee document. */
export function isPrimaryBillType(typeCode: string): boolean {
  return ["HE", "LA", "KAA"].includes(typeCode.toUpperCase());
}

/** True if this is a committee report (mietintö): HaVM, PuVM, StVM, etc. */
export function isCommitteeReport(tunnus: string): boolean {
  return /^[A-Za-z]+VM\s/.test(tunnus);
}

/** True if this is a committee statement (lausunto): HaVL, PeVL, etc. */
export function isCommitteeStatement(tunnus: string): boolean {
  return /^[A-Za-z]+VL\s/.test(tunnus);
}

/** Extract committee code from a report/statement tunnus: "HaVM 3/2026 vp" → "HaV" */
export function committeeCodeFromReport(tunnus: string): string | null {
  const m = tunnus.match(/^([A-Za-z]+)V[ML]\s/);
  return m ? `${m[1]}V` : null;
}
