export async function api(
  url: string,
  method = "GET",
  data?: unknown,
  key?: string,
  signal?: AbortSignal,
) {
  const timeout = AbortSignal.timeout(30_000);
  const r = await fetch("/api/v1" + url, {
    method,
    cache: "no-store",
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    credentials: "include",
    headers: {
      ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  }).catch((error) => {
    if (timeout.aborted && !signal?.aborted)
      throw new Error(method === "GET"
        ? "The server is taking too long. Please retry."
        : "Server confirmation timed out. Check the record or retry the pending submission before entering it again.");
    throw error;
  });
  const b = await r.json().catch(() => {
    throw new Error("The server returned an unavailable response. Please retry shortly.");
  });
  if (!r.ok) {
    const e: any = new Error(b.error || "Request failed");
    e.status = r.status;
    throw e;
  }
  return b;
}
