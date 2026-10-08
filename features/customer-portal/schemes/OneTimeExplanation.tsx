"use client";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<CustomerPortalModel, "lang" | "currentAcc">;
export function OneTimeExplanation({ lang, currentAcc }: Props) {
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
          {lang === "kn" ? "ಏಕಕಾಲೀನ ಠೇವಣಿ" : "Single Lump-Sum Deposit"}
        </span>
        <strong>₹3,00,000</strong>
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
        <strong>
          1 {lang === "kn" ? "ವರ್ಷ (12 ತಿಂಗಳು)" : "Year (12 Months)"}
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
          0%{" "}
          {lang === "kn"
            ? "ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ + ಸಂರಕ್ಷಿತ ದರ"
            : "Making Charges + Protected Gold Rate"}
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
          {lang === "kn" ? "ಕಾಯ್ದಿರಿಸಿದ ಚಿನ್ನದ ತೂಕ" : "Reserved Gold Weight"}
        </span>
        <strong>{currentAcc.totalReservedGrams || "0.0000"} g</strong>
      </div>
    </div>
  );
}
