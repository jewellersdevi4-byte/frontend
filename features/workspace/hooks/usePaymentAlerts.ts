"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../lib/api";
import { money } from "../../../lib/format";
import type { Row } from "../../../lib/types";

const POLL_INTERVAL_MS = 15_000;

function paymentDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${value.slice(0, 10)}T12:00:00+05:30`));
}

export function usePaymentAlerts(userId?: string) {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const audio = useRef<AudioContext | null>(null);
  const seen = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (!userId) return;
    setPermission(typeof Notification === "undefined" ? "denied" : Notification.permission);
    const key = `devi_payment_alert_ids_${userId}`;
    const saved = localStorage.getItem(key);
    if (saved) seen.current = new Set(JSON.parse(saved));

    let active = true;
    const check = async () => {
      try {
        const payments: Row[] = await api("/payments");
        if (!active) return;
        const ordered = [...payments].sort(
          (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
        );
        if (!initialized.current && !seen.current.size) {
          seen.current = new Set(ordered.map((payment) => payment.id));
          initialized.current = true;
          localStorage.setItem(key, JSON.stringify([...seen.current].slice(-300)));
          return;
        }
        initialized.current = true;
        for (const payment of ordered) {
          if (!payment.id || seen.current.has(payment.id)) continue;
          seen.current.add(payment.id);
          if (payment.reversal_reason) continue;

          const message = `${payment.customer_name} paid ${money(payment.amount)} on ${paymentDate(payment.payment_date)}.`;
          if (Notification.permission === "granted") {
            new Notification("Customer payment received", { body: message, tag: payment.id });
          }
          if (audio.current?.state === "running") {
            const context = audio.current;
            const now = context.currentTime;
            for (const [offset, frequency] of [[0, 880], [0.2, 1175]] as const) {
              const oscillator = context.createOscillator();
              const gain = context.createGain();
              oscillator.type = "sine";
              oscillator.frequency.value = frequency;
              gain.gain.setValueAtTime(0.0001, now + offset);
              gain.gain.exponentialRampToValueAtTime(0.18, now + offset + 0.02);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.16);
              oscillator.connect(gain);
              gain.connect(context.destination);
              oscillator.start(now + offset);
              oscillator.stop(now + offset + 0.17);
            }
          }
        }
        localStorage.setItem(key, JSON.stringify([...seen.current].slice(-300)));
      } catch {
        // Keep the last seen IDs so a temporary outage does not create false alerts.
      }
    };

    void check();
    const timer = window.setInterval(check, POLL_INTERVAL_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [userId]);

  const enable = useCallback(async () => {
    if (typeof window === "undefined") return;
    const AudioContextConstructor = window.AudioContext;
    if (AudioContextConstructor) {
      audio.current ??= new AudioContextConstructor();
      await audio.current.resume();
    }
    if ("Notification" in window) {
      const next = await Notification.requestPermission();
      setPermission(next);
    }
    setEnabled(true);
  }, []);

  return { enabled, permission, enable };
}
