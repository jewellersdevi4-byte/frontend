"use client";
import { ShieldCheck } from "lucide-react";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<
  CustomerPortalModel,
  | "showOnlineModal"
  | "busy"
  | "setShowOnlineModal"
  | "t"
  | "lang"
  | "isScheme4"
  | "manualAmount"
  | "setManualAmount"
  | "customer"
  | "currentAcc"
  | "initiateOnlinePayment"
> & { customer: NonNullable<CustomerPortalModel["customer"]> };
export function OnlinePaymentModal({
  showOnlineModal,
  busy,
  setShowOnlineModal,
  t,
  lang,
  isScheme4,
  manualAmount,
  setManualAmount,
  customer,
  currentAcc,
  initiateOnlinePayment,
}: Props) {
  return (
    <>
      {showOnlineModal && (
        <div
          className="modal-overlay"
          onClick={() => !busy && setShowOnlineModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t.onlineTitle}</h3>
              <button
                className="close-btn"
                onClick={() => setShowOnlineModal(false)}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div className="banner-notice info">
                <ShieldCheck size={18} />
                <span>
                  {lang === "kn"
                    ? "ಆನ್‌ಲೈನ್‌ ಪಾವತಿಯು ತಕ್ಷಣವೇ ಅಡ್ಮಿನ್‌ ಪ್ಯಾನೆಲ್‌ನಲ್ಲಿ ನವೀಕರಿಸಲ್ಪಡುತ್ತದೆ ಮತ್ತು ಅಧಿಕೃತ ರಸೀದಿಯನ್ನು ನೀಡುತ್ತದೆ."
                    : "Online payments update immediately in the shop admin panel with an instant official receipt."}
                </span>
              </div>

              <div className="input-group">
                <label className="input-label">
                  {isScheme4
                    ? lang === "kn"
                      ? "ಠೇವಣಿ ಮೊತ್ತ (₹, ಕನಿಷ್ಠ ₹5,000 - ಗರಿಷ್ಠ ಮಿತಿಯಿಲ್ಲ)"
                      : "Enter Deposit Amount (₹, Min ₹5,000 - No upper limit)"
                    : lang === "kn"
                      ? "ಪಾವತಿ ಮೊತ್ತ (₹)"
                      : "Instalment Amount (₹)"}
                </label>
                <input
                  type="number"
                  className="text-input"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  min={isScheme4 ? "5000" : "10"}
                  required
                />
                {isScheme4 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginTop: 8,
                    }}
                  >
                    {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setManualAmount(amt.toString())}
                        style={{
                          padding: "4px 10px",
                          fontSize: 12,
                          borderRadius: 16,
                          border: "1px solid #ebd9a8",
                          background:
                            manualAmount === amt.toString()
                              ? "var(--primary)"
                              : "#fff",
                          color:
                            manualAmount === amt.toString()
                              ? "#fff"
                              : "var(--primary)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        ₹{amt.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: 12,
                  background: "#fcfbf8",
                  borderRadius: 8,
                  border: "1px solid #ebd9a8",
                  marginBottom: 16,
                }}
              >
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Customer: <strong>{customer.name}</strong>
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  Scheme Account: <strong>{currentAcc?.number}</strong>
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  Supported:{" "}
                  <strong>GPay, PhonePe, Paytm, UPI, Cards, NetBanking</strong>
                </p>
              </div>

              <button
                type="button"
                className="btn btn-gold"
                onClick={initiateOnlinePayment}
                disabled={busy}
              >
                {busy
                  ? lang === "kn"
                    ? "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ…"
                    : "Processing…"
                  : `${lang === "kn" ? "₹" + manualAmount + " ಪಾವತಿಸಿ" : "Pay ₹" + manualAmount + " via Razorpay"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
