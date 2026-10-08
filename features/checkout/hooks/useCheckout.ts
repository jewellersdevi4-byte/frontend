"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PayData } from "../types";
export function useCheckout() {
  const params = useParams();
  const linkId = params?.linkId as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PayData | null>(null);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  useEffect(() => {
    if (!linkId) return;
    fetch(`/api/v1/pay/${linkId}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Payment link not found");
        setData(body);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [linkId]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("razorpay-checkout-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  async function handleLiveRazorpay() {
    if (!data) return;
    if (!(window as any).Razorpay) {
      setError(
        "Razorpay SDK is loading. Please try again in a moment or use test simulator.",
      );
      return;
    }

    setPaying(true);
    setError("");

    try {
      const options = {
        key: data.razorpayKeyId,
        amount: data.amountPaise,
        currency: data.currency || "INR",
        name: "Devi Jewellers, Kaup",
        description: `${data.schemeName} (${data.accountNumber})`,
        order_id: data.providerOrderId || undefined,
        modal: {
          ondismiss: function () {
            setPaying(false);
            setError("Payment cancelled: Razorpay modal closed by user.");
          },
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                linkId: data.linkId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error || "Payment signature verification failed",
              );
            }
            setPaid(true);
            setPaymentResult({
              providerPaymentId: response.razorpay_payment_id,
              providerOrderId: response.razorpay_order_id,
              receipt: verifyData.receipt,
            });
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: data.customerName,
        },
        notes: {
          linkId: data.linkId,
        },
        theme: {
          color: "#133b32",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment failed. Please retry.");
        setPaying(false);
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message || "Could not initiate Razorpay checkout");
      setPaying(false);
    }
  }
  return {
    loading,
    error,
    data,
    paid,
    paymentResult,
    handleLiveRazorpay,
    paying,
  };
}
export type CheckoutModel = ReturnType<typeof useCheckout>;
