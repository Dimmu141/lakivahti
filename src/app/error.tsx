"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Lakivahti] Unhandled error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h1
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Jotain meni pieleen
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Sivun lataaminen epäonnistui. Yritä uudelleen tai palaa etusivulle.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: "var(--accent-red)", color: "white" }}
          >
            Yritä uudelleen
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            ← Etusivu
          </Link>
        </div>
      </div>
    </>
  );
}
