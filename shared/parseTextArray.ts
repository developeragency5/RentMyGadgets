export function parseTextArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === "string");
  if (typeof val === "string") {
    if (val.startsWith("[")) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed.filter((v: unknown): v is string => typeof v === "string") : [];
      } catch { return []; }
    }
    if (val.startsWith("{")) {
      const inner = val.slice(1, -1);
      if (!inner) return [];
      return inner.split(",").map(s => s.replace(/^"|"$/g, ""));
    }
  }
  return [];
}
