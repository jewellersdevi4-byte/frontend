"use client";
import { Sparkles } from "lucide-react";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<CustomerPortalModel, "lang">;
export function LoadingScreen({ lang }: Props) {
  return (
    <div
      className="phone-container"
      style={{ justifyContent: "center", alignItems: "center", padding: 40 }}
    >
      <Sparkles
        size={40}
        style={{ color: "var(--gold)", animation: "spin 2s linear infinite" }}
      />
      <p style={{ marginTop: 16, fontWeight: 600, color: "var(--primary)" }}>
        {lang === "kn"
          ? "ಪಾಸ್‌ಬುಕ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ…"
          : "Opening your Devi Jewellers passbook…"}
      </p>
    </div>
  );
}
