export const getApiBaseUrl = (): string => {
  const raw = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "");
  const v = String(raw).trim();
  if (!import.meta.env.DEV && (v.includes("localhost") || v.includes("127.0.0.1"))) return "";
  if (!v) return "";
  const noSlash = v.replace(/\/$/, "");
  return noSlash.endsWith("/api") ? noSlash.slice(0, -4) : noSlash;
};
