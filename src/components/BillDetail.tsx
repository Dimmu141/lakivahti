"use client";

import { useState } from "react";
import StageTracker from "./StageTracker";
import VoteBar from "./VoteBar";
import PartyVoteGrid from "./PartyVoteGrid";
import ExpertCard from "./ExpertCard";
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
  HE: "📋 Hallituksen esitys",
  LA: "📋 Lakialoite",
  KAA: "📋 Kansalaisaloite",
  mietinto: "📄 Mietintö",
  lausunto: "📝 Lausunto",
  asiantuntijalausunto: "🎙 Asiantuntijalausunto",
  poytakirja: "📔 Pöytäkirja",
  saadoskokoelma: "⚖️ Säädöskokoelma",
};

export default function BillDetail({ bill }: { bill: SampleBill }) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const urgencyBg =
    bill.urgency === "high"
      ? "rgba(233,69,96,0.12)"
      : bill.urgency === "low"
      ? "rgba(255,255,255,0.04)"
      : "rgba(78,204,163,0.1)";
  const urgencyColor =
    bill.urgency === "high"
      ? "var(--accent-red)"
      : bill.urgency === "low"
      ? "var(--text-muted)"
      : "var(--accent-green)";
  const urgencyLabel = bill.urgency === "high" ? "Kiireellinen" : bill.urgency === "low" ? "Ei kiireellinen" : "Tavallinen";

  const stageInfo = STAGES.find((s) => s.key === bill.currentStage);

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
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: urgencyBg,
              color: urgencyColor,
              border: `1px solid ${urgencyColor}40`,
            }}
          >
            {urgencyLabel}
          </span>
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

        {/* Stage tracker */}
        <StageTracker currentStage={bill.currentStage} />
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-4 p-1 rounded-xl"
        style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2 px-3 text-sm rounded-lg transition-all"
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
        {/* ─── YLEISKATSAUS ─── */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {bill.summaryFi && (
              <div>
                <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Tiivistelmä
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {bill.summaryFi}
                </p>
              </div>
            )}

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
                        <span className="font-mono text-xs font-semibold" style={{ color: "var(--accent-red)" }}>
                          {c.committeeCode}
                        </span>
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                          {COMMITTEES[c.committeeCode] ?? c.committeeNameFi}
                        </span>
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

        {/* ─── ASIANTUNTIJAT ─── */}
        {activeTab === "experts" && (
          <div>
            {bill.experts.length === 0 ? (
              <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
                <div className="text-3xl mb-2">🎙</div>
                <p className="text-sm">Ei vielä asiantuntijalausuntoja</p>
              </div>
            ) : (
              <>
                <div
                  className="flex items-center justify-between mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="text-xs uppercase tracking-wider">
                    {bill.experts.length} asiantuntijaa kuultu
                  </span>
                  <div className="flex gap-3 text-xs">
                    <span style={{ color: "var(--accent-green)" }}>
                      ● Puolesta {bill.experts.filter((e) => e.position === "for").length}
                    </span>
                    <span style={{ color: "var(--accent-red)" }}>
                      ● Vastaan {bill.experts.filter((e) => e.position === "against").length}
                    </span>
                    <span style={{ color: "var(--accent-yellow)" }}>
                      ● Neutraali {bill.experts.filter((e) => e.position === "neutral").length}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {bill.experts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── ÄÄNESTYS ─── */}
        {activeTab === "votes" && (
          <div>
            {bill.votes.length === 0 ? (
              <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm">Äänestystä ei vielä pidetty</p>
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

        {/* ─── ASIAKIRJAT ─── */}
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
