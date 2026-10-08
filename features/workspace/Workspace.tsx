"use client";
import { api } from "../../lib/api";
import { AccountDetailsView } from "./views/AccountDetailsView";
import { AuditLogView } from "./views/AuditLogView";
import { ChangePasswordScreen } from "./auth/ChangePasswordScreen";
import { CustomerDetailsView } from "./views/CustomerDetailsView";
import { CustomersView } from "./views/CustomersView";
import { DashboardView } from "./views/DashboardView";
import { GoldRatesView } from "./views/GoldRatesView";
import { InboxView } from "./views/InboxView";
import { LoadingScreen } from "./auth/LoadingScreen";
import { LoginScreen } from "./auth/LoginScreen";
import { MessagesView } from "./views/MessagesView";
import { PaymentProofsView } from "./views/PaymentProofsView";
import { PaymentsView } from "./views/PaymentsView";
import { ReportsView } from "./views/ReportsView";
import { SchemesView } from "./views/SchemesView";
import { SettingsView } from "./views/SettingsView";
import { StaffView } from "./views/StaffView";
import { WhatsAppView } from "./views/WhatsAppView";
import { WorkspaceHeading } from "./components/WorkspaceHeading";
import { WorkspaceModal } from "./components/WorkspaceModal";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";
import { useWorkspace } from "./hooks/useWorkspace";
import { usePaymentAlerts } from "./hooks/usePaymentAlerts";
import { Bell } from "lucide-react";
export default function Workspace() {
  const {
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
  } = useWorkspace();
  const paymentAlerts = usePaymentAlerts(user?.id);
  if (checking) return <LoadingScreen />;
  if (!user)
    return (
      <LoginScreen
        setBusy={setBusy}
        setError={setError}
        setUser={setUser}
        error={error}
        busy={busy}
      />
    );
  if (user.mustChangePassword)
    return (
      <ChangePasswordScreen
        setBusy={setBusy}
        setError={setError}
        setUser={setUser}
        user={user}
        setSuccess={setSuccess}
        error={error}
        busy={busy}
      />
    );
  return (
    <div className="shell">
      <WorkspaceSidebar
        owner={owner}
        page={page}
        setPage={setPage}
        setCustomer={setCustomer}
        setAccount={setAccount}
        setSuccess={setSuccess}
        setError={setError}
        action={action}
        setUser={setUser}
        setData={setData}
      />
      <div className="workspace">
        <header className="topbar">
          <span>Devi Jewellers / {page}</span>
          <div className="avatar">
            <button
              className="button"
              onClick={() => void paymentAlerts.enable()}
              aria-label="Enable payment notification sound"
              title="Enable sound and browser notifications for new customer payments"
            >
              <Bell size={15} />
              {paymentAlerts.enabled ? "Payment alerts on" : "Enable payment alerts"}
            </button>
            <span>
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <b>{user.name?.slice(0, 2).toUpperCase()}</b>
            <button
              className="link"
              onClick={() =>
                action(async () => {
                  await api("/auth/logout", "POST");
                  setUser(null);
                })
              }
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="main">
          <WorkspaceHeading
            page={page}
            heading={heading}
            load={load}
            open={open}
            account={account}
            customer={customer}
            owner={owner}
          />
          {error && !modal && (
            <div role="alert" className="error">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="success">
              {success}
            </div>
          )}
          {loading && <div className="banner">Loading confirmed records…</div>}
          {typeof window !== "undefined" &&
            sessionStorage.getItem("devi_pending") && (
              <div className="banner">
                A submission is awaiting server confirmation.{" "}
                <button
                  className="button"
                  disabled={busy}
                  onClick={() =>
                    action(async () => {
                      const p = JSON.parse(
                        sessionStorage.getItem("devi_pending")!,
                      );
                      const r = JSON.parse(p.fingerprint);
                      await write(r.url, r.method, r.payload);
                      setSuccess("The server confirmed the saved record.");
                    })
                  }
                >
                  Retry pending submission
                </button>
              </div>
            )}
          {
            <DashboardView
              page={page}
              data={data}
              options={options}
              setModal={setModal}
              open={open}
              setPage={setPage}
            />
          }
          {
            <CustomersView
              page={page}
              customer={customer}
              account={account}
              load={load}
              search={search}
              setSearch={setSearch}
              data={data}
              selectCustomer={selectCustomer}
            />
          }
          {
            <CustomerDetailsView
              page={page}
              customer={customer}
              account={account}
              setCustomer={setCustomer}
              open={open}
              owner={owner}
              setModal={setModal}
              selectAccount={selectAccount}
            />
          }
          {
            <AccountDetailsView
              account={account}
              page={page}
              setAccount={setAccount}
              open={open}
              setModal={setModal}
              setError={setError}
              owner={owner}
              paymentColumns={paymentColumns}
            />
          }
          {<SchemesView page={page} data={data} owner={owner} open={open} />}
          {
            <PaymentsView
              page={page}
              data={data}
              paymentColumns={paymentColumns}
            />
          }
          {
            <PaymentProofsView
              page={page}
              data={data}
              owner={owner}
              open={open}
            />
          }
          {<GoldRatesView page={page} data={data} />}
          {
            <MessagesView
              page={page}
              data={data}
              owner={owner}
              busy={busy}
              action={action}
            />
          }
          {
            <WhatsAppView
              page={page}
              data={data}
              busy={busy}
              action={action}
              setSuccess={setSuccess}
            />
          }
          {
            <InboxView
              page={page}
              data={data}
              conversation={conversation}
              selectConversation={selectConversation}
              action={action}
              user={user}
              write={write}
              busy={busy}
            />
          }
          {
            <ReportsView
              page={page}
              report={report}
              setReport={setReport}
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
              data={data}
            />
          }
          {<SettingsView page={page} data={data} busy={busy} action={action} />}
          {<StaffView page={page} data={data} busy={busy} open={open} />}
          {<AuditLogView page={page} data={data} />}
        </main>
      </div>
      {
        <WorkspaceModal
          modal={modal}
          busy={busy}
          setModal={setModal}
          submit={submit}
          account={account}
          setSuccess={setSuccess}
          rates={rates}
          setError={setError}
          load={load}
          schemes={schemes}
          customers={customers}
          accounts={accounts}
          error={error}
        />
      }
    </div>
  );
}
