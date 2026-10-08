"use client";
import { useRef } from "react";
import { api } from "../../../lib/api";
/** Retains the same idempotency key until the server confirms the write. */
export function usePendingSubmission() {
  const pending = useRef<{ fingerprint: string; key: string } | null>(null);
  async function write(url: string, method: string, payload: unknown) {
    const fingerprint = JSON.stringify({ url, method, payload });
    const saved = sessionStorage.getItem("devi_pending");
    if (saved) pending.current = JSON.parse(saved);
    if (pending.current && pending.current.fingerprint !== fingerprint)
      throw new Error(
        "An earlier submission is awaiting confirmation. Retry it before entering another.",
      );
    if (!pending.current)
      pending.current = { fingerprint, key: crypto.randomUUID() };
    sessionStorage.setItem("devi_pending", JSON.stringify(pending.current));
    try {
      const result = await api(url, method, payload, pending.current.key);
      pending.current = null;
      sessionStorage.removeItem("devi_pending");
      return result;
    } catch (e: any) {
      if (e.status && e.status < 500) {
        pending.current = null;
        sessionStorage.removeItem("devi_pending");
      }
      throw e;
    }
  }
  return { pending, write };
}
