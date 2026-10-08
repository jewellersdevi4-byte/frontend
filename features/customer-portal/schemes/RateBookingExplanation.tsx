"use client";
import { money } from "../../../lib/format";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<CustomerPortalModel, "lang" | "currentAcc">;
export function RateBookingExplanation({ lang, currentAcc }: Props) {
  return (
    <div
      style={{
        background: "#fcfbf8",
        border: "1px solid #ebd9a8",
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "1px solid #f0e6ce",
          fontSize: 14,
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>
          {lang === "kn" ? "ಕನಿಷ್ಠ ಠೇವಣಿ" : "Minimum Deposit"}
        </span>
        <strong>
          ₹5,000 {lang === "kn" ? "(ಗರಿಷ್ಠ ಮಿತಿಯಿಲ್ಲ)" : "(No upper limit)"}
        </strong>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "1px solid #f0e6ce",
          fontSize: 14,
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>
          {lang === "kn" ? "ಯೋಜನೆಯ ಅವಧಿ" : "Scheme Duration"}
        </span>
        <strong>1 {lang === "kn" ? "ವರ್ಷ" : "Year (12 Months)"}</strong>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "1px solid #f0e6ce",
          fontSize: 14,
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>
          {lang === "kn" ? "ದರ ನೋಂದಣಿ" : "Rate Registration"}
        </span>
        <strong>
          {currentAcc.locked_rate
            ? `${money(currentAcc.locked_rate)}/g (22K)`
            : lang === "kn"
              ? "ಪಾವತಿ ದಿನಾಂಕದಂದು ಲಾಕ್"
              : "Locked on payment date"}
        </strong>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "1px solid #f0e6ce",
          fontSize: 14,
          color: "#27ae60",
        }}
      >
        <span>
          {lang === "kn"
            ? "ಮಾರುಕಟ್ಟೆ ಏರಿಕೆಯ ರಕ್ಷಣೆ"
            : "Rising Market Protection"}
        </span>
        <strong>
          {lang === "kn" ? "ಕಡಿಮೆ ಬುಕ್ ಮಾಡಿದ ದರ" : "Lower booked rate"}
        </strong>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "1px solid #f0e6ce",
          fontSize: 14,
          color: "#27ae60",
        }}
      >
        <span>
          {lang === "kn"
            ? "ಮಾರುಕಟ್ಟೆ ಇಳಿಕೆಯ ರಕ್ಷಣೆ"
            : "Falling Market Protection"}
        </span>
        <strong>
          {lang === "kn" ? "ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಕಡಿಮೆ ದರ" : "Prevailing lower rate"}
        </strong>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0 2px",
          fontSize: 14,
          fontWeight: 600,
          color: "#b8860b",
        }}
      >
        <span>{lang === "kn" ? "ಮರುಪಾವತಿ ನೀತಿ" : "Refund Policy"}</span>
        <span>
          {lang === "kn"
            ? "ಕೇವಲ ಆಭರಣ ಖರೀದಿಗೆ ಮಾತ್ರ"
            : "Strictly redeemable as jewellery"}
        </span>
      </div>
    </div>
  );
}
