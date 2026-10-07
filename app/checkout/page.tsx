'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, CreditCard, Lock, Sparkles, RotateCcw } from 'lucide-react';

export default function RazorpayCheckoutPage() {
  const [amountRupees, setAmountRupees] = useState<string>('500');
  const [customerName, setCustomerName] = useState<string>('Sumith');
  const [customerPhone, setCustomerPhone] = useState<string>('7892490633');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [verifiedPayment, setVerifiedPayment] = useState<any>(null);
  const [lastOrder, setLastOrder] = useState<any>(null);

  // Ensure Razorpay script is loaded
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('razorpay-checkout-script')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handleCheckout() {
    setError('');
    setStatusMessage('');
    setVerifiedPayment(null);
    setLastOrder(null);

    const rupees = parseFloat(amountRupees);
    if (isNaN(rupees) || rupees <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    const amountPaise = Math.round(rupees * 100);
    if (amountPaise < 100) {
      setError('Minimum amount must be at least 100 paise (₹1.00).');
      return;
    }

    if (!(window as any).Razorpay) {
      setError('Razorpay SDK is still loading. Please wait 2 seconds and try again.');
      return;
    }

    setLoading(true);
    setStatusMessage('Step 1: Creating order on backend (POST /api/create-order)…');

    try {
      // STEP 1: Call Backend to Create Order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customerName,
            customerPhone,
            purpose: 'Devi Jewellers Gold Savings Scheme'
          }
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create Razorpay order');
      }

      setLastOrder(orderData);
      setStatusMessage(`Step 2: Order created (${orderData.order_id}). Launching Razorpay Standard Checkout…`);

      // STEP 2: Configure & Open Razorpay Standard Checkout Modal
      const keyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        orderData.key_id ||
        'rzp_test_TkpsygIB3STtU7';

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Devi Jewellers',
        description: 'Gold Savings Scheme Instalment',
        order_id: orderData.order_id,
        prefill: {
          name: customerName,
          contact: customerPhone
        },
        theme: {
          color: '#193c34'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setStatusMessage('');
            setError('Payment cancelled: Razorpay modal was closed by user.');
          }
        },
        handler: async function (response: any) {
          // Received razorpay_payment_id, razorpay_order_id, razorpay_signature
          setStatusMessage('Step 3: Verifying HMAC-SHA256 signature on backend (POST /api/verify-payment)…');

          try {
            // STEP 3: Verify Signature on Backend
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            setVerifiedPayment({
              ...response,
              ...verifyData,
              amount: orderData.amount,
              currency: orderData.currency
            });
            setStatusMessage('');
          } catch (err: any) {
            setError(err.message || 'Signature verification error');
          } finally {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', function (resp: any) {
        setLoading(false);
        setStatusMessage('');
        setError(`Payment failed: ${resp.error?.description || resp.error?.reason || 'Transaction could not be completed.'}`);
      });

      rzp.open();
    } catch (err: any) {
      setLoading(false);
      setStatusMessage('');
      setError(err.message || 'Error initiating Razorpay checkout.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fcfbf7', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 12, border: '1px solid #e9e5d9', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: '#193c34', color: '#fff', padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#d5b058', fontWeight: 700, fontSize: 19, letterSpacing: '0.5px' }}>
            <Sparkles size={20} /> Devi Jewellers · Kaup
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#b9cfc7', letterSpacing: '0.3px' }}>
            Razorpay Standard Web Checkout
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 20px' }}>
          
          {/* Status Message */}
          {statusMessage && (
            <div style={{ background: '#eaf4ee', border: '1px solid #c2e2cc', color: '#165a34', padding: '12px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
              ⏳ {statusMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ background: '#fdf2f0', border: '1px solid #f8cbc5', color: '#a32b1d', padding: '12px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>{error}</div>
            </div>
          )}

          {/* Success Box */}
          {verifiedPayment && (
            <div style={{ background: '#f3f9f4', border: '2px solid #2e7d32', padding: '20px 18px', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1b5e20', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
                <CheckCircle2 size={24} color="#2e7d32" />
                Payment Verified Successfully!
              </div>
              <div style={{ fontSize: 13, color: '#333', lineHeight: 1.8, background: '#fff', padding: '12px 14px', borderRadius: 6, border: '1px solid #d7e8db' }}>
                <div><strong>Amount:</strong> ₹{(verifiedPayment.amount / 100).toFixed(2)} {verifiedPayment.currency}</div>
                <div><strong>Payment ID:</strong> <code style={{ color: '#193c34', fontWeight: 600 }}>{verifiedPayment.razorpay_payment_id}</code></div>
                <div><strong>Order ID:</strong> <code style={{ color: '#193c34', fontWeight: 600 }}>{verifiedPayment.razorpay_order_id}</code></div>
                <div><strong>Signature:</strong> <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓ Verified (HMAC-SHA256 Match)</span></div>
                {verifiedPayment.receipt && <div><strong>Receipt:</strong> {verifiedPayment.receipt}</div>}
              </div>
              <button
                onClick={() => { setVerifiedPayment(null); setError(''); }}
                style={{ marginTop: 12, width: '100%', background: '#fff', border: '1px solid #2e7d32', color: '#2e7d32', padding: '8px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <RotateCcw size={14} /> Make Another Test Payment
              </button>
            </div>
          )}

          {/* Checkout Form */}
          {!verifiedPayment && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.5px' }}>
                  Amount to Pay (INR)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: 12, fontSize: 16, fontWeight: 700, color: '#193c34' }}>₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amountRupees}
                    onChange={(e) => setAmountRupees(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px 11px 32px', fontSize: 16, fontWeight: 700, borderRadius: 8, border: '1.5px solid #d5b058', outline: 'none', color: '#193c34' }}
                    placeholder="500"
                  />
                </div>
                <div style={{ fontSize: 11, color: '#777', marginTop: 4 }}>
                  Minimum amount: ₹1.00 (100 paise)
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.5px' }}>
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', fontSize: 14, borderRadius: 8, border: '1px solid #ccc', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.5px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', fontSize: 14, borderRadius: 8, border: '1px solid #ccc', outline: 'none' }}
                />
              </div>

              {/* Pay Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#888' : '#193c34',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(25, 60, 52, 0.25)',
                  transition: 'background 0.2s'
                }}
              >
                <CreditCard size={18} />
                {loading ? 'Processing…' : `Pay ₹${amountRupees || '0'} with Razorpay`}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          )}

          {/* Trust Banner */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#777', borderTop: '1px solid #eee', paddingTop: 16 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#193c34', fontWeight: 600, marginBottom: 4 }}>
              <Lock size={13} /> 256-Bit SSL Encrypted Razorpay Checkout
            </div>
            <div>Supports UPI (GPay, PhonePe, Paytm), Cards & NetBanking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
