export type Customer = {
  id: string;
  number: string;
  name: string;
  mobile: string;
  whatsapp: string;
  language: string;
  address: string;
};
export type Instalment = {
  id: string;
  seq: number;
  due: string;
  amount: string;
  paid: string;
  status: "Paid" | "Due" | "Overdue" | "Partially paid" | "Future";
};
export type PaymentReceipt = {
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
export type PaymentProof = {
  id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  review_note?: string;
  receipt_number?: string;
};
export type Account = {
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
  todayRate?: {
    id: string;
    purity: string;
    paise_per_gram: string;
    effective_at: string;
    notes?: string;
  } | null;
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
export type ShopInfo = {
  shopName: string;
  address: string;
  phone: string;
  whatsapp: string;
};
