"use client";
import type { CheckoutModel } from "../hooks/useCheckout";
type Props = Pick<CheckoutModel, never>;
export function LoadingScreen({}: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f4ee",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <p style={{ color: "#737970" }}>Loading secure payment details…</p>
    </div>
  );
}
