export class EvidenceError extends Error {
  constructor(message,status=400) { super(message); this.status=status; }
}
export function evidenceErrorResponse(error) {
  return error instanceof EvidenceError
    ? Response.json({success:false,message:error.message},{status:error.status,headers:{"Cache-Control":"no-store"}})
    : null;
}
