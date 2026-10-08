"use client";
import { ReactNode, useEffect, useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { api } from "../../../lib/api";
import { day, money } from "../../../lib/format";
import { createSubmissionHandler } from "../actions/createSubmissionHandler";
import type { Row } from "../../../lib/types";
import { usePendingSubmission } from "./usePendingSubmission";
export function useWorkspace() {
  const [user, setUser] = useState<Row | null>(null),
    [checking, setChecking] = useState(true),
    [page, setPage] = useState("Dashboard"),
    [loaded, setLoaded] = useState<any>(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [modal, setModal] = useState<Row | null>(null),
    [busy, setBusy] = useState(false),
    [search, setSearch] = useState(""),
    [customer, setCustomer] = useState<Row | null>(null),
    [account, setAccount] = useState<Row | null>(null),
    [schemes, setSchemes] = useState<Row[]>([]),
    [customers, setCustomers] = useState<Row[]>([]),
    [accounts, setAccounts] = useState<Row[]>([]),
    [rates, setRates] = useState<Row[]>([]),
    [conversation, setConversation] = useState<Row | null>(null),
    [report, setReport] = useState("daily"),
    [from, setFrom] = useState(day().slice(0, 7) + "-01"),
    [to, setTo] = useState(day());
  const data = loaded?.page === page ? loaded.value : null;
  function setData(value: any) {
    setLoaded(value === null ? null : { page, value });
  }
  const { pending, write } = usePendingSubmission();
  useEffect(() => {
    api("/auth/me")
      .then(setUser)
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (user?.role === "owner") {
      api("/rates")
        .then((ratesList: Row[]) => {
          const todayDate = day();
          const hasToday = ratesList.some((r: Row) => {
            const d = new Intl.DateTimeFormat("en-CA", {
              timeZone: "Asia/Kolkata",
            }).format(new Date(r.effective_at));
            return d === todayDate;
          });
          if (!hasToday) {
            setModal({ type: "rate", dailyPopup: true });
          }
        })
        .catch(() => {});
    }
  }, [user]);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const urls: Record<string, string> = {
        Dashboard: "/dashboard",
        Customers: "/customers?q=" + encodeURIComponent(search),
        Schemes: "/schemes",
        Payments: "/payments",
        "Payment proofs": "/payment-proofs",
        "Gold rates": "/rates",
        WhatsApp: "/whatsapp/status",
        "WhatsApp inbox": "/inbox",
        Messages: "/messages",
        Reports: `/reports/${report}?from=${from}&to=${to}`,
        Settings: "/settings",
        Staff: "/staff",
        "Audit log": "/audit",
      };
      setData(await api(urls[page]));
      if (page === "Customers" && customer)
        setCustomer(await api("/customers/" + customer.id));
      if (account) setAccount(await api("/accounts/" + account.id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (user) {
      setData(null);
      void load();
    }
  }, [user, page, report, from, to]);
  useEffect(() => {
    if (page !== "WhatsApp" || data?.status === "connected") return;
    const timer = setInterval(() => {
      api("/whatsapp/status")
        .then(setData)
        .catch(() => {});
    }, 3000);
    return () => clearInterval(timer);
  }, [page, data?.status]);
  async function options() {
    const [s, c, a, r] = await Promise.all([
      api("/schemes"),
      api("/customers"),
      api("/accounts"),
      api("/rates"),
    ]);
    setSchemes(s);
    setCustomers(c);
    setAccounts(a);
    setRates(r);
  }
  async function open(type: string, extra: Row = {}) {
    setError("");
    setSuccess("");
    pending.current = null;
    try {
      if (
        [
          "payment",
          "enrol",
          "redeem",
          "version",
          "customer",
          "approveProof",
        ].includes(type)
      )
        await options();
      setModal({ type, ...extra });
    } catch (e: any) {
      setError(e.message);
    }
  }

  const submit = createSubmissionHandler({
    busy,
    modal,
    account,
    setBusy,
    setError,
    setCustomer,
    setAccount,
    setPage,
    setSuccess,
    setModal,
    load,
    write,
  });
  async function selectCustomer(c: Row) {
    setLoading(true);
    try {
      setCustomer(await api("/customers/" + c.id));
      setAccount(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function selectAccount(a: Row) {
    setLoading(true);
    try {
      setAccount(await api("/accounts/" + a.id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function selectConversation(c: Row) {
    try {
      setConversation(await api("/inbox/" + c.id));
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function action(fn: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await fn();
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const owner = user?.role === "owner";
  const heading = account
    ? "Scheme account"
    : customer && page === "Customers"
      ? customer.name
      : page;
  const paymentColumns: [string, (r: Row) => ReactNode][] = [
    [
      "Receipt",
      (r) => (
        <>
          <a
            className="receipt"
            href={"/api/v1/receipts/" + r.receipt_id}
            target="_blank"
          >
            {r.receipt_number}
          </a>
          <span className="row-detail">{r.payment_date}</span>
        </>
      ),
    ],
    [
      "Customer / account",
      (r) => (
        <>
          {r.customer_name || account?.customer_name}
          <span className="row-detail">
            {r.account_number || account?.number}
          </span>
        </>
      ),
    ],
    [
      "Amount",
      (r) => (
        <>
          <strong>{money(r.amount)}</strong>
          {r.reserved_grams ? (
            <span className="row-detail">
              {r.reserved_grams}g @ {money(r.rate_paise_per_gram)}/g ({r.purity}
              )
            </span>
          ) : null}
        </>
      ),
    ],
    [
      "Method",
      (r) => (
        <>
          {r.method}
          {r.method === "Razorpay" ? (
            <span
              className="pill"
              style={{
                marginLeft: 6,
                background: "#1d4ed8",
                color: "#fff",
                fontSize: 10,
              }}
            >
              Online
            </span>
          ) : null}
        </>
      ),
    ],
    [
      "Status",
      (r) => (
        <Badge
          value={
            r.reversal_reason
              ? "Reversed"
              : r.gold_allocation_status === "pending_rate"
                ? "Rate Pending"
                : "Confirmed"
          }
        />
      ),
    ],
    [
      "Actions",
      (r) =>
        owner &&
        !r.reversal_reason && (
          <button
            className="link"
            onClick={() => open("reverse", { record: r })}
          >
            Reverse
          </button>
        ),
    ],
  ];
  return {
    checking,
    user,
    setBusy,
    setError,
    setUser,
    error,
    busy,
    setSuccess,
    owner,
    page,
    setPage,
    setCustomer,
    setAccount,
    action,
    setData,
    heading,
    load,
    open,
    account,
    customer,
    modal,
    success,
    loading,
    write,
    data,
    options,
    setModal,
    search,
    setSearch,
    selectCustomer,
    selectAccount,
    paymentColumns,
    conversation,
    selectConversation,
    report,
    setReport,
    from,
    setFrom,
    to,
    setTo,
    submit,
    rates,
    schemes,
    customers,
    accounts,
  };
}
export type WorkspaceModel = ReturnType<typeof useWorkspace>;
