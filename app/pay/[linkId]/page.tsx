'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Lock } from 'lucide-react';

type PayData = {
  linkId: string;
  accountNumber: string;
  schemeName: string;
  customerName: string;
  amountPaise: string;
  currency: string;
  providerOrderId: string | null;
  razorpayKeyId: string;
  adapter: string;
  status?: string;
};

const money = (paiseStr: string) => {
  const n = BigInt(paiseStr || '0');
  return '₹' + (n / 100n).toLocaleString('en-IN') + '.' + String(n % 100n).padStart(2, '0');
};

export default function PayPage() {
  const params = useParams();
  const linkId = params?.linkId as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PayData | null>(null);
  const [error, setError] = useState('');
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    if (!linkId) return;
    fetch(`/api/v1/pay/${linkId}`)
      .then(async res => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Payment link not found');
        setData(body);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [linkId]);

  // Load Razorpay checkout script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('razorpay-checkout-script')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handleLiveRazorpay() {
    if (!data) return;
    if (!(window as any).Razorpay) {
      setError('Razorpay SDK is loading. Please try again in a moment or use test simulator.');
      return;
    }

    setPaying(true);
    setError('');

    try {
      const options = {
        key: data.razorpayKeyId,
        amount: data.amountPaise,
        currency: data.currency || 'INR',
        name: 'Devi Jewellers, Kaup',
        description: `${data.schemeName} (${data.accountNumber})`,
        order_id: data.providerOrderId || undefined,
        modal: {
          ondismiss: function () {
            setPaying(false);
            setError('Payment cancelled: Razorpay modal closed by user.');
          }
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                linkId: data.linkId
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed');
            }
            setPaid(true);
            setPaymentResult({
              providerPaymentId: response.razorpay_payment_id,
              providerOrderId: response.razorpay_order_id,
              receipt: verifyData.receipt
            });
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
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
          color: '#133b32',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description || 'Payment failed. Please retry.');
        setPaying(false);
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message || 'Could not initiate Razorpay checkout');
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ee', fontFamily: 'Arial, sans-serif' }}>
        <p style={{ color: '#737970' }}>Loading secure payment details…</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ee', fontFamily: 'Arial, sans-serif', padding: 20 }}>
        <div style={{ background: '#fff', padding: 36, borderRadius: 8, maxWidth: 440, width: '100%', textAlign: 'center', border: '1px solid #e4e5dd', boxShadow: '0 4px 20px #0001' }}>
          <AlertCircle size={44} color="#9a3324" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: '#9a3324', marginBottom: 12 }}>Unable to Open Payment</h2>
          <p style={{ color: '#737970', fontSize: 14, lineHeight: 1.6 }}>{error}</p>
          <p style={{ fontSize: 13, color: '#999', marginTop: 24 }}>If you already paid, your WhatsApp receipt will be sent shortly.</p>
        </div>
      </div>
    );
  }

  if (paid) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ee', fontFamily: 'Arial, sans-serif', padding: 20 }}>
        <div style={{ background: '#fff', padding: 40, borderRadius: 10, maxWidth: 480, width: '100%', textAlign: 'center', border: '1px solid #e4e5dd', boxShadow: '0 10px 30px #0001' }}>
          <CheckCircle2 size={56} color="#215d39" style={{ margin: '0 auto 18px' }} />
          <h1 style={{ color: '#133b32', fontSize: 26, margin: '0 0 10px' }}>Payment Confirmed</h1>
          <p style={{ color: '#555', fontSize: 15, margin: '0 0 20px' }}>
            Thank you! Your payment of <strong>{money(data!.amountPaise)}</strong> has been credited to your scheme account.
          </p>
          <div style={{ background: '#f8f9f5', border: '1px solid #e4e5dd', borderRadius: 6, padding: 18, textAlign: 'left', fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
            <div><strong>Customer:</strong> {data?.customerName}</div>
            <div><strong>Account:</strong> {data?.accountNumber}</div>
            <div><strong>Scheme:</strong> {data?.schemeName}</div>
            {paymentResult?.providerPaymentId && <div><strong>Reference:</strong> {paymentResult.providerPaymentId}</div>}
            {paymentResult?.receipt && <div><strong>Receipt Number:</strong> {paymentResult.receipt.number}</div>}
          </div>
          <p style={{ fontSize: 13, color: '#737970', lineHeight: 1.5 }}>
            A formal WhatsApp receipt and updated balance have been dispatched to your mobile number.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4ee', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 10, border: '1px solid #e4e5dd', overflow: 'hidden', boxShadow: '0 8px 30px #0001' }}>
        
        {/* Header */}
        <div style={{ background: '#133b32', color: '#fff', padding: '24px 28px', textAlign: 'center' }}>
          <div style={{ color: '#e8d39f', fontSize: 20, fontFamily: 'Georgia, serif', fontWeight: 600 }}>Devi Jewellers</div>
          <div style={{ color: '#9fb8aa', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>Main Road, Kaup · Scheme Payment</div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: '#737970', textTransform: 'uppercase', letterSpacing: 1 }}>Amount Due</span>
            <div style={{ fontSize: 36, fontFamily: 'Georgia, serif', color: '#133b32', fontWeight: 700, margin: '6px 0' }}>
              {money(data!.amountPaise)}
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#edf6ef', color: '#215d39', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              <Lock size={12} /> Secure Checkout
            </span>
          </div>

          <div style={{ background: '#f8f9f5', border: '1px solid #eef0e9', borderRadius: 8, padding: 16, fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#737970' }}>Customer:</span>
              <strong>{data?.customerName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#737970' }}>Account:</span>
              <strong>{data?.accountNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#737970' }}>Scheme:</span>
              <strong style={{ textAlign: 'right', maxWidth: 220 }}>{data?.schemeName}</strong>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fff0eb', border: '1px solid #ecc7bc', color: '#9a3324', padding: 12, borderRadius: 6, fontSize: 13, marginBottom: 18 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={handleLiveRazorpay}
              disabled={paying}
              style={{
                width: '100%',
                background: '#133b32',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '14px',
                fontSize: 15,
                fontWeight: 600,
                cursor: paying ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {paying ? 'Processing…' : <>Pay with Razorpay <ArrowRight size={16} /></>}
            </button>


          </div>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#737970', lineHeight: 1.5 }}>
            <ShieldCheck size={16} color="#737970" style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Official payment portal of Devi Jewellers, Kaup.
            <br />
            Payments are verified in real time and confirmed on WhatsApp.
          </div>
        </div>
      </div>
    </div>
  );
}
