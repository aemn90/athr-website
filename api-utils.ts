type Bucket = { count: number; resets: number };
const buckets = new Map<string, Bucket>();

export function rateLimited(request: Request, namespace: string, limit = 5) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${namespace}:${ip}`;
  const now = Date.now();
  if (buckets.size > 2000) {
    for (const [k, bucket] of buckets) if (bucket.resets < now) buckets.delete(k);
    if (buckets.size > 2000) buckets.delete(buckets.keys().next().value!);
  }
  const existing = buckets.get(key);
  if (!existing || existing.resets <= now) {
    buckets.set(key, { count: 1, resets: now + 60_000 });
    return false;
  }
  existing.count += 1;
  return existing.count > limit;
}

export const isEmail = (value: string) => value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

export function safeOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
