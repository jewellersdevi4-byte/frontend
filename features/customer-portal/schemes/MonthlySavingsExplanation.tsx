"use client";
import { money } from "../../../lib/format";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<CustomerPortalModel, "lang" | "currentAcc">;
export function MonthlySavingsExplanation({ lang, currentAcc }: Props) {
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
        <strong>
          ₹500 /{" "}
          {lang === "kn"
            ? "ತಿಂಗಳು (ಅಥವಾ ₹500ರ ಗುಣಕಗಳು)"
            : "month (or multiples of ₹500)"}
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
        <span>
          {lang === "kn" ? "ಸ್ಥಿರ ಬೋನಸ್ ಲಾಭ" : "Fixed Bonus Incentive"}
        </span>
        <strong>+{money(currentAcc.rules.benefit || "50000")}</strong>
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0 2px",
          fontSize: 15,
          fontWeight: 700,
          color: "var(--primary)",
        }}
      >
        <span>
          {lang === "kn"
            ? "ಮೆಚ್ಯೂರಿಟಿ ಒಟ್ಟು ಖರೀದಿ ಮೌಲ್ಯ"
            : "Total Purchasing Value"}
        </span>
        <span>
          {money(
            BigInt(currentAcc.scheduledTotal || "600000") +
              BigInt(currentAcc.rules.benefit || "50000"),
          )}
        </span>
      </div>
    </div>
  );
}
