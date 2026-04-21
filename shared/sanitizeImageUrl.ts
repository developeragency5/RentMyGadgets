export function sanitizeImageUrl(url: string): string {
  if (!url || typeof url !== "string") return url;
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return new URL(trimmed).href;
    }
    const temp = new URL(trimmed, "http://localhost");
    return temp.pathname + temp.search + temp.hash;
  } catch {
    return trimmed.replace(/ /g, "%20");
  }
}
