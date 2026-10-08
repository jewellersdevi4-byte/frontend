"use client";
import { Plus, RefreshCw } from "lucide-react";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "page" | "heading" | "load" | "open" | "account" | "customer" | "owner"
>;
export function WorkspaceHeading({
  page,
  heading,
  load,
  open,
  account,
  customer,
  owner,
}: Props) {
  return (
    <div className="heading">
      <div>
        <div className="eyebrow">
          {page === "Dashboard"
            ? "YOUR SHOP, AT A GLANCE"
            : "DEVI JEWELLERS · KAUP"}
        </div>
        <h1>{heading}</h1>
        <p>
          {page === "Dashboard"
            ? "A clear view of your collections and customer commitments."
            : page === "Customers"
              ? "Every customer. Every instalment. One clear record."
              : page === "Schemes"
                ? "Confirmed terms, preserved for every customer."
                : page === "WhatsApp"
                  ? "Scan QR code to connect shop phone for automated customer reminders and owner alerts."
                  : "Manage your shop with confidence."}
        </p>
      </div>
      <div className="actions">
        <button className="button" onClick={load} aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
        {["Dashboard", "Payments"].includes(page) && (
          <button className="button primary" onClick={() => open("payment")}>
            <Plus size={16} />
            Record payment
          </button>
        )}
        {page === "Customers" && !account && (
          <button
            className="button primary"
            onClick={() =>
              open(customer ? "enrol" : "customer", {
                customerId: customer?.id,
              })
            }
          >
            <Plus size={16} />
            {customer ? "Enrol in scheme" : "Add customer"}
          </button>
        )}
        {page === "Schemes" && owner && (
          <button className="button primary" onClick={() => open("scheme")}>
            <Plus size={16} />
            New scheme
          </button>
        )}
        {page === "Gold rates" && owner && (
          <button className="button primary" onClick={() => open("rate")}>
            <Plus size={16} />
            Update rate
          </button>
        )}
        {page === "Staff" && owner && (
          <button className="button primary" onClick={() => open("staff")}>
            <Plus size={16} />
            Add staff
          </button>
        )}
      </div>
    </div>
  );
}
