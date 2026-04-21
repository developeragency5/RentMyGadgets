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
      return parsePgArray(val);
    }
  }
  return [];
}

function parsePgArray(raw: string): string[] {
  const inner = raw.slice(1, -1);
  if (!inner) return [];

  const results: string[] = [];
  let i = 0;

  while (i < inner.length) {
    if (inner[i] === '"') {
      i++;
      let element = "";
      while (i < inner.length) {
        if (inner[i] === '\\' && i + 1 < inner.length) {
          element += inner[i + 1];
          i += 2;
        } else if (inner[i] === '"') {
          i++;
          break;
        } else {
          element += inner[i];
          i++;
        }
      }
      results.push(element);
      if (i < inner.length && inner[i] === ',') i++;
    } else {
      let element = "";
      while (i < inner.length && inner[i] !== ',') {
        element += inner[i];
        i++;
      }
      if (element === "NULL") {
        results.push("");
      } else {
        results.push(element);
      }
      if (i < inner.length && inner[i] === ',') i++;
    }
  }

  return results;
}
