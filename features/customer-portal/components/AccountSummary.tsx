"use client";
import { Building, CreditCard } from "lucide-react";
import { money } from "../../../lib/format";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<
  CustomerPortalModel,
  | "currentAcc"
  | "isScheme1"
  | "sharesCount"
  | "lang"
  | "monthlyInstalmentPaise"
  | "isScheme4"
  | "t"
  | "paidCount"
  | "totalCount"
  | "isScheme5"
  | "progressPct"
  | "setManualAmount"
  | "setShowOnlineModal"
  | "setShowManualModal"
>;
export function AccountSummary({
  currentAcc,
  isScheme1,
  sharesCount,
  lang,
  monthlyInstalmentPaise,
  isScheme4,
  t,
  paidCount,
  totalCount,
  isScheme5,
  progressPct,
  setManualAmount,
  setShowOnlineModal,
  setShowManualModal,
}: Props) {
  return (
    <div className="card gold-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <span className="badge badge-gold">
            {currentAcc.scheme_name}
            {isScheme1
              ? ` · ${sharesCount} ${lang === "kn" ? "ಷೇರುಗಳು" : "Shares"} (${money(monthlyInstalmentPaise)}/${lang === "kn" ? "ತಿಂಗಳು" : "mo"})`
              : ""}
          </span>
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            Account: <strong>{currentAcc.number}</strong>
          </p>
        </div>
        <span
          className={`badge ${currentAcc.status === "Active" ? "badge-green" : "badge-gold"}`}
        >
          {currentAcc.status}
        </span>
      </div>

      {/* Financial Numbers Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ebd9a8",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {isScheme4
              ? lang === "kn"
                ? "ಠೇವಣಿ ಮೊತ್ತ"
                : "Total Deposited"
              : t.totalPaid}
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--primary)",
              marginTop: 4,
            }}
          >
            {money(currentAcc.totalPaid)}
          </p>
          <p style={{ fontSize: 11, color: "#27ae60", fontWeight: 600 }}>
            {isScheme4
              ? paidCount > 0
                ? lang === "kn"
                  ? "✓ ದರ ಲಾಕ್ ಆಗಿದೆ"
                  : "✓ Rate Locked"
                : lang === "kn"
                  ? "ಕನಿಷ್ಠ ₹5,000"
                  : "Min ₹5,000"
              : `✓ ${paidCount} of ${totalCount} instalments`}
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ebd9a8",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {isScheme4
              ? paidCount > 0
                ? lang === "kn"
                  ? "ಮೀಸಲು ಚಿನ್ನದ ತೂಕ"
                  : "Reserved Gold Weight"
                : lang === "kn"
                  ? "ಠೇವಣಿ ಬಾಕಿ"
                  : "Deposit Due"
              : t.dueNow}
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: isScheme4
                ? paidCount > 0
                  ? "var(--primary)"
                  : "#b8860b"
                : BigInt(currentAcc.dueNow) > 0n
                  ? "#b8860b"
                  : "#27ae60",
              marginTop: 4,
            }}
          >
            {isScheme4
              ? paidCount > 0
                ? `${currentAcc.totalReservedGrams || "0.0000"} g`
                : "₹5,000+"
              : money(currentAcc.dueNow)}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {isScheme4
              ? paidCount > 0
                ? lang === "kn"
                  ? "ಕಡಿಮೆ ದರದ ರಕ್ಷಣೆ"
                  : "Lower rate hedge"
                : lang === "kn"
                  ? "ಗರಿಷ್ಠ ಮಿತಿಯಿಲ್ಲ"
                  : "No upper limit"
              : BigInt(currentAcc.dueNow) > 0n
                ? "Payment due"
                : "Current month paid"}
          </p>
        </div>
      </div>

      {/* Gold Quantity Highlight Tile (Displayed for ALL schemes) */}
      <div
        style={{
          marginTop: 12,
          background: "linear-gradient(135deg, #fdfbf7 0%, #f7f1e5 100%)",
          border: "1.5px solid #d4af37",
          borderRadius: 10,
          padding: "12px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>⚖️</span>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#193c34",
                margin: 0,
              }}
            >
              {lang === "kn"
                ? currentAcc.goldGramsLabelKn || "ಚಿನ್ನದ ಪ್ರಮಾಣ"
                : currentAcc.goldGramsLabel || "Gold Quantity"}
            </p>
          </div>
          <p style={{ fontSize: 11, color: "#6d5d36", margin: "3px 0 0" }}>
            {isScheme4
              ? lang === "kn"
                ? "ಬುಕ್ ಮಾಡಿದ ದರದಲ್ಲಿ ಸೂಚಿತ ತೂಕ (ಕಡಿಮೆ ದರದ ರಕ್ಷಣೆ)"
                : "Indicative weight at booked rate (Market hedge)"
              : isScheme5
                ? lang === "kn"
                  ? "ನಿಗದಿತ ದರದಲ್ಲಿ ಲಾಕ್ ಆದ ತೂಕ (0% ಮೇಕಿಂಗ್ ಚಾರ್ಜ್)"
                  : "Locked rate weight (0% Making Charges)"
                : lang === "kn"
                  ? "ಇಂದಿನ 22K ದರದ ಪ್ರಕಾರ ತತ್ಸಮಾನ ತೂಕ"
                  : "Equivalent weight at today's 22K rate"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#84612a",
              margin: 0,
              fontFamily: "serif",
            }}
          >
            {currentAcc.totalReservedGrams || "0.0000"} g
          </p>
          {currentAcc.scheduledGoldGrams && (
            <p style={{ fontSize: 10, color: "#888", margin: "2px 0 0" }}>
              {lang === "kn"
                ? `ಗುರಿ: ${currentAcc.scheduledGoldGrams} g`
                : `Target: ${currentAcc.scheduledGoldGrams} g`}
            </p>
          )}
        </div>
      </div>

      {/* Progress / Scheme Status Bar */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span>{lang === "kn" ? "ಪ್ರಗತಿ" : "Scheme Progress"}</span>
          <span>
            {isScheme4
              ? paidCount > 0
                ? "100% (Deposited)"
                : "0% (Pending)"
              : `${progressPct}% (${paidCount}/${totalCount})`}
          </span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${isScheme4 ? (paidCount > 0 ? 100 : 0) : progressPct}%`,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          {isScheme4 ? (
            <>
              <span>
                {currentAcc.locked_rate
                  ? `Locked Rate: ${money(currentAcc.locked_rate)}/g (22K)`
                  : "Rate locks on deposit date"}
              </span>
              <span style={{ color: "#27ae60" }}>Market Price Hedge</span>
            </>
          ) : (
            <>
              <span>Scheduled Remaining: {money(currentAcc.future)}</span>
              <span>Bonus Benefit: +{money(currentAcc.benefit)}</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons: Online vs Shop Cash */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {isScheme4 && paidCount === 0 && (
          <div
            style={{
              padding: 10,
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #ebd9a8",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              {lang === "kn"
                ? "ತ್ವರಿತ ಠೇವಣಿ ಮೊತ್ತ ಆಯ್ಕೆಮಾಡಿ (ಕನಿಷ್ಠ ₹5,000):"
                : "Choose quick deposit amount (Min ₹5,000):"}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setManualAmount(amt.toString());
                    setShowOnlineModal(true);
                  }}
                  style={{
                    padding: "4px 10px",
                    fontSize: 12,
                    borderRadius: 16,
                    border: "1px solid #ebd9a8",
                    background: "#fcfbf8",
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn btn-gold"
          onClick={() => {
            const defaultAmt = isScheme4
              ? BigInt(currentAcc.totalPaid) > 0n
                ? "5000"
                : "5000"
              : BigInt(currentAcc.dueNow) > 0n
                ? (Number(currentAcc.dueNow) / 100).toString()
                : (Number(monthlyInstalmentPaise) / 100).toString();
            setManualAmount(defaultAmt);
            setShowOnlineModal(true);
          }}
        >
          <CreditCard size={18} />{" "}
          {isScheme4 && paidCount === 0
            ? lang === "kn"
              ? "ಆನ್‌ಲೈನ್‌ ಠೇವಣಿ ಪಾವತಿಸಿ"
              : "Pay Deposit Online (Razorpay)"
            : t.payOnlineBtn}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            const defaultAmt = isScheme4
              ? BigInt(currentAcc.totalPaid) > 0n
                ? "5000"
                : "5000"
              : BigInt(currentAcc.dueNow) > 0n
                ? (Number(currentAcc.dueNow) / 100).toString()
                : (Number(monthlyInstalmentPaise) / 100).toString();
            setManualAmount(defaultAmt);
            setShowManualModal(true);
          }}
        >
          <Building size={18} />{" "}
          {isScheme4 && paidCount === 0
            ? lang === "kn"
              ? "ಅಂಗಡಿಯಲ್ಲಿ ನಗದು ಠೇವಣಿ / ವರದಿ"
              : "Pay Deposit at Shop (Cash) / Report"
            : t.payAtShopBtn}
        </button>
      </div>
    </div>
  );
}
