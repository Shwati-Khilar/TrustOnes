"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { ticketTypes } from "@/lib/support-options";

const panel = "space-y-4 rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6 shadow-sm";
const inputStyle = "mt-1 block w-full rounded-xl border border-[#eadfd2] px-4 py-3";
const buttonStyle = "rounded-xl bg-[#6f2e1c] px-5 py-3 font-bold text-white disabled:opacity-60";

async function submit(path, method, payload) {
  const response = await fetch(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export function PasswordSettings({ hasPassword }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function save(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    if (fields.newPassword !== fields.confirmPassword) return setMessage("Passwords must match.");
    setBusy(true);
    try {
      await submit("/api/user/password", "PUT", fields);
      await signOut({ callbackUrl: "/login" });
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  return <section className={panel}><h2 className="text-xl font-black">Password</h2>
    {hasPassword ? <form onSubmit={save} className="space-y-3">
      {[["currentPassword", "Current password"], ["newPassword", "New password"], ["confirmPassword", "Confirm new password"]].map(([name, label]) =>
        <label key={name} className="block text-sm font-bold">{label}<input name={name} className={inputStyle}
          type="password" autoComplete={name === "currentPassword" ? "current-password" : "new-password"} required minLength={name === "currentPassword" ? 1 : 8} /></label>)}
      <p className="text-sm">Changing your password signs you out of existing sessions.</p>
      <button disabled={busy} className={buttonStyle}>{busy ? "Updating..." : "Update password"}</button>
      <p role="status">{message}</p>
    </form> : <p>Manage your password with your sign-in provider.</p>}
  </section>;
}

export function ClientSupport() {
  const [tickets, setTickets] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/support", { signal: controller.signal, cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setTickets(result.data);
      } catch (error) { if (!controller.signal.aborted) setLoadError(error.message); }
    }
    load();
    return () => controller.abort();
  }, []);
  async function create(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    if (fields.type === "ACCOUNT_DELETION" && !window.confirm("Send an account deletion request to support for review?")) return;
    setBusy(true);
    try {
      const ticket = await submit("/api/support", "POST", fields);
      setTickets(current => [ticket, ...current]);
      setMessage("Support request submitted.");
      form.reset();
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  return <section className={panel}><h2 className="text-xl font-black">Support center</h2>
    <form onSubmit={create} className="space-y-3">
      <label className="block">Category<select name="type" className={inputStyle}>{ticketTypes.map(type => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
      <label className="block">Subject<input name="title" required minLength={2} maxLength={120} className={inputStyle} /></label>
      <label className="block">Description<textarea name="message" required minLength={10} maxLength={1200} rows={3} className={inputStyle} /></label>
      <button disabled={busy || !tickets} className={buttonStyle}>{busy ? "Submitting..." : "Submit ticket"}</button>
    </form><p role="status">{message}</p><h3 className="font-bold">Your requests</h3>
    {loadError || (tickets === null ? "Loading requests..." : !tickets.length && "No requests yet.")}
    {tickets?.map(ticket => <article key={ticket.id} className="break-words rounded-xl border border-[#eadfd2] p-3">
      <strong>{ticket.title}</strong><p>{ticket.status.replaceAll("_", " ")}</p><p>{ticket.message}</p>
    </article>)}
  </section>;
}
