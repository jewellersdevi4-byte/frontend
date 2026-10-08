"use client";
import { CheckCircle2 } from "lucide-react";
import { money } from "../../../lib/format";
import type { CheckoutModel } from "../hooks/useCheckout";
type Props = Pick<CheckoutModel, "data" | "paymentResult">;
export function PaymentSuccess({ data, paymentResult }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f4ee",
        fontFamily: "Arial, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 10,
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          border: "1px solid #e4e5dd",
          boxShadow: "0 10px 30px #0001",
        }}
      >
        <CheckCircle2
          size={56}
          color="#215d39"
          style={{ margin: "0 auto 18px" }}
        />
        <h1 style={{ color: "#133b32", fontSize: 26, margin: "0 0 10px" }}>
          Payment Confirmed
        </h1>
        <p style={{ color: "#555", fontSize: 15, margin: "0 0 20px" }}>
          Thank you! Your payment of <strong>{money(data!.amountPaise)}</strong>{" "}
          has been credited to your scheme account.
        </p>
        <div
          style={{
            background: "#f8f9f5",
            border: "1px solid #e4e5dd",
            borderRadius: 6,
            padding: 18,
            textAlign: "left",
            fontSize: 13,
            lineHeight: 1.8,
            marginBottom: 24,
          }}
        >
          <div>
            <strong>Customer:</strong> {data?.customerName}
          </div>
          <div>
            <strong>Account:</strong> {data?.accountNumber}
          </div>
          <div>
            <strong>Scheme:</strong> {data?.schemeName}
          </div>
          {paymentResult?.providerPaymentId && (
            <div>
              <strong>Reference:</strong> {paymentResult.providerPaymentId}
            </div>
          )}
          {paymentResult?.receipt && (
            <div>
              <strong>Receipt Number:</strong> {paymentResult.receipt.number}
            </div>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#737970", lineHeight: 1.5 }}>
          A formal WhatsApp receipt and updated balance have been dispatched to
          your mobile number.
        </p>
      </div>
    </div>
  );
}
