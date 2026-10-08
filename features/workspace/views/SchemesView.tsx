"use client";
import { Badge } from "../../../components/ui/Badge";
import { Empty } from "../../../components/ui/Empty";
import { money } from "../../../lib/format";
import type { Row } from "../../../lib/types";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<WorkspaceModel, "page" | "data" | "owner" | "open">;
export function SchemesView({ page, data, owner, open }: Props) {
  return (
    <>
      {page === "Schemes" && (
        <>
          <div className="banner">
            No unresolved scheme may be activated. Changing a scheme creates a
            new version and preserves existing agreements.
          </div>
          {(data || []).length === 0 ? (
            <section className="card">
              <Empty text="No schemes configured. Add a draft, then confirm all terms before enrolment." />
            </section>
          ) : (
            (data || []).map((s: Row) => (
              <section className="card" key={s.id}>
                <header>
                  <h2>{s.name}</h2>
                  <Badge
                    value={
                      s.versions.length
                        ? "Confirmed version " + s.versions[0].version
                        : "Draft · rules required"
                    }
                  />
                </header>
                <p className="muted">{s.description}</p>
                <p className="terms">{s.reference}</p>
                {s.versions[0] && (
                  <p>
                    {money(s.versions[0].rules.amount)} ×{" "}
                    {s.versions[0].rules.count} instalments ·{" "}
                    {s.versions[0].rules.durationMonths} months
                  </p>
                )}
                {owner && (
                  <button
                    className="button"
                    onClick={() => open("version", { record: s })}
                  >
                    Review & approve a new version
                  </button>
                )}
              </section>
            ))
          )}
        </>
      )}
    </>
  );
}
