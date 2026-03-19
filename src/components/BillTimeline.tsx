import { COMMITTEES } from "@/lib/constants";
import { formatFinnishDate } from "@/lib/utils";
import type { SampleBill } from "@/lib/sample-data";

interface TimelineEvent {
  date: string;
  icon: string;
  label: string;
  detail?: string;
  color: string;
}

function buildTimeline(bill: SampleBill): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // 1. Submitted
  if (bill.submittedDate) {
    events.push({
      date: bill.submittedDate,
      icon: "📋",
      label: "Annettu eduskunnalle",
      detail: bill.sponsor || undefined,
      color: "var(--text-secondary)",
    });
  }

  // 2. Committee assignments
  for (const c of bill.committees) {
    const name = COMMITTEES[c.committeeCode] ?? c.committeeNameFi;
    const roleLabel = c.role === "lead" ? "vastuuvaliokunta" : "lausuntovaliokunta";
    // We don't always have assignedDate, approximate from submission + a few days
    events.push({
      date: bill.submittedDate, // best we have
      icon: "🏛️",
      label: `Lähetetty: ${name}`,
      detail: roleLabel,
      color: "var(--text-secondary)",
    });
  }

  // 3. Expert hearings (grouped by date)
  const hearingsByDate = new Map<string, number>();
  for (const e of bill.experts) {
    if (e.hearingDate) {
      hearingsByDate.set(e.hearingDate, (hearingsByDate.get(e.hearingDate) ?? 0) + 1);
    }
  }
  for (const [date, count] of hearingsByDate) {
    events.push({
      date,
      icon: "🎙️",
      label: "Asiantuntijakuuleminen",
      detail: `${count} asiantuntijaa kuultu`,
      color: "var(--accent-yellow, #EAB308)",
    });
  }

  // 4. Committee reports
  for (const c of bill.committees) {
    if (c.reportId && c.reportDate) {
      const name = COMMITTEES[c.committeeCode] ?? c.committeeNameFi;
      events.push({
        date: c.reportDate,
        icon: "📄",
        label: `Mietintö valmis`,
        detail: `${name} — ${c.reportId}`,
        color: "var(--accent-green)",
      });
    }
  }

  // 5. Votes
  for (const v of bill.votes) {
    if (v.voteDate) {
      const dateStr = v.voteDate.split("T")[0];
      const passed = v.result === "passed";
      events.push({
        date: dateStr,
        icon: passed ? "✅" : "❌",
        label: passed ? "Hyväksytty" : "Hylätty",
        detail: `${v.votesFor}–${v.votesAgainst}`,
        color: passed ? "var(--accent-green)" : "var(--accent-red)",
      });
    }
  }

  // 6. Enacted (säädöskokoelma document)
  const enacted = bill.documents.find((d) => d.docType === "saadoskokoelma");
  if (enacted) {
    events.push({
      date: enacted.publishedDate,
      icon: "⚖️",
      label: "Vahvistettu",
      detail: enacted.id,
      color: "var(--accent-green)",
    });
  }

  // Sort chronologically
  events.sort((a, b) => a.date.localeCompare(b.date));

  return events;
}

export default function BillTimeline({ bill }: { bill: SampleBill }) {
  const events = buildTimeline(bill);

  if (events.length <= 1) return null;

  return (
    <div>
      <h3
        className="text-xs uppercase tracking-wider mb-3"
        style={{ color: "var(--text-muted)" }}
      >
        Käsittelyn eteneminen
      </h3>
      <div className="relative pl-6">
        {/* Vertical line */}
        <div
          className="absolute left-2.5 top-1 bottom-1 w-px"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {events.map((event, i) => (
          <div key={`${event.date}-${i}`} className="relative mb-3 last:mb-0">
            {/* Dot on the line */}
            <div
              className="absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full z-10"
              style={{
                background: event.color,
                border: "2px solid var(--bg-card)",
              }}
            />

            <div className="flex items-baseline gap-3">
              <span className="text-xs font-mono shrink-0" style={{ color: "var(--text-faint)", minWidth: "70px" }}>
                {formatFinnishDate(event.date)}
              </span>
              <div>
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {event.icon} {event.label}
                </span>
                {event.detail && (
                  <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
                    {event.detail}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
