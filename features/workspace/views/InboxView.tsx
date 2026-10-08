"use client";
import { Badge } from "../../../components/ui/Badge";
import { Empty } from "../../../components/ui/Empty";
import { api } from "../../../lib/api";
import type { Row } from "../../../lib/types";
import type { WorkspaceModel } from "../hooks/useWorkspace";
type Props = Pick<
  WorkspaceModel,
  | "page"
  | "data"
  | "conversation"
  | "selectConversation"
  | "action"
  | "user"
  | "write"
  | "busy"
> & { user: NonNullable<WorkspaceModel["user"]> };
export function InboxView({
  page,
  data,
  conversation,
  selectConversation,
  action,
  user,
  write,
  busy,
}: Props) {
  return (
    <>
      {page === "WhatsApp inbox" && (
        <div className="two-col">
          <section className="card" style={{ padding: 0 }}>
            {(data || []).length ? (
              (data || []).map((c: Row) => (
                <button
                  className={
                    "inbox-row " +
                    (conversation?.conversation?.id === c.id ? "selected" : "")
                  }
                  key={c.id}
                  onClick={() => selectConversation(c)}
                >
                  <strong>{c.customer_name || "Unidentified sender"}</strong>
                  <span className="row-detail">{c.phone}</span>
                  <p style={{ marginTop: 10, fontSize: 12 }}>
                    {c.latest?.text || "WhatsApp conversation"}
                  </p>
                  <Badge value={c.status} />
                </button>
              ))
            ) : (
              <Empty text="Customer enquiries will appear here." />
            )}
          </section>
          <section className="card">
            {conversation?.conversation ? (
              <>
                <header>
                  <h2>Conversation</h2>
                  <button
                    className="button"
                    onClick={() =>
                      action(async () => {
                        await api(
                          "/inbox/" + conversation.conversation.id,
                          "PATCH",
                          {
                            status:
                              conversation.conversation.status === "open"
                                ? "resolved"
                                : "open",
                            assignedTo: user.id,
                          },
                        );
                        await selectConversation(conversation.conversation);
                      })
                    }
                  >
                    {conversation.conversation.status === "open"
                      ? "Resolve enquiry"
                      : "Take conversation"}
                  </button>
                </header>
                {conversation.messages.map((m: Row) => (
                  <div className={"conversation " + m.direction} key={m.id}>
                    {m.body.text?.body ||
                      m.body.text ||
                      m.body.interactive?.body?.text ||
                      m.kind}
                    <small>
                      {new Date(m.created_at).toLocaleString()} · {m.status}
                    </small>
                  </div>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    action(async () => {
                      await write(
                        "/inbox/" + conversation.conversation.id + "/reply",
                        "POST",
                        { text: f.get("text") },
                      );
                      await selectConversation(conversation.conversation);
                    });
                  }}
                >
                  <textarea
                    name="text"
                    placeholder="Write a personal reply…"
                    aria-label="Reply"
                    required
                  />
                  <button
                    disabled={busy}
                    className="button primary"
                    style={{ marginTop: 12 }}
                  >
                    Send reply
                  </button>
                </form>
                <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
                  Outside the customer reply window, an approved template is
                  required.
                </p>
              </>
            ) : (
              <Empty text="Select a conversation to view messages." />
            )}
          </section>
        </div>
      )}
    </>
  );
}
