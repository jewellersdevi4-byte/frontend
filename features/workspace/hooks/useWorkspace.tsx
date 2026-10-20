"use client";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { api } from "../../../lib/api";
import { day, money } from "../../../lib/format";
import { createSubmissionHandler } from "../actions/createSubmissionHandler";
import type { Row } from "../../../lib/types";
import { usePendingSubmission } from "./usePendingSubmission";
import { nav } from "../navigation";
export function useWorkspace() {
  const [user, setUser] = useState<Row | null>(null),
    [checking, setChecking] = useState(true),
    [page, setPageState] = useState("Dashboard"),
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
  const pageRef = useRef(page);
  pageRef.current = page;
  const setPage: Dispatch<SetStateAction<string>> = (next) => {
    const value = typeof next === "function" ? next(pageRef.current) : next;
    pageRef.current = value;
    setPageState(value);
    if (user && user.role !== "platform_admin") {
      try { localStorage.setItem(`devi_workspace_page_${user.id}`, value); } catch {}
    }
  };
  const request = useRef<AbortController | null>(null);
  const detailRequest = useRef<AbortController | null>(null);
  const activeView = useRef("");
  const viewKey = `${user?.id || ""}:${page}:${report}:${from}:${to}`;
  activeView.current = viewKey;
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
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const currentView = viewKey;
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
      const [value, nextCustomer, nextAccount] = await Promise.all([
        api(urls[page], "GET", undefined, undefined, controller.signal),
        page === "Customers" && customer ? api("/customers/" + customer.id, "GET", undefined, undefined, controller.signal) : null,
        account ? api("/accounts/" + account.id, "GET", undefined, undefined, controller.signal) : null,
      ]);
      if (controller.signal.aborted || activeView.current !== currentView) return;
      setData(value);
      if (nextCustomer) setCustomer(nextCustomer);
      if (nextAccount) setAccount(nextAccount);
    } catch (e: any) {
      if (!controller.signal.aborted && activeView.current === currentView) setError(e.message);
    } finally {
      if (!controller.signal.aborted && activeView.current === currentView) setLoading(false);
    }
  }
  useEffect(() => {
    if (user && user.role !== "platform_admin") {
      const allowedPages = nav
        .filter(([name]) => user.role === "owner" || !["WhatsApp", "Settings", "Staff", "Audit log"].includes(name))
        .map(([name]) => name as string);
      let savedPage = "";
      try { savedPage = localStorage.getItem(`devi_workspace_page_${user.id}`) || ""; } catch {}
      if (allowedPages.includes(savedPage) && savedPage !== page) {
        setPage(savedPage);
        return;
      }
      setData(null);
      void load();
    }
    return () => { request.current?.abort(); detailRequest.current?.abort(); };
  }, [user, page, report, from, to]);
  useEffect(() => {
    if (!user || page !== "WhatsApp") return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      if (controller.signal.aborted) return;
      if (document.visibilityState === "visible") {
        try {
          const value = await api("/whatsapp/status", "GET", undefined, undefined, controller.signal);
          if (!controller.signal.aborted) setData(value);
        } catch { /* Keep the last known state during transient outages. */ }
      }
      if (!controller.signal.aborted) timer = setTimeout(poll, 3000);
    }
    timer = setTimeout(poll, 3000);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [user, page]);
  async function options(type?: string) {
    const needs = (types: string[]) => !type || types.includes(type);
    const [s, c, a, r] = await Promise.all([
      needs(["customer", "enrol"]) ? api("/schemes") : null,
      needs(["enrol"]) ? api("/customers") : null,
      needs(["payment", "approveProof"]) ? api("/accounts") : null,
      needs(["customer", "enrol", "redeem"]) ? api("/rates") : null,
    ]);
    if (s) setSchemes(s);
    if (c) setCustomers(c);
    if (a) setAccounts(a);
    if (r) setRates(r);
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
        await options(type);
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
  async function selectDetail(kind: "customers" | "accounts", id: string) {
    detailRequest.current?.abort();
    request.current?.abort();
    const controller = new AbortController();
    detailRequest.current = controller;
    const currentView = viewKey;
    setLoading(true);
    setError("");
    try {
      const value = await api(`/${kind}/${id}`, "GET", undefined, undefined, controller.signal);
      if (controller.signal.aborted || activeView.current !== currentView) return;
      if (kind === "customers") { setCustomer(value); setAccount(null); }
      else setAccount(value);
    } catch (e: any) {
      if (!controller.signal.aborted && activeView.current === currentView) setError(e.message);
    } finally {
      if (!controller.signal.aborted && activeView.current === currentView) setLoading(false);
    }
  }
  async function selectCustomer(c: Row) { await selectDetail("customers", c.id); }
  async function selectAccount(a: Row) { await selectDetail("accounts", a.id); }
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
