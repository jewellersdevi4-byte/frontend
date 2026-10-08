"use client";
import { Search } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Table } from "../../../components/ui/Table";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  | "page"
  | "customer"
  | "account"
  | "load"
  | "search"
  | "setSearch"
  | "data"
  | "selectCustomer"
>;
export function CustomersView({
  page,
  customer,
  account,
  load,
  search,
  setSearch,
  data,
  selectCustomer,
}: Props) {
  return (
    <>
      {page === "Customers" && !customer && !account && (
        <section className="card">
          <form
            className="toolbar"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
          >
            <input
              aria-label="Search customers"
              className="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, mobile or customer ID"
            />
            <button className="button">
              <Search size={16} />
              Search
            </button>
          </form>
          <Table
            rows={data || []}
            columns={[
              [
                "Customer",
                (r) => (
                  <>
                    <button className="link" onClick={() => selectCustomer(r)}>
                      {r.name}
                    </button>
                    <span className="row-detail">{r.number}</span>
                  </>
                ),
              ],
              ["Mobile", (r) => r.mobile],
              [
                "Language",
                (r) => (r.language === "kn" ? "Kannada" : "English"),
              ],
              ["Accounts", (r) => r.accounts],
              [
                "WhatsApp",
                (r) => (
                  <Badge value={r.consent ? "Opted in" : "Not opted in"} />
                ),
              ],
            ]}
          />
        </section>
      )}
    </>
  );
}
