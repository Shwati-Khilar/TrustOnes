"use client";
import Link from "next/link";

export default function MobileMarketNav({portal}) {
  const client=portal==="client";
  const routes=[["Dashboard","dashboard"],["Projects","projects"],[client?"Freelancers":"Discover projects",client?"freelancers":"discover"],
    ["Invitations and proposals",client?"offers":"invites"],[client?"Create project":"Deal rooms",client?"projects/create":"deal-rooms"],["Profile","profile"],["Settings","settings"]];
  return <details className="relative lg:hidden"><summary className="cursor-pointer rounded-xl border border-[#eadfd2] bg-white px-3 py-2 text-sm font-bold">Menu</summary>
    <nav className="absolute left-0 z-30 mt-1 w-56 rounded-xl border border-[#eadfd2] bg-white p-2 shadow-lg">
      {routes.map(([label,path])=><Link key={path} className="block rounded-lg p-2 hover:bg-[#fff7ed]" href={"/"+portal+"/"+path} onClick={e=>e.currentTarget.closest("details")?.removeAttribute("open")}>{label}</Link>)}
    </nav></details>;
}
