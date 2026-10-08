"use client";
import { Sparkles } from "lucide-react";
import { LuckyDrawExplanation } from "../schemes/LuckyDrawExplanation";
import { MakingChargesExplanation } from "../schemes/MakingChargesExplanation";
import { MonthlySavingsExplanation } from "../schemes/MonthlySavingsExplanation";
import { OneTimeExplanation } from "../schemes/OneTimeExplanation";
import { RateBookingExplanation } from "../schemes/RateBookingExplanation";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<
  CustomerPortalModel,
  | "activeTab"
  | "t"
  | "isScheme4"
  | "lang"
  | "currentAcc"
  | "isScheme3"
  | "isScheme5"
  | "isScheme1"
  | "sharesCount"
  | "monthlyInstalmentPaise"
>;
export function OverviewTab({
  activeTab,
  t,
  isScheme4,
  lang,
  currentAcc,
  isScheme3,
  isScheme5,
  isScheme1,
  sharesCount,
  monthlyInstalmentPaise,
}: Props) {
  return (
    <>
      {activeTab === "overview" && (
        <div className="card">
          <h3
            style={{
              fontFamily: "serif",
              fontSize: 18,
              color: "var(--primary)",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Sparkles size={18} color="var(--gold)" /> {t.howItWorks}
          </h3>

          {isScheme4 ? (
            <RateBookingExplanation lang={lang} currentAcc={currentAcc} />
          ) : isScheme3 ? (
            <MakingChargesExplanation lang={lang} currentAcc={currentAcc} />
          ) : isScheme5 ? (
            <OneTimeExplanation lang={lang} currentAcc={currentAcc} />
          ) : isScheme1 ? (
            <LuckyDrawExplanation
              lang={lang}
              sharesCount={sharesCount}
              monthlyInstalmentPaise={monthlyInstalmentPaise}
              currentAcc={currentAcc}
            />
          ) : (
            <MonthlySavingsExplanation lang={lang} currentAcc={currentAcc} />
          )}

          {/* Terms in Selected Language */}
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--text-muted)",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                color: "var(--primary)",
                marginBottom: 4,
              }}
            >
              {lang === "kn"
                ? "ಸ್ಕೀಮ್ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು:"
                : "Scheme Rules & Benefits:"}
            </p>
            <p>
              {lang === "kn"
                ? currentAcc.rules.termsKn
                : currentAcc.rules.termsEn}
            </p>
            <p style={{ marginTop: 8, fontSize: 12 }}>
              📅{" "}
              <strong>
                {lang === "kn"
                  ? "ನಿರೀಕ್ಷಿತ ಮುಕ್ತಾಯ ದಿನಾಂಕ:"
                  : "Expected Maturity Date:"}
              </strong>{" "}
              {currentAcc.maturity_date}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
