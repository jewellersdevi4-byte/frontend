import type { ReactNode } from "react";
export function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={"field " + (full ? "full" : "")}>
      <label>{label}</label>
      {children}
    </div>
  );
}
