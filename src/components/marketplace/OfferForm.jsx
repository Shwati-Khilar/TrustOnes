"use client";
import { EvidencePicker,useEvidenceSelection } from "./EvidenceFiles";
import s from "./negotiation.module.css";
import { deliveryDays } from "@/lib/negotiation-presentation";
import { projectDate, projectMoney } from "@/lib/project-presentation";
import { useState } from "react";
import { useRouter } from "next/navigation";

const field = "mt-1 block w-full rounded-xl border border-[#eadfd2] bg-white px-3 py-2";
const button = "rounded-xl bg-[#6f2e1c] px-4 py-2 font-semibold text-white disabled:opacity-50";

export function PublishForm({project, onPublished}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  async function publish(event) {
    event.preventDefault();
    const visibility=new FormData(event.currentTarget).get("visibility");
    setBusy(true); setError("");
    try {
      const data=await send("/api/projects/"+project.id+"/publish","POST",{visibility});
      onPublished({...project,...data.data});
    } catch(e){setError(e.message);} finally{setBusy(false);}
  }
  return <form onSubmit={publish} className="my-4 flex flex-wrap items-end gap-3">
    <label>Visibility<select name="visibility" defaultValue={project.visibility} className={field}><option value="PRIVATE">Private invitations</option><option value="PUBLIC">Public discovery</option></select></label>
    <button className={button} disabled={busy}>{busy?"Publishing...":"Publish project"}</button><span role="status">{error}</span>
  </form>;
}
async function send(url,method,body,transport) {
  const response=transport ? await transport(url,method,body) : await fetch(url,{method,cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const result=await response.json();
  if(!response.ok) throw new Error(result.message || "Unable to save changes.");
  return result;
}

export default function OfferForm({mode,projectId,workerId,projects=[],thread,actorId,portal,onSaved}) {
  const router=useRouter();
  const selection=useEvidenceSelection();
  const [busy,setBusy]=useState(false),[feedback,setFeedback]=useState(""),[counter,setCounter]=useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const [needsReload,setNeedsReload]=useState(false);
  const latest=thread?.offers.at(-1);
  const recipient=latest?.recipientId===actorId;
  const initiator=thread?.kind==="INVITATION"?thread.project.clientId:thread?.freelancerId;
  async function save(action,fields={}) {
    if(busy) return;
    if(["ACCEPT","REJECT","WITHDRAW"].includes(action) && !window.confirm(action==="ACCEPT"?"Accept offer "+latest.version+" for "+projectMoney(latest.amount)+" with delivery in "+deliveryDays(latest.days)+" and assign this project?":"Confirm "+action.toLowerCase()+"?")) return;
    setBusy(true); setFeedback("");
    try {
      let url, payload,method="POST";
      if(mode==="application") {
        url="/api/projects/"+projectId+"/proposals";
        payload={bidAmount:fields.amount,estimatedDays:Number(fields.days),scope:fields.scope,coverLetter:fields.note};
      } else if(mode==="invitation") {
        url="/api/projects/"+fields.projectId+"/invitations";
        payload={amount:fields.amount,days:Number(fields.days),scope:fields.scope,note:fields.note,freelancerId:workerId};
      } else {
        url="/api/negotiations/"+thread.id;method="PATCH";
        payload={action,version:latest.version,...fields};
      }
      const result=await send(url,method,payload,(!thread || action==="COUNTER") ? selection.submit : undefined);
      selection.change([]);
      if(thread) {onSaved(result.data);setFeedback("Response saved.");setCounter(false);}
      else router.push("/"+portal+"/offers/"+(result.data || result.proposal).id+(mode==="invitation"?"?sent=invitation":""));
    } catch (error) {
      setFeedback(error.message);
      if (thread) {
        try {
          const current = await send("/api/negotiations/" + thread.id, "GET");
          onSaved(current.data);
          if(current.data.version!==thread.version || current.data.status!=="PENDING") selection.change([]);
          setCounter(false);
        } catch {
          setNeedsReload(true);
          setFeedback(error.message + " Reload the page to view the current offer.");
        }
      }
    } finally {
      setBusy(false);
    }
  }
  if(mode==="invitation" && !projects.length) return <p>Publish an open project to send an invitation.</p>;
  const actionable=thread?.status==="PENDING" && latest?.version===thread.version && !needsReload;
  return <div className="space-y-4">
    {actionable && <div className={s.actionGroup}>
      {recipient && thread.canExchangeTerms && <><button className={s.primary} disabled={busy} onClick={()=>save("ACCEPT")}>Accept offer</button>
        <button className={s.secondary} aria-expanded={counter} disabled={busy} onClick={()=>setCounter(!counter)}>Counteroffer</button></>}
      {recipient && <button className={s.danger} disabled={busy} onClick={()=>save("REJECT")}>Reject offer</button>}
      {initiator===actorId && <button className={s.danger} disabled={busy} onClick={()=>save("WITHDRAW")}>Withdraw</button>}
    </div>}
    {(!thread || (actionable && recipient && thread.canExchangeTerms && counter)) && <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={e=>{
      e.preventDefault();save("COUNTER",Object.fromEntries(new FormData(e.currentTarget)));
    }}>
      {mode==="invitation" && <label className="sm:col-span-2">Your project<select name="projectId" className={field} value={selectedProjectId} disabled={busy} onChange={event=>{setSelectedProjectId(event.target.value);selection.change([]);}} required>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>}
      {selectedProject && <p className="sm:col-span-2 text-sm text-[#715c4d]">Listed project deadline · {projectDate(selectedProject.deadline)}</p>}
      <label>Amount (INR)<input className={field} type="number" name="amount" min="0.01" step="0.01" defaultValue={latest?.amount} required/></label>
      <label>Delivery days from acceptance<input className={field} type="number" name="days" min="1" max="3650" defaultValue={latest?.days} required/></label>
      <label className="sm:col-span-2">Scope and conditions<textarea className={field} name="scope" maxLength={8000} defaultValue={latest?.scope} required/></label>
      <label className="sm:col-span-2">{mode==="application"?"Cover letter":"Negotiation note"}<textarea className={field} name="note" maxLength={4000} required={mode==="application"}/></label>
      <EvidencePicker selection={selection} disabled={busy}/>
      <button disabled={busy} className={button}>{busy?"Saving...":thread?"Send counteroffer":mode==="application"?"Submit proposal":"Send invitation"}</button>
    </form>}
    <p role="status">{feedback}</p>
    {needsReload && <button className={button} onClick={()=>window.location.reload()}>Reload negotiation</button>}
  </div>;
}
