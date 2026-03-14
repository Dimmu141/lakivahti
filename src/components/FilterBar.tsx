"use client";

interface FilterBarProps {
  query: string;
  stage: string;
  category: string;
  categories: string[];
  onQueryChange: (v: string) => void;
  onStageChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
}

const STAGE_OPTIONS = [
  { value: "", label: "Kaikki vaiheet" },
  { value: "submitted", label: "Annettu" },
  { value: "committee", label: "Valiokunnassa" },
  { value: "hearing", label: "Kuuleminen" },
  { value: "report", label: "Mietintö" },
  { value: "plenary", label: "Täysistunto" },
  { value: "voted", label: "Äänestetty" },
  { value: "enacted", label: "Vahvistettu" },
];

const selectStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "var(--text-primary)",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "14px",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: "32px",
};

export default function FilterBar({
  query,
  stage,
  category,
  categories,
  onQueryChange,
  onStageChange,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-5">
      <div className="relative flex-1">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="Hae nimellä tai avainsanalla…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all"
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "rgba(233,69,96,0.5)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
          }
        />
      </div>

      <select
        value={stage}
        onChange={(e) => onStageChange(e.target.value)}
        style={selectStyle}
      >
        {STAGE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#16162a" }}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={selectStyle}
      >
        <option value="" style={{ background: "#16162a" }}>
          Kaikki kategoriat
        </option>
        {categories.map((c) => (
          <option key={c} value={c} style={{ background: "#16162a" }}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
