import Header from "@/components/Header";
import Link from "next/link";
import { getMps } from "@/lib/bills-service";
import { PARTIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

/** Map full English/Finnish party group names → abbreviation */
const PARTY_GROUP_MAP: Record<string, string> = {
  "Parliamentary Group of the National Coalition Party": "KOK",
  "The Finns Party Parliamentary Group": "PS",
  "Social Democratic Parliamentary Group": "SDP",
  "Centre Party Parliamentary Group": "KESK",
  "Green Parliamentary Group": "VIHR",
  "Left Alliance Parliamentary Group": "VAS",
  "Swedish Parliamentary Group": "RKP",
  "Christian Democratic Parliamentary Group": "KD",
  "Liike Nyt-Movement's Parliamentary Group": "LIIK",
  "Parliamentary Group Timo Vornanen": "PS",
  // Finnish names
  "Kansallinen Kokoomus": "KOK",
  "Perussuomalaiset": "PS",
  "Suomen Sosialidemokraattinen Puolue": "SDP",
  "Suomen Keskusta": "KESK",
  "Vihreä liitto": "VIHR",
  "Vasemmistoliitto": "VAS",
  "Ruotsalainen kansanpuolue": "RKP",
  "Kristillisdemokraatit": "KD",
};

function normalizePartyAbbrev(raw: string): string {
  const trimmed = raw.trim();
  return PARTY_GROUP_MAP[trimmed] ?? trimmed;
}

export default async function KansanedustajatPage() {
  const allMps = await getMps();

  // Filter to MPs with a known party (exclude empty-string historical MPs)
  const mps = allMps.filter((mp) => mp.party.trim() !== "");

  // Group by normalized party abbreviation
  const byParty: Record<string, typeof mps> = {};
  for (const mp of mps) {
    const party = normalizePartyAbbrev(mp.party);
    if (!byParty[party]) byParty[party] = [];
    byParty[party].push(mp);
  }

  const partyOrder = ["KOK", "PS", "SDP", "KESK", "VIHR", "VAS", "RKP", "KD", "LIIK"];
  const sortedParties = [
    ...partyOrder.filter((p) => byParty[p]),
    ...Object.keys(byParty).filter((p) => !partyOrder.includes(p)).sort(),
  ];

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
            Kansanedustajat
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {mps.length} kansanedustajaa — katso äänestyshistoria
          </p>
        </div>

        {mps.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl"
            style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Kansanedustajaluettelo ei ole saatavilla
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedParties.map((party) => {
              const partyInfo = PARTIES[party];
              const members = byParty[party];
              return (
                <div key={party}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: partyInfo?.color ?? "#888" }}
                    />
                    <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {partyInfo?.name ?? party}
                    </h2>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      ({members.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {members.map((mp) => (
                      <Link key={mp.id} href={`/kansanedustaja/${mp.id}`}>
                        <div
                          className="rounded-lg px-3 py-2.5 flex items-center gap-2 transition-all cursor-pointer"
                          style={{
                            background: "var(--bg-card)",
                            border: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          {mp.photoUrl ? (
                            <img
                              src={mp.photoUrl}
                              alt={`${mp.firstName} ${mp.lastName}`}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{
                                background: partyInfo?.color
                                  ? `${partyInfo.color}33`
                                  : "rgba(255,255,255,0.1)",
                                color: partyInfo?.color ?? "var(--text-secondary)",
                              }}
                            >
                              {mp.firstName[0]}{mp.lastName[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                              {mp.firstName} {mp.lastName}
                            </div>
                            {mp.constituency && (
                              <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                                {mp.constituency}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
