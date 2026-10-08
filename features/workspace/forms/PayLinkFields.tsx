"use client";
import { ArrowUpRight } from "lucide-react";
import { money } from "../../../lib/format";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "modal" | "account" | "setSuccess"> & {
  modal: NonNullable<WorkspaceModel["modal"]>;
};
export function PayLinkFields({ modal, account, setSuccess }: Props) {
  return (
    <>
      {modal.type === "payLink" &&
        modal.intent &&
        (() => {
          const url =
            (typeof window !== "undefined" ? window.location.origin : "") +
            "/pay/" +
            modal.intent.link_id;
          return (
            <div className="field full">
              <p>
                Share this link with <strong>{account?.customer_name}</strong>{" "}
                for instalment payment of{" "}
                <strong>{money(modal.intent.amount)}</strong>.
              </p>
              <div
                style={{
                  background: "#fff",
                  padding: 14,
                  border: "1px solid var(--line)",
                  borderRadius: 6,
                  margin: "16px 0",
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              >
                {url}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 20,
                }}
              >
                <button
                  type="button"
                  className="button primary"
                  onClick={() => {
                    navigator.clipboard?.writeText(url);
                    setSuccess("Payment link copied to clipboard!");
                  }}
                >
                  Copy Link
                </button>
                <a
                  className="button"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Payment Page <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          );
        })()}
    </>
  );
}
