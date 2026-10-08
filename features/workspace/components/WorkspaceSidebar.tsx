"use client";
import { LogOut } from "lucide-react";
import { api } from "../../../lib/api";
import { nav } from "../navigation";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  | "owner"
  | "page"
  | "setPage"
  | "setCustomer"
  | "setAccount"
  | "setSuccess"
  | "setError"
  | "action"
  | "setUser"
  | "setData"
>;
export function WorkspaceSidebar({
  owner,
  page,
  setPage,
  setCustomer,
  setAccount,
  setSuccess,
  setError,
  action,
  setUser,
  setData,
}: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <strong>Devi Jewellers</strong>
        <small>KAUP · SCHEME MANAGER</small>
      </div>
      <nav>
        {nav
          .filter(
            ([n]) =>
              owner ||
              !["WhatsApp", "Settings", "Staff", "Audit log"].includes(n),
          )
          .map(([name, Icon]) => (
            <button
              key={name}
              className={page === name ? "active" : ""}
              onClick={() => {
                setPage(name);
                setCustomer(null);
                setAccount(null);
                setSuccess("");
                setError("");
              }}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}
      </nav>
      <div className="bottom">
        <small>PRIVATE SHOP WORKSPACE</small>
        <button
          onClick={() =>
            action(async () => {
              await api("/auth/logout", "POST");
              setUser(null);
              setData(null);
              setCustomer(null);
              setAccount(null);
            })
          }
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
