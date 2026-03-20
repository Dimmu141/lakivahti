export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-8 w-48 rounded-lg mb-2" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-4 w-64 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>

      {/* Search bar */}
      <div className="h-10 w-full rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.05)" }} />

      {/* Grid of MP cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-3 flex flex-col items-center gap-2"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="w-16 h-16 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="h-3 w-20 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-3 w-14 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
