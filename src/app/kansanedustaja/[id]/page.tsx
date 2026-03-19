import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { getMpWithVotes } from "@/lib/bills-service";
import { PARTIES, normalizePartyAbbrev } from "@/lib/constants";
import { billIdToSlug, formatFinnishDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getMpWithVotes(id);
  if (!data) return { title: "Kansanedustajaa ei löydy — Lakivahti" };
  return { title: `${data.mp.firstName} ${data.mp.lastName} — Lakivahti` };
}

const VOTE_COLORS: Record<string, string> = {
  Jaa: "var(--accent-green)",
  Ei: "var(--accent-red)",
  Poissa: "var(--text-faint)",
  "Tyhjää": "var(--accent-yellow)",
};

export default async function KansanedustajaPage({ params }: Props) {
  const { id } = await params;
  const data = await getMpWithVotes(id);
  if (!data) notFound();

  const { mp, mpVotes } = data;
  const partyInfo = PARTIES[normalizePartyAbbrev(mp.party)];

  // Stats
  const jaa = mpVotes.filter((v) => v.voteValue === "Jaa").length;
  const ei = mpVotes.filter((v) => v.voteValue === "Ei").length;
  const poissa = mpVotes.filter((v) => v.voteValue === "Poissa").length;
  const total = mpVotes.length;

  // Only show votes linked to bills
  const billVotes = mpVotes.filter((v) => v.vote.bill);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* MP Header Card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-start gap-5">
            {mp.photoUrl ? (
              <img
                src={mp.photoUrl}
                alt={`${mp.firstName} ${mp.lastName}`}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
                style={{
                  background: partyInfo?.color ? `${partyInfo.color}33` : "rgba(255,255,255,0.1)",
                  color: partyInfo?.color ?? "var(--text-secondary)",
                }}
              >
                {mp.firstName[0]}{mp.lastName[0]}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {mp.firstName} {mp.lastName}
              </h1>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: partyInfo?.color ? `${partyInfo.color}22` : "rgba(255,255,255,0.1)",
                    color: partyInfo?.color ?? "var(--text-secondary)",
                    border: `1px solid ${partyInfo?.color ? `${partyInfo.color}44` : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {partyInfo?.name ?? mp.party.trim()}
                </span>
                {mp.constituency && (
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {mp.constituency}
                  </span>
                )}
              </div>

              {/* Vote stats */}
              {total > 0 && (
                <div className="flex gap-4 text-xs">
                  <span style={{ color: "var(--accent-green)" }}>✓ Jaa {jaa}</span>
                  <span style={{ color: "var(--accent-red)" }}>✗ Ei {ei}</span>
                  <span style={{ color: "var(--text-muted)" }}>Poissa {poissa}</span>
                  <span style={{ color: "var(--text-faint)" }}>Yhteensä {total} äänestystä</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vote history */}
        <div>
          <h2 className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>
            Äänestyshistoria {billVotes.length > 0 && `(${billVotes.length} hanketta)`}
          </h2>

          {billVotes.length === 0 ? (
            <div
              className="text-center py-12 rounded-xl"
              style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Äänestyshistoriaa ei löydy
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              {billVotes.map((mv, i) => {
                const bill = mv.vote.bill!;
                return (
                  <Link
                    key={mv.id}
                    href={`/laki/${billIdToSlug(bill.id)}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    style={{
                      borderBottom: i < billVotes.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : undefined,
                    }}
                  >
                    <span
                      className="font-mono text-xs font-bold w-6 text-center shrink-0"
                      style={{ color: VOTE_COLORS[mv.voteValue] ?? "var(--text-muted)" }}
                    >
                      {mv.voteValue === "Jaa" ? "J" : mv.voteValue === "Ei" ? "E" : mv.voteValue === "Poissa" ? "–" : "T"}
                    </span>
                    <span
                      className="text-xs font-mono font-semibold w-24 shrink-0"
                      style={{ color: "var(--accent-red)" }}
                    >
                      {bill.id.replace(" vp", "")}
                    </span>
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {bill.titleFi}
                    </span>
                    <span className="text-xs shrink-0" style={{ color: "var(--text-faint)" }}>
                      {mv.vote.voteDate
                        ? formatFinnishDate(mv.vote.voteDate.toISOString().split("T")[0])
                        : ""}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
