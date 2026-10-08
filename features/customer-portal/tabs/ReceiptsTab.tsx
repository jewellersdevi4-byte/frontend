"use client";
import { Download, Receipt } from "lucide-react";
import { money } from "../../../lib/format";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<
  CustomerPortalModel,
  "activeTab" | "t" | "currentAcc" | "lang" | "token"
>;
export function ReceiptsTab({ activeTab, t, currentAcc, lang, token }: Props) {
  return (
    <>
      {activeTab === "receipts" && (
        <div className="card">
          <h3
            style={{
              fontFamily: "serif",
              fontSize: 18,
              color: "var(--primary)",
              marginBottom: 14,
            }}
          >
            {t.receipts}
          </h3>

          {currentAcc.payments.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px 0",
                color: "var(--text-muted)",
              }}
            >
              <Receipt
                size={32}
                style={{ margin: "0 auto 10px", opacity: 0.5 }}
              />
              <p>
                {lang === "kn"
                  ? "ಯಾವುದೇ ರಸೀದಿಗಳು ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ."
                  : "No receipts issued yet."}
              </p>
            </div>
          ) : (
            currentAcc.payments.map((p) => (
              <div key={p.id} className="receipt-item">
                <div>
                  <strong style={{ color: "var(--primary)", fontSize: 15 }}>
                    {p.receipt_number}
                  </strong>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {p.payment_date} · {p.method}{" "}
                    {p.reference ? `(${p.reference})` : ""}
                  </p>
                  {p.reserved_grams && Number(p.reserved_grams) > 0 ? (
                    <p
                      style={{
                        fontSize: 12,
                        color: "#84612a",
                        fontWeight: 600,
                        marginTop: 3,
                      }}
                    >
                      ⚖️ {p.reserved_grams} g gold{" "}
                      {p.rate_paise_per_gram
                        ? `@ ${money(p.rate_paise_per_gram)}/g (${p.purity || "22K"})`
                        : ""}
                    </p>
                  ) : null}
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong style={{ fontSize: 16, color: "#27ae60" }}>
                    {money(p.amount)}
                  </strong>
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      gap: 8,
                      justifyContent: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <a
                      href={`/api/v1/customer-portal/receipts/${p.receipt_id}?token=${encodeURIComponent(token)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        padding: "4px 8px",
                        background: "#eef3eb",
                        border: "1px solid #c7d8c1",
                        borderRadius: 6,
                        color: "var(--primary)",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <Receipt size={13} /> {t.viewReceipt}
                    </a>
                    <a
                      href={`/api/v1/customer-portal/receipts/${p.receipt_id}?token=${encodeURIComponent(token)}&download=1`}
                      download={`Receipt-${(p.receipt_number || "").replace(/[^a-zA-Z0-9_-]/g, "_")}.html`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        padding: "4px 8px",
                        background: "var(--primary)",
                        borderRadius: 6,
                        color: "#fff",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <Download size={13} />{" "}
                      {lang === "kn" ? "ಡೌನ್‌ಲೋಡ್" : "Download"}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
