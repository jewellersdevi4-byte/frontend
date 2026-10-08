"use client";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, never>;
export function LoadingScreen({}: Props) {
  return <div className="empty">Opening your workspace…</div>;
}
