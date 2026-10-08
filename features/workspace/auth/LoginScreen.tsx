"use client";
import { ArrowUpRight } from "lucide-react";
import { api } from "../../../lib/api";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  "setBusy" | "setError" | "setUser" | "error" | "busy"
>;
export function LoginScreen({
  setBusy,
  setError,
  setUser,
  error,
  busy,
}: Props) {
  return (
    <div className="login">
      <div className="login-art">
        <img src="/brand.jpg" alt="Devi Jewellers, Kaup" />
        <p>
          A little saved today.
          <br />
          Something precious tomorrow.
        </p>
      </div>
      <form
        className="login-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const f = new FormData(e.currentTarget);
          try {
            const b = await api("/auth/login", "POST", {
              username: f.get("username"),
              password: f.get("password"),
            });
            setUser(b.user);
          } catch (e: any) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="eyebrow">OWNER & STAFF WORKSPACE</div>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to manage your customers and schemes.</p>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" autoComplete="username" required />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        {error && <div className="error">{error}</div>}
        <button className="button primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"} <ArrowUpRight size={16} />
        </button>
        <p className="muted" style={{ fontSize: 12, marginTop: 28 }}>
          Devi Jewellers · Main Road, Kaup
          <br />
          This workspace is for authorised shop staff.
        </p>
      </form>
    </div>
  );
}
