import { EvidenceList } from "./EvidenceFiles";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePortal } from "@/lib/portal-session";
import { invitationProjects, directory, discover, inbox, negotiation, sharedListing, workerProfile, marketplaceCounts } from "@/services/marketplace.service";
import FreelancerPortalShell from "@/components/freelancer/FreelancerPortalShell";
import OfferForm from "./OfferForm";
import NegotiationInbox from "./NegotiationInbox";
import NegotiationDetail from "./NegotiationDetail";
import DiscoveryProjectCard from "./DiscoveryProjectCard";
import ProjectDescription from "./ProjectDescription";
import { projectDate, projectMoney } from "@/lib/project-presentation";
import { TalentDirectory, ProfessionalProfile } from "./TalentDiscovery";

const card="min-w-0 space-y-3 break-words rounded-[2rem] border border-[#eadfd2] bg-white/80 p-5 shadow-sm";
const link="inline-block font-bold text-[#6f2e1c] underline";
const field="mt-1 block w-full rounded-xl border border-[#eadfd2] bg-white p-2";
const plain=value=>JSON.parse(JSON.stringify(value));

function Frame({portal,title,children}) {
  const content=<div className="mx-auto max-w-[1480px] space-y-5"><h1 className="text-3xl font-black tracking-tight text-[#24130c]">{title}</h1>{children}</div>;
  return portal==="freelancer"?<FreelancerPortalShell>{content}</FreelancerPortalShell>:content;
}
function Pager({data,query}) {
  return <nav aria-label="Result pages" className="flex gap-4">{[["Previous",data.page-1],["Next",data.page+1]].filter(([,p])=>p>0&&(p<data.page||data.hasNext)).map(([label,p])=><Link key={label} className={link} href={"?"+new URLSearchParams({...query,page:String(p)})}>{label}</Link>)}</nav>;
}
async function detail(fn) {try{return await fn();}catch(e){if(e.status===404)notFound();throw e;}}
export async function Discovery({portal,query}) {
  const client=portal==="client",user=await requirePortal(client?"CLIENT":"FREELANCER");
  const input=Object.fromEntries(Object.entries(query).filter(([,v])=>v!==""));
  let data,error;
  try {data=await (client?directory:discover)(user.id,input);} catch(e){if(e.name!=="ZodError") throw e;error="Check your search filters.";}
  if (client) return <TalentDirectory data={data} query={input} error={error} pager={data && <Pager data={data} query={input}/>}/>;
  const labels=[["q","Title, description or skill"],["category","Category"],["min","Minimum INR"],["max","Maximum INR"],["by","Deadline by"]];
  return <Frame portal={portal} title="Discover projects">
      <form className="rounded-2xl border border-[#e4d7c9] bg-[#fffdf9] p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[12rem] flex-1 text-sm font-semibold text-[#5d4536]">Title, description or skill
            <input type="search" name="q" defaultValue={input.q} className={field} placeholder="Search published projects"/>
          </label>
          <button className="min-h-11 rounded-xl bg-[#713923] px-5 text-sm font-bold text-white hover:bg-[#542917]">Search</button>
        </div>
        <details className="mt-3" open={labels.slice(1).some(([key]) => input[key]) || undefined}>
          <summary className="w-fit cursor-pointer rounded py-1 text-sm font-semibold text-[#77452d] focus-visible:outline-2">More filters</summary>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{labels.slice(1).map(([key,label]) =>
            <label key={key} className="text-sm text-[#634d3f]">{label}
              <input name={key} type={key === "by" ? "date" : "text"} defaultValue={input[key]} className={field}/>
            </label>)}</div>
        </details>
      </form>

    {error && <p role="alert">{error}</p>}
    {data && <><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{data.items.map(item=><DiscoveryProjectCard key={item.id} project={item}/>)}</div>{!data.items.length&&<p className={card}>No published projects match this search.</p>}<Pager data={data} query={input}/></>}
  </Frame>;
}
export async function Professional({workerId}) {
  const user=await requirePortal("CLIENT");
  const worker=await detail(()=>workerProfile(user.id,null,{workerId}));
  const projects=await invitationProjects(user.id,workerId);
  return <ProfessionalProfile worker={worker} projects={projects}/>;
}
export async function Listing({projectId}) {
  const user=await requirePortal("FREELANCER");
  const p=await detail(()=>sharedListing(user.id,null,{projectId}));
  return <Frame portal="freelancer" title={p.title}>
    <article className={card}>
      <div className="flex flex-wrap items-center gap-3 text-sm text-[#745d4b]">
        <span className="rounded-full bg-[#f5e9d8] px-3 py-1 font-semibold">{p.category}</span>
        <span>{p.client.name}</span><span>{p.visibility.toLowerCase()} listing</span>
      </div>
      <dl className="flex flex-wrap gap-x-10 gap-y-3 border-y border-[#eadfd2] py-4">
        <div><dt className="text-xs text-[#745d4b]">{p.acceptedAt ? "Accepted contract value" : "Listed budget"}</dt><dd className="text-lg font-bold">{projectMoney(p.budget)}</dd></div>
        <div><dt className="text-xs text-[#745d4b]">{p.acceptedAt ? "Agreed delivery" : "Project deadline"}</dt><dd className="text-lg font-bold">{projectDate(p.deadline)}</dd></div>
      </dl>
      {p.acceptedAt && <p className="text-sm">Original listing · {projectMoney(p.advertisedBudget)} · {projectDate(p.advertisedDeadline)}</p>}
      <h2 className="pt-2 text-xl font-bold">Project brief</h2><ProjectDescription text={p.description}/>
      <EvidenceList files={p.evidence} title="Project reference files"/>
      {p.skills.length>0 && <p className="border-t border-[#eadfd2] pt-3 text-sm"><b>Required skills</b> · {p.skills.join(", ")}</p>}
      {p.freelancerId===user.id && <Link className={link} href={"/freelancer/deal-rooms/"+p.id}>Open deal room</Link>}</article>
    <section className={card}>{p.proposals.map(n=><p key={n.id}><Link className={link} href={"/freelancer/offers/"+n.id}>{n.kind} · {n.status}</Link></p>)}
    {p.status==="OPEN" && p.visibility==="PUBLIC" && !p.proposals.some(n=>n.kind==="PROPOSAL"||n.status==="PENDING")&&<OfferForm mode="application" portal="freelancer" projectId={p.id}/>}</section></Frame>;
}
function NegotiationPortal({portal,children}) {
  return portal === "freelancer" ? <FreelancerPortalShell>{children}</FreelancerPortalShell> : children;
}
export async function Threads({portal,query}) {
  const user=await requirePortal(portal.toUpperCase());
  const filters=Object.fromEntries(Object.entries(query).filter(([,value])=>value!==""));
  let data,error;
  try { data=await inbox(user.id,filters); }
  catch(e) { if(e.name!=="ZodError") throw e; error=true; }
  return <NegotiationPortal portal={portal}>
    <NegotiationInbox portal={portal} actorId={user.id} query={filters} data={data} error={error}
      pager={data && <Pager data={data} query={filters}/>}/>
  </NegotiationPortal>;
}
export async function Thread({portal,id,invitationSent}) {
  const user=await requirePortal(portal.toUpperCase());
  const n=await detail(()=>negotiation(user.id,null,{negotiationId:id}));
  return <NegotiationPortal portal={portal}>
    <NegotiationDetail key={n.id + ":" + n.version + ":" + n.status} initial={plain(n)} actorId={user.id} portal={portal}
      invitationSent={invitationSent && n.kind==="INVITATION" && n.project.clientId===user.id}/>
  </NegotiationPortal>;
}
export async function MarketSummary({role}) {
  const user=await requirePortal(role);
  const counts=await marketplaceCounts(user.id,role);
  const labels={projects:"Projects",drafts:"Drafts",published:"Published",proposals:role==="CLIENT"?"Pending proposals":"Submitted proposals",invitations:role==="CLIENT"?"Sent invitations":"Received invitations",waiting:"Awaiting your response",active:"Active projects"};
  return <section className={card}><h2 className="text-xl font-bold">Project activity</h2><dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {Object.entries(labels).filter(([k])=>role==="CLIENT"||!["drafts","published"].includes(k)).map(([k,label])=><div key={k}><dt>{label}</dt><dd className="text-2xl font-black">{counts[k]}</dd></div>)}</dl>
    <Link href={role==="CLIENT"?"/client/offers":"/freelancer/invites"} className={link}>Invitations and proposals</Link></section>;
}
