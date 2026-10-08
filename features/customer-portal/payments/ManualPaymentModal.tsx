"use client";
import { Clock } from "lucide-react";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<
  CustomerPortalModel,
  | "showManualModal"
  | "busy"
  | "setShowManualModal"
  | "t"
  | "submitManualProof"
  | "lang"
  | "manualMethod"
  | "setManualMethod"
  | "setManualRef"
  | "isScheme4"
  | "manualAmount"
  | "setManualAmount"
  | "manualDate"
  | "setManualDate"
  | "manualRef"
  | "manualNote"
  | "setManualNote"
>;
export function ManualPaymentModal({
  showManualModal,
  busy,
  setShowManualModal,
  t,
  submitManualProof,
  lang,
  manualMethod,
  setManualMethod,
  setManualRef,
  isScheme4,
  manualAmount,
  setManualAmount,
  manualDate,
  setManualDate,
  manualRef,
  manualNote,
  setManualNote,
}: Props) {
  return (
    <>
      {showManualModal && (
        <div
          className="modal-overlay"
          onClick={() => !busy && setShowManualModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t.manualTitle}</h3>
              <button
                className="close-btn"
                onClick={() => setShowManualModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={submitManualProof}>
              <div className="banner-notice warning">
                <Clock size={18} />
                <span>
                  {lang === "kn"
                    ? "ನೀವು ಅಂಗಡಿಯಲ್ಲಿ ನಗದು ನೀಡಿದ್ದರೆ ಅಥವಾ ನೇರ ಯುಪಿಐ ಮಾಡಿದ್ದರೆ, ಅಂಗಡಿ ಮಾಲೀಕರು ಪರಿಶೀಲಿಸಿ ರಸೀದಿಯನ್ನು ಅನುಮೋದಿಸುತ್ತಾರೆ."
                    : "If you paid cash at the Kaup shop or transferred directly, the shop owner will verify and approve your official receipt."}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="input-group">
                <label className="input-label">
                  {lang === "kn" ? "ಪಾವತಿ ವಿಧಾನ" : "How Did You Pay?"}
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    className={`btn ${manualMethod === "Cash" ? "btn-primary" : "btn-secondary"}`}
                    style={{ padding: "10px 4px", fontSize: 13 }}
                    onClick={() => {
                      setManualMethod("Cash");
                      setManualRef("Paid at shop counter");
                    }}
                  >
                    💵 Cash at Shop
                  </button>
                  <button
                    type="button"
                    className={`btn ${manualMethod === "UPI" ? "btn-primary" : "btn-secondary"}`}
                    style={{ padding: "10px 4px", fontSize: 13 }}
                    onClick={() => {
                      setManualMethod("UPI");
                      setManualRef("Shop UPI QR");
                    }}
                  >
                    📱 Direct UPI
                  </button>
                  <button
                    type="button"
                    className={`btn ${manualMethod === "Bank" ? "btn-primary" : "btn-secondary"}`}
                    style={{ padding: "10px 4px", fontSize: 13 }}
                    onClick={() => {
                      setManualMethod("Bank");
                      setManualRef("Shop Bank Transfer");
                    }}
                  >
                    🏦 Bank NEFT
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="input-group">
                <label className="input-label">
                  {isScheme4
                    ? lang === "kn"
                      ? "ಠೇವಣಿ ಮೊತ್ತ (₹, ಕನಿಷ್ಠ ₹5,000 - ಗರಿಷ್ಠ ಮಿತಿಯಿಲ್ಲ)"
                      : "Enter Deposit Amount (₹, Min ₹5,000 - No upper limit)"
                    : lang === "kn"
                      ? "ಪಾವತಿಸಿದ ಮೊತ್ತ (₹)"
                      : "Amount Paid (₹)"}
                </label>
                <input
                  type="number"
                  className="text-input"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  min={isScheme4 ? "5000" : "1"}
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

              {/* Date */}
              <div className="input-group">
                <label className="input-label">
                  {lang === "kn" ? "ಪಾವತಿ ದಿನಾಂಕ" : "Payment Date"}
                </label>
                <input
                  type="date"
                  className="text-input"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  required
                />
              </div>

              {/* Reference */}
              <div className="input-group">
                <label className="input-label">
                  {manualMethod === "Cash"
                    ? lang === "kn"
                      ? "ಉಲ್ಲೇಖ / ಕೌಂಟರ್ ವಿವರ (ಐಚ್ಛಿಕ)"
                      : "Reference / Counter Details (Optional)"
                    : lang === "kn"
                      ? "ಯುಪಿಐ / ಬ್ಯಾಂಕ್ UTR ರೆಫರೆನ್ಸ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ — ಕಡ್ಡಾಯವಲ್ಲ)"
                      : "UPI / Bank UTR Number (Optional — not compulsory)"}
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={manualRef}
                  onChange={(e) => setManualRef(e.target.value)}
                  placeholder={
                    manualMethod === "Cash"
                      ? "e.g. Paid at shop counter"
                      : lang === "kn"
                        ? "ಐಚ್ಛಿಕ — ಕಡ್ಡಾಯವಲ್ಲ"
                        : "Optional — not required"
                  }
                />
              </div>

              {/* Note */}
              <div className="input-group">
                <label className="input-label">
                  {lang === "kn"
                    ? "ಟಿಪ್ಪಣಿ (ಐಚ್ಛಿಕ)"
                    : "Note for Shop Owner (Optional)"}
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  placeholder="e.g. Paid cash to owner in the afternoon"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy}
                style={{ marginTop: 10 }}
              >
                {busy
                  ? lang === "kn"
                    ? "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ…"
                    : "Submitting…"
                  : lang === "kn"
                    ? "ಮಾಲೀಕರ ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ"
                    : "Submit for Shop Verification"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
