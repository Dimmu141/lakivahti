export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      {/* Back button */}
      <div className="h-7 w-24 rounded mb-6" style={{ background: "var(--bg-card)" }} />

      {/* Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--bg-card)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-16 rounded" style={{ background: "var(--bg-inner)" }} />
          <div className="h-6 w-48 rounded" style={{ background: "var(--bg-inner)" }} />
        </div>
        <div className="h-4 w-32 rounded" style={{ background: "var(--bg-inner)" }} />
      </div>

      {/* Bill list */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-4 mb-3 h-24"
          style={{ background: "var(--bg-card)" }}
        />
      ))}
    </div>
  );
}
