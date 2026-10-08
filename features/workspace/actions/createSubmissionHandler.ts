import type { Dispatch, FormEvent, SetStateAction } from "react";
import { api } from "../../../lib/api";
import { day, paise } from "../../../lib/format";
import type { Row } from "../../../lib/types";
type Options = {
  busy: boolean;
  modal: Row | null;
  account: Row | null;
  setBusy: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
  setCustomer: Dispatch<SetStateAction<Row | null>>;
  setAccount: Dispatch<SetStateAction<Row | null>>;
  setPage: Dispatch<SetStateAction<string>>;
  setSuccess: Dispatch<SetStateAction<string>>;
  setModal: Dispatch<SetStateAction<Row | null>>;
  load: () => Promise<void>;
  write: (url: string, method: string, payload: unknown) => Promise<any>;
};
/** Coordinates confirmed writes, feedback and refresh for workspace forms. */
export function createSubmissionHandler({
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
}: Options) {
  return async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;
    setBusy(true);
    setError("");
    try {
      let result;
      const type = modal?.type;
      if (type === "customer") {
        let schemeAccount = undefined;
        if (f.versionId) {
          schemeAccount = {
            versionId: f.versionId,
            startDate: f.startDate || day(),
            ...(f.rateId ? { rateId: f.rateId } : {}),
            termsAccepted: f.termsAccepted === "on",
            ...(f.shares && f.shares.trim()
              ? { shares: parseInt(f.shares, 10) }
              : {}),
            ...(f.paymentAmount && f.paymentAmount.trim()
              ? { paymentAmount: paise(f.paymentAmount) }
              : {}),
          };
        }
        result = await write(
          "/customers" + (modal?.record ? "/" + modal.record.id : ""),
          modal?.record ? "PATCH" : "POST",
          {
            name: f.name,
            mobile: f.mobile,
            whatsapp: f.whatsapp || f.mobile,
            address: f.address,
            language: f.language,
            consent: f.consent === "on",
            consentMethod:
              f.consentMethod?.trim() || "In-store customer consent",
            notes: f.notes,
            ...(schemeAccount ? { schemeAccount } : {}),
          },
        );
        if (result.account) {
          setCustomer(result.customer);
          setAccount(result.account);
          setPage("Customers");
          setSuccess(
            "Registered customer " +
              result.customer.name +
              " and created account " +
              result.account.number +
              "." +
              (result.receipt
                ? " Receipt " + result.receipt.number + " issued."
                : ""),
          );
        } else if (modal?.record) {
          setCustomer(result.customer || result);
          setSuccess("Customer updated successfully.");
        } else {
          setSuccess("Customer saved successfully.");
        }
      }
      if (type === "deleteCustomer") {
        await api("/customers/" + modal!.record.id, "DELETE");
        setCustomer(null);
        setAccount(null);
        setSuccess("Customer deleted successfully.");
        setModal(null);
        await load();
        return;
      }
      if (type === "scheme")
        await write("/schemes", "POST", {
          name: f.name,
          description: f.description,
          reference: f.reference,
        });
      if (type === "enrol") {
        result = await write("/accounts", "POST", {
          customerId: f.customerId,
          versionId: f.versionId,
          startDate: f.startDate,
          ...(f.rateId ? { rateId: f.rateId } : {}),
          ...(f.shares && f.shares.trim()
            ? { shares: parseInt(f.shares, 10) }
            : {}),
          ...(f.paymentAmount && f.paymentAmount.trim()
            ? { paymentAmount: paise(f.paymentAmount) }
            : {}),
          termsAccepted: f.termsAccepted === "on",
        });
        setAccount(result);
        setPage("Customers");
      }
      if (type === "payment") {
        result = await write("/payments", "POST", {
          accountId: f.accountId,
          amount: paise(f.amount),
          paymentDate: f.paymentDate,
          method: f.method,
          reference: f.reference,
          notes: f.notes,
        });
        setAccount(result.account);
        setSuccess(
          "Payment saved. Receipt " +
            result.receipt.number +
            " is available in payment history.",
        );
      }
      if (type === "rate")
        await write("/rates", "POST", {
          purity: f.purity,
          paisePerGram: paise(f.amount),
          effectiveAt: new Date(f.effectiveAt).toISOString(),
          notes: f.notes || undefined,
        });
      if (type === "reverse")
        await write("/payments/" + modal!.record.id + "/reverse", "POST", {
          reason: f.reason,
        });
      if (type === "opening")
        await write("/accounts/" + account!.id + "/opening", "POST", {
          amount: paise(f.amount),
          effectiveDate: f.effectiveDate,
          note: f.note,
          ...(f.benefitEligibility
            ? { benefitEligible: f.benefitEligibility === "yes" }
            : {}),
        });
      if (type === "redeem")
        await write("/accounts/" + account!.id + "/redeem", "POST", {
          amount: paise(f.amount || "0"),
          weightMicrograms: f.weightMicrograms || "0",
          ...(f.rateId ? { rateId: f.rateId } : {}),
          billReference: f.billReference,
          note: f.note,
        });
      if (type === "staff")
        await write("/staff", "POST", {
          username: f.username,
          name: f.name,
          password: f.password,
          permissions: {
            customers: f.customers === "on",
            payments: f.payments === "on",
            inbox: f.inbox === "on",
          },
        });
      if (type === "staffEdit")
        await write("/staff/" + modal!.record.id, "PATCH", {
          active: f.active === "on",
          permissions: {
            customers: f.customers === "on",
            payments: f.payments === "on",
            inbox: f.inbox === "on",
          },
          ...(f.password ? { password: f.password } : {}),
        });
      if (type === "version") {
        const rules = {
          type: f.schemeType,
          amount: paise(f.amount),
          count: Number(f.count),
          durationMonths: Number(f.durationMonths),
          dueDay: Number(f.dueDay),
          firstDue: f.firstDue,
          maturity: f.maturity,
          partial: f.partial === "on",
          advance: f.advance === "on",
          benefit: paise(f.benefit),
          benefitLatePolicy: f.benefitLatePolicy,
          missed: "carry_forward",
          earlyClosure: "disabled",
          refund: "disabled",
          formula: f.formula,
          purity: f.purity || null,
          roundingMicrograms: f.roundingMicrograms,
          makingTerms: f.makingTerms,
          termsEn: f.termsEn,
          termsKn: f.termsKn,
          confirmation: f.confirmation === "on",
          decisionNote: f.decisionNote,
        };
        await write(
          "/schemes/" + modal!.record.id + "/versions",
          "POST",
          rules,
        );
      }
      if (type === "approveProof") {
        result = await write(
          "/payment-proofs/" + modal!.record.id + "/approve",
          "POST",
          {
            accountId: f.accountId,
            amount: paise(f.amount),
            paymentDate: f.paymentDate,
            method: f.method,
            reference: f.reference,
            note: f.note,
            bankVerified: f.bankVerified === "on",
          },
        );
        setSuccess(
          "Payment proof approved. Receipt " +
            (result?.receipt?.number || "") +
            " issued.",
        );
      }
      if (type === "rejectProof") {
        await write("/payment-proofs/" + modal!.record.id + "/reject", "POST", {
          reason: f.reason,
        });
        setSuccess("Payment proof rejected.");
      }
      setModal(null);
      if (!["payment", "approveProof", "rejectProof"].includes(type))
        setSuccess("Saved successfully.");
      await load();
    } catch (e: any) {
      setError(
        e.message ||
          "Connection interrupted. Retry the same entry to confirm its status.",
      );
    } finally {
      setBusy(false);
    }
  };
}
