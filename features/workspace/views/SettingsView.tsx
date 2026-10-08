"use client";
import { api } from "../../../lib/api";
import { SettingsForm } from "../forms/SettingsForm";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "page" | "data" | "busy" | "action">;
export function SettingsView({ page, data, busy, action }: Props) {
  return (
    <>
      {page === "Settings" && data && (
        <SettingsForm
          data={data}
          busy={busy}
          onSave={(b) => action(() => api("/settings", "PUT", b))}
        />
      )}
    </>
  );
}
