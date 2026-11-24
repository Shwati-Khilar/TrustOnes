import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { projectMoney } from "@/lib/project-presentation";
import { deliveryDays, offerTime, responseOwner, statusLabels } from "@/lib/negotiation-presentation";
import s from "./negotiation.module.css";

function Filters({query, path}) {
  return <form role="search" action={path} className={s.filters}>
    {query.projectId && <input type="hidden" name="projectId" value={query.projectId}/>}
    <div><label htmlFor="neg-search">Search negotiations</label><div className={s.searchBox}><Search size={17}/>
      <input type="search" id="neg-search" name="search" placeholder="Project or participant" maxLength={150} defaultValue={query.search}/></div></div>
    <div><label htmlFor="neg-type">Type</label><select id="neg-type" name="kind" defaultValue={query.kind || ""}>
      <option value="">All types</option><option value="INVITATION">Invitations</option><option value="PROPOSAL">Proposals</option></select></div>
    <div><label htmlFor="neg-status">Status</label><select id="neg-status" name="status" defaultValue={query.status || "ALL"}>
      <option value="ALL">All statuses</option>{Object.entries(statusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>
    <button className={s.primary}>Apply filters</button>
  </form>;
}

export default function NegotiationInbox({portal,actorId,query,data,error,pager}) {
  const path = portal === "client" ? "/client/offers" : "/freelancer/invites";
  const filtered = query.search || query.projectId || query.kind || query.page || (query.status && query.status !== "ALL");
  return <div className={s.surface}>
    <header className={s.pageTitle}><h1>Invitations and proposals</h1><p>Review project terms, respond to offers and revisit your agreements.</p></header>
    <Filters query={query} path={path}/>
    {error ? <p role="alert" className={s.empty}>Check the filters and page number. <Link href={path}>Reset filters</Link></p> : <>
      <div className={s.resultLine}><strong>{data.total} {data.total === 1 ? "negotiation" : "negotiations"}</strong>
        {data.total > 0 && <span>{data.counts.PENDING || 0} pending · {data.counts.ACCEPTED || 0} accepted</span>}
        {filtered && <Link href={path}>Clear filters</Link>}</div>
      {data.items.length ? <div className={s.rows}>{data.items.map(thread=>{
        const latest=thread.offers[0];
        const waiting=responseOwner(thread,latest);
        return <article key={thread.id} data-negotiation-row className={s.row}>
          <div><div className={s.metaLine}><span className={s.kind}>{thread.kind === "INVITATION" ? "Invitation" : "Proposal"}</span><span className={s.badge} data-state={thread.status}>{statusLabels[thread.status]}</span></div>
            <h2>{thread.project.title}</h2><p className={s.names}>Client · {thread.project.client.name} <span> / </span> Freelancer · {thread.freelancer.name}</p></div>
          <div className={s.rowTerms}>{latest && <><strong>{projectMoney(latest.amount)}</strong><span>{deliveryDays(latest.days)} · Offer {latest.version}</span></>}
            <time dateTime={new Date(thread.updatedAt).toISOString()}>{offerTime(thread.updatedAt)}</time></div>
          <div className={s.rowAction}>{waiting && <span>{latest.recipientId === actorId ? "Your response needed" : "Awaiting "+waiting.role.toLowerCase()}</span>}
            <Link className={s.open} href={"/"+portal+"/offers/"+thread.id}>View negotiation <ArrowUpRight size={16}/></Link></div>
        </article>;
      })}</div> : <p className={s.empty}>{data.total ? "No negotiations on this page." : filtered ? "No negotiations match these filters." : "No invitations or proposals yet."}</p>}
      {pager}
    </>}
  </div>;
}
