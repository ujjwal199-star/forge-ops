const NOW = new Date("2026-08-15T07:00:00.000Z");

export function now() {
  return NOW;
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function relativeTime(value: string | null | undefined) {
  if (!value) return "—";
  if (value === "continuous") return "continuous";
  const diff = new Date(value).getTime() - NOW.getTime();
  const abs = Math.abs(diff);
  const minute = 60_000;
  const units: [number, string][] = [
    [minute, "min"],
    [minute * 60, "hr"],
    [minute * 60 * 24, "day"],
    [minute * 60 * 24 * 30, "mo"],
  ];
  let label = "just now";
  for (let i = units.length - 1; i >= 0; i--) {
    const [ms, unit] = units[i]!;
    if (abs >= ms) {
      const n = Math.round(abs / ms);
      label = `${n} ${unit}${n === 1 ? "" : "s"}`;
      break;
    }
  }
  if (label === "just now") return label;
  return diff < 0 ? `${label} ago` : `in ${label}`;
}

export function num(value: number) {
  return value.toLocaleString("en-US");
}

export function pct(part: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}
