"use client";
import { RefreshCw } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { api } from "../../../lib/api";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "page" | "data" | "busy" | "action" | "setSuccess"
>;
export function WhatsAppView({ page, data, busy, action, setSuccess }: Props) {
  return (
    <>
      {page === "WhatsApp" && (
        <div className="grid">
          <div>
            <section className="card">
              <header>
                <h2>WhatsApp Connection</h2>
                <Badge
                  value={
                    data?.status === "connected"
                      ? "Connected"
                      : data?.status === "qr_ready"
                        ? "Ready to Scan"
                        : data?.status === "connecting"
                          ? "Connecting…"
                          : "Disconnected"
                  }
                />
              </header>
              {data?.status === "connected" ? (
                <div>
                  <div
                    className="banner"
                    style={{
                      background: "#edf6ef",
                      borderColor: "#c4e3cb",
                      color: "#215d39",
                    }}
                  >
                    ✓ <strong>Shop WhatsApp is Active & Linked</strong>
                    <div style={{ marginTop: 6 }}>
                      Connected Phone: <strong>+{data.phone}</strong>
                    </div>
                  </div>
                  <p
                    className="muted"
                    style={{ fontSize: 14, lineHeight: 1.7 }}
                  >
                    Your shop WhatsApp is connected. Automated monthly
                    reminders, instant owner alerts upon payment, and incoming
                    UPI proof uploads are active.
                  </p>
                  <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                    <button
                      className="button danger"
                      disabled={busy}
                      onClick={() =>
                        action(async () => {
                          if (
                            confirm(
                              "Disconnect shop WhatsApp? Reminders will be paused until re-linked.",
                            )
                          ) {
                            await api("/whatsapp/disconnect", "POST");
                            setSuccess("WhatsApp disconnected.");
                          }
                        })
                      }
                    >
                      Disconnect Phone
                    </button>
                    <button
                      className="button"
                      disabled={busy}
                      onClick={() =>
                        action(async () => {
                          await api("/whatsapp/restart", "POST");
                          setSuccess("Connection restarted.");
                        })
                      }
                    >
                      Restart Connection
                    </button>
                  </div>
                </div>
              ) : data?.status === "qr_ready" && data?.qr ? (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div
                    className="banner"
                    style={{ textAlign: "left", marginBottom: 20 }}
                  >
                    <strong>To link your shop’s WhatsApp:</strong>
                    <ol
                      style={{
                        margin: "8px 0 0",
                        paddingLeft: 20,
                        lineHeight: 1.6,
                      }}
                    >
                      <li>Open WhatsApp on the shop phone</li>
                      <li>
                        Tap <strong>Settings</strong> or{" "}
                        <strong>⋮ (Menu)</strong> &gt;{" "}
                        <strong>Linked devices</strong>
                      </li>
                      <li>
                        Tap <strong>Link a device</strong> and scan the QR code
                        below:
                      </li>
                    </ol>
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      padding: 14,
                      background: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <img
                      src={data.qr}
                      alt="Scan WhatsApp QR"
                      style={{ width: 280, height: 280, display: "block" }}
                    />
                  </div>
                  <p className="muted" style={{ fontSize: 13, marginTop: 16 }}>
                    🔄 Waiting for scan… (Updates automatically when scanned)
                  </p>
                  <div style={{ marginTop: 16 }}>
                    <button
                      className="button"
                      disabled={busy}
                      onClick={() =>
                        action(async () => {
                          await api("/whatsapp/restart", "POST");
                          setSuccess("Refreshed QR code.");
                        })
                      }
                    >
                      Refresh QR Code
                    </button>
                  </div>
                </div>
              ) : data?.status === "connecting" ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <RefreshCw
                    size={32}
                    style={{
                      margin: "0 auto 16px",
                      display: "block",
                      color: "var(--gold)",
                    }}
                  />
                  <p>
                    <strong>Connecting to WhatsApp Gateway…</strong>
                  </p>
                  <p className="muted" style={{ fontSize: 13 }}>
                    Initializing session, please wait a moment.
                  </p>
                </div>
              ) : (
                <div>
                  <div
                    className="banner"
                    style={{
                      background: "#fff0eb",
                      borderColor: "#ecc7bc",
                      color: "#9a3324",
                    }}
                  >
                    ⚠️ <strong>WhatsApp is disconnected</strong>
                    <p style={{ margin: "6px 0 0", fontSize: 13 }}>
                      {data?.message ||
                        "The WhatsApp gateway is not connected. Click below to generate a QR code."}
                    </p>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <button
                      className="button primary"
                      disabled={busy}
                      onClick={() =>
                        action(async () => {
                          await api("/whatsapp/restart", "POST");
                          setSuccess("Starting WhatsApp gateway…");
                        })
                      }
                    >
                      Generate QR Code
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
          <div>
            <section className="card">
              <div className="eyebrow">BUILT-IN AUTOMATION</div>
              <h2>How It Works</h2>
              <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
                Direct WhatsApp Web gateway runs on the shop backend with zero
                monthly subscriptions and no Meta business verification needed.
              </p>
              <div className="key-value" style={{ marginTop: 20 }}>
                <p>
                  <strong>📅 Automated Reminders</strong>
                  <small>
                    Sent on instalment due dates with customer details and
                    personalized secure payment links.
                  </small>
                </p>
                <p>
                  <strong>🔔 Instant Owner Alerts</strong>
                  <small>
                    Owner receives an instant WhatsApp alert as soon as any
                    customer payment is completed.
                  </small>
                </p>
                <p>
                  <strong>📸 UPI Screenshot Intake</strong>
                  <small>
                    Customer UPI screenshots sent to this WhatsApp appear in
                    "Payment proofs" for bank verification.
                  </small>
                </p>
                <p>
                  <strong>🤖 Customer Enquiries</strong>
                  <small>
                    Customers texting BALANCE or STATUS get instant account
                    summaries automatically.
                  </small>
                </p>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
