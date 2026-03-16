export const COMMITTEES: Record<string, string> = {
  PeV: "Perustuslakivaliokunta",
  LaV: "Lakivaliokunta",
  HaV: "Hallintovaliokunta",
  TaV: "Talousvaliokunta",
  VaV: "Valtiovarainvaliokunta",
  PuV: "Puolustusvaliokunta",
  UaV: "Ulkoasiainvaliokunta",
  SiV: "Sivistysvaliokunta",
  StV: "Sosiaali- ja terveysvaliokunta",
  TyV: "Työelämä- ja tasa-arvovaliokunta",
  LiV: "Liikenne- ja viestintävaliokunta",
  MmV: "Maa- ja metsätalousvaliokunta",
  YmV: "Ympäristövaliokunta",
  SuV: "Suuri valiokunta",
  TrV: "Tarkastusvaliokunta",
  TuV: "Tulevaisuusvaliokunta",
};

export const PARTIES: Record<string, { name: string; color: string }> = {
  KOK:  { name: "Kokoomus",         color: "#003580" },
  PS:   { name: "Perussuomalaiset", color: "#FFD700" },
  SDP:  { name: "SDP",              color: "#E0001A" },
  KESK: { name: "Keskusta",         color: "#00A651" },
  VIHR: { name: "Vihreät",          color: "#61BF1A" },
  VAS:  { name: "Vasemmistoliitto", color: "#CC0033" },
  RKP:  { name: "RKP",              color: "#FFB81C" },
  KD:   { name: "KD",               color: "#18359B" },
  LIIK: { name: "Liike Nyt",        color: "#F05A28" },
  // Swedish abbreviations (from API/initial-load data)
  SAML: { name: "Kokoomus",         color: "#003580" },
  SAF:  { name: "Perussuomalaiset", color: "#FFD700" },
  SD:   { name: "SDP",              color: "#E0001A" },
  CENT: { name: "Keskusta",         color: "#00A651" },
  "GRÖNA": { name: "Vihreät",       color: "#61BF1A" },
  VÄNST: { name: "Vasemmistoliitto",color: "#CC0033" },
  SV:   { name: "RKP",              color: "#FFB81C" },
  R:    { name: "RKP",              color: "#FFB81C" },
  KRF:  { name: "KD",               color: "#18359B" },
  ERK:  { name: "KD",               color: "#18359B" },
};

/** Trim trailing whitespace and normalize party key */
export function normalizePartyKey(raw: string): string {
  return raw.trim();
}

export const STAGES = [
  { key: "submitted",  label: "Annettu",       icon: "📋" },
  { key: "committee",  label: "Valiokunnassa", icon: "🏛️" },
  { key: "hearing",    label: "Kuuleminen",    icon: "🎙️" },
  { key: "report",     label: "Mietintö",      icon: "📄" },
  { key: "plenary",    label: "Täysistunto",   icon: "🏛️" },
  { key: "voted",      label: "Äänestetty",    icon: "✅" },
  { key: "enacted",    label: "Vahvistettu",   icon: "⚖️" },
] as const;

export type StageKey = typeof STAGES[number]["key"];
