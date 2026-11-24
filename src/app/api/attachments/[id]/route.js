import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { evidenceErrorResponse } from "@/lib/evidence-error";
import { retrieveEvidence } from "@/services/evidence-storage";
import { freelancerListingAccess } from "@/services/marketplace.service";

export async function GET(request,{params}) {
  try {
    const session=await getServerSession(authOptions);
    const access=requireRole(session,["CLIENT","FREELANCER"]);
    if(!access.allowed) return Response.json({message:access.message},{status:access.status,headers:{"Cache-Control":"no-store"}});
    const mode=new URL(request.url).searchParams.get("view");
    const file=await retrieveEvidence((await params).id,session.user,freelancerListingAccess,mode==="metadata");
    const headers={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Cross-Origin-Resource-Policy":"same-origin",
      "Content-Security-Policy":"default-src 'none'; sandbox","Referrer-Policy":"no-referrer"};
    if(mode==="metadata") return Response.json({data:file},{headers});
    const inline=mode==="preview" && file.mediaType.startsWith("image/");
    const encoded=encodeURIComponent(file.filename).replace(/['()*]/g,c=>"%"+c.charCodeAt(0).toString(16));
    return new Response(file.object.bytes,{headers:{...headers,"Content-Type":file.mediaType,"Content-Length":String(file.byteSize),
      "Content-Disposition":(inline?"inline":"attachment")+"; filename*=UTF-8''"+encoded}});
  } catch(error) {
    return evidenceErrorResponse(error) || Response.json({message:"Unable to retrieve file."},{status:500,headers:{"Cache-Control":"no-store"}});
  }
}
