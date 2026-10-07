'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Phone,
  MessageSquare,
  Sparkles,
  Receipt,
  HelpCircle,
  LogOut,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info
} from 'lucide-react';

type Customer = {
  id: string;
  number: string;
  name: string;
  mobile: string;
  whatsapp: string;
  language: string;
  address: string;
};

type Instalment = {
  id: string;
  seq: number;
  due: string;
  amount: string;
  paid: string;
  status: 'Paid' | 'Due' | 'Overdue' | 'Partially paid' | 'Future';
};

type PaymentReceipt = {
  id: string;
  amount: string;
  payment_date: string;
  method: string;
  reference?: string;
  receipt_id: string;
  receipt_number: string;
  reserved_grams?: string | null;
  rate_paise_per_gram?: string | null;
  purity?: string | null;
};

type PaymentProof = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  review_note?: string;
  receipt_number?: string;
};

type Account = {
  id: string;
  number: string;
  scheme_name: string;
  status: string;
  totalPaid: string;
  dueNow: string;
  overdue: string;
  future: string;
  benefit: string;
  maturity_date: string;
  locked_rate?: string | null;
  totalReservedGrams?: string | null;
  remainingReservedGrams?: string | null;
  scheduledGoldGrams?: string | null;
  scheduledTotal?: string;
  goldGramsLabel?: string;
  goldGramsLabelKn?: string;
  todayRate?: { id: string; purity: string; paise_per_gram: string; effective_at: string; notes?: string } | null;
  rules: {
    type: string;
    formula: string;
    amount: string;
    count: number;
    durationMonths: number;
    dueDay: number;
    benefit: string;
    purity?: string;
    termsEn?: string;
    termsKn?: string;
    makingTerms?: string;
  };
  instalments: Instalment[];
  payments: PaymentReceipt[];
  proofs: PaymentProof[];
};

type ShopInfo = {
  shopName: string;
  address: string;
  phone: string;
  whatsapp: string;
};

const money = (paiseStr: string | number | bigint) => {
  const n = BigInt(paiseStr || '0');
  return '₹' + (n / 100n).toLocaleString('en-IN') + '.' + String(n % 100n).padStart(2, '0');
};

export default function CustomerPortal() {
  const [lang, setLang] = useState<'kn' | 'en'>('en');
  const [token, setToken] = useState<string>('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [shop, setShop] = useState<ShopInfo>({
    shopName: 'Devi Jewellers',
    address: 'Main Road, Kaup - 574106',
    phone: '9019382425',
    whatsapp: '9019382425'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'instalments' | 'receipts' | 'rules'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [loginInput, setLoginInput] = useState<string>('');

  // Payment modals
  const [showOnlineModal, setShowOnlineModal] = useState<boolean>(false);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Manual payment form fields
  const [manualMethod, setManualMethod] = useState<'Cash' | 'UPI' | 'Bank'>('Cash');
  const [manualAmount, setManualAmount] = useState<string>('500');
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [manualRef, setManualRef] = useState<string>('Paid at shop counter');
  const [manualNote, setManualNote] = useState<string>('');
  const [manualImage, setManualImage] = useState<string>('');

  // Translations
  const t = {
    brand: lang === 'kn' ? 'ದೇವಿ ಜ್ಯುವೆಲ್ಲರ್ಸ್' : 'Devi Jewellers',
    tagline: lang === 'kn' ? 'ಕಾಪು · ಶಾಪಿಂಗ್ ಹಾಗೂ ಸ್ಕೀಮ್ ಪಾಸ್‌ಬುಕ್' : 'Kaup · Scheme Passbook & Online Payments',
    welcome: lang === 'kn' ? 'ನಮಸ್ಕಾರ' : 'Welcome',
    loginTitle: lang === 'kn' ? 'ನಿಮ್ಮ ಸ್ಕೀಮ್ ಪಾಸ್‌ಬುಕ್ ತೆರೆಯಿರಿ' : 'Open Your Scheme Passbook',
    loginSubtitle: lang === 'kn' 
      ? 'ನಿಮ್ಮ ಗ್ರಾಹಕ ಐಡಿ (ಉದಾ: DJ-C-1001) ಅಥವಾ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' 
      : 'Enter your Customer ID (e.g. DJ-C-1001) or registered mobile number.',
    idPlaceholder: lang === 'kn' ? 'ಗ್ರಾಹಕ ಐಡಿ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Customer ID (e.g. DJ-C-1001) or Mobile',
    loginBtn: lang === 'kn' ? 'ಪಾಸ್‌ಬುಕ್ ವೀಕ್ಷಿಸಿ' : 'View My Scheme',
    totalPaid: lang === 'kn' ? 'ಇಲ್ಲಿಯವರೆಗೆ ಪಾವತಿಸಿದ ಮೊತ್ತ' : 'Total Paid So Far',
    dueNow: lang === 'kn' ? 'ಈ ತಿಂಗಳು ಪಾವತಿಸಬೇಕಾದದ್ದು' : 'Due This Month',
    futurePending: lang === 'kn' ? 'ಮುಂದಿನ ಬಾಕಿ ಮೊತ್ತ' : 'Remaining Balance',
    benefit: lang === 'kn' ? 'ಅಂಗಡಿ ಬೋನಸ್ ಲಾಭ' : 'Shop Bonus Benefit',
    payOnlineBtn: lang === 'kn' ? 'ಆನ್‌ಲೈನ್‌ ಪಾವತಿ (UPI / ಕಾರ್ಡ್)' : 'Pay Online (UPI / Card / NetBanking)',
    payAtShopBtn: lang === 'kn' ? 'ಅಂಗಡಿಯಲ್ಲಿ ನಗದು ಪಾವತಿ / ರಶೀದಿ ವರದಿ' : 'Pay at Shop (Cash) / Report Payment',
    howItWorks: lang === 'kn' ? 'ಈ ಸ್ಕೀಮ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?' : 'How This Scheme Works',
    instalmentTracker: lang === 'kn' ? 'ಕಂತುಗಳ ವಿವರ' : 'Instalments Tracker',
    receipts: lang === 'kn' ? 'ಅಧಿಕೃತ ರಸೀದಿಗಳು' : 'Payment Receipts',
    viewReceipt: lang === 'kn' ? 'ರಸೀದಿ ವೀಕ್ಷಿಸಿ' : 'View Receipt',
    pendingVerification: lang === 'kn' ? 'ಅಂಗಡಿ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ' : 'Pending Shop Verification',
    manualTitle: lang === 'kn' ? 'ಅಂಗಡಿಯಲ್ಲಿ ನಗದು ಪಾವತಿ ವರದಿ' : 'Report Shop Cash / Manual Payment',
    onlineTitle: lang === 'kn' ? 'ಆನ್‌ಲೈನ್‌ ಪಾವತಿ (ರೇಜರ್‌ಪೇ)' : 'Pay Online via Razorpay',
    contactShop: lang === 'kn' ? 'ಅಂಗಡಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ' : 'Contact Devi Jewellers, Kaup'
  };

  // Check URL query parameters and local token on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id') || params.get('phone') || params.get('customer') || params.get('account');
    const storedToken = localStorage.getItem('devi_customer_token');

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
    setError('');
    try {
      const res = await fetch('/api/v1/customer-portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error('Connection error. Please try again.');
      }
      if (!res.ok) throw new Error(data.error || 'Failed to login');

      setToken(data.token);
      localStorage.setItem('devi_customer_token', data.token);
      setCustomer(data.customer);
      if (data.customer.language === 'kn') setLang('kn');
      await fetchCustomerData(data.token);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function fetchCustomerData(authToken: string, retryCount = 0) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/customer-portal/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        if (retryCount < 2) {
          await new Promise(r => setTimeout(r, 600));
          return fetchCustomerData(authToken, retryCount + 1);
        }
        throw new Error('Connection error. Please refresh the page.');
      }
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('devi_customer_token');
          setToken('');
          setCustomer(null);
        }
        throw new Error(data.error || 'Failed to fetch scheme data');
      }

      setCustomer(data.customer);
      setAccounts(data.accounts || []);
      if (data.shop) setShop(data.shop);
      if (data.accounts && data.accounts.length > 0) {
        setSelectedAccount(data.accounts[0]);
        const nextDue = data.accounts[0].dueNow && BigInt(data.accounts[0].dueNow) > 0n 
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
    localStorage.removeItem('devi_customer_token');
    setToken('');
    setCustomer(null);
    setAccounts([]);
    setSelectedAccount(null);
  }

  // Online Razorpay Payment
  async function initiateOnlinePayment() {
    if (!selectedAccount) return;
    setBusy(true);
    setError('');
    const isS4 = selectedAccount.rules.type === 'rate_booking' || selectedAccount.rules.formula === 'lower_rate';
    if (isS4 && (!manualAmount || BigInt(manualAmount) < 5000n)) {
      setError(lang === 'kn' ? 'ಕನಿಷ್ಠ ಠೇವಣಿ ಮೊತ್ತ ₹5,000 ಆಗಿರಬೇಕು' : 'Minimum deposit amount for Scheme 4 is ₹5,000');
      setBusy(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/customer-portal/pay-online', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          amountPaise: (BigInt(manualAmount) * 100n).toString()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not initiate payment');

      // Check if Razorpay is available
      if ((window as any).Razorpay && data.adapter === 'live') {
        const rzp = new (window as any).Razorpay({
          key: data.razorpayKeyId,
          amount: data.amountPaise,
          currency: 'INR',
          name: shop.shopName,
          description: `${data.schemeName} (${data.accountNumber})`,
          order_id: data.providerOrderId || undefined,
          modal: {
            ondismiss: function () {
              setBusy(false);
              setError(lang === 'kn' ? 'ಪಾವತಿ ರದ್ದುಗೊಂಡಿದೆ.' : 'Payment was cancelled: Razorpay modal closed.');
            }
          },
          handler: async function (response: any) {
            await confirmOnlinePayment(
              data.linkId,
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
          },
          prefill: {
            name: data.customerName,
            contact: data.customerPhone
          },
          theme: { color: '#193c34' }
        });
        rzp.on('payment.failed', function (resp: any) {
          setError(resp.error?.description || 'Payment was cancelled or failed.');
          setBusy(false);
        });
        rzp.open();
      } else {
        throw new Error('Razorpay payment gateway is unavailable. Please refresh or pay at the shop counter.');
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
    signature?: string
  ) {
    try {
      const res = await fetch('/api/v1/customer-portal/complete-online-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          linkId,
          providerPaymentId,
          providerOrderId,
          signature
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Payment confirmation error');

      setShowOnlineModal(false);
      setNotice(lang === 'kn' 
        ? '✓ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ಹಣ ಜಮೆಯಾಗಿದೆ ಮತ್ತು ರಸೀದಿ ಸಿದ್ಧವಾಗಿದೆ.' 
        : '✓ Payment Successful! Amount credited and official receipt issued.');
      await fetchCustomerData(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Submit Manual Cash / Shop Counter Payment
  async function submitManualProof(e: FormEvent) {
    e.preventDefault();
    if (!selectedAccount) return;
    setBusy(true);
    setError('');
    const isS4 = selectedAccount.rules.type === 'rate_booking' || selectedAccount.rules.formula === 'lower_rate';
    if (isS4 && (!manualAmount || BigInt(manualAmount) < 5000n)) {
      setError(lang === 'kn' ? 'ಕನಿಷ್ಠ ಠೇವಣಿ ಮೊತ್ತ ₹5,000 ಆಗಿರಬೇಕು' : 'Minimum deposit amount for Scheme 4 is ₹5,000');
      setBusy(false);
      return;
    }

    try {
      const paiseAmount = (BigInt(manualAmount) * 100n).toString();
      const res = await fetch('/api/v1/customer-portal/submit-manual-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          amount: paiseAmount,
          paymentDate: manualDate,
          method: manualMethod,
          reference: manualRef.trim() || 'Paid at shop counter',
          note: manualNote.trim(),
          imageDataUrl: manualImage || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit payment report');

      setShowManualModal(false);
      setManualImage('');
      setNotice(lang === 'kn'
        ? '✓ ನಗದು ಪಾವತಿಯನ್ನು ಅಂಗಡಿ ಮಾಲೀಕರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಅಂಗಡಿ ಪರಿಶೀಲನೆಯ ನಂತರ ರಸೀದಿ ಲಭ್ಯವಾಗುತ್ತದೆ.'
        : '✓ Payment reported to shop owner. Official receipt will be issued once verified in store.');
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
      setError('Please upload a screenshot under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setManualImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // 1. Loading State
  if (loading) {
    return (
      <div className="phone-container" style={{ justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <Sparkles size={40} style={{ color: 'var(--gold)', animation: 'spin 2s linear infinite' }} />
        <p style={{ marginTop: 16, fontWeight: 600, color: 'var(--primary)' }}>
          {lang === 'kn' ? 'ಪಾಸ್‌ಬುಕ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ…' : 'Opening your Devi Jewellers passbook…'}
        </p>
      </div>
    );
  }

  // 2. Login Screen (Customer enters ID or Phone Number)
  if (!customer || !token) {
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
          <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}>
            {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
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
                {lang === 'kn' ? 'ನಿಮ್ಮ ಗ್ರಾಹಕ ಐಡಿ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Customer ID or Registered Mobile'}
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
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                {lang === 'kn' 
                  ? 'ಉದಾಹರಣೆಗೆ: DJ-C-1001 ಅಥವಾ 7892490633' 
                  : 'Example: DJ-C-1001 or your 10-digit mobile number'}
              </p>
            </div>

            {error && (
              <div className="banner-notice warning" style={{ marginBottom: 14 }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={busy} style={{ marginTop: 8 }}>
              {busy ? (lang === 'kn' ? 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…' : 'Checking…') : t.loginBtn} <ArrowRight size={16} />
            </button>
          </form>


        </div>

        {/* Trust Badges Footer */}
        <div style={{ padding: '20px 24px', textAlign: 'center', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, color: 'var(--text-muted)', fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={16} color="var(--primary)" /> 100% Safe & Verified
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Receipt size={16} color="var(--gold)" /> Official Receipts
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
            {shop.shopName} · {shop.address} · Ph: {shop.phone}
          </p>
        </div>
      </div>
    );
  }

  // 3. Authenticated Customer Dashboard
  const currentAcc = selectedAccount || accounts[0];
  const paidCount = currentAcc ? currentAcc.instalments.filter(i => i.status === 'Paid').length : 0;
  const totalCount = currentAcc ? currentAcc.rules.count : 12;
  const isScheme4 = Boolean(currentAcc && (currentAcc.rules.type === 'rate_booking' || currentAcc.rules.formula === 'lower_rate'));
  const isScheme5 = Boolean(currentAcc && (currentAcc.rules.type === 'one_time' || currentAcc.rules.formula === 'locked_rate'));
  const isScheme3 = Boolean(currentAcc && (currentAcc.scheme_name.toLowerCase().includes('making charges') || currentAcc.rules.makingTerms?.includes('25%')));
  const isScheme1 = Boolean(currentAcc && (currentAcc.scheme_name.toLowerCase().includes('adrushta') || currentAcc.scheme_name.toLowerCase().includes('lucky draw')));
  const isScheme2 = Boolean(currentAcc && !isScheme1 && !isScheme3 && !isScheme4 && !isScheme5);
  const monthlyInstalmentPaise = currentAcc?.instalments?.[0]?.amount || currentAcc?.rules?.amount || '10000';
  const sharesCount = isScheme1 ? Math.max(1, Math.round(Number(monthlyInstalmentPaise) / 10000)) : 1;
  const progressPct = totalCount ? Math.round((paidCount / totalCount) * 100) : 0;

  return (
    <div className="phone-container">
      {/* App Header */}
      <header className="app-header">
        <div>
          <h1 className="brand-title">
            <Sparkles size={20} color="var(--gold-light)" /> {t.brand}
          </h1>
          <p className="brand-subtitle">{shop.address.split(',')[1] || 'Kaup'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}>
            {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>
          <button 
            onClick={handleLogout} 
            title="Sign out"
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: 7, borderRadius: 20, cursor: 'pointer' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Customer Greeting Card */}
      <div style={{ padding: '16px 20px 10px', background: 'var(--primary)', color: '#fff' }}>
        <p style={{ fontSize: 13, color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
          {customer.number}
        </p>
        <h2 style={{ fontFamily: 'serif', fontSize: 24, margin: '2px 0 6px' }}>
          {t.welcome}, {customer.name}
        </h2>
        <p style={{ fontSize: 13, opacity: 0.85 }}>
          📱 +{customer.mobile} · {customer.address}
        </p>
      </div>

      {/* Notice & Alerts */}
      {notice && (
        <div className="banner-notice success" style={{ margin: '14px 16px 0' }}>
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="banner-notice warning" style={{ margin: '14px 16px 0' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Scheme Selection (if multiple accounts) */}
      {accounts.length > 1 && (
        <div style={{ padding: '12px 16px 0' }}>
          <label className="input-label">{lang === 'kn' ? 'ಖಾತೆ ಆಯ್ಕೆಮಾಡಿ:' : 'Select Scheme Account:'}</label>
          <select 
            className="text-input" 
            value={currentAcc?.id} 
            onChange={(e) => {
              const acc = accounts.find(a => a.id === e.target.value);
              if (acc) setSelectedAccount(acc);
            }}
          >
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.scheme_name} · #{a.number}</option>
            ))}
          </select>
        </div>
      )}

      {currentAcc && (
        <>
          {/* Main Financial Highlights Card */}
          <div className="card gold-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-gold">
                  {currentAcc.scheme_name}{isScheme1 ? ` · ${sharesCount} ${lang === 'kn' ? 'ಷೇರುಗಳು' : 'Shares'} (${money(monthlyInstalmentPaise)}/${lang === 'kn' ? 'ತಿಂಗಳು' : 'mo'})` : ''}
                </span>
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  Account: <strong>{currentAcc.number}</strong>
                </p>
              </div>
              <span className={`badge ${currentAcc.status === 'Active' ? 'badge-green' : 'badge-gold'}`}>
                {currentAcc.status}
              </span>
            </div>

            {/* Financial Numbers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
              <div style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #ebd9a8' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {isScheme4 ? (lang === 'kn' ? 'ಠೇವಣಿ ಮೊತ್ತ' : 'Total Deposited') : t.totalPaid}
                </p>
                <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}>
                  {money(currentAcc.totalPaid)}
                </p>
                <p style={{ fontSize: 11, color: '#27ae60', fontWeight: 600 }}>
                  {isScheme4 
                    ? (paidCount > 0 ? (lang === 'kn' ? '✓ ದರ ಲಾಕ್ ಆಗಿದೆ' : '✓ Rate Locked') : (lang === 'kn' ? 'ಕನಿಷ್ಠ ₹5,000' : 'Min ₹5,000')) 
                    : `✓ ${paidCount} of ${totalCount} instalments`}
                </p>
              </div>

              <div style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #ebd9a8' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {isScheme4 
                    ? (paidCount > 0 ? (lang === 'kn' ? 'ಮೀಸಲು ಚಿನ್ನದ ತೂಕ' : 'Reserved Gold Weight') : (lang === 'kn' ? 'ಠೇವಣಿ ಬಾಕಿ' : 'Deposit Due'))
                    : t.dueNow}
                </p>
                <p style={{ fontSize: 22, fontWeight: 700, color: isScheme4 ? (paidCount > 0 ? 'var(--primary)' : '#b8860b') : (BigInt(currentAcc.dueNow) > 0n ? '#b8860b' : '#27ae60'), marginTop: 4 }}>
                  {isScheme4 ? (paidCount > 0 ? `${currentAcc.totalReservedGrams || '0.0000'} g` : '₹5,000+') : money(currentAcc.dueNow)}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {isScheme4 
                    ? (paidCount > 0 ? (lang === 'kn' ? 'ಕಡಿಮೆ ದರದ ರಕ್ಷಣೆ' : 'Lower rate hedge') : (lang === 'kn' ? 'ಗರಿಷ್ಠ ಮಿತಿಯಿಲ್ಲ' : 'No upper limit'))
                    : (BigInt(currentAcc.dueNow) > 0n ? 'Payment due' : 'Current month paid')}
                </p>
              </div>
            </div>

            {/* Gold Quantity Highlight Tile (Displayed for ALL schemes) */}
            <div style={{
              marginTop: 12,
              background: 'linear-gradient(135deg, #fdfbf7 0%, #f7f1e5 100%)',
              border: '1.5px solid #d4af37',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>⚖️</span>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#193c34', margin: 0 }}>
                    {lang === 'kn' ? (currentAcc.goldGramsLabelKn || 'ಚಿನ್ನದ ಪ್ರಮಾಣ') : (currentAcc.goldGramsLabel || 'Gold Quantity')}
                  </p>
                </div>
                <p style={{ fontSize: 11, color: '#6d5d36', margin: '3px 0 0' }}>
                  {isScheme4
                    ? (lang === 'kn' ? 'ಬುಕ್ ಮಾಡಿದ ದರದಲ್ಲಿ ಸೂಚಿತ ತೂಕ (ಕಡಿಮೆ ದರದ ರಕ್ಷಣೆ)' : 'Indicative weight at booked rate (Market hedge)')
                    : isScheme5
                    ? (lang === 'kn' ? 'ನಿಗದಿತ ದರದಲ್ಲಿ ಲಾಕ್ ಆದ ತೂಕ (0% ಮೇಕಿಂಗ್ ಚಾರ್ಜ್)' : 'Locked rate weight (0% Making Charges)')
                    : (lang === 'kn' ? 'ಇಂದಿನ 22K ದರದ ಪ್ರಕಾರ ತತ್ಸಮಾನ ತೂಕ' : "Equivalent weight at today's 22K rate")}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#84612a', margin: 0, fontFamily: 'serif' }}>
                  {currentAcc.totalReservedGrams || '0.0000'} g
                </p>
                {currentAcc.scheduledGoldGrams && (
                  <p style={{ fontSize: 10, color: '#888', margin: '2px 0 0' }}>
                    {lang === 'kn' ? `ಗುರಿ: ${currentAcc.scheduledGoldGrams} g` : `Target: ${currentAcc.scheduledGoldGrams} g`}
                  </p>
                )}
              </div>
            </div>

            {/* Progress / Scheme Status Bar */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                <span>{lang === 'kn' ? 'ಪ್ರಗತಿ' : 'Scheme Progress'}</span>
                <span>{isScheme4 ? (paidCount > 0 ? '100% (Deposited)' : '0% (Pending)') : `${progressPct}% (${paidCount}/${totalCount})`}</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${isScheme4 ? (paidCount > 0 ? 100 : 0) : progressPct}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                {isScheme4 ? (
                  <>
                    <span>{currentAcc.locked_rate ? `Locked Rate: ${money(currentAcc.locked_rate)}/g (22K)` : 'Rate locks on deposit date'}</span>
                    <span style={{ color: '#27ae60' }}>Market Price Hedge</span>
                  </>
                ) : (
                  <>
                    <span>Scheduled Remaining: {money(currentAcc.future)}</span>
                    <span>Bonus Benefit: +{money(currentAcc.benefit)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons: Online vs Shop Cash */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isScheme4 && paidCount === 0 && (
                <div style={{ padding: 10, background: '#fff', borderRadius: 8, border: '1px solid #ebd9a8' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {lang === 'kn' ? 'ತ್ವರಿತ ಠೇವಣಿ ಮೊತ್ತ ಆಯ್ಕೆಮಾಡಿ (ಕನಿಷ್ಠ ₹5,000):' : 'Choose quick deposit amount (Min ₹5,000):'}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[5000, 10000, 25000, 50000, 100000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setManualAmount(amt.toString());
                          setShowOnlineModal(true);
                        }}
                        style={{
                          padding: '4px 10px',
                          fontSize: 12,
                          borderRadius: 16,
                          border: '1px solid #ebd9a8',
                          background: '#fcfbf8',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                className="btn btn-gold" 
                onClick={() => {
                  const defaultAmt = isScheme4 
                    ? (BigInt(currentAcc.totalPaid) > 0n ? '5000' : '5000')
                    : (BigInt(currentAcc.dueNow) > 0n 
                      ? (Number(currentAcc.dueNow) / 100).toString() 
                      : (Number(monthlyInstalmentPaise) / 100).toString());
                  setManualAmount(defaultAmt);
                  setShowOnlineModal(true);
                }}
              >
                <CreditCard size={18} /> {isScheme4 && paidCount === 0 ? (lang === 'kn' ? 'ಆನ್‌ಲೈನ್‌ ಠೇವಣಿ ಪಾವತಿಸಿ' : 'Pay Deposit Online (Razorpay)') : t.payOnlineBtn}
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  const defaultAmt = isScheme4 
                    ? (BigInt(currentAcc.totalPaid) > 0n ? '5000' : '5000')
                    : (BigInt(currentAcc.dueNow) > 0n 
                      ? (Number(currentAcc.dueNow) / 100).toString() 
                      : (Number(monthlyInstalmentPaise) / 100).toString());
                  setManualAmount(defaultAmt);
                  setShowManualModal(true);
                }}
              >
                <Building size={18} /> {isScheme4 && paidCount === 0 ? (lang === 'kn' ? 'ಅಂಗಡಿಯಲ್ಲಿ ನಗದು ಠೇವಣಿ / ವರದಿ' : 'Pay Deposit at Shop (Cash) / Report') : t.payAtShopBtn}
              </button>
            </div>
          </div>

          {/* Pending Verification Notice from Shop Owner */}
          {currentAcc.proofs && currentAcc.proofs.filter(p => p.status === 'pending').length > 0 && (
            <div className="banner-notice warning" style={{ margin: '0 16px 14px' }}>
              <Clock size={20} />
              <div>
                <strong>{t.pendingVerification}</strong>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  {currentAcc.proofs.filter(p => p.status === 'pending').map((p, i) => (
                    <span key={p.id}>
                      {p.review_note || 'Shop payment reported'} · {new Date(p.created_at).toLocaleDateString('en-IN')}
                      {i < currentAcc.proofs.length - 1 ? '; ' : ''}
                    </span>
                  ))}
                </p>
                <p style={{ fontSize: 11, marginTop: 4, opacity: 0.9 }}>
                  {lang === 'kn' 
                    ? 'ಅಂಗಡಿ ಮಾಲೀಕರು ಅಂಗಡಿ ರಿಜಿಸ್ಟರ್ ಪರಿಶೀಲಿಸಿ ಶೀಘ್ರದಲ್ಲೇ ಅನುಮೋದಿಸುತ್ತಾರೆ.' 
                    : 'Shop owner will verify against the store cash register / bank and issue official receipt.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="tab-bar">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              {t.howItWorks}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'instalments' ? 'active' : ''}`}
              onClick={() => setActiveTab('instalments')}
            >
              {t.instalmentTracker}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'receipts' ? 'active' : ''}`}
              onClick={() => setActiveTab('receipts')}
            >
              {t.receipts} ({currentAcc.payments.length})
            </button>
          </div>

          {/* TAB 1: How It Works & Scheme Ideas */}
          {activeTab === 'overview' && (
            <div className="card">
              <h3 style={{ fontFamily: 'serif', fontSize: 18, color: 'var(--primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={18} color="var(--gold)" /> {t.howItWorks}
              </h3>

              {isScheme4 ? (
                <div style={{ background: '#fcfbf8', border: '1px solid #ebd9a8', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಕನಿಷ್ಠ ಠೇವಣಿ' : 'Minimum Deposit'}</span>
                    <strong>₹5,000 {lang === 'kn' ? '(ಗರಿಷ್ಠ ಮಿತಿಯಿಲ್ಲ)' : '(No upper limit)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಯೋಜನೆಯ ಅವಧಿ' : 'Scheme Duration'}</span>
                    <strong>1 {lang === 'kn' ? 'ವರ್ಷ' : 'Year (12 Months)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ದರ ನೋಂದಣಿ' : 'Rate Registration'}</span>
                    <strong>{currentAcc.locked_rate ? `${money(currentAcc.locked_rate)}/g (22K)` : (lang === 'kn' ? 'ಪಾವತಿ ದಿನಾಂಕದಂದು ಲಾಕ್' : 'Locked on payment date')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14, color: '#27ae60' }}>
                    <span>{lang === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಏರಿಕೆಯ ರಕ್ಷಣೆ' : 'Rising Market Protection'}</span>
                    <strong>{lang === 'kn' ? 'ಕಡಿಮೆ ಬುಕ್ ಮಾಡಿದ ದರ' : 'Lower booked rate'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14, color: '#27ae60' }}>
                    <span>{lang === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಇಳಿಕೆಯ ರಕ್ಷಣೆ' : 'Falling Market Protection'}</span>
                    <strong>{lang === 'kn' ? 'ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಕಡಿಮೆ ದರ' : 'Prevailing lower rate'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 2px', fontSize: 14, fontWeight: 600, color: '#b8860b' }}>
                    <span>{lang === 'kn' ? 'ಮರುಪಾವತಿ ನೀತಿ' : 'Refund Policy'}</span>
                    <span>{lang === 'kn' ? 'ಕೇವಲ ಆಭರಣ ಖರೀದಿಗೆ ಮಾತ್ರ' : 'Strictly redeemable as jewellery'}</span>
                  </div>
                </div>
              ) : isScheme3 ? (
                <div style={{ background: '#fcfbf8', border: '1px solid #ebd9a8', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಮಾಸಿಕ ಕಂತು' : 'Monthly Instalment'}</span>
                    <strong>₹5,000 / {lang === 'kn' ? 'ತಿಂಗಳು' : 'month'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಒಟ್ಟು ಅವಧಿ' : 'Total Duration'}</span>
                    <strong>12 {lang === 'kn' ? 'ತಿಂಗಳುಗಳು (12 ಕಂತುಗಳು)' : 'Months (12 Instalments)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14, color: '#27ae60' }}>
                    <span>{lang === 'kn' ? 'ಪ್ರಮುಖ ಲಾಭ' : 'Primary Benefit'}</span>
                    <strong>25% {lang === 'kn' ? 'ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ ರಿಯಾಯಿತಿ' : 'Discount on Making Charges (MC)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಅನ್ವಯವಾಗುವ ಚಿನ್ನದ ದರ' : 'Applicable Gold Rate'}</span>
                    <strong>{lang === 'kn' ? 'ವಿಮೋಚನೆಯ ದಿನದ ಲೈವ್ ದರ' : 'Live rate on redemption date'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಚಿನ್ನದ ಪ್ರಮಾಣ (22K)' : 'Gold Quantity (22K)'}</span>
                    <strong>{currentAcc.totalReservedGrams || '0.0000'} g</strong>
                  </div>
                </div>
              ) : isScheme5 ? (
                <div style={{ background: '#fcfbf8', border: '1px solid #ebd9a8', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಏಕಕಾಲೀನ ಠೇವಣಿ' : 'Single Lump-Sum Deposit'}</span>
                    <strong>₹3,00,000</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಯೋಜನೆಯ ಅವಧಿ' : 'Scheme Duration'}</span>
                    <strong>1 {lang === 'kn' ? 'ವರ್ಷ (12 ತಿಂಗಳು)' : 'Year (12 Months)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14, color: '#27ae60' }}>
                    <span>{lang === 'kn' ? 'ಪ್ರಮುಖ ಲಾಭ' : 'Primary Benefit'}</span>
                    <strong>0% {lang === 'kn' ? 'ಮೇಕಿಂಗ್ ಚಾರ್ಜ್ + ಸಂರಕ್ಷಿತ ದರ' : 'Making Charges + Protected Gold Rate'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಕಾಯ್ದಿರಿಸಿದ ಚಿನ್ನದ ತೂಕ' : 'Reserved Gold Weight'}</span>
                    <strong>{currentAcc.totalReservedGrams || '0.0000'} g</strong>
                  </div>
                </div>
              ) : isScheme1 ? (
                <div style={{ background: '#fcfbf8', border: '1px solid #ebd9a8', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? '೧ ಷೇರು ಬೆಲೆ' : 'Price per Share'}</span>
                    <strong>₹100 / {lang === 'kn' ? 'ತಿಂಗಳು (ಒಟ್ಟು 12 ತಿಂಗಳು)' : 'month (12 Months)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14, color: 'var(--primary)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ನಿಮ್ಮ ಒಟ್ಟು ಷೇರುಗಳು' : 'Your Enrolled Shares'}</span>
                    <strong>{sharesCount} {lang === 'kn' ? 'ಷೇರುಗಳು' : 'shares'} ({money(monthlyInstalmentPaise)}/{lang === 'kn' ? 'ತಿಂಗಳು' : 'month'})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಮಾಸಿಕ ಕಂತು' : 'Monthly Instalment'}</span>
                    <strong>{money(monthlyInstalmentPaise)} / {lang === 'kn' ? 'ತಿಂಗಳು' : 'month'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಪಾವತಿ ಅಂತಿಮ ದಿನಾಂಕ' : 'Due Date'}</span>
                    <strong>{lang === 'kn' ? 'ಪ್ರತಿ ತಿಂಗಳ 10ನೇ ತಾರೀಖಿನೊಳಗೆ' : 'On or before 10th of every month'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14, color: '#27ae60' }}>
                    <span>{lang === 'kn' ? 'ಮಾಸಿಕ ಲಕ್ಕಿ ಡ್ರಾ' : 'Monthly Lucky Draw'}</span>
                    <strong>{lang === 'kn' ? 'ಪ್ರತಿ ತಿಂಗಳು ಲಕ್ಕಿ ಡ್ರಾ ಸೌಲಭ್ಯ' : 'Draw held every month'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14, color: '#27ae60' }}>
                    <span>{lang === 'kn' ? 'ವಿಜೇತರ ಸೌಲಭ್ಯ' : 'Draw Winner Benefit'}</span>
                    <span>{lang === 'kn' ? 'ತಕ್ಷಣ ಆಭರಣ + ಮುಂದಿನ ಕಂತು ಮನ್ನಾ' : 'Jewellery immediately + Future dues waived'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಚಿನ್ನದ ಪ್ರಮಾಣ (22K)' : 'Gold Quantity (22K)'}</span>
                    <strong>{currentAcc.totalReservedGrams || '0.0000'} g</strong>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fcfbf8', border: '1px solid #ebd9a8', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಮಾಸಿಕ ಕಂತು' : 'Monthly Instalment'}</span>
                    <strong>₹500 / {lang === 'kn' ? 'ತಿಂಗಳು (ಅಥವಾ ₹500ರ ಗುಣಕಗಳು)' : 'month (or multiples of ₹500)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಒಟ್ಟು ಅವಧಿ' : 'Total Duration'}</span>
                    <strong>12 {lang === 'kn' ? 'ತಿಂಗಳುಗಳು (12 ಕಂತುಗಳು)' : 'Months (12 Instalments)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14, color: '#27ae60' }}>
                    <span>{lang === 'kn' ? 'ಸ್ಥಿರ ಬೋನಸ್ ಲಾಭ' : 'Fixed Bonus Incentive'}</span>
                    <strong>+{money(currentAcc.rules.benefit || '50000')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0e6ce', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{lang === 'kn' ? 'ಚಿನ್ನದ ಪ್ರಮಾಣ (22K)' : 'Gold Quantity (22K)'}</span>
                    <strong>{currentAcc.totalReservedGrams || '0.0000'} g</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 2px', fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
                    <span>{lang === 'kn' ? 'ಮೆಚ್ಯೂರಿಟಿ ಒಟ್ಟು ಖರೀದಿ ಮೌಲ್ಯ' : 'Total Purchasing Value'}</span>
                    <span>{money(BigInt(currentAcc.scheduledTotal || '600000') + BigInt(currentAcc.rules.benefit || '50000'))}</span>
                  </div>
                </div>
              )}

              {/* Terms in Selected Language */}
              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
                  {lang === 'kn' ? 'ಸ್ಕೀಮ್ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು:' : 'Scheme Rules & Benefits:'}
                </p>
                <p>{lang === 'kn' ? currentAcc.rules.termsKn : currentAcc.rules.termsEn}</p>
                <p style={{ marginTop: 8, fontSize: 12 }}>
                  📅 <strong>{lang === 'kn' ? 'ನಿರೀಕ್ಷಿತ ಮುಕ್ತಾಯ ದಿನಾಂಕ:' : 'Expected Maturity Date:'}</strong> {currentAcc.maturity_date}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Instalment Tracker */}
          {activeTab === 'instalments' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'serif', fontSize: 18, color: 'var(--primary)' }}>
                  {t.instalmentTracker}
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {paidCount} / {totalCount} {lang === 'kn' ? 'ಪಾವತಿಸಲಾಗಿದೆ' : 'Paid'}
                </span>
              </div>

              {/* 12-Box Instalments Grid */}
              <div className="instalment-grid">
                {currentAcc.instalments.map((inst) => {
                  const isPaid = inst.status === 'Paid';
                  const isDue = inst.status === 'Due' || inst.status === 'Overdue';
                  const rateVal = currentAcc.locked_rate ? Number(currentAcc.locked_rate) : (currentAcc.todayRate ? Number(currentAcc.todayRate.paise_per_gram) : 1200000);
                  const instGrams = rateVal > 0 ? (Number(inst.amount) / rateVal).toFixed(4) : null;
                  return (
                    <div 
                      key={inst.id} 
                      className={`instalment-box ${isPaid ? 'paid' : isDue ? 'due' : 'upcoming'}`}
                    >
                      <div style={{ fontWeight: 700 }}>#{inst.seq}</div>
                      <div style={{ fontSize: 10, marginTop: 2 }}>{inst.due.slice(5)}</div>
                      <div style={{ fontSize: 11, marginTop: 4 }}>
                        {isPaid ? '✓ ' + money(inst.paid) : isDue ? 'Due' : money(inst.amount)}
                      </div>
                      {instGrams && (
                        <div style={{ fontSize: 9, opacity: 0.85, marginTop: 2 }}>
                          {instGrams}g
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detailed Instalments List */}
              <div style={{ marginTop: 16 }}>
                {currentAcc.instalments.map((inst) => {
                  const rateVal = currentAcc.locked_rate ? Number(currentAcc.locked_rate) : (currentAcc.todayRate ? Number(currentAcc.todayRate.paise_per_gram) : 1200000);
                  const instGrams = rateVal > 0 ? (Number(inst.amount) / rateVal).toFixed(4) : null;
                  return (
                  <div 
                    key={inst.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-light)',
                      fontSize: 13
                    }}
                  >
                    <div>
                      <strong>Instalment #{inst.seq}</strong>
                      <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>Due: {inst.due}</span>
                      {instGrams && <span style={{ color: '#84612a', marginLeft: 8, fontSize: 12 }}>⚖️ ~{instGrams}g</span>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${inst.status === 'Paid' ? 'badge-green' : inst.status === 'Due' || inst.status === 'Overdue' ? 'badge-gold' : 'badge-blue'}`}>
                        {inst.status === 'Paid' ? 'Paid ' + money(inst.paid) : inst.status}
                      </span>
                    </div>
                  </div>
                );})}
              </div>
            </div>
          )}

          {/* TAB 3: Payment Receipts */}
          {activeTab === 'receipts' && (
            <div className="card">
              <h3 style={{ fontFamily: 'serif', fontSize: 18, color: 'var(--primary)', marginBottom: 14 }}>
                {t.receipts}
              </h3>

              {currentAcc.payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                  <Receipt size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <p>{lang === 'kn' ? 'ಯಾವುದೇ ರಸೀದಿಗಳು ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ.' : 'No receipts issued yet.'}</p>
                </div>
              ) : (
                currentAcc.payments.map((p) => (
                  <div key={p.id} className="receipt-item">
                    <div>
                      <strong style={{ color: 'var(--primary)', fontSize: 15 }}>{p.receipt_number}</strong>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {p.payment_date} · {p.method} {p.reference ? `(${p.reference})` : ''}
                      </p>
                      {p.reserved_grams && Number(p.reserved_grams) > 0 ? (
                        <p style={{ fontSize: 12, color: '#84612a', fontWeight: 600, marginTop: 3 }}>
                          ⚖️ {p.reserved_grams} g gold {p.rate_paise_per_gram ? `@ ${money(p.rate_paise_per_gram)}/g (${p.purity || '22K'})` : ''}
                        </p>
                      ) : null}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: 16, color: '#27ae60' }}>{money(p.amount)}</strong>
                      <div style={{ marginTop: 6, display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <a 
                          href={`/api/v1/customer-portal/receipts/${p.receipt_id}?token=${encodeURIComponent(token)}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12,
                            padding: '4px 8px',
                            background: '#eef3eb',
                            border: '1px solid #c7d8c1',
                            borderRadius: 6,
                            color: 'var(--primary)',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          <Receipt size={13} /> {t.viewReceipt}
                        </a>
                        <a 
                          href={`/api/v1/customer-portal/receipts/${p.receipt_id}?token=${encodeURIComponent(token)}&download=1`} 
                          download={`Receipt-${(p.receipt_number || '').replace(/[^a-zA-Z0-9_-]/g, '_')}.html`} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12,
                            padding: '4px 8px',
                            background: 'var(--primary)',
                            borderRadius: 6,
                            color: '#fff',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          <Download size={13} /> {lang === 'kn' ? 'ಡೌನ್‌ಲೋಡ್' : 'Download'}
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Shop Assistance & WhatsApp Floating Link */}
      <div style={{ margin: '14px 16px', padding: 16, background: '#f5f7f2', borderRadius: 12, border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: 14, color: 'var(--primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <HelpCircle size={16} /> {t.contactShop}
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {shop.shopName} · {shop.address}
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <a 
            href={`https://wa.me/91${shop.whatsapp}?text=Namaskara,%20I%20have%20an%20enquiry%20regarding%20my%20scheme%20account%20${currentAcc?.number || ''}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: 13, textDecoration: 'none', flex: 1 }}
          >
            <MessageSquare size={16} color="#25D366" /> WhatsApp Shop
          </a>
          <a 
            href={`tel:${shop.phone}`}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: 13, textDecoration: 'none', flex: 1 }}
          >
            <Phone size={16} color="var(--primary)" /> Call Shop
          </a>
        </div>
      </div>

      {/* MODAL 1: Online Payment via Razorpay */}
      {showOnlineModal && (
        <div className="modal-overlay" onClick={() => !busy && setShowOnlineModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t.onlineTitle}</h3>
              <button className="close-btn" onClick={() => setShowOnlineModal(false)}>×</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div className="banner-notice info">
                <ShieldCheck size={18} />
                <span>
                  {lang === 'kn'
                    ? 'ಆನ್‌ಲೈನ್‌ ಪಾವತಿಯು ತಕ್ಷಣವೇ ಅಡ್ಮಿನ್‌ ಪ್ಯಾನೆಲ್‌ನಲ್ಲಿ ನವೀಕರಿಸಲ್ಪಡುತ್ತದೆ ಮತ್ತು ಅಧಿಕೃತ ರಸೀದಿಯನ್ನು ನೀಡುತ್ತದೆ.'
                    : 'Online payments update immediately in the shop admin panel with an instant official receipt.'}
                </span>
              </div>

              <div className="input-group">
                <label className="input-label">
                  {isScheme4 
                    ? (lang === 'kn' ? 'ಠೇವಣಿ ಮೊತ್ತ (₹, ಕನಿಷ್ಠ ₹5,000 - ಗರಿಷ್ಠ ಮಿತಿಯಿಲ್ಲ)' : 'Enter Deposit Amount (₹, Min ₹5,000 - No upper limit)') 
                    : (lang === 'kn' ? 'ಪಾವತಿ ಮೊತ್ತ (₹)' : 'Instalment Amount (₹)')}
                </label>
                <input 
                  type="number" 
                  className="text-input" 
                  value={manualAmount} 
                  onChange={(e) => setManualAmount(e.target.value)}
                  min={isScheme4 ? "5000" : "10"}
                  required
                />
                {isScheme4 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {[5000, 10000, 25000, 50000, 100000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setManualAmount(amt.toString())}
                        style={{
                          padding: '4px 10px',
                          fontSize: 12,
                          borderRadius: 16,
                          border: '1px solid #ebd9a8',
                          background: manualAmount === amt.toString() ? 'var(--primary)' : '#fff',
                          color: manualAmount === amt.toString() ? '#fff' : 'var(--primary)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ padding: 12, background: '#fcfbf8', borderRadius: 8, border: '1px solid #ebd9a8', marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Customer: <strong>{customer.name}</strong></p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Scheme Account: <strong>{currentAcc?.number}</strong></p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Supported: <strong>GPay, PhonePe, Paytm, UPI, Cards, NetBanking</strong></p>
              </div>

              <button 
                type="button" 
                className="btn btn-gold" 
                onClick={initiateOnlinePayment}
                disabled={busy}
              >
                {busy ? (lang === 'kn' ? 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ…' : 'Processing…') : `${lang === 'kn' ? '₹' + manualAmount + ' ಪಾವತಿಸಿ' : 'Pay ₹' + manualAmount + ' via Razorpay'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Report Shop Cash / Manual Payment */}
      {showManualModal && (
        <div className="modal-overlay" onClick={() => !busy && setShowManualModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t.manualTitle}</h3>
              <button className="close-btn" onClick={() => setShowManualModal(false)}>×</button>
            </div>

            <form onSubmit={submitManualProof}>
              <div className="banner-notice warning">
                <Clock size={18} />
                <span>
                  {lang === 'kn'
                    ? 'ನೀವು ಅಂಗಡಿಯಲ್ಲಿ ನಗದು ನೀಡಿದ್ದರೆ ಅಥವಾ ನೇರ ಯುಪಿಐ ಮಾಡಿದ್ದರೆ, ಅಂಗಡಿ ಮಾಲೀಕರು ಪರಿಶೀಲಿಸಿ ರಸೀದಿಯನ್ನು ಅನುಮೋದಿಸುತ್ತಾರೆ.'
                    : 'If you paid cash at the Kaup shop or transferred directly, the shop owner will verify and approve your official receipt.'}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="input-group">
                <label className="input-label">{lang === 'kn' ? 'ಪಾವತಿ ವಿಧಾನ' : 'How Did You Pay?'}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <button
                    type="button"
                    className={`btn ${manualMethod === 'Cash' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '10px 4px', fontSize: 13 }}
                    onClick={() => { setManualMethod('Cash'); setManualRef('Paid at shop counter'); }}
                  >
                    💵 Cash at Shop
                  </button>
                  <button
                    type="button"
                    className={`btn ${manualMethod === 'UPI' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '10px 4px', fontSize: 13 }}
                    onClick={() => { setManualMethod('UPI'); setManualRef('Shop UPI QR'); }}
                  >
                    📱 Direct UPI
                  </button>
                  <button
                    type="button"
                    className={`btn ${manualMethod === 'Bank' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '10px 4px', fontSize: 13 }}
                    onClick={() => { setManualMethod('Bank'); setManualRef('Shop Bank Transfer'); }}
                  >
                    🏦 Bank NEFT
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="input-group">
                <label className="input-label">
                  {isScheme4 
                    ? (lang === 'kn' ? 'ಠೇವಣಿ ಮೊತ್ತ (₹, ಕನಿಷ್ಠ ₹5,000 - ಗರಿಷ್ಠ ಮಿತಿಯಿಲ್ಲ)' : 'Enter Deposit Amount (₹, Min ₹5,000 - No upper limit)') 
                    : (lang === 'kn' ? 'ಪಾವತಿಸಿದ ಮೊತ್ತ (₹)' : 'Amount Paid (₹)')}
                </label>
                <input 
                  type="number" 
                  className="text-input" 
                  value={manualAmount} 
                  onChange={(e) => setManualAmount(e.target.value)}
                  min={isScheme4 ? "5000" : "1"}
                  required
                />
                {isScheme4 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {[5000, 10000, 25000, 50000, 100000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setManualAmount(amt.toString())}
                        style={{
                          padding: '4px 10px',
                          fontSize: 12,
                          borderRadius: 16,
                          border: '1px solid #ebd9a8',
                          background: manualAmount === amt.toString() ? 'var(--primary)' : '#fff',
                          color: manualAmount === amt.toString() ? '#fff' : 'var(--primary)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="input-group">
                <label className="input-label">{lang === 'kn' ? 'ಪಾವತಿ ದಿನಾಂಕ' : 'Payment Date'}</label>
                <input 
                  type="date" 
                  className="text-input" 
                  value={manualDate} 
                  onChange={(e) => setManualDate(e.target.value)}
                  required
                />
              </div>

              {/* Reference */}
              <div className="input-group">
                <label className="input-label">
                  {manualMethod === 'Cash' 
                    ? (lang === 'kn' ? 'ಉಲ್ಲೇಖ / ಕೌಂಟರ್ ವಿವರ (ಐಚ್ಛಿಕ)' : 'Reference / Counter Details (Optional)')
                    : (lang === 'kn' ? 'ಯುಪಿಐ / ಬ್ಯಾಂಕ್ UTR ರೆಫರೆನ್ಸ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ — ಕಡ್ಡಾಯವಲ್ಲ)' : 'UPI / Bank UTR Number (Optional — not compulsory)')}
                </label>
                <input 
                  type="text" 
                  className="text-input" 
                  value={manualRef} 
                  onChange={(e) => setManualRef(e.target.value)}
                  placeholder={manualMethod === 'Cash' ? 'e.g. Paid at shop counter' : (lang === 'kn' ? 'ಐಚ್ಛಿಕ — ಕಡ್ಡಾಯವಲ್ಲ' : 'Optional — not required')}
                />
              </div>

              {/* Note */}
              <div className="input-group">
                <label className="input-label">{lang === 'kn' ? 'ಟಿಪ್ಪಣಿ (ಐಚ್ಛಿಕ)' : 'Note for Shop Owner (Optional)'}</label>
                <input 
                  type="text" 
                  className="text-input" 
                  value={manualNote} 
                  onChange={(e) => setManualNote(e.target.value)}
                  placeholder="e.g. Paid cash to owner in the afternoon"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={busy} style={{ marginTop: 10 }}>
                {busy ? (lang === 'kn' ? 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ…' : 'Submitting…') : (lang === 'kn' ? 'ಮಾಲೀಕರ ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ' : 'Submit for Shop Verification')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
