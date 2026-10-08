import { Layers } from "lucide-react";
export function Empty({ text = "No records yet." }: { text?: string }) {
  return (
    <div className="empty">
      <Layers size={28} />
      {text}
    </div>
  );
}
