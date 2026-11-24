import { requirePortal } from "@/lib/portal-session";
import { prisma } from "@/lib/prisma";

export default async function SandboxLedger({role}) {
  const user=await requirePortal(role);
  const payments=await prisma.paymentTransaction.findMany({where:{provider:"SIMULATED",
    ...(role==="CLIENT"?{clientId:user.id}:{funding:{freelancerId:user.id}})},
    select:{id:true,amount:true,createdAt:true,funding:{select:{milestone:{select:{title:true,project:{select:{title:true}}}}}}},
    orderBy:{createdAt:"desc"}});
  return <section className="space-y-5"><h1 className="text-3xl font-black">{role==="CLIENT"?"Escrow":"Wallet"}</h1>
    <article className="space-y-4 rounded-[2rem] border border-[#eadfd2] bg-white/80 p-6"><h2 className="text-xl font-bold">Simulated funding history</h2>
    <p>Provider settlement, cash balances and withdrawals are unavailable in this sandbox.</p>
    {payments.length===0&&<p>No simulated funding records yet.</p>}{payments.map(p=><div key={p.id} className="border-t pt-3">
      <strong>{p.funding.milestone.project.title} · {p.funding.milestone.title}</strong><p>Simulated INR {String(p.amount)} · {p.createdAt.toISOString().slice(0,10)}</p></div>)}</article></section>;
}
