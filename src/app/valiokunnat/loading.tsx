export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-8 w-40 rounded-lg mb-2" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-4 w-56 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>

      {/* Committee cards */}
      <div className="space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-10 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="h-4 w-48 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div className="h-4 w-16 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
