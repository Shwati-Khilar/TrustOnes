import Busboy from "busboy";
import { createHash } from "node:crypto";
import { EvidenceError } from "@/lib/evidence-error";
import { defaultEvidenceLimits } from "@/lib/evidence-policy";
import { validateEvidence } from "./evidence-format";

function limit(name,fallback,max) {
  const value=Number(process.env[name]);
  return Number.isSafeInteger(value) && value>0 ? Math.min(value,max) : fallback;
}
export function evidenceLimits() {
  return {
    fileBytes:limit("EVIDENCE_FILE_BYTES",defaultEvidenceLimits.fileBytes,10*1048576),
    requestBytes:limit("EVIDENCE_REQUEST_BYTES",defaultEvidenceLimits.requestBytes,32*1048576),
    briefCount:limit("EVIDENCE_BRIEF_COUNT",10,10), revisionCount:limit("EVIDENCE_REVISION_COUNT",5,5),
  };
}

async function readBounded(request,max) {
  const tooLarge=()=>new EvidenceError("The request exceeds the upload limit.",413);
  if (Number(request.headers.get("content-length"))>max) throw tooLarge();
  const reader=request.body?.getReader();
  if (!reader) throw new EvidenceError("Empty request.");
  let size=0; const chunks=[];
  try {
    while (true) {
      const {done,value}=await reader.read();
      if (done) break;
      size+=value.byteLength;
      if (size>max) { await reader.cancel(); throw tooLarge(); }
      chunks.push(value);
    }
    return Buffer.concat(chunks);
  } finally { reader.releaseLock(); }
}
function json(text) {
  try { return JSON.parse(text); } catch { throw new EvidenceError("Invalid submission data."); }
}
function parseParts(bytes,type,limits,count,brief) {
  return new Promise((resolve,reject)=>{
    let parser;
    try { parser=Busboy({headers:{"content-type":type},preservePath:true,defParamCharset:"utf8",
      limits:{fieldSize:64*1024,fields:1,files:count,fileSize:limits.fileBytes+1,parts:count+2}}); }
    catch { reject(new EvidenceError("Invalid upload format.")); return; }
    const files=[]; let payload;
    const invalid=()=>reject(new EvidenceError("Invalid upload parts."));
    const oversized=()=>reject(new EvidenceError("Too many files or upload limit exceeded.",413));
    parser.on("fieldsLimit",invalid).on("partsLimit",oversized).on("filesLimit",oversized);
    parser.on("field",(key,value,info)=>{
      if(key!=="payload" || info.valueTruncated || payload!==undefined) invalid();
      else payload=value;
    });
    parser.on("file",(key,stream,{filename,mimeType})=>{
      const allowed=brief ? ["CLIENT_ONLY","PROJECT_VIEWERS"] : ["PARTICIPANTS"];
      if (!allowed.includes(key)) invalid();
      const file={filename,mediaType:mimeType,audience:key};
      files.push(file);
      const chunks=[];
      stream.on("limit",oversized).on("error",invalid).on("data",chunk=>chunks.push(chunk)).on("end",()=>{
        file.bytes=Buffer.concat(chunks);
        if(file.bytes.length>limits.fileBytes) oversized();
      });
    });
    parser.on("error",invalid).on("close",()=>resolve({payload,files}));
    parser.end(bytes);
  });
}
let validating=0;
export async function evidenceSubmission(request,brief=false) {
  const type=request.headers.get("content-type") || "";
  if (type.split(";")[0].trim().toLowerCase()==="application/json") {
    return {input:json((await readBounded(request,65536)).toString("utf8")),files:[]};
  }
  if (!/^multipart\/form-data\s*;/i.test(type)) throw new EvidenceError("Use JSON or a multipart upload.",415);
  const origin=new URL(process.env.NEXTAUTH_URL || request.url).origin;
  const batch=request.headers.get("x-evidence-batch");
  if(request.headers.get("origin")!==origin || !batch || !/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(batch)) {
    throw new EvidenceError("Upload origin or submission token is invalid.",403);
  }
  if(validating>=4) throw new EvidenceError("Upload service busy. Please retry.",429);
  validating++;
  try {
    const limits=evidenceLimits();
    const bytes=await readBounded(request,limits.requestBytes);
    const {payload,files}=await parseParts(bytes,type,limits,brief?limits.briefCount:limits.revisionCount,brief);
    const input=json(payload);
    for(const file of files) {
      await validateEvidence(file.filename,file.mediaType,file.bytes);
      file.digest=createHash("sha256").update(file.bytes).digest("hex");
      file.batchId=batch;
    }
    return {input,files};
  } finally { validating--; }
}
