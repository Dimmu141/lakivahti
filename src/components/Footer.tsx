import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-16 border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Left: branding + description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--accent-red)" }}
              >
                L
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
              >
                Lakivahti
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Suomen lainsäädännön seuranta — avoin data, avoin koodi.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
              Lähdedata:{" "}
              <a
                href="https://avoindata.eduskunta.fi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--accent-green)" }}
              >
                Eduskunnan avoin data
              </a>{" "}
              (CC BY 4.0)
            </p>
          </div>

          {/* Right: links */}
          <nav
            className="flex flex-col gap-2 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <Link href="/" className="hover:text-white transition-colors">
              Lakihankkeet
            </Link>
            <Link href="/valiokunnat" className="hover:text-white transition-colors">
              Valiokunnat
            </Link>
            <Link href="/kansanedustajat" className="hover:text-white transition-colors">
              Kansanedustajat
            </Link>
            <Link href="/tietosuoja" className="hover:text-white transition-colors">
              Tietosuoja
            </Link>
            <a
              href="/api/rss"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>RSS-syöte</span>
              <span style={{ color: "var(--accent-green)" }}>↗</span>
            </a>
            <a
              href="https://avoindata.eduskunta.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Lähdedata</span>
              <span style={{ color: "var(--accent-green)" }}>↗</span>
            </a>
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            color: "var(--text-faint)",
          }}
        >
          <span>Prototyyppi — ei virallinen palvelu</span>
          <span>
            Data päivittyy automaattisesti eduskunnan istuntojen mukaan
          </span>
        </div>
      </div>
    </footer>
  );
}
