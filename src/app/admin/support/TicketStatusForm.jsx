"use client";
import { useState } from "react";
import { ticketStatuses } from "@/lib/support-options";

export default function TicketStatusForm({ id, initial }) {
  const [status, setStatus] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/support/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setSaved(result.data.status);
      setMessage("Status saved.");
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  return <form onSubmit={save} className="flex flex-wrap items-center gap-3">
    <label>Status <select className="rounded border p-2" value={status} disabled={busy} onChange={e => setStatus(e.target.value)}>
      {ticketStatuses.map(value => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}
    </select></label>
    <button disabled={busy || status === saved} className="rounded bg-slate-800 px-3 py-2 text-white disabled:opacity-50">{busy ? "Saving..." : "Update status"}</button>
    <span role="status">{message}</span>
  </form>;
}
