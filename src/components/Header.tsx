"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Lakihankkeet" },
  { href: "/hankkeet", label: "Valmistelussa" },
  { href: "/valiokunnat", label: "Valiokunnat" },
  { href: "/kansanedustajat", label: "Kansanedustajat" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold shrink-0"
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
            className="hidden sm:inline text-xs px-1.5 py-0.5 rounded font-mono"
            style={{
              background: "rgba(233,69,96,0.15)",
              color: "var(--accent-red)",
              border: "1px solid rgba(233,69,96,0.3)",
            }}
          >
            PROTOTYYPPI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-5 text-sm">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors relative"
                style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = active ? "var(--text-primary)" : "var(--text-secondary)")
                }
              >
                {active && (
                  <span
                    className="absolute -bottom-[17px] left-0 right-0 h-px"
                    style={{ background: "var(--accent-red)" }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
          <a
            href="https://avoindata.eduskunta.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            Lähdedata ↗
          </a>
          <a
            href="/api/rss"
            className="transition-colors"
            title="RSS-syöte"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            RSS
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Avaa valikko"
          aria-expanded={menuOpen}
        >
          <span
            className="block h-0.5 rounded transition-all duration-200 origin-center"
            style={{
              background: "var(--text-secondary)",
              transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <span
            className="block h-0.5 rounded transition-all duration-200"
            style={{
              background: "var(--text-secondary)",
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? "scaleX(0)" : "none",
            }}
          />
          <span
            className="block h-0.5 rounded transition-all duration-200 origin-center"
            style={{
              background: "var(--text-secondary)",
              transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="sm:hidden border-t px-4 py-4 flex flex-col gap-1"
          style={{
            background: "rgba(10, 10, 26, 0.98)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm transition-colors"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  background: active ? "rgba(233,69,96,0.08)" : "transparent",
                  borderLeft: active ? "2px solid var(--accent-red)" : "2px solid transparent",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div
            className="mt-2 pt-2 flex flex-col gap-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <a
              href="https://avoindata.eduskunta.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-lg text-sm"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMenuOpen(false)}
            >
              Lähdedata ↗
            </a>
            <a
              href="/api/rss"
              className="py-2.5 px-3 rounded-lg text-sm"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMenuOpen(false)}
            >
              RSS-syöte
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
