import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { projectDate, projectMoney, projectPreview } from "@/lib/project-presentation";

export default function DiscoveryProjectCard({ project }) {
  const { title, category, budget, deadline, skills, proposals } = project;
  const current = proposals.find(item => item.status === "PENDING") || proposals.find(item => item.kind === "PROPOSAL");
  const status = current ? (current.kind === "INVITATION" ? "Invitation" : "Proposal") + " · " + current.status.toLowerCase() : "Open for proposals";
  return (
    <article className="flex min-w-0 flex-col rounded-3xl border border-[#e3d6c8] bg-[#fffdf9] p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        <span className="uppercase tracking-widest text-[#80573d]">{category}</span>
        <span className="rounded-full bg-[#eff3e9] px-2.5 py-1 text-[#425135]">{status}</span>
      </div>
      <h2 className="mt-4 text-xl font-bold leading-tight tracking-tight text-[#2b190f] [overflow-wrap:anywhere]">{title}</h2>
      <p data-project-preview className="mt-2 line-clamp-3 text-sm leading-6 text-[#675547] [overflow-wrap:anywhere]">{projectPreview(project.description)}</p>
      <div className="mb-5 mt-4 flex flex-wrap gap-1.5">
        {skills.slice(0,3).map((skill,i)=><span key={i} className="max-w-full rounded-lg bg-[#f5eee4] px-2 py-1 text-xs font-medium text-[#654734] [overflow-wrap:anywhere]">{skill}</span>)}
        {skills.length>3 && <span className="px-1 py-1 text-xs text-[#715e4e]">+{skills.length-3} more</span>}
      </div>
      <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-[#eadfd2] pt-4">
        <div><dt className="text-xs text-[#776454]">Listed budget</dt><dd className="mt-1 font-bold text-[#342016]">{projectMoney(budget)}</dd></div>
        <div><dt className="flex items-center gap-1 text-xs text-[#776454]"><CalendarDays size={13}/> Deadline</dt><dd className="mt-1 text-sm font-bold">{projectDate(deadline)}</dd></div>
      </dl>
      <Link href={"/freelancer/discover/"+project.id} className="mt-5 inline-flex min-h-11 items-center justify-between rounded-xl bg-[#703821] px-4 font-semibold text-white transition hover:bg-[#542917] focus-visible:outline-2 focus-visible:outline-offset-2">
        View project <ArrowUpRight size={17} aria-hidden="true"/>
      </Link>
    </article>
  );
}
