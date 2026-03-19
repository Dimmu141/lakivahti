"use client";

import Link from "next/link";

interface CommitteeCardProps {
  code: string;
  name: string;
  count?: number;
}

export default function CommitteeCard({ code, name, count }: CommitteeCardProps) {
  return (
    <Link href={`/valiokunta/${code}`}>
      <div
        className="rounded-xl px-5 py-4 flex items-center justify-between transition-all cursor-pointer"
        style={{
          background: "var(--bg-card)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "rgba(233,69,96,0.25)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.04)")
        }
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold w-12" style={{ color: "var(--accent-red)" }}>
            {code}
          </span>
          <span className="text-sm" style={{ color: "var(--text-primary)" }}>
            {name}
          </span>
        </div>
        {count !== undefined && (
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
          >
            {count} hanketta
          </span>
        )}
      </div>
    </Link>
  );
}
