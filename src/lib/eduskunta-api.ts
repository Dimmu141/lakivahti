const BASE =
  process.env.EDUSKUNTA_API_BASE ?? "https://avoindata.eduskunta.fi/api/v1";

export interface FetchTableOptions {
  page?: number;
  perPage?: number;
  columnName?: string;
  columnValue?: string;
}

export async function fetchTableRows(
  table: string,
  options: FetchTableOptions = {}
): Promise<string[][]> {
  const params = new URLSearchParams({
    page: String(options.page ?? 0),
    perPage: String(options.perPage ?? 100),
  });
  if (options.columnName && options.columnValue) {
    params.set("columnName", options.columnName);
    params.set("columnValue", options.columnValue);
  }

  const url = `${BASE}/tables/${table}/rows?${params}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Eduskunta API ${res.status}: ${url}`);

  const data = await res.json();
  return (data.rowData as string[][]) ?? [];
}

/** Paginate through all rows (200 ms delay between pages). */
export async function fetchAllRows(
  table: string,
  options: Omit<FetchTableOptions, "page"> = {}
): Promise<string[][]> {
  let page = 0;
  const all: string[][] = [];
  while (true) {
    const rows = await fetchTableRows(table, { ...options, page, perPage: 100 });
    if (rows.length === 0) break;
    all.push(...rows);
    page++;
    await new Promise((r) => setTimeout(r, 200));
  }
  return all;
}

// ─── Column index maps (verified against live API) ────────────────────────────

/** VaskiData: [Id, XmlData, Status, Created, Eduskuntatunnus, AttachmentGroupId, Imported] */
export const VASKI_COL = {
  Id: 0,
  XmlData: 1,
  Status: 2,
  Created: 3,
  Eduskuntatunnus: 4,
  AttachmentGroupId: 5,
  Imported: 6,
} as const;

/**
 * SaliDBAanestys (35 cols):
 * AanestysId, KieliId, IstuntoVPVuosi, IstuntoNumero, IstuntoPvm,
 * IstuntoIlmoitettuAlkuaika, IstuntoAlkuaika, PJOtsikko, AanestysNumero,
 * AanestysAlkuaika, AanestysLoppuaika, AanestysMitatoity, AanestysOtsikko,
 * AanestysLisaOtsikko, PaaKohtaTunniste, PaaKohtaOtsikko, PaaKohtaHuomautus,
 * KohtaKasittelyOtsikko, KohtaKasittelyVaihe, KohtaJarjestys, KohtaTunniste,
 * KohtaOtsikko, KohtaHuomautus, AanestysTulosJaa, AanestysTulosEi,
 * AanestysTulosTyhjia, AanestysTulosPoissa, AanestysTulosYhteensa, Url,
 * AanestysPoytakirja, AanestysPoytakirjaUrl, AanestysValtiopaivaasia,
 * AanestysValtiopaivaasiaUrl, AliKohtaTunniste, Imported
 */
export const AANESTYS_COL = {
  AanestysId: 0,
  IstuntoPvm: 4,
  AanestysAlkuaika: 9,
  AanestysTulosJaa: 23,
  AanestysTulosEi: 24,
  AanestysTulosTyhjia: 25,
  AanestysTulosPoissa: 26,
  AanestysValtiopaivaasia: 31,
  AanestysValtiopaivaasiaUrl: 32,
} as const;

/** SaliDBAanestysEdustaja: [EdustajaId, AanestysId, EdustajaEtunimi, EdustajaSukunimi, EdustajaHenkiloNumero, EdustajaRyhmaLyhenne, EdustajaAanestys, Imported] */
export const EDUSTAJA_COL = {
  EdustajaId: 0,
  AanestysId: 1,
  EdustajaEtunimi: 2,
  EdustajaSukunimi: 3,
  EdustajaHenkiloNumero: 4,
  EdustajaRyhmaLyhenne: 5,
  EdustajaAanestys: 6,
} as const;

/** MemberOfParliament: [personId, lastname, firstname, party, minister, XmlData, XmlDataSv, XmlDataFi, XmlDataEn] */
export const MP_COL = {
  personId: 0,
  lastname: 1,
  firstname: 2,
  party: 3,
  minister: 4,
} as const;
