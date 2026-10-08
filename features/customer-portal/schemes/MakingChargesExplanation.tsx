"use client";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<CustomerPortalModel, "lang" | "currentAcc">;
export function MakingChargesExplanation({ lang, currentAcc }: Props) {
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
          {lang === "kn" ? "ಮಾಸಿಕ ಕಂತು" : "Monthly Instalment"}
        </span>
        <strong>₹5,000 / {lang === "kn" ? "ತಿಂಗಳು" : "month"}</strong>
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
          {lang === "kn" ? "ಒಟ್ಟು ಅವಧಿ" : "Total Duration"}
        </span>
        <strong>
          12{" "}
          {lang === "kn" ? "ತಿಂಗಳುಗಳು (12 ಕಂತುಗಳು)" : "Months (12 Instalments)"}
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
        <span>{lang === "kn" ? "ಪ್ರಮುಖ ಲಾಭ" : "Primary Benefit"}</span>
        <strong>
          25%{" "}
          {lang === "kn"
            ? "ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ ರಿಯಾಯಿತಿ"
            : "Discount on Making Charges (MC)"}
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
          {lang === "kn" ? "ಅನ್ವಯವಾಗುವ ಚಿನ್ನದ ದರ" : "Applicable Gold Rate"}
        </span>
        <strong>
          {lang === "kn"
            ? "ವಿಮೋಚನೆಯ ದಿನದ ಲೈವ್ ದರ"
            : "Live rate on redemption date"}
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
          {lang === "kn" ? "ಚಿನ್ನದ ಪ್ರಮಾಣ (22K)" : "Gold Quantity (22K)"}
        </span>
        <strong>{currentAcc.totalReservedGrams || "0.0000"} g</strong>
      </div>
    </div>
  );
}
