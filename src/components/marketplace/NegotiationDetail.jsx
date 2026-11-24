"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projectDate, projectMoney } from "@/lib/project-presentation";
import { deliveryDays, noteLabel, offerTime, party, responseOwner, statusLabels, threadOrigin } from "@/lib/negotiation-presentation";
import { EvidenceList } from "./EvidenceFiles";
import OfferForm from "./OfferForm";
import ProjectDescription from "./ProjectDescription";
import ProfessionalAvatar from "./ProfessionalAvatar";
import s from "./negotiation.module.css";

function Signature({thread,offer}) {
  const sender = party(thread,offer.senderId);
  return <p className={s.signature}>{sender?.role} · {sender?.person.name}
    <time dateTime={offer.createdAt}>{offerTime(offer.createdAt)}</time></p>;
}

function TermsText({offer,kind}) {
  return <div className={s.writing}>
    <div><h4>Scope and conditions</h4><ProjectDescription text={offer.scope}/></div>
    {offer.note && <div><h4>{noteLabel(kind,offer.version)}</h4><ProjectDescription text={offer.note}/></div>}
  </div>;
}

function Participants({thread}) {
  const origin=threadOrigin(thread);
  return <dl className={s.parties}>{[["Client",thread.project.client],["Freelancer",thread.freelancer]].map(([role,person])=>
    <div key={role}><ProfessionalAvatar name={person.name || role} image={person.image}/>
      <div><dt>{role}{role === origin && " · Initiator"}</dt><dd>{person.name || role}</dd></div></div>)}</dl>;
}

function Latest({thread,latest,previous}) {
  const agreed=thread.status === "ACCEPTED" && Boolean(thread.project.acceptedAt);
  const title=agreed ? "Accepted agreement" : thread.status === "PENDING" ? "Current offer" : thread.status === "ACCEPTED" ? "Accepted offer" : "Final offer";
  return <section id="latest-offer" aria-labelledby="current-title" data-latest className={s.latest}>
    <header className={s.termsHead}><h2 id="current-title">{title}</h2>
      <h3>Offer {latest.version} · {agreed ? "Agreed terms" : statusLabels[thread.status]}</h3></header>
    <Signature thread={thread} offer={latest}/>
    <dl className={s.numbers}><div><dt>{agreed ? "Accepted amount" : "Offer amount"}</dt><dd>{projectMoney(latest.amount)}</dd></div>
      <div><dt>Delivery from acceptance</dt><dd>{deliveryDays(latest.days)}</dd></div></dl>
    {previous && (Number(previous.amount)!==Number(latest.amount) || previous.days!==latest.days) &&
      <div className={s.changes}><small>Changed since offer {previous.version}</small>
        {Number(previous.amount)!==Number(latest.amount) && <span>{projectMoney(previous.amount)} → {projectMoney(latest.amount)}</span>}
        {previous.days!==latest.days && <span>{deliveryDays(previous.days)} → {deliveryDays(latest.days)}</span>}</div>}
    {agreed && <dl className={s.agreed}><div><dt>Selected freelancer</dt><dd>{thread.freelancer.name}</dd></div>
      {thread.project.acceptedAt && <div><dt>Accepted at</dt><dd><time dateTime={thread.project.acceptedAt}>{offerTime(thread.project.acceptedAt)}</time></dd></div>}
      {thread.project.deadline && <div><dt>Contract deadline</dt><dd>{projectDate(thread.project.deadline)} UTC</dd></div>}</dl>}
    <TermsText offer={latest} kind={thread.kind}/>
    <EvidenceList files={latest.attachments} title={agreed?"Accepted revision files":"Offer supporting files"}/>
  </section>;
}

function History({thread}) {
  return <section data-history className={s.history}><h2>Offer history</h2>
    <ol>{thread.offers.map(offer=>{
      const current=offer.version === thread.version;
      return <li key={offer.id} data-version={offer.version}>
        {current ? <div className={s.historyCurrent}><strong>Offer {offer.version} · {statusLabels[thread.status]}</strong>
          <a href="#latest-offer">View terms ↑</a></div> :
          <details><summary><h3>Offer {offer.version} · Superseded</h3><span>{projectMoney(offer.amount)} · {deliveryDays(offer.days)}</span></summary>
            <Signature thread={thread} offer={offer}/><TermsText offer={offer} kind={thread.kind}/><EvidenceList files={offer.attachments} title={"Historical files · Offer "+offer.version}/></details>}
      </li>;
    })}</ol>
  </section>;
}

export default function NegotiationDetail({initial,actorId,portal,invitationSent}) {
  const [thread,setThread]=useState(initial);
  const {project,status,offers}=thread;
  const latest=offers.at(-1);
  const waiting=responseOwner(thread,latest);
  const owner=portal==="client";
  const type=thread.kind==="INVITATION" ? "Invitation" : "Proposal";
  return <div className={s.surface}>
    <Link className={s.back} href={owner?"/client/offers":"/freelancer/invites"}><ArrowLeft size={16}/> Invitations and proposals</Link>
    {invitationSent && <p className={s.receipt} role="status"><strong>Invitation sent.</strong>{" "}<Link href={"/client/offers/"+thread.id}>View negotiation</Link></p>}
    <header className={s.hero}>
      <div className={s.metaLine}><span>{type}</span><span className={s.badge} data-state={status}>{statusLabels[status]}</span>
        {waiting && <span className={s.turn}>Awaiting {waiting.role.toLowerCase()} response</span>}</div>
      <h1>{project.title}</h1><Participants thread={thread}/>
    </header>
    <div className={s.workspace}>
      {latest && <Latest thread={thread} latest={latest} previous={offers.at(-2)}/>}
      <aside className={s.side}>
        <section className={s.response} data-closed={status!=="PENDING" || undefined} aria-label="Negotiation response">
          <h2>{waiting ? latest.recipientId === actorId ? "Your response" : "Awaiting response" : "Outcome"}</h2>
          {waiting && <a className={s.review} href="#latest-offer">Review offer {latest.version} terms ↓</a>}
          {waiting && !thread.canExchangeTerms && <p>This project is no longer open to new terms or acceptance.</p>}
          <OfferForm mode="response" thread={thread} actorId={actorId} portal={portal} onSaved={setThread}/>
        </section>
        {(owner || thread.freelancerCanOpenProject) && <section className={s.context}><h2>Project details</h2>
          {project.listedDeadline && <dl><div><dt>Advertised deadline</dt><dd>{projectDate(project.listedDeadline)} UTC</dd></div></dl>}
          <EvidenceList files={project.references} title="Shared project references"/>
          <nav aria-label="Related project and profile">
            {(owner || thread.freelancerCanOpenProject) && <Link href={(owner?"/client/projects/":"/freelancer/discover/")+project.id}>Project details <ArrowUpRight size={15}/></Link>}
            {owner && thread.canOpenProfessionalProfile && <Link href={"/client/freelancers/"+thread.freelancerId}>Freelancer profile <ArrowUpRight size={15}/></Link>}
            {!owner && status==="ACCEPTED" && project.acceptedAt && <Link href={"/freelancer/deal-rooms/"+project.id}>Open deal room <ArrowUpRight size={15}/></Link>}
          </nav>
        </section>}
      </aside>
      <History thread={thread}/>
    </div>
  </div>;
}
