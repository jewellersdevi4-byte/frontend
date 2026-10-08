"use client";
import { AlertCircle } from "lucide-react";
import type { CheckoutModel } from "../hooks/useCheckout";
type Props = Pick<CheckoutModel, "error">;
export function PaymentError({ error }: Props) {
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
          padding: 36,
          borderRadius: 8,
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
          border: "1px solid #e4e5dd",
          boxShadow: "0 4px 20px #0001",
        }}
      >
        <AlertCircle
          size={44}
          color="#9a3324"
          style={{ margin: "0 auto 16px" }}
        />
        <h2 style={{ color: "#9a3324", marginBottom: 12 }}>
          Unable to Open Payment
        </h2>
        <p style={{ color: "#737970", fontSize: 14, lineHeight: 1.6 }}>
          {error}
        </p>
        <p style={{ fontSize: 13, color: "#999", marginTop: 24 }}>
          If you already paid, your WhatsApp receipt will be sent shortly.
        </p>
      </div>
    </div>
  );
}
