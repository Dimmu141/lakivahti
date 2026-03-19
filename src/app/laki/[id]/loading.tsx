export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      {/* Back button */}
      <div className="h-7 w-24 rounded mb-5" style={{ background: "var(--bg-card)" }} />

      {/* Header card */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--bg-card)" }}>
        <div className="flex gap-2 mb-4">
          <div className="h-5 w-14 rounded-full" style={{ background: "var(--bg-inner)" }} />
          <div className="h-5 w-20 rounded-full" style={{ background: "var(--bg-inner)" }} />
        </div>
        <div className="h-7 w-3/4 rounded mb-2" style={{ background: "var(--bg-inner)" }} />
        <div className="h-4 w-1/2 rounded mb-6" style={{ background: "var(--bg-inner)" }} />
        <div className="flex gap-3 mb-6">
          <div className="h-8 w-28 rounded-lg" style={{ background: "var(--bg-inner)" }} />
          <div className="h-8 w-28 rounded-lg" style={{ background: "var(--bg-inner)" }} />
        </div>
        {/* Stage tracker */}
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 h-12 rounded" style={{ background: "var(--bg-inner)" }} />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: "var(--bg-card)" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1 h-9 rounded-lg" style={{ background: "var(--bg-inner)" }} />
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--bg-card)" }}>
        <div className="h-4 w-24 rounded" style={{ background: "var(--bg-inner)" }} />
        <div className="h-4 w-full rounded" style={{ background: "var(--bg-inner)" }} />
        <div className="h-4 w-5/6 rounded" style={{ background: "var(--bg-inner)" }} />
        <div className="h-4 w-4/6 rounded" style={{ background: "var(--bg-inner)" }} />
      </div>
    </div>
  );
}
