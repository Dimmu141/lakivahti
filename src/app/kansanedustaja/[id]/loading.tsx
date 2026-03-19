export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      {/* Back button */}
      <div className="h-7 w-24 rounded mb-6" style={{ background: "var(--bg-card)" }} />

      {/* MP header */}
      <div className="rounded-2xl p-6 mb-6 flex items-center gap-5" style={{ background: "var(--bg-card)" }}>
        <div className="w-20 h-20 rounded-full shrink-0" style={{ background: "var(--bg-inner)" }} />
        <div className="flex-1">
          <div className="h-7 w-48 rounded mb-2" style={{ background: "var(--bg-inner)" }} />
          <div className="h-4 w-32 rounded mb-1" style={{ background: "var(--bg-inner)" }} />
          <div className="h-4 w-24 rounded" style={{ background: "var(--bg-inner)" }} />
        </div>
      </div>

      {/* Vote stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl h-20" style={{ background: "var(--bg-card)" }} />
        ))}
      </div>

      {/* Vote history */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-4 mb-3 h-16"
          style={{ background: "var(--bg-card)" }}
        />
      ))}
    </div>
  );
}
