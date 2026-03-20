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
          className="mt-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            color: "var(--text-faint)",
          }}
        >
          <div className="flex flex-col gap-1">
            <span>Prototyyppi — ei virallinen palvelu</span>
            <span>
              Tekijä:{" "}
              <a
                href="https://bsky.app/profile/dimmu141.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--text-secondary)" }}
              >
                Dmitry Gurbanov
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://bsky.app/profile/dimmu141.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
              title="Bluesky"
            >
              <svg width="14" height="14" viewBox="0 0 360 320" fill="currentColor" aria-hidden="true">
                <path d="M180 142c-16.3-31.7-60.7-90.8-102-120C38 2 14.3 2 6 2 0 2 0 8 0 8v4c0 4 2 6 6 8 44 20 88 56 120 96-32 40-76 76-120 96-4 2-6 4-6 8v4s0 6 6 6c8.3 0 32 0 72-20 41.3-29.2 85.7-88.3 102-120z"/>
                <path d="M180 142c16.3-31.7 60.7-90.8 102-120 40-20 63.7-20 72-20 6 0 6 6 6 6v4c0 4-2 6-6 8-44 20-88 56-120 96 32 40 76 76 120 96 4 2 6 4 6 8v4s0 6-6 6c-8.3 0-32 0-72-20C221.7 230.8 196.3 173.7 180 142z"/>
              </svg>
              <span>Bluesky</span>
            </a>
            <a
              href="https://www.threads.com/@dimmu141"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
              title="Threads"
            >
              <svg width="13" height="14" viewBox="0 0 192 192" fill="currentColor" aria-hidden="true">
                <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.318-11.399 11.392-25.124 16.28-45.857 16.432-23.002-.168-40.386-7.556-51.66-21.969C36.468 124.06 31.09 105.3 30.873 82c.217-23.3 5.595-42.06 15.976-55.768C57.942 12.816 75.326 5.428 98.33 5.26c23.168.17 40.936 7.59 52.822 22.058 5.81 7.099 10.168 16.002 13.009 26.348l16.147-4.317c-3.44-12.68-8.853-23.606-16.219-32.668C148.582 6.979 127.037-1.051 98.426-1.271 69.815-1.051 48.6 7.02 33.76 24.18 20.58 39.33 13.686 60.406 13.48 82c.206 21.594 7.1 42.67 20.28 57.82C48.6 156.98 69.815 165.051 98.426 165.271c26.245-.179 44.788-7.043 59.932-22.222 20.68-20.692 19.977-45.731 13.199-61.337-4.749-11.076-13.72-20.031-30.02-22.724z"/>
              </svg>
              <span>Threads</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
