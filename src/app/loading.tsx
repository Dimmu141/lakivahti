export default function Loading() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse"
      aria-label="Ladataan..."
    >
      {/* Hero */}
      <div className="mb-8">
        <div
          className="h-9 w-36 rounded-lg mb-2"
          style={{ background: "var(--bg-card)" }}
        />
        <div
          className="h-4 w-80 rounded"
          style={{ background: "var(--bg-card)" }}
        />
      </div>

      {/* Stats boxes */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg h-16"
            style={{ background: "var(--bg-card)" }}
          />
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-5">
        <div
          className="flex-1 h-9 rounded-lg"
          style={{ background: "var(--bg-card)" }}
        />
        <div
          className="w-40 h-9 rounded-lg"
          style={{ background: "var(--bg-card)" }}
        />
        <div
          className="w-40 h-9 rounded-lg"
          style={{ background: "var(--bg-card)" }}
        />
      </div>

      {/* Bill cards */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-4 mb-3 h-28"
          style={{ background: "var(--bg-card)" }}
        />
      ))}
    </div>
  );
}
