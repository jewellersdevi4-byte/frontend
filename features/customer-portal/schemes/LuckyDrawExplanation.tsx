"use client";
import { money } from "../../../lib/format";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<
  CustomerPortalModel,
  "lang" | "sharesCount" | "monthlyInstalmentPaise" | "currentAcc"
>;
export function LuckyDrawExplanation({
  lang,
  sharesCount,
  monthlyInstalmentPaise,
  currentAcc,
}: Props) {
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
          {lang === "kn" ? "೧ ಷೇರು ಬೆಲೆ" : "Price per Share"}
        </span>
        <strong>
          ₹100 /{" "}
          {lang === "kn" ? "ತಿಂಗಳು (ಒಟ್ಟು 12 ತಿಂಗಳು)" : "month (12 Months)"}
        </strong>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "1px solid #f0e6ce",
          fontSize: 14,
          color: "var(--primary)",
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>
          {lang === "kn" ? "ನಿಮ್ಮ ಒಟ್ಟು ಷೇರುಗಳು" : "Your Enrolled Shares"}
        </span>
        <strong>
          {sharesCount} {lang === "kn" ? "ಷೇರುಗಳು" : "shares"} (
          {money(monthlyInstalmentPaise)}/{lang === "kn" ? "ತಿಂಗಳು" : "month"})
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
          {lang === "kn" ? "ಮಾಸಿಕ ಕಂತು" : "Monthly Instalment"}
        </span>
        <strong>
          {money(monthlyInstalmentPaise)} / {lang === "kn" ? "ತಿಂಗಳು" : "month"}
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
          {lang === "kn" ? "ಪಾವತಿ ಅಂತಿಮ ದಿನಾಂಕ" : "Due Date"}
        </span>
        <strong>
          {lang === "kn"
            ? "ಪ್ರತಿ ತಿಂಗಳ 10ನೇ ತಾರೀಖಿನೊಳಗೆ"
            : "On or before 10th of every month"}
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
        <span>{lang === "kn" ? "ಮಾಸಿಕ ಲಕ್ಕಿ ಡ್ರಾ" : "Monthly Lucky Draw"}</span>
        <strong>
          {lang === "kn"
            ? "ಪ್ರತಿ ತಿಂಗಳು ಲಕ್ಕಿ ಡ್ರಾ ಸೌಲಭ್ಯ"
            : "Draw held every month"}
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
        <span>{lang === "kn" ? "ವಿಜೇತರ ಸೌಲಭ್ಯ" : "Draw Winner Benefit"}</span>
        <span>
          {lang === "kn"
            ? "ತಕ್ಷಣ ಆಭರಣ + ಮುಂದಿನ ಕಂತು ಮನ್ನಾ"
            : "Jewellery immediately + Future dues waived"}
        </span>
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
