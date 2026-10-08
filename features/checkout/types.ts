export type PayData = {
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
