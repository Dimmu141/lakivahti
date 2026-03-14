import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div
          className="text-6xl font-bold font-mono mb-4"
          style={{ color: "var(--accent-red)" }}
        >
          404
        </div>
        <h1
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Sivua ei löydy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Etsimääsi sivua ei ole olemassa tai se on siirretty.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "var(--accent-red)", color: "white" }}
        >
          ← Takaisin etusivulle
        </Link>
      </div>
    </>
  );
}
