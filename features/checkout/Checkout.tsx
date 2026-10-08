"use client";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { money } from "../../lib/format";
import { LoadingScreen } from "./components/LoadingScreen";
import { PaymentError } from "./components/PaymentError";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { useCheckout } from "./hooks/useCheckout";
export default function Checkout() {
  const {
    loading,
    error,
    data,
    paid,
    paymentResult,
    handleLiveRazorpay,
    paying,
  } = useCheckout();
  if (loading) {
    return <LoadingScreen />;
  }
  if (error && !data) {
    return <PaymentError error={error} />;
  }
  if (paid) {
    return <PaymentSuccess data={data} paymentResult={paymentResult} />;
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f4ee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e4e5dd",
          overflow: "hidden",
          boxShadow: "0 8px 30px #0001",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#133b32",
            color: "#fff",
            padding: "24px 28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#e8d39f",
              fontSize: 20,
              fontFamily: "Georgia, serif",
              fontWeight: 600,
            }}
          >
            Devi Jewellers
          </div>
          <div
            style={{
              color: "#9fb8aa",
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Main Road, Kaup · Scheme Payment
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "28px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span
              style={{
                fontSize: 12,
                color: "#737970",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Amount Due
            </span>
            <div
              style={{
                fontSize: 36,
                fontFamily: "Georgia, serif",
                color: "#133b32",
                fontWeight: 700,
                margin: "6px 0",
              }}
            >
              {money(data!.amountPaise)}
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#edf6ef",
                color: "#215d39",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Lock size={12} /> Secure Checkout
            </span>
          </div>

          <div
            style={{
              background: "#f8f9f5",
              border: "1px solid #eef0e9",
              borderRadius: 8,
              padding: 16,
              fontSize: 13,
              lineHeight: 1.8,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#737970" }}>Customer:</span>
              <strong>{data?.customerName}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#737970" }}>Account:</span>
              <strong>{data?.accountNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#737970" }}>Scheme:</span>
              <strong style={{ textAlign: "right", maxWidth: 220 }}>
                {data?.schemeName}
              </strong>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#fff0eb",
                border: "1px solid #ecc7bc",
                color: "#9a3324",
                padding: 12,
                borderRadius: 6,
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={handleLiveRazorpay}
              disabled={paying}
              style={{
                width: "100%",
                background: "#133b32",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "14px",
                fontSize: 15,
                fontWeight: 600,
                cursor: paying ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {paying ? (
                "Processing…"
              ) : (
                <>
                  Pay with Razorpay <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          <div
            style={{
              marginTop: 24,
              textAlign: "center",
              fontSize: 12,
              color: "#737970",
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck
              size={16}
              color="#737970"
              style={{ verticalAlign: "middle", marginRight: 4 }}
            />
            Official payment portal of Devi Jewellers, Kaup.
            <br />
            Payments are verified in real time and confirmed on WhatsApp.
          </div>
        </div>
      </div>
    </div>
  );
}
