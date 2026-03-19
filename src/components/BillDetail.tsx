"use client";

import { useState } from "react";
import Link from "next/link";
import StageTracker from "./StageTracker";
import VoteBar from "./VoteBar";
import PartyVoteGrid from "./PartyVoteGrid";
import ExpertCard from "./ExpertCard";
import BillTimeline from "./BillTimeline";
import { STAGES, COMMITTEES } from "@/lib/constants";
import { formatFinnishDate } from "@/lib/utils";
import type { SampleBill } from "@/lib/sample-data";

const TABS = [
  { key: "overview", label: "Yleiskatsaus" },
  { key: "experts", label: "Asiantuntijat" },
  { key: "votes", label: "Äänestys" },
  { key: "documents", label: "Asiakirjat" },
] as const;

type TabKey = typeof TABS[number]["key"];

const TYPE_LABELS: Record<string, string> = {
  HE: "Hallituksen esitys",
  LA: "Lakialoite",
  KAA: "Kansalaisaloite",
};

const DOC_TYPE_LABELS: Record<string, string> = {
  HE: "Hallituksen esitys",
  LA: "Lakialoite",
  KAA: "Kansalaisaloite",
  mietinto: "Mietintö",
  lausunto: "Lausunto",
  asiantuntijalausunto: "Asiantuntijalausunto",
  poytakirja: "Pöytäkirja",
  saadoskokoelma: "Säädöskokoelma",
};

/** Calculate days between two date strings */
function daysBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.floor(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

/** Duration color based on days */
function durationColor(days: number): string {
  if (days < 60) return "var(--accent-green)";
  if (days < 120) return "var(--accent-yellow, #EAB308)";
  return "var(--accent-red)";
}

/** Detect data quality issues */
function getDataWarnings(bill: SampleBill): string[] {
  const warnings: string[] = [];
  const stageOrder = ["submitted", "committee", "hearing", "report", "plenary", "voted", "enacted"];
  const idx = stageOrder.indexOf(bill.currentStage);

  // Past hearing stage but no experts
  if (idx >= 3 && bill.experts.length === 0) {
    warnings.push("Asiantuntijatiedot saattavat olla puutteelliset — valiokunta on jo antanut mietinnön, mutta kuulemistietoja ei ole.");
  }

  // Past committee stage but no committee assigned
  if (idx >= 1 && bill.committees.length === 0) {
    warnings.push("Valiokuntatiedot puuttuvat — hanke on edennyt valiokuntavaiheen ohi, mutta valiokuntaa ei ole merkitty.");
  }

  // Voted/enacted but no vote data
  if ((bill.currentStage === "voted" || bill.currentStage === "enacted") && bill.votes.length === 0) {
    warnings.push("Yksityiskohtaiset äänestystiedot eivät ole saatavilla tälle hankkeelle.");
  }

  return warnings;
}

/** Determine reading stage context */
function getReadingInfo(bill: SampleBill): string | null {
  if (bill.currentStage === "plenary") {
    // If committee report exists, this is likely 2nd reading
    const hasReport = bill.committees.some((c) => c.reportId);
    if (hasReport) {
      return "Toinen käsittely — mietintö valmis, eduskunta päättää lain hyväksymisestä tai hylkäämisestä.";
    }
    return "Ensimmäinen käsittely — eduskunta keskustelee valiokunnan mietinnöstä ja päättää lain sisällöstä.";
  }
  return null;
}

export default function BillDetail({ bill }: { bill: SampleBill }) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Only show urgency badge for high urgency (kiireellinen)
  const showUrgencyBadge = bill.urgency === "high";

  const stageInfo = STAGES.find((s) => s.key === bill.currentStage);

  // Processing duration
  const today = new Date().toISOString().split("T")[0];
  const isTerminal = bill.currentStage === "enacted" || bill.currentStage === "voted";
  const durationEnd = isTerminal ? bill.stageUpdatedAt : today;
  const processingDays = bill.submittedDate ? daysBetween(bill.submittedDate, durationEnd) : 0;

  // Committee duration
  const leadCommittee = bill.committees.find((c) => c.role === "lead");
  const committeeDays = leadCommittee
    ? daysBetween(bill.submittedDate, leadCommittee.reportDate ?? today)
    : null;

  // Data quality warnings
  const warnings = getDataWarnings(bill);

  // Reading info
  const readingInfo = getReadingInfo(bill);

  // Find the HE/LA/KAA source document for fallback link
  const sourceDoc = bill.documents.find(
    (d) => d.docType === bill.billType
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Bill header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* ID row */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className="font-mono text-lg font-bold"
            style={{ color: "var(--accent-red)" }}
          >
            {bill.id}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
          >
            {TYPE_LABELS[bill.billType] ?? bill.billType}
          </span>
          {showUrgencyBadge && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(233,69,96,0.12)",
                color: "var(--accent-red)",
                border: "1px solid rgba(233,69,96,0.3)",
              }}
            >
              Kiireellinen
            </span>
          )}

          {/* Processing duration badge */}
          {bill.submittedDate && processingDays > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{
                background: `${durationColor(processingDays)}15`,
                color: durationColor(processingDays),
                border: `1px solid ${durationColor(processingDays)}30`,
              }}
            >
              {isTerminal ? `${processingDays} pv` : `${processingDays} pv käsittelyssä`}
            </span>
          )}

          {stageInfo && (
            <span
              className="text-xs px-2 py-0.5 rounded-full ml-auto"
              style={{
                background: "rgba(233,69,96,0.1)",
                color: "var(--accent-red)",
                border: "1px solid rgba(233,69,96,0.2)",
              }}
            >
              {stageInfo.icon} {stageInfo.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold leading-snug mb-4" style={{ color: "var(--text-primary)" }}>
          {bill.titleFi}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
          <span>Annettu: <strong style={{ color: "var(--text-primary)" }}>{formatFinnishDate(bill.submittedDate)}</strong></span>
          <span>Aloitteentekijä: <strong style={{ color: "var(--text-primary)" }}>{bill.sponsor}</strong></span>
          <span>Kategoria: <strong style={{ color: "var(--text-primary)" }}>{bill.category}</strong></span>
          {committeeDays !== null && (
            <span>
              Valiokunnassa:{" "}
              <strong style={{ color: durationColor(committeeDays) }}>
                {committeeDays} pv
              </strong>
            </span>
          )}
          {bill.eduskuntaUrl && (
            <a
              href={bill.eduskuntaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--accent-green)" }}
            >
              eduskunta.fi ↗
            </a>
          )}
        </div>

        {/* Reading info */}
        {readingInfo && (
          <div
            className="text-xs px-3 py-2 rounded-lg mb-4"
            style={{
              background: "rgba(78,204,163,0.08)",
              border: "1px solid rgba(78,204,163,0.15)",
              color: "var(--accent-green)",
            }}
          >
            {readingInfo}
          </div>
        )}

        {/* Stage tracker */}
        <StageTracker currentStage={bill.currentStage} />
      </div>

      {/* Data quality warnings */}
      {warnings.length > 0 && (
        <div
          className="rounded-xl p-3.5 mb-4 space-y-1.5"
          style={{
            background: "rgba(234,179,8,0.06)",
            border: "1px solid rgba(234,179,8,0.15)",
          }}
        >
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--accent-yellow, #EAB308)" }}>⚠</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex gap-1 mb-4 p-1 rounded-xl overflow-x-auto"
        style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2 px-3 text-sm rounded-lg transition-all shrink-0"
            style={{
              background: activeTab === tab.key ? "var(--bg-inner)" : "transparent",
              color: activeTab === tab.key ? "var(--text-primary)" : "var(--text-muted)",
              border: activeTab === tab.key ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
              fontWeight: activeTab === tab.key ? 500 : 400,
            }}
          >
            {tab.label}
            {tab.key === "experts" && bill.experts.length > 0 && (
              <span
                className="ml-1.5 text-xs px-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}
              >
                {bill.experts.length}
              </span>
            )}
            {tab.key === "votes" && bill.votes.length > 0 && (
              <span
                className="ml-1.5 text-xs px-1 rounded-full"
                style={{ background: "rgba(78,204,163,0.2)", color: "var(--accent-green)" }}
              >
                {bill.votes.length}
              </span>
            )}
            {tab.key === "documents" && bill.documents.length > 0 && (
              <span
                className="ml-1.5 text-xs px-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}
              >
                {bill.documents.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        {/* YLEISKATSAUS */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Summary or fallback */}
            {bill.summaryFi ? (
              <div>
                <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Tiivistelmä
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {bill.summaryFi}
                </p>
              </div>
            ) : (
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--bg-inner)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Tiivistelmä
                </h3>
                <p className="text-sm mb-2" style={{ color: "var(--text-faint)" }}>
                  Tiivistelmää ei ole saatavilla.
                </p>
                {sourceDoc?.eduskuntaUrl && sourceDoc.eduskuntaUrl !== "#" && (
                  <a
                    href={sourceDoc.eduskuntaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:underline inline-flex items-center gap-1"
                    style={{ color: "var(--accent-green)" }}
                  >
                    Lue alkuperäinen {TYPE_LABELS[bill.billType] ?? "asiakirja"} eduskunta.fi:ssä ↗
                  </a>
                )}
                {bill.eduskuntaUrl && (!sourceDoc?.eduskuntaUrl || sourceDoc.eduskuntaUrl === "#") && (
                  <a
                    href={bill.eduskuntaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:underline inline-flex items-center gap-1"
                    style={{ color: "var(--accent-green)" }}
                  >
                    Katso hanke eduskunta.fi:ssä ↗
                  </a>
                )}
              </div>
            )}

            {/* Timeline */}
            <BillTimeline bill={bill} />

            {bill.keywords.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Avainsanat
                </h3>
                <div className="flex flex-wrap gap-2">
                  {bill.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: "var(--bg-inner)",
                        color: "var(--text-secondary)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {bill.committees.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Valiokunnat
                </h3>
                <div className="space-y-2">
                  {bill.committees.map((c) => (
                    <div
                      key={c.committeeCode}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ background: "var(--bg-inner)", border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/valiokunta/${c.committeeCode}`}
                          className="font-mono text-xs font-semibold hover:underline"
                          style={{ color: "var(--accent-red)" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.committeeCode}
                        </Link>
                        <Link
                          href={`/valiokunta/${c.committeeCode}`}
                          className="text-sm hover:underline"
                          style={{ color: "var(--text-primary)" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {COMMITTEES[c.committeeCode] ?? c.committeeNameFi}
                        </Link>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: c.role === "lead" ? "rgba(233,69,96,0.1)" : "rgba(255,255,255,0.05)",
                            color: c.role === "lead" ? "var(--accent-red)" : "var(--text-muted)",
                          }}
                        >
                          {c.role === "lead" ? "Vastuuvaliokunta" : "Lausuntovaliokunta"}
                        </span>
                      </div>
                      {c.reportId && (
                        <span className="font-mono text-xs" style={{ color: "var(--accent-green)" }}>
                          {c.reportId}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ASIANTUNTIJAT */}
        {activeTab === "experts" && (
          <div>
            {bill.experts.length === 0 ? (
              <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
                <div className="text-3xl mb-2">🎙</div>
                <p className="text-sm">Ei vielä asiantuntijalausuntoja</p>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {bill.experts.length} asiantuntijaa kuultu
                  </span>
                </div>
                <div className="space-y-2">
                  {bill.experts.map((expert) => {
                    const committee = bill.committees.find(
                      (c) => c.committeeCode === expert.committeeCode
                    );
                    const reportDoc = committee?.reportId
                      ? bill.documents.find((d) => d.id === committee.reportId)
                      : null;
                    return (
                      <ExpertCard
                        key={expert.id}
                        expert={expert}
                        reportUrl={reportDoc?.eduskuntaUrl ?? null}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ÄÄNESTYS */}
        {activeTab === "votes" && (
          <div>
            {bill.votes.length === 0 ? (
              <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
                <div className="text-3xl mb-2">{bill.currentStage === "voted" || bill.currentStage === "enacted" ? "✅" : "🕐"}</div>
                <p className="text-sm">
                  {bill.currentStage === "voted" || bill.currentStage === "enacted"
                    ? "Äänestys pidettiin — yksityiskohtaisia äänestystietoja ei ole saatavilla"
                    : "Äänestystä ei vielä pidetty"}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {bill.votes.map((vote) => (
                  <div key={vote.id}>
                    <VoteBar vote={vote} />
                    {vote.mpVotes.length > 0 && (
                      <PartyVoteGrid mpVotes={vote.mpVotes} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ASIAKIRJAT */}
        {activeTab === "documents" && (
          <div>
            {bill.documents.length === 0 ? (
              <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm">Ei asiakirjoja</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bill.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.eduskuntaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-all group"
                    style={{
                      background: "var(--bg-inner)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor = "rgba(78,204,163,0.2)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.04)")
                    }
                  >
                    <div>
                      <div className="text-sm font-mono" style={{ color: "var(--accent-green)" }}>
                        {DOC_TYPE_LABELS[doc.docType] ?? doc.docType} — {doc.id}
                      </div>
                      {doc.titleFi && (
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                          {doc.titleFi}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {formatFinnishDate(doc.publishedDate)}
                      </span>
                      <span className="text-xs" style={{ color: "var(--accent-green)" }}>↗</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
