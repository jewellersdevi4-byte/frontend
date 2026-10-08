"use client";
import { FormEvent, useEffect, useState } from "react";
import type { Account, Customer, ShopInfo } from "../types";
export function useCustomerPortal() {
  const [lang, setLang] = useState<"kn" | "en">("en");
  const [token, setToken] = useState<string>("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [shop, setShop] = useState<ShopInfo>({
    shopName: "Devi Jewellers",
    address: "Main Road, Kaup - 574106",
    phone: "9019382425",
    whatsapp: "9019382425",
  });
  const [activeTab, setActiveTab] = useState<
    "overview" | "instalments" | "receipts" | "rules"
  >("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [loginInput, setLoginInput] = useState<string>("");
  const [showOnlineModal, setShowOnlineModal] = useState<boolean>(false);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [manualMethod, setManualMethod] = useState<"Cash" | "UPI" | "Bank">(
    "Cash",
  );
  const [manualAmount, setManualAmount] = useState<string>("500");
  const [manualDate, setManualDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [manualRef, setManualRef] = useState<string>("Paid at shop counter");
  const [manualNote, setManualNote] = useState<string>("");
  const [manualImage, setManualImage] = useState<string>("");
  const t = {
    brand: lang === "kn" ? "ದೇವಿ ಜ್ಯುವೆಲ್ಲರ್ಸ್" : "Devi Jewellers",
    tagline:
      lang === "kn"
        ? "ಕಾಪು · ಶಾಪಿಂಗ್ ಹಾಗೂ ಸ್ಕೀಮ್ ಪಾಸ್‌ಬುಕ್"
        : "Kaup · Scheme Passbook & Online Payments",
    welcome: lang === "kn" ? "ನಮಸ್ಕಾರ" : "Welcome",
    loginTitle:
      lang === "kn"
        ? "ನಿಮ್ಮ ಸ್ಕೀಮ್ ಪಾಸ್‌ಬುಕ್ ತೆರೆಯಿರಿ"
        : "Open Your Scheme Passbook",
    loginSubtitle:
      lang === "kn"
        ? "ನಿಮ್ಮ ಗ್ರಾಹಕ ಐಡಿ (ಉದಾ: DJ-C-1001) ಅಥವಾ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ."
        : "Enter your Customer ID (e.g. DJ-C-1001) or registered mobile number.",
    idPlaceholder:
      lang === "kn"
        ? "ಗ್ರಾಹಕ ಐಡಿ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
        : "Customer ID (e.g. DJ-C-1001) or Mobile",
    loginBtn: lang === "kn" ? "ಪಾಸ್‌ಬುಕ್ ವೀಕ್ಷಿಸಿ" : "View My Scheme",
    totalPaid:
      lang === "kn" ? "ಇಲ್ಲಿಯವರೆಗೆ ಪಾವತಿಸಿದ ಮೊತ್ತ" : "Total Paid So Far",
    dueNow: lang === "kn" ? "ಈ ತಿಂಗಳು ಪಾವತಿಸಬೇಕಾದದ್ದು" : "Due This Month",
    futurePending: lang === "kn" ? "ಮುಂದಿನ ಬಾಕಿ ಮೊತ್ತ" : "Remaining Balance",
    benefit: lang === "kn" ? "ಅಂಗಡಿ ಬೋನಸ್ ಲಾಭ" : "Shop Bonus Benefit",
    payOnlineBtn:
      lang === "kn"
        ? "ಆನ್‌ಲೈನ್‌ ಪಾವತಿ (UPI / ಕಾರ್ಡ್)"
        : "Pay Online (UPI / Card / NetBanking)",
    payAtShopBtn:
      lang === "kn"
        ? "ಅಂಗಡಿಯಲ್ಲಿ ನಗದು ಪಾವತಿ / ರಶೀದಿ ವರದಿ"
        : "Pay at Shop (Cash) / Report Payment",
    howItWorks:
      lang === "kn"
        ? "ಈ ಸ್ಕೀಮ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?"
        : "How This Scheme Works",
    instalmentTracker: lang === "kn" ? "ಕಂತುಗಳ ವಿವರ" : "Instalments Tracker",
    receipts: lang === "kn" ? "ಅಧಿಕೃತ ರಸೀದಿಗಳು" : "Payment Receipts",
    viewReceipt: lang === "kn" ? "ರಸೀದಿ ವೀಕ್ಷಿಸಿ" : "View Receipt",
    pendingVerification:
      lang === "kn" ? "ಅಂಗಡಿ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ" : "Pending Shop Verification",
    manualTitle:
      lang === "kn"
        ? "ಅಂಗಡಿಯಲ್ಲಿ ನಗದು ಪಾವತಿ ವರದಿ"
        : "Report Shop Cash / Manual Payment",
    onlineTitle:
      lang === "kn" ? "ಆನ್‌ಲೈನ್‌ ಪಾವತಿ (ರೇಜರ್‌ಪೇ)" : "Pay Online via Razorpay",
    contactShop:
      lang === "kn" ? "ಅಂಗಡಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ" : "Contact Devi Jewellers, Kaup",
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam =
      params.get("id") ||
      params.get("phone") ||
      params.get("customer") ||
      params.get("account");
    const storedToken = localStorage.getItem("devi_customer_token");

    if (idParam) {
      setLoginInput(idParam);
      handleDirectLogin(idParam);
    } else if (storedToken) {
      setToken(storedToken);
      fetchCustomerData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);
  async function handleDirectLogin(identifier: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/customer-portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Connection error. Please try again.");
      }
      if (!res.ok) throw new Error(data.error || "Failed to login");

      setToken(data.token);
      localStorage.setItem("devi_customer_token", data.token);
      setCustomer(data.customer);
      if (data.customer.language === "kn") setLang("kn");
      await fetchCustomerData(data.token);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }
  async function fetchCustomerData(authToken: string, retryCount = 0) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/customer-portal/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        if (retryCount < 2) {
          await new Promise((r) => setTimeout(r, 600));
          return fetchCustomerData(authToken, retryCount + 1);
        }
        throw new Error("Connection error. Please refresh the page.");
      }
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("devi_customer_token");
          setToken("");
          setCustomer(null);
        }
        throw new Error(data.error || "Failed to fetch scheme data");
      }

      setCustomer(data.customer);
      setAccounts(data.accounts || []);
      if (data.shop) setShop(data.shop);
      if (data.accounts && data.accounts.length > 0) {
        setSelectedAccount(data.accounts[0]);
        const nextDue =
          data.accounts[0].dueNow && BigInt(data.accounts[0].dueNow) > 0n
            ? (Number(data.accounts[0].dueNow) / 100).toString()
            : (Number(data.accounts[0].rules.amount) / 100).toString();
        setManualAmount(nextDue);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    if (!loginInput.trim()) return;
    handleDirectLogin(loginInput.trim());
  }
  function handleLogout() {
    localStorage.removeItem("devi_customer_token");
    setToken("");
    setCustomer(null);
    setAccounts([]);
    setSelectedAccount(null);
  }
  async function initiateOnlinePayment() {
    if (!selectedAccount) return;
    setBusy(true);
    setError("");
    const isS4 =
      selectedAccount.rules.type === "rate_booking" ||
      selectedAccount.rules.formula === "lower_rate";
    if (isS4 && (!manualAmount || BigInt(manualAmount) < 5000n)) {
      setError(
        lang === "kn"
          ? "ಕನಿಷ್ಠ ಠೇವಣಿ ಮೊತ್ತ ₹5,000 ಆಗಿರಬೇಕು"
          : "Minimum deposit amount for Scheme 4 is ₹5,000",
      );
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/customer-portal/pay-online", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          amountPaise: (BigInt(manualAmount) * 100n).toString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not initiate payment");

      // Check if Razorpay is available
      if ((window as any).Razorpay && data.adapter === "live") {
        const rzp = new (window as any).Razorpay({
          key: data.razorpayKeyId,
          amount: data.amountPaise,
          currency: "INR",
          name: shop.shopName,
          description: `${data.schemeName} (${data.accountNumber})`,
          order_id: data.providerOrderId || undefined,
          modal: {
            ondismiss: function () {
              setBusy(false);
              setError(
                lang === "kn"
                  ? "ಪಾವತಿ ರದ್ದುಗೊಂಡಿದೆ."
                  : "Payment was cancelled: Razorpay modal closed.",
              );
            },
          },
          handler: async function (response: any) {
            await confirmOnlinePayment(
              data.linkId,
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
            );
          },
          prefill: {
            name: data.customerName,
            contact: data.customerPhone,
          },
          theme: { color: "#193c34" },
        });
        rzp.on("payment.failed", function (resp: any) {
          setError(
            resp.error?.description || "Payment was cancelled or failed.",
          );
          setBusy(false);
        });
        rzp.open();
      } else {
        throw new Error(
          "Razorpay payment gateway is unavailable. Please refresh or pay at the shop counter.",
        );
      }
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  }
  async function confirmOnlinePayment(
    linkId: string,
    providerPaymentId: string,
    providerOrderId?: string,
    signature?: string,
  ) {
    try {
      const res = await fetch(
        "/api/v1/customer-portal/complete-online-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            linkId,
            providerPaymentId,
            providerOrderId,
            signature,
          }),
        },
      );
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Payment confirmation error");

      setShowOnlineModal(false);
      setNotice(
        lang === "kn"
          ? "✓ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಹಣ ಜಮೆಯಾಗಿದೆ ಮತ್ತು ರಸೀದಿ ಸಿದ್ಧವಾಗಿದೆ."
          : "✓ Payment Successful! Amount credited and official receipt issued.",
      );
      await fetchCustomerData(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function submitManualProof(e: FormEvent) {
    e.preventDefault();
    if (!selectedAccount) return;
    setBusy(true);
    setError("");
    const isS4 =
      selectedAccount.rules.type === "rate_booking" ||
      selectedAccount.rules.formula === "lower_rate";
    if (isS4 && (!manualAmount || BigInt(manualAmount) < 5000n)) {
      setError(
        lang === "kn"
          ? "ಕನಿಷ್ಠ ಠೇವಣಿ ಮೊತ್ತ ₹5,000 ಆಗಿರಬೇಕು"
          : "Minimum deposit amount for Scheme 4 is ₹5,000",
      );
      setBusy(false);
      return;
    }

    try {
      const paiseAmount = (BigInt(manualAmount) * 100n).toString();
      const res = await fetch("/api/v1/customer-portal/submit-manual-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          amount: paiseAmount,
          paymentDate: manualDate,
          method: manualMethod,
          reference: manualRef.trim() || "Paid at shop counter",
          note: manualNote.trim(),
          imageDataUrl: manualImage || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Could not submit payment report");

      setShowManualModal(false);
      setManualImage("");
      setNotice(
        lang === "kn"
          ? "✓ ನಗದು ಪಾವತಿಯನ್ನು ಅಂಗಡಿ ಮಾಲೀಕರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಅಂಗಡಿ ಪರಿಶೀಲನೆಯ ನಂತರ ರಸೀದಿ ಲಭ್ಯವಾಗುತ್ತದೆ."
          : "✓ Payment reported to shop owner. Official receipt will be issued once verified in store.",
      );
      await fetchCustomerData(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload a screenshot under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setManualImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
  const currentAcc = selectedAccount || accounts[0];
  const paidCount = currentAcc
    ? currentAcc.instalments.filter((i) => i.status === "Paid").length
    : 0;
  const totalCount = currentAcc ? currentAcc.rules.count : 12;
  const isScheme4 = Boolean(
    currentAcc &&
    (currentAcc.rules.type === "rate_booking" ||
      currentAcc.rules.formula === "lower_rate"),
  );
  const isScheme5 = Boolean(
    currentAcc &&
    (currentAcc.rules.type === "one_time" ||
      currentAcc.rules.formula === "locked_rate"),
  );
  const isScheme3 = Boolean(
    currentAcc &&
    (currentAcc.scheme_name.toLowerCase().includes("making charges") ||
      currentAcc.rules.makingTerms?.includes("25%")),
  );
  const isScheme1 = Boolean(
    currentAcc &&
    (currentAcc.scheme_name.toLowerCase().includes("adrushta") ||
      currentAcc.scheme_name.toLowerCase().includes("lucky draw")),
  );
  const isScheme2 = Boolean(
    currentAcc && !isScheme1 && !isScheme3 && !isScheme4 && !isScheme5,
  );
  const monthlyInstalmentPaise =
    currentAcc?.instalments?.[0]?.amount ||
    currentAcc?.rules?.amount ||
    "10000";
  const sharesCount = isScheme1
    ? Math.max(1, Math.round(Number(monthlyInstalmentPaise) / 10000))
    : 1;
  const progressPct = totalCount
    ? Math.round((paidCount / totalCount) * 100)
    : 0;
  return {
    loading,
    lang,
    customer,
    token,
    t,
    setLang,
    handleLoginSubmit,
    loginInput,
    setLoginInput,
    error,
    busy,
    shop,
    handleLogout,
    notice,
    accounts,
    currentAcc,
    setSelectedAccount,
    isScheme1,
    sharesCount,
    monthlyInstalmentPaise,
    isScheme4,
    paidCount,
    totalCount,
    isScheme5,
    progressPct,
    setManualAmount,
    setShowOnlineModal,
    setShowManualModal,
    activeTab,
    setActiveTab,
    isScheme3,
    showOnlineModal,
    manualAmount,
    initiateOnlinePayment,
    showManualModal,
    submitManualProof,
    manualMethod,
    setManualMethod,
    setManualRef,
    manualDate,
    setManualDate,
    manualRef,
    manualNote,
    setManualNote,
  };
}
export type CustomerPortalModel = ReturnType<typeof useCustomerPortal>;
