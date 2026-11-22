"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileNameForm({ name }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function save(event) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("name");
    setBusy(true);
    try {
      const response = await fetch("/api/client/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: value }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      router.refresh();
      setMessage("Name saved.");
    } catch (error) { setMessage(error.message || "Unable to save name."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={save} className="mt-6 space-y-3">
    <label className="block text-sm font-bold">Full name
      <input name="name" defaultValue={name} required minLength={2} maxLength={80}
        className="mt-2 w-full rounded-2xl border border-[#eadfd2] px-4 py-3" />
    </label>
    <button disabled={busy} className="rounded-xl bg-[#6f2e1c] px-4 py-2 font-bold text-white">{busy ? "Saving..." : "Save name"}</button>
    <p role="status" className="text-sm">{message}</p>
  </form>;
}
