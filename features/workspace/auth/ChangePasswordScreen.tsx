"use client";
import { ArrowUpRight } from "lucide-react";
import { api } from "../../../lib/api";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "setBusy" | "setError" | "setUser" | "user" | "setSuccess" | "error" | "busy"
>;
export function ChangePasswordScreen({
  setBusy,
  setError,
  setUser,
  user,
  setSuccess,
  error,
  busy,
}: Props) {
  return (
    <div className="login">
      <div className="login-art">
        <img src="/brand.jpg" alt="Devi Jewellers, Kaup" />
        <p>
          Security Notice
          <br />
          Please set your permanent password.
        </p>
      </div>
      <form
        className="login-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const f = new FormData(e.currentTarget);
          const cur = String(f.get("currentPassword") || ""),
            n1 = String(f.get("newPassword") || ""),
            n2 = String(f.get("confirmPassword") || "");
          if (n1 !== n2) {
            setError("New passwords do not match");
            setBusy(false);
            return;
          }
          if (n1.length < 12) {
            setError("New password must be at least 12 characters");
            setBusy(false);
            return;
          }
          try {
            await api("/auth/change-password", "POST", {
              currentPassword: cur,
              newPassword: n1,
            });
            setUser({ ...user, mustChangePassword: false });
            setSuccess(
              "Password updated successfully. Welcome to your workspace!",
            );
          } catch (err: any) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="eyebrow">FIRST-TIME OWNER SETUP</div>
        <h1>Set permanent password</h1>
        <p className="muted">
          Your account was initialized with a temporary password. Choose a
          secure personal password to continue.
        </p>
        <label htmlFor="currentPassword">Current temporary password</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
        />
        <label htmlFor="newPassword">New password (min 12 characters)</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={12}
        />
        <label htmlFor="confirmPassword">Confirm new password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={12}
        />
        {error && <div className="error">{error}</div>}
        <button className="button primary" disabled={busy}>
          {busy ? "Updating password…" : "Update password & enter"}{" "}
          <ArrowUpRight size={16} />
        </button>
      </form>
    </div>
  );
}
