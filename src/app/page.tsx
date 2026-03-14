import Header from "@/components/Header";
import BillList from "@/components/BillList";
import { getBills, getStageCounts, getCategories } from "@/lib/bills-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ bills }, stageCounts, categories] = await Promise.all([
    getBills({ limit: 200 }),
    getStageCounts(),
    getCategories(),
  ]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold tracking-tight mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Lakivahti
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Seuraa hallituksen esitysten ja lakialoitteiden etenemistä
            eduskunnan käsittelyssä
          </p>
        </div>

        <BillList
          initialBills={bills}
          initialStageCounts={stageCounts}
          initialCategories={categories}
        />
      </main>
    </>
  );
}
