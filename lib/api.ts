export async function api(
  url: string,
  method = "GET",
  data?: unknown,
  key?: string,
) {
  const r = await fetch("/api/v1" + url, {
    method,
    credentials: "include",
    headers: {
      ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  const b = await r.json();
  if (!r.ok) {
    const e: any = new Error(b.error || "Request failed");
    e.status = r.status;
    throw e;
  }
  return b;
}
