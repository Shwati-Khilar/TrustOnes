import { EvidenceList } from "@/components/marketplace/EvidenceFiles";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Layers3 } from "lucide-react";
import { PublishForm } from "@/components/marketplace/OfferForm";
import ProjectDescription from "@/components/marketplace/ProjectDescription";
import { projectDate, projectMoney } from "@/lib/project-presentation";

const panel = "min-w-0 rounded-3xl border border-[#e4d7c9] bg-[#fffdf9] p-5 shadow-sm sm:p-7";
const action = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#713923] px-4 text-sm font-bold text-white hover:bg-[#542917] focus-visible:outline-2 focus-visible:outline-offset-2";
const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d8c6b6] px-4 text-sm font-bold text-[#713923] hover:bg-[#f8ede1]";

export default function ProjectOverview({project,milestones,onPublish,onCancel,cancelling,cancelError}) {
  const open = project.status === "OPEN";
  const active = project.status === "ACTIVE";
  const draft = open && !project.publishedAt;
  const agreement = project.acceptedOffer;
  const activity = project.offerActivity || {proposals:0,invitations:0,pending:0};
  const state = draft ? "Draft" : project.status[0] + project.status.slice(1).toLowerCase();
  const offersUrl = "/client/offers?projectId=" + project.id;
  return <div className="space-y-5 text-[#332117]">
    <Link href="/client/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[#765640] hover:underline"><ArrowLeft size={15}/> All projects</Link>
    <header className="rounded-3xl bg-[#382319] px-6 py-7 text-[#fff9f0] sm:px-9 sm:py-8">
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
        <span className="rounded-full bg-[#f6ddad] px-3 py-1 text-[#57351f]">{state}</span>
        <span className="uppercase tracking-[.14em] text-[#dfcbb7]">{project.category}</span>
      </div>
      <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight [overflow-wrap:anywhere] sm:text-4xl">{project.title}</h1>
      <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/20 pt-5">
        <div><dt className="text-xs text-[#e6ceba]">{agreement ? "Accepted contract value" : active ? "Project budget" : "Listed budget"}</dt><dd className="mt-1 text-xl font-bold">{projectMoney(project.budget)}</dd></div>
        <div><dt className="flex items-center gap-1 text-xs text-[#e6ceba]"><CalendarDays size={13}/>{agreement ? "Agreed delivery" : "Project deadline"}</dt><dd className="mt-1 text-lg font-semibold">{projectDate(project.deadline)}</dd></div>
        <div><dt className="text-xs text-[#e6ceba]">Publication</dt><dd className="mt-1 font-semibold">{project.publishedAt ? project.visibility : "Unpublished"}</dd></div>
      </dl>
    </header>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,1fr)]">
      <div className="min-w-0 space-y-5">
        {active && <section className={panel}>
          <h2 className="text-xl font-bold">Accepted agreement</h2>
          {project.freelancer && <p className="mt-2 font-semibold">Assigned to {project.freelancer.name}</p>}
          {agreement ? <>
            <p className="mt-1 text-sm text-[#745d4b]">{agreement.days} days from acceptance · Accepted {projectDate(project.acceptedAt)}</p>
            <h3 className="mb-2 mt-5 text-sm font-bold">Agreed scope</h3><ProjectDescription text={agreement.scope}/>
            <Link className={secondary+" mt-4"} href={"/client/offers/"+agreement.negotiationId}>View accepted agreement <ArrowUpRight size={16}/></Link>
          </> : <p className="mt-3 text-sm">This assignment predates the versioned offer record.</p>}
        </section>}
        <section className={panel}>
          <h2 className="mb-4 text-xl font-bold">Project brief</h2><ProjectDescription text={project.description}/>
          {!!project.skills?.length && <div className="mt-5 border-t border-[#eadfd2] pt-4"><h3 className="mb-2 text-sm font-semibold">Required skills</h3>
            <div className="flex flex-wrap gap-2">{project.skills.map((skill,i)=><span key={i} className="rounded-lg bg-[#f5eee4] px-2.5 py-1 text-sm [overflow-wrap:anywhere]">{skill}</span>)}</div></div>}
        </section>
      </div>
      <aside className={panel+" space-y-5"}>
        <section><h2 className="text-lg font-bold">{active ? "Project workspace" : "Project activity"}</h2>
          {active && <p className="mt-2 text-sm text-[#745d4b]">{milestones.length ? milestones.length + (milestones.length === 1 ? " milestone" : " milestones") + " planned · " + projectMoney(milestones.reduce((sum,m)=>sum+Number(m.amount),0)) + " allocated" : "Ready to plan the first milestone."}</p>}
          {active && <a href="#milestones" className={action+" mt-4"}><Layers3 size={16}/> Open milestone workspace</a>}
          <dl className="my-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-[#745d4b]">Proposals</dt><dd className="text-xl font-semibold">{activity.proposals}</dd></div>
            <div><dt className="text-[#745d4b]">Invitations</dt><dd className="text-xl font-semibold">{activity.invitations}</dd></div>
          </dl>
          <Link href={offersUrl} className={active ? secondary : action}>View negotiations <ArrowUpRight size={15}/></Link>
        </section>
        {agreement && <section className="border-t border-[#eadfd2] pt-4"><h3 className="text-sm font-bold">Original listing</h3><p className="mt-2 text-sm">{projectMoney(project.advertisedBudget)} · {projectDate(project.advertisedDeadline)}</p></section>}
        <EvidenceList files={project.evidence} title="Project reference files" empty="No project reference files have been added."/>
        {open && <section className="border-t border-[#eadfd2] pt-4">
          {draft && <PublishForm project={project} onPublished={onPublish}/>}
          <div className="flex flex-wrap items-center gap-3">
            {activity.pending===0 && <Link className={secondary} href={"/client/projects/"+project.id+"/edit"}>Edit project</Link>}
            <button type="button" className="min-h-11 rounded-lg px-2 text-sm font-semibold text-[#a23626] hover:underline" disabled={cancelling} onClick={onCancel}>{cancelling?"Cancelling…":"Cancel project"}</button>
          </div>
          {activity.pending>0 && <p className="mt-2 text-sm text-[#745d4b]">Listing edits unlock when pending negotiations close.</p>}
          {cancelError && <p role="alert" className="mt-2 text-sm text-red-700">{cancelError}</p>}
        </section>}
      </aside>
    </div>
  </div>;
}
