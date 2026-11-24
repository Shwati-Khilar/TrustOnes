import { prisma } from "@/lib/prisma";
import { EvidenceError } from "@/lib/evidence-error";
import { evidenceLimits } from "./evidence-upload";

export const evidenceSelect={id:true,filename:true,mediaType:true,byteSize:true,audience:true,createdAt:true,uploader:{select:{name:true}}};
export const references=(sharedOnly=false)=>({
  where:{revisionId:null,...(sharedOnly?{audience:"PROJECT_VIEWERS"}:{})},
  orderBy:[{createdAt:"asc"},{position:"asc"}],select:evidenceSelect,
});
export const revisionFiles={orderBy:{position:"asc"},select:evidenceSelect};

export async function storeEvidence(tx,files,uploaderId,projectId,revisionId=null) {
  if(!files?.length) return;
  const limits=evidenceLimits();
  const existing=revisionId ? 0 : await tx.collaborationAttachment.count({where:{projectId,revisionId:null}});
  if(existing+files.length>(revisionId?limits.revisionCount:limits.briefCount)) throw new EvidenceError("Attachment count limit exceeded.",413);
  for(const [position,file] of files.entries()) {
    const object=await tx.privateFileObject.create({data:{bytes:file.bytes},select:{id:true}});
    try {
      await tx.collaborationAttachment.create({data:{storageKey:object.id,projectId,uploaderId,revisionId,
      filename:file.filename,byteSize:file.bytes.length,mediaType:file.mediaType,digest:file.digest,
      audience:file.audience,batchId:file.batchId,position},select:{id:true}});
    } catch(error) {
      if(error.code==="P2002") throw new EvidenceError("This submission already exists. Refresh to see the saved record.",409);
      throw error;
    }
  }
}

export async function retrieveEvidence(id,user,listingAccess,metadataOnly) {
  const missing=()=>new EvidenceError("File unavailable.",404);
  if(!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id)) throw missing();
  const membership=user.role==="CLIENT" ? {project:{clientId:user.id}} : {OR:[
    {revisionId:null,audience:"PROJECT_VIEWERS",project:listingAccess(user.id)},
    {audience:"PARTICIPANTS",revision:{negotiation:{freelancerId:user.id}}},
  ]};
  const row=await prisma.collaborationAttachment.findFirst({where:{id,...membership},select:{
    ...evidenceSelect,...(metadataOnly?{}:{digest:true,object:{select:{id:true,bytes:true,bucket:true,version:true}}}),
  }});
  if(!row || (!metadataOnly && !row.object)) throw missing();
  if(!metadataOnly && row.object.bytes===null) {
    try {
      const {readBucketFile}=await import("@/lib/private-object-store.mjs");
      row.object.bytes=await readBucketFile(row);
    } catch {
      throw new EvidenceError("File storage is temporarily unavailable.",503);
    }
  }
  return row;
}
