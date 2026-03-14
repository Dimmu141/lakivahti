import Link from "next/link";
import Header from "@/components/Header";

export default function BillNotFound() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div
          className="font-mono text-5xl font-bold mb-4"
          style={{ color: "var(--accent-red)" }}
        >
          404
        </div>
        <h1
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Lakihanketta ei löydy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Tätä lakihanketta ei ole tietokannassa. Se saattaa olla liian vanha
          tai tunniste on virheellinen.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
          style={{ background: "var(--accent-red)", color: "white" }}
        >
          ← Kaikki lakihankkeet
        </Link>
      </div>
    </>
  );
}
