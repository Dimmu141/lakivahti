export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-8 w-48 rounded-lg mb-2 animate-pulse" style={{ background: "var(--bg-card)" }} />
      <div className="h-4 w-80 rounded mb-6 animate-pulse" style={{ background: "var(--bg-card)" }} />
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-32 rounded-lg animate-pulse" style={{ background: "var(--bg-card)" }} />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl p-4 mb-3 animate-pulse" style={{ background: "var(--bg-card)" }}>
          <div className="flex gap-2 mb-2">
            <div className="h-4 w-28 rounded" style={{ background: "var(--bg-inner)" }} />
            <div className="h-4 w-20 rounded-full" style={{ background: "var(--bg-inner)" }} />
          </div>
          <div className="h-4 w-3/4 rounded mb-2" style={{ background: "var(--bg-inner)" }} />
          <div className="h-3 w-full rounded mb-1" style={{ background: "var(--bg-inner)" }} />
          <div className="h-3 w-2/3 rounded" style={{ background: "var(--bg-inner)" }} />
        </div>
      ))}
    </div>
  );
}
