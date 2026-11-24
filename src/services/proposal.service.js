import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { respond, startNegotiation, money } from "@/services/marketplace.service";
import { serviceResult } from "@/services/service-result";

const application = z.strictObject({ bidAmount:money, estimatedDays:z.coerce.number().int().positive(),
  coverLetter:z.string().trim().min(1).max(4000), scope:z.string().trim().min(1).max(8000).optional() });
export function createProposal(userId,projectId,input,files) {
  return serviceResult(async()=>{
    const data=application.parse(input);
    const thread=await startNegotiation(userId,{amount:data.bidAmount,days:data.estimatedDays,scope:data.scope||data.coverLetter,note:data.coverLetter},{projectId},"PROPOSAL",files);
    return {proposal:{...thread,bidAmount:data.bidAmount,estimatedDays:data.estimatedDays,coverLetter:data.coverLetter}};
  },201);
}
export function getProjectProposals(clientId,projectId) {
  return serviceResult(async()=>{
    await prisma.project.findFirstOrThrow({where:{id:projectId,clientId},select:{id:true}});
    const proposals=await prisma.proposal.findMany({where:{projectId,kind:"PROPOSAL"},include:{freelancer:{select:{id:true,name:true,image:true}}},orderBy:{createdAt:"desc"}});
    return {proposals};
  });
}
export function acceptProposal(clientId,proposalId) {
  return serviceResult(async()=>{
    const item=await prisma.proposal.findFirstOrThrow({where:{id:proposalId,kind:"PROPOSAL",project:{clientId}}});
    // Legacy clients can accept only the original proposal. Counters use the versioned endpoint.
    const proposal=await respond(clientId,{action:"ACCEPT",version:1},{negotiationId:proposalId});
    return {proposal,project:await prisma.project.findUniqueOrThrow({where:{id:item.projectId}})};
  });
}
