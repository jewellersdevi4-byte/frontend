"use client";
import {
  AlertCircle,
  ArrowRight,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { CustomerPortalModel } from "../hooks/useCustomerPortal";
type Props = Pick<
  CustomerPortalModel,
  | "t"
  | "setLang"
  | "lang"
  | "handleLoginSubmit"
  | "loginInput"
  | "setLoginInput"
  | "error"
  | "busy"
  | "shop"
>;
export function LoginScreen({
  t,
  setLang,
  lang,
  handleLoginSubmit,
  loginInput,
  setLoginInput,
  error,
  busy,
  shop,
}: Props) {
  return (
    <div className="phone-container">
      {/* Header */}
      <header className="app-header">
        <div>
          <h1 className="brand-title">
            <Sparkles size={20} color="var(--gold-light)" /> {t.brand}
          </h1>
          <p className="brand-subtitle">{t.tagline}</p>
        </div>
        <button
          className="lang-toggle"
          onClick={() => setLang(lang === "en" ? "kn" : "en")}
        >
          {lang === "en" ? "ಕನ್ನಡ" : "English"}
        </button>
      </header>

      {/* Hero Banner */}
      <div className="login-hero">
        <h1>{t.loginTitle}</h1>
        <p>{t.loginSubtitle}</p>
      </div>

      {/* Login Card */}
      <div className="card" style={{ marginTop: -20 }}>
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="customerIdInput">
              {lang === "kn"
                ? "ನಿಮ್ಮ ಗ್ರಾಹಕ ಐಡಿ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
                : "Customer ID or Registered Mobile"}
            </label>
            <input
              id="customerIdInput"
              type="text"
              className="text-input"
              placeholder={t.idPlaceholder}
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              autoCapitalize="characters"
              required
            />
            <p
              style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}
            >
              {lang === "kn"
                ? "ಉದಾಹರಣೆಗೆ: DJ-C-1001 ಅಥವಾ 7892490633"
                : "Example: DJ-C-1001 or your 10-digit mobile number"}
            </p>
          </div>

          {error && (
            <div className="banner-notice warning" style={{ marginBottom: 14 }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy}
            style={{ marginTop: 8 }}
          >
            {busy
              ? lang === "kn"
                ? "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…"
                : "Checking…"
              : t.loginBtn}{" "}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* Trust Badges Footer */}
      <div
        style={{ padding: "20px 24px", textAlign: "center", marginTop: "auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            color: "var(--text-muted)",
            fontSize: 12,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldCheck size={16} color="var(--primary)" /> 100% Safe &
            Verified
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Receipt size={16} color="var(--gold)" /> Official Receipts
          </span>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
          {shop.shopName} · {shop.address} · Ph: {shop.phone}
        </p>
      </div>
    </div>
  );
}
