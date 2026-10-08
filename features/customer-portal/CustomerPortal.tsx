"use client";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  LogOut,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";
import { AccountSummary } from "./components/AccountSummary";
import { InstalmentsTab } from "./tabs/InstalmentsTab";
import { LoadingScreen } from "./components/LoadingScreen";
import { LoginScreen } from "./components/LoginScreen";
import { ManualPaymentModal } from "./payments/ManualPaymentModal";
import { OnlinePaymentModal } from "./payments/OnlinePaymentModal";
import { OverviewTab } from "./tabs/OverviewTab";
import { ReceiptsTab } from "./tabs/ReceiptsTab";
import { useCustomerPortal } from "./hooks/useCustomerPortal";
export default function CustomerPortal() {
  const {
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
  } = useCustomerPortal();
  if (loading) {
    return <LoadingScreen lang={lang} />;
  }
  if (!customer || !token) {
    return (
      <LoginScreen
        t={t}
        setLang={setLang}
        lang={lang}
        handleLoginSubmit={handleLoginSubmit}
        loginInput={loginInput}
        setLoginInput={setLoginInput}
        error={error}
        busy={busy}
        shop={shop}
      />
    );
  }
  return (
    <div className="phone-container">
      {/* App Header */}
      <header className="app-header">
        <div>
          <h1 className="brand-title">
            <Sparkles size={20} color="var(--gold-light)" /> {t.brand}
          </h1>
          <p className="brand-subtitle">
            {shop.address.split(",")[1] || "Kaup"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === "en" ? "kn" : "en")}
          >
            {lang === "en" ? "ಕನ್ನಡ" : "English"}
          </button>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              padding: 7,
              borderRadius: 20,
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Customer Greeting Card */}
      <div
        style={{
          padding: "16px 20px 10px",
          background: "var(--primary)",
          color: "#fff",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "var(--gold-light)",
            textTransform: "uppercase",
            letterSpacing: 1,
            fontWeight: 600,
          }}
        >
          {customer.number}
        </p>
        <h2 style={{ fontFamily: "serif", fontSize: 24, margin: "2px 0 6px" }}>
          {t.welcome}, {customer.name}
        </h2>
        <p style={{ fontSize: 13, opacity: 0.85 }}>
          📱 +{customer.mobile} · {customer.address}
        </p>
      </div>

      {/* Notice & Alerts */}
      {notice && (
        <div
          className="banner-notice success"
          style={{ margin: "14px 16px 0" }}
        >
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div
          className="banner-notice warning"
          style={{ margin: "14px 16px 0" }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Scheme Selection (if multiple accounts) */}
      {accounts.length > 1 && (
        <div style={{ padding: "12px 16px 0" }}>
          <label className="input-label">
            {lang === "kn" ? "ಖಾತೆ ಆಯ್ಕೆಮಾಡಿ:" : "Select Scheme Account:"}
          </label>
          <select
            className="text-input"
            value={currentAcc?.id}
            onChange={(e) => {
              const acc = accounts.find((a) => a.id === e.target.value);
              if (acc) setSelectedAccount(acc);
            }}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.scheme_name} · #{a.number}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentAcc && (
        <>
          {/* Main Financial Highlights Card */}
          <AccountSummary
            currentAcc={currentAcc}
            isScheme1={isScheme1}
            sharesCount={sharesCount}
            lang={lang}
            monthlyInstalmentPaise={monthlyInstalmentPaise}
            isScheme4={isScheme4}
            t={t}
            paidCount={paidCount}
            totalCount={totalCount}
            isScheme5={isScheme5}
            progressPct={progressPct}
            setManualAmount={setManualAmount}
            setShowOnlineModal={setShowOnlineModal}
            setShowManualModal={setShowManualModal}
          />

          {/* Pending Verification Notice from Shop Owner */}
          {currentAcc.proofs &&
            currentAcc.proofs.filter((p) => p.status === "pending").length >
              0 && (
              <div
                className="banner-notice warning"
                style={{ margin: "0 16px 14px" }}
              >
                <Clock size={20} />
                <div>
                  <strong>{t.pendingVerification}</strong>
                  <p style={{ fontSize: 12, marginTop: 4 }}>
                    {currentAcc.proofs
                      .filter((p) => p.status === "pending")
                      .map((p, i) => (
                        <span key={p.id}>
                          {p.review_note || "Shop payment reported"} ·{" "}
                          {new Date(p.created_at).toLocaleDateString("en-IN")}
                          {i < currentAcc.proofs.length - 1 ? "; " : ""}
                        </span>
                      ))}
                  </p>
                  <p style={{ fontSize: 11, marginTop: 4, opacity: 0.9 }}>
                    {lang === "kn"
                      ? "ಅಂಗಡಿ ಮಾಲೀಕರು ಅಂಗಡಿ ರಿಜಿಸ್ಟರ್ ಪರಿಶೀಲಿಸಿ ಶೀಘ್ರದಲ್ಲೇ ಅನುಮೋದಿಸುತ್ತಾರೆ."
                      : "Shop owner will verify against the store cash register / bank and issue official receipt."}
                  </p>
                </div>
              </div>
            )}

          {/* Tab Navigation */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              {t.howItWorks}
            </button>
            <button
              className={`tab-btn ${activeTab === "instalments" ? "active" : ""}`}
              onClick={() => setActiveTab("instalments")}
            >
              {t.instalmentTracker}
            </button>
            <button
              className={`tab-btn ${activeTab === "receipts" ? "active" : ""}`}
              onClick={() => setActiveTab("receipts")}
            >
              {t.receipts} ({currentAcc.payments.length})
            </button>
          </div>

          {/* TAB 1: How It Works & Scheme Ideas */}
          {
            <OverviewTab
              activeTab={activeTab}
              t={t}
              isScheme4={isScheme4}
              lang={lang}
              currentAcc={currentAcc}
              isScheme3={isScheme3}
              isScheme5={isScheme5}
              isScheme1={isScheme1}
              sharesCount={sharesCount}
              monthlyInstalmentPaise={monthlyInstalmentPaise}
            />
          }

          {/* TAB 2: Instalment Tracker */}
          {
            <InstalmentsTab
              activeTab={activeTab}
              t={t}
              paidCount={paidCount}
              totalCount={totalCount}
              lang={lang}
              currentAcc={currentAcc}
            />
          }

          {/* TAB 3: Payment Receipts */}
          {
            <ReceiptsTab
              activeTab={activeTab}
              t={t}
              currentAcc={currentAcc}
              lang={lang}
              token={token}
            />
          }
        </>
      )}

      {/* Shop Assistance & WhatsApp Floating Link */}
      <div
        style={{
          margin: "14px 16px",
          padding: 16,
          background: "#f5f7f2",
          borderRadius: 12,
          border: "1px solid var(--border)",
        }}
      >
        <h4
          style={{
            fontSize: 14,
            color: "var(--primary)",
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <HelpCircle size={16} /> {t.contactShop}
        </h4>
        <p
          style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}
        >
          {shop.shopName} · {shop.address}
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <a
            href={`https://wa.me/91${shop.whatsapp}?text=Namaskara,%20I%20have%20an%20enquiry%20regarding%20my%20scheme%20account%20${currentAcc?.number || ""}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{
              padding: "8px 12px",
              fontSize: 13,
              textDecoration: "none",
              flex: 1,
            }}
          >
            <MessageSquare size={16} color="#25D366" /> WhatsApp Shop
          </a>
          <a
            href={`tel:${shop.phone}`}
            className="btn btn-secondary"
            style={{
              padding: "8px 12px",
              fontSize: 13,
              textDecoration: "none",
              flex: 1,
            }}
          >
            <Phone size={16} color="var(--primary)" /> Call Shop
          </a>
        </div>
      </div>

      {/* MODAL 1: Online Payment via Razorpay */}
      {
        <OnlinePaymentModal
          showOnlineModal={showOnlineModal}
          busy={busy}
          setShowOnlineModal={setShowOnlineModal}
          t={t}
          lang={lang}
          isScheme4={isScheme4}
          manualAmount={manualAmount}
          setManualAmount={setManualAmount}
          customer={customer}
          currentAcc={currentAcc}
          initiateOnlinePayment={initiateOnlinePayment}
        />
      }

      {/* MODAL 2: Report Shop Cash / Manual Payment */}
      {
        <ManualPaymentModal
          showManualModal={showManualModal}
          busy={busy}
          setShowManualModal={setShowManualModal}
          t={t}
          submitManualProof={submitManualProof}
          lang={lang}
          manualMethod={manualMethod}
          setManualMethod={setManualMethod}
          setManualRef={setManualRef}
          isScheme4={isScheme4}
          manualAmount={manualAmount}
          setManualAmount={setManualAmount}
          manualDate={manualDate}
          setManualDate={setManualDate}
          manualRef={manualRef}
          manualNote={manualNote}
          setManualNote={setManualNote}
        />
      }
    </div>
  );
}
