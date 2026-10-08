import { Input } from "../../../components/ui/Input";
import type { Row } from "../../../lib/types";
export function SettingsForm({
  data,
  busy,
  onSave,
}: {
  data: Row;
  busy: boolean;
  onSave: (b: Row) => void;
}) {
  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<
          string,
          string
        >;
        const templates: Row = {};
        for (const k of ["welcome", "reminder", "receipt", "maturity"])
          if (f[k + "En"] && f[k + "Kn"])
            templates[k] = { en: f[k + "En"], kn: f[k + "Kn"] };
        onSave({
          shopName: f.shopName,
          address: f.address,
          phone: f.phone,
          whatsapp: f.whatsapp,
          reminderDays: f.days.split(",").map((v) => Number(v.trim())),
          messagingEnabled: f.enabled === "on",
          languageReviewed: f.reviewed === "on",
          templates,
        });
      }}
    >
      <h2>Shop details</h2>
      <div className="form-grid">
        <Input name="shopName" label="Shop name" defaultValue={data.shopName} />
        <Input name="address" label="Address" defaultValue={data.address} />
        <Input name="phone" label="Phone" defaultValue={data.phone} />
        <Input
          name="whatsapp"
          label="Public WhatsApp number"
          defaultValue={data.whatsapp}
        />
        <Input
          name="days"
          label="Reminder days (1–10, comma separated)"
          defaultValue={data.reminderDays.join(",")}
        />
      </div>
      <h2 style={{ marginTop: 30 }}>WhatsApp templates</h2>
      <p className="muted">
        Enter approved utility template names. Tokens and business API
        credentials stay on the server.
      </p>
      <div className="form-grid">
        {["welcome", "reminder", "receipt", "maturity"].map((k) => (
          <div key={k}>
            <Input
              name={k + "En"}
              label={k + " · English template"}
              defaultValue={data.templates[k]?.en || ""}
              required={false}
            />
            <Input
              name={k + "Kn"}
              label={k + " · Kannada template"}
              defaultValue={data.templates[k]?.kn || ""}
              required={false}
            />
          </div>
        ))}
      </div>
      <label className="check" style={{ marginTop: 22 }}>
        <input
          type="checkbox"
          name="reviewed"
          defaultChecked={data.languageReviewed}
        />
        Owner reviewed Kannada and English customer messages
      </label>
      <label className="check">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={data.messagingEnabled}
        />
        Enable background messaging
      </label>
      <button
        className="button primary"
        disabled={busy}
        style={{ marginTop: 22 }}
      >
        Save settings
      </button>
    </form>
  );
}
