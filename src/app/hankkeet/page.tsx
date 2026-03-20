import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GovProjectCard from "@/components/GovProjectCard";
import { getGovProjects, getMinistries, PREP_PHASE_LABELS } from "@/lib/gov-projects-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Valmistelussa olevat hankkeet — Lakivahti",
  description:
    "Seuraa hallituksen lainsäädäntöhankkeita ennen niiden saapumista eduskuntaan. Lähde: Valtioneuvoston Hankeikkuna.",
};

export default async function HankkeetPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const q = params.q ?? undefined;
  const prepPhase = params.vaihe ?? undefined;
  const ministry = params.ministerio ?? undefined;

  const [{ projects, total }, ministries] = await Promise.all([
    getGovProjects({ q, prepPhase, ministry, limit: 100 }),
    getMinistries(),
  ]);

  const phases = Object.entries(PREP_PHASE_LABELS);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Valmistelussa
            </h1>
            <span
              className="text-xs px-2 py-0.5 rounded font-mono"
              style={{
                background: "rgba(78,204,163,0.12)",
                color: "var(--accent-green)",
                border: "1px solid rgba(78,204,163,0.25)",
              }}
            >
              {total} hanketta
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Hallituksen lainsäädäntöhankkeet ennen eduskunnan käsittelyä —{" "}
            <a
              href="https://valtioneuvosto.fi/hankkeet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--accent-green)" }}
            >
              Valtioneuvoston Hankeikkuna ↗
            </a>
          </p>
        </div>

        {/* Filters */}
        <form method="GET" className="mb-6 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Hae hankkeita…"
            className="flex-1 px-3 py-2 rounded-lg text-sm"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
          <select
            name="vaihe"
            defaultValue={prepPhase ?? ""}
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-secondary)",
            }}
          >
            <option value="">Kaikki vaiheet</option>
            {phases.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            name="ministerio"
            defaultValue={ministry ?? ""}
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-secondary)",
            }}
          >
            <option value="">Kaikki ministeriöt</option>
            {ministries.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--accent-green)",
              color: "var(--bg-base)",
            }}
          >
            Hae
          </button>
          {(q || prepPhase || ministry) && (
            <a
              href="/hankkeet"
              className="px-4 py-2 rounded-lg text-sm text-center transition-opacity hover:opacity-80"
              style={{
                background: "var(--bg-inner)",
                color: "var(--text-muted)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Tyhjennä
            </a>
          )}
        </form>

        {/* Phase summary pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {phases.map(([key, label]) => {
            const count = projects.filter((p) => p.prepPhase === key).length;
            if (count === 0) return null;
            return (
              <a
                key={key}
                href={`/hankkeet?vaihe=${key}`}
                className="text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                style={{
                  background: prepPhase === key ? "rgba(78,204,163,0.15)" : "var(--bg-card)",
                  color: prepPhase === key ? "var(--accent-green)" : "var(--text-muted)",
                  border: prepPhase === key
                    ? "1px solid rgba(78,204,163,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {label} · {count}
              </a>
            );
          })}
        </div>

        {/* Project list */}
        {projects.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Ei hankkeita hakuehdoilla.
            </p>
          </div>
        ) : (
          <div>
            {projects.map((project) => (
              <GovProjectCard key={project.uuid} project={project} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
