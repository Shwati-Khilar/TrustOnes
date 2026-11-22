import Link from "next/link";
import { requirePortal } from "@/lib/portal-session";
import { triageTickets } from "@/services/support.service";
import TicketStatusForm from "./TicketStatusForm";

export default async function AdminSupport() {
  await requirePortal("ADMIN");
  const tickets = await triageTickets();
  return <main className="min-h-screen bg-slate-100 p-4 sm:p-8"><section className="mx-auto max-w-5xl space-y-4">
    <Link className="underline" href="/admin/dashboard">Admin dashboard</Link>
    <h1 className="text-3xl font-bold">Support requests</h1>
    {!tickets.length && <p>No requests yet.</p>}
    {tickets.map(ticket => <article key={ticket.id} className="space-y-3 break-words rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">{ticket.title}</h2>
      <p className="text-sm text-slate-600">{ticket.user.name} &middot; {ticket.user.role} &middot; {ticket.type.replaceAll("_"," ")} &middot; {ticket.createdAt.toISOString().slice(0,10)}</p>
      <p className="whitespace-pre-wrap">{ticket.message}</p>
      <TicketStatusForm id={ticket.id} initial={ticket.status}/>
    </article>)}
  </section></main>;
}
