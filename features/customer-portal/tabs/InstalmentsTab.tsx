"use client";
import { money } from "../../../lib/format";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<
  CustomerPortalModel,
  "activeTab" | "t" | "paidCount" | "totalCount" | "lang" | "currentAcc"
>;
export function InstalmentsTab({
  activeTab,
  t,
  paidCount,
  totalCount,
  lang,
  currentAcc,
}: Props) {
  return (
    <>
      {activeTab === "instalments" && (
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3
              style={{
                fontFamily: "serif",
                fontSize: 18,
                color: "var(--primary)",
              }}
            >
              {t.instalmentTracker}
            </h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {paidCount} / {totalCount}{" "}
              {lang === "kn" ? "ಪಾವತಿಸಲಾಗಿದೆ" : "Paid"}
            </span>
          </div>

          {/* 12-Box Instalments Grid */}
          <div className="instalment-grid">
            {currentAcc.instalments.map((inst) => {
              const isPaid = inst.status === "Paid";
              const isDue = inst.status === "Due" || inst.status === "Overdue";
              const rateVal = currentAcc.locked_rate
                ? Number(currentAcc.locked_rate)
                : currentAcc.todayRate
                  ? Number(currentAcc.todayRate.paise_per_gram)
                  : 1200000;
              const instGrams =
                rateVal > 0 ? (Number(inst.amount) / rateVal).toFixed(4) : null;
              return (
                <div
                  key={inst.id}
                  className={`instalment-box ${isPaid ? "paid" : isDue ? "due" : "upcoming"}`}
                >
                  <div style={{ fontWeight: 700 }}>#{inst.seq}</div>
                  <div style={{ fontSize: 10, marginTop: 2 }}>
                    {inst.due.slice(5)}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    {isPaid
                      ? "✓ " + money(inst.paid)
                      : isDue
                        ? "Due"
                        : money(inst.amount)}
                  </div>
                  {instGrams && (
                    <div style={{ fontSize: 9, opacity: 0.85, marginTop: 2 }}>
                      {instGrams}g
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Instalments List */}
          <div style={{ marginTop: 16 }}>
            {currentAcc.instalments.map((inst) => {
              const rateVal = currentAcc.locked_rate
                ? Number(currentAcc.locked_rate)
                : currentAcc.todayRate
                  ? Number(currentAcc.todayRate.paise_per_gram)
                  : 1200000;
              const instGrams =
                rateVal > 0 ? (Number(inst.amount) / rateVal).toFixed(4) : null;
              return (
                <div
                  key={inst.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border-light)",
                    fontSize: 13,
                  }}
                >
                  <div>
                    <strong>Instalment #{inst.seq}</strong>
                    <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>
                      Due: {inst.due}
                    </span>
                    {instGrams && (
                      <span
                        style={{
                          color: "#84612a",
                          marginLeft: 8,
                          fontSize: 12,
                        }}
                      >
                        ⚖️ ~{instGrams}g
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      className={`badge ${inst.status === "Paid" ? "badge-green" : inst.status === "Due" || inst.status === "Overdue" ? "badge-gold" : "badge-blue"}`}
                    >
                      {inst.status === "Paid"
                        ? "Paid " + money(inst.paid)
                        : inst.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
