import Link from "next/link";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(10, 10, 26, 0.95)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--accent-red)" }}
          >
            L
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
          >
            Lakivahti
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{
              background: "rgba(233,69,96,0.15)",
              color: "var(--accent-red)",
              border: "1px solid rgba(233,69,96,0.3)",
            }}
          >
            PROTOTYYPPI
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm" style={{ color: "var(--text-secondary)" }}>
          <Link href="/" className="hover:text-white transition-colors">
            Lakihankkeet
          </Link>
          <a
            href="https://avoindata.eduskunta.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Lähdedata ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
