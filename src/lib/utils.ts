/** Format a Finnish date: "15.3.2026" */
export function formatFinnishDate(date: Date | string | null | undefined): string {
  if (!date) return "–";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

/** Convert bill ID to a URL-safe slug: "HE 1/2026 vp" → "HE-1-2026" */
export function billIdToSlug(id: string): string {
  return id
    .replace(" vp", "")
    .replace(/\s+/g, "-")
    .replace("/", "-");
}

/** Convert URL slug back to bill ID: "HE-1-2026" → "HE 1/2026 vp" */
export function slugToBillId(slug: string): string {
  const parts = slug.split("-");
  const type = parts[0];
  const number = parts[1];
  const year = parts[2];
  return `${type} ${number}/${year} vp`;
}
