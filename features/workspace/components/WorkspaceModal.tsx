"use client";
import { Modal } from "../../../components/ui/Modal";
import { ApproveProofFields } from "../forms/ApproveProofFields";
import { CustomerFields } from "../forms/CustomerFields";
import { DeleteCustomerFields } from "../forms/DeleteCustomerFields";
import { EnrolFields } from "../forms/EnrolFields";
import { ExceptionsFields } from "../forms/ExceptionsFields";
import { OpeningFields } from "../forms/OpeningFields";
import { PayLinkFields } from "../forms/PayLinkFields";
import { PaymentFields } from "../forms/PaymentFields";
import { RateFields } from "../forms/RateFields";
import { RedeemFields } from "../forms/RedeemFields";
import { RejectProofFields } from "../forms/RejectProofFields";
import { ReverseFields } from "../forms/ReverseFields";
import { SchemeFields } from "../forms/SchemeFields";
import { StaffEditFields } from "../forms/StaffEditFields";
import { StaffFields } from "../forms/StaffFields";
import { VersionFields } from "../forms/VersionFields";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  | "modal"
  | "busy"
  | "setModal"
  | "submit"
  | "account"
  | "setSuccess"
  | "rates"
  | "setError"
  | "load"
  | "schemes"
  | "customers"
  | "accounts"
  | "error"
>;
export function WorkspaceModal({
  modal,
  busy,
  setModal,
  submit,
  account,
  setSuccess,
  rates,
  setError,
  load,
  schemes,
  customers,
  accounts,
  error,
}: Props) {
  return (
    <>
      {modal && (
        <Modal
          title={
            (
              {
                customer: modal.record ? "Edit customer" : "Register customer",
                scheme: "Create scheme draft",
                enrol: "Enrol customer",
                payment: "Record verified payment",
                rate: "Publish gold rate",
                reverse: "Reverse payment",
                opening: "Approve opening balance",
                redeem: "Redeem scheme credit",
                staff: "Add staff member",
                staffEdit: "Manage staff access",
                version: "Confirm scheme calculation rules",
                payLink: "Instalment Pay Link",
                exceptions: "Reconciliation Exceptions",
                approveProof: "Approve payment proof",
                rejectProof: "Reject payment proof",
                deleteCustomer: "Delete Customer",
              } as Record<string, string>
            )[modal.type] || modal.type
          }
          onClose={() => !busy && setModal(null)}
          wide={
            modal.type === "version" ||
            modal.type === "customer" ||
            modal.type === "exceptions" ||
            modal.type === "approveProof"
          }
        >
          <form
            onSubmit={
              modal.type === "payLink" || modal.type === "exceptions"
                ? (e) => e.preventDefault()
                : submit
            }
          >
            <div className="form-grid">
              {
                <PayLinkFields
                  modal={modal}
                  account={account}
                  setSuccess={setSuccess}
                />
              }
              {
                <ExceptionsFields
                  modal={modal}
                  rates={rates}
                  setError={setError}
                  setSuccess={setSuccess}
                  setModal={setModal}
                  load={load}
                />
              }
              {<CustomerFields modal={modal} schemes={schemes} rates={rates} />}
              {<SchemeFields modal={modal} />}
              {
                <EnrolFields
                  modal={modal}
                  customers={customers}
                  schemes={schemes}
                  rates={rates}
                />
              }
              {<PaymentFields modal={modal} accounts={accounts} />}
              {<DeleteCustomerFields modal={modal} setModal={setModal} />}
              {<RateFields modal={modal} />}
              {<ReverseFields modal={modal} />}
              {<OpeningFields modal={modal} />}
              {<RedeemFields modal={modal} account={account} rates={rates} />}
              {<StaffFields modal={modal} />}
              {<StaffEditFields modal={modal} />}
              {<VersionFields modal={modal} />}
              {<ApproveProofFields modal={modal} accounts={accounts} />}
              {<RejectProofFields modal={modal} />}
            </div>
            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
            <footer>
              <button
                type="button"
                className="button"
                onClick={() => setModal(null)}
                disabled={busy}
              >
                {["payLink", "exceptions"].includes(modal.type)
                  ? "Close"
                  : "Cancel"}
              </button>
              {!["payLink", "exceptions"].includes(modal.type) && (
                <button className="button primary" disabled={busy}>
                  {busy
                    ? "Saving…"
                    : modal.type === "version"
                      ? "Approve version"
                      : modal.type === "payment"
                        ? "Confirm payment"
                        : modal.type === "approveProof"
                          ? "Confirm approval"
                          : modal.type === "rejectProof"
                            ? "Confirm rejection"
                            : "Save"}
                </button>
              )}
            </footer>
          </form>
        </Modal>
      )}
    </>
  );
}
