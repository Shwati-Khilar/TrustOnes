import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import bcrypt from "bcryptjs";
import { SessionClient,startFixture } from "./auth-fixture.mjs";
import { pdf,image,docx } from "./evidence-samples.mjs";

const run=promisify(execFile);
const objects=new Map();
let bucketServer, simulateFailure=false;
let fx,owner,worker,other,outsider,anonymous,logo;
const listing={title:"Print identity",description:"Packaging project.",category:"Design",budget:18500,deadline:new Date(Date.now()+86400000*60).toISOString()};
const terms={amount:"15000.25",days:15,scope:"Prepare print-ready artwork.",note:"Review the attached evidence."};
const pdfFile=(name="reference.pdf",audience="PARTICIPANTS")=>({name,audience,type:"application/pdf",bytes:pdf()});
const docType="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
async function account(id,role) {
  const password=randomUUID();
  await fx.pool.query('INSERT INTO users(id,name,email,role,status,"emailVerified","passwordHash","updatedAt") VALUES ($1,$1,$2,$3,\'ACTIVE\',true,$4,now())',[id,id+"@example.invalid",role,await bcrypt.hash(password,6)]);
  const session=new SessionClient(fx.origin);
  await session.auth("callback/credentials",{email:id+"@example.invalid",password});
  return session;
}
async function result(response,status) {
  const data=await response.json();
  assert.equal(response.status,status,JSON.stringify(data.message)); return data;
}
async function json(who,path,method,data,status=200) {
  return result(await who.request("/api/"+path,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}),status);
}
async function submit(who,path,method,payload,files,status=200,headers={}) {
  const form=new FormData(); form.set("payload",JSON.stringify(payload));
  for(const f of files) form.append(f.audience,new Blob([f.bytes],{type:f.type}),f.name);
  return result(await who.request("/api/"+path,{method,headers:{origin:fx.origin,"x-evidence-batch":randomUUID(),...headers},body:form}),status);
}
async function publish(id,visibility) {return json(owner,"projects/"+id+"/publish","POST",{visibility});}
async function file(who,item,status=200,query="") {
  const res=await who.request("/api/attachments/"+item.id+query);
  assert.equal(res.status,status); return res;
}
before(async()=>{
  // Local versioned bucket protocol fixture. Never contact a cloud account.
  bucketServer=createServer(async(req,res)=>{
    const url=new URL(req.url,"http://localhost");
    if(!req.headers.authorization?.startsWith("AWS4-HMAC-SHA256 ")) {res.writeHead(403).end();return;}
    if(simulateFailure) {res.writeHead(403).end();return;}
    if(req.method==="PUT") {
      if(objects.has(url.pathname)) {res.writeHead(412).end();return;}
      const chunks=[]; for await(const chunk of req) chunks.push(chunk);
      objects.set(url.pathname,Buffer.concat(chunks));
      res.writeHead(200,{"x-amz-version-id":"fixture-v1"}).end();return;
    }
    const bytes=objects.get(url.pathname);
    if(req.method!=="GET" || !bytes || (url.searchParams.has("versionId") && url.searchParams.get("versionId")!=="fixture-v1")) {
      res.writeHead(404).end();return;
    }
    res.writeHead(200,{"x-amz-version-id":"fixture-v1","Content-Length":bytes.length}).end(bytes);
  });
  await new Promise(resolve=>bucketServer.listen(0,"127.0.0.1",resolve));
  Object.assign(process.env,{EVIDENCE_S3_ENDPOINT:"http://127.0.0.1:"+bucketServer.address().port,
    EVIDENCE_S3_BUCKET:"evidence-fixture",AWS_ACCESS_KEY_ID:"fixture",AWS_SECRET_ACCESS_KEY:"test-fixture-only",AWS_EC2_METADATA_DISABLED:"true"});
  fx=await startFixture({beforeMigration:async(pool,name)=>{
    if (!name.endsWith("collaboration_attachments")) return;
    await pool.query(`INSERT INTO users(id,name,email,role,"updatedAt") VALUES ('upgrade-c','Client','upgrade-c@example.invalid','CLIENT',now()),('upgrade-f','Worker','upgrade-f@example.invalid','FREELANCER',now());
      INSERT INTO projects(id,title,description,category,budget,deadline,"clientId","updatedAt") VALUES ('upgrade-p','Prior assignment','Design','Design',100,now(),'upgrade-c',now());
      INSERT INTO proposals(id,"projectId","freelancerId","coverLetter","bidAmount","estimatedDays",status,"updatedAt") VALUES ('upgrade-n','upgrade-p','upgrade-f','Prior note',100,5,'ACCEPTED',now());
      INSERT INTO offer_revisions(id,"negotiationId",version,"senderId","recipientId",amount,days,scope,note) VALUES ('upgrade-o','upgrade-n',1,'upgrade-f','upgrade-c',100,5,'Original scope','Prior note');
      UPDATE projects SET "acceptedOfferId"='upgrade-o',"acceptedAt"=now(),"freelancerId"='upgrade-f',status='ACTIVE' WHERE id='upgrade-p';`);
  }});
  anonymous=new SessionClient(fx.origin);
  [owner,worker,other,outsider]=await Promise.all([account("buyer","CLIENT"),account("artist","FREELANCER"),account("other","FREELANCER"),account("outsider","CLIENT")]);
  logo=await image();
});
after(async()=>{await fx?.stop(); if(bucketServer) await new Promise(resolve=>bucketServer.close(resolve));});

test("upgrade preserves a prior S2 accepted revision and its assignment",async()=>{
  const {rows}=await fx.pool.query('SELECT p."acceptedOfferId",r.scope FROM projects p JOIN offer_revisions r ON r.id=p."acceptedOfferId" WHERE p.id=\'upgrade-p\'');
  assert.deepEqual(rows,[{acceptedOfferId:"upgrade-o",scope:"Original scope"}]);
});

test("project files commit atomically with the draft, stay private by default and honor current listing access",async()=>{
  const batch=randomUUID();
  const files=[pdfFile("costs.pdf","CLIENT_ONLY"),{name:"sample.png",audience:"PROJECT_VIEWERS",type:"image/png",bytes:logo}];
  const {project}=await submit(owner,"projects","POST",listing,files,201,{"x-evidence-batch":batch});
  await submit(owner,"projects","POST",listing,files,409,{"x-evidence-batch":batch});
  const detail=(await json(owner,"projects/"+project.id,"GET")).project;
  const [privateDoc,shared]=detail.evidence;
  assert.equal(detail.evidence.length,2);
  assert.equal(privateDoc.storageKey,undefined);
  await file(anonymous,shared,401); await file(worker,shared,404); await file(outsider,privateDoc,404,"?view=metadata");
  await publish(project.id,"PUBLIC");
  assert.deepEqual((await json(worker,"discovery/projects/"+project.id,"GET")).data.evidence.map(f=>f.id),[shared.id]);
  const preview=await file(worker,shared,200,"?view=preview");
  assert.equal(preview.headers.get("x-content-type-options"),"nosniff");
  assert.match(preview.headers.get("content-disposition"),/^inline/);
  assert.deepEqual(Buffer.from(await preview.arrayBuffer()),logo);
  assert.match((await file(owner,privateDoc,200,"?view=preview")).headers.get("content-disposition"),/^attachment/);
  await file(worker,privateDoc,404);
  await submit(outsider,"projects/"+project.id,"PATCH",listing,[pdfFile("other.pdf","CLIENT_ONLY")],404);
  await submit(owner,"projects/"+project.id,"PATCH",listing,[pdfFile("added.pdf","CLIENT_ONLY")]);
  assert.equal((await json(owner,"projects/"+project.id,"GET")).project.evidence.length,3);
  await file(owner,{id:randomUUID()},404);
});
test("bounded validation rejects unsupported formats, mismatches, filenames, excess count and untrusted origin without persisting bytes",async()=>{
  const count=async()=>(await fx.pool.query("SELECT count(*)::int AS n FROM private_file_objects")).rows[0].n;
  const initial=await count();
  const base=pdfFile("brief.pdf","CLIENT_ONLY");
  for(const [over,status] of [[{name:"sample.txt"},415],[{name:"folder/brief.pdf"},400],[{type:"image/png"},415],[{bytes:Buffer.from("not a document")},415],[{name:"brief.docx",type:docType},415],[{bytes:Buffer.alloc(10*1048576+1)},413]]) {
    await submit(owner,"projects","POST",listing,[{...base,...over}],status);
  }
  await submit(owner,"projects","POST",listing,Array(11).fill(base),413);
  await submit(owner,"projects","POST",listing,[base],403,{origin:"https://example.invalid"});
  await submit(owner,"projects","POST",{...listing,title:""},[base],400);
  await submit(owner,"projects","POST",listing,[{...base,audience:"PARTICIPANTS"}],400);
  assert.equal(await count(),initial);
});
test("proposal DOCX stays with its original participants after rejection",async()=>{
  const p=(await json(owner,"projects","POST",listing,201)).project;
  await publish(p.id,"PUBLIC");
  const {proposal}=await submit(worker,"projects/"+p.id+"/proposals","POST",{bidAmount:16500,estimatedDays:12,coverLetter:"See technical approach."},[
    {name:"approach.docx",type:docType,bytes:docx(),audience:"PARTICIPANTS"}],201);
  const item=proposal.offers[0].attachments[0];
  await json(owner,"negotiations/"+proposal.id,"PATCH",{action:"REJECT",version:1});
  const res=await file(owner,item);
  assert.equal(res.headers.get("content-type"),docType);
  assert.deepEqual(Buffer.from(await res.arrayBuffer()),docx());
  await file(worker,item); await file(other,item,404); await file(outsider,item,404);
});
test("private invitations, counters and acceptance retain exactly each revision's evidence",async()=>{
  const {project}=await submit(owner,"projects","POST",listing,[pdfFile("shared.pdf","PROJECT_VIEWERS")],201);
  await publish(project.id,"PRIVATE");
  const start="projects/"+project.id+"/invitations";
  const sent=(await submit(owner,start,"POST",{...terms,freelancerId:"artist"},[pdfFile("invitation.pdf")],201)).data;
  await submit(owner,start,"POST",{...terms,freelancerId:"artist"},[pdfFile()],409);
  const url="negotiations/"+sent.id;
  await submit(worker,url,"PATCH",{...terms,action:"COUNTER",version:1},[pdfFile("worker.pdf")]);
  await submit(worker,url,"PATCH",{...terms,action:"COUNTER",version:1},[pdfFile("stale.pdf")],409);
  await submit(owner,url,"PATCH",{...terms,action:"COUNTER",version:2},[pdfFile("final.pdf")]);
  const accepted=(await json(worker,url,"PATCH",{action:"ACCEPT",version:3})).data;
  assert.deepEqual(accepted.offers.map(o=>o.attachments.map(f=>f.filename)),[["invitation.pdf"],["worker.pdf"],["final.pdf"]]);
  assert.deepEqual((await json(owner,url,"GET")).data,accepted);
  assert.equal(accepted.project.acceptedOfferId,accepted.offers[2].id);
  assert.equal(accepted.project.references[0].filename,"shared.pdf");
  await submit(owner,start,"POST",{...terms,freelancerId:"artist"},Array(6).fill(pdfFile()),413);
  for(const item of [accepted.project.references[0],...accepted.offers.flatMap(o=>o.attachments)]) {
    await file(owner,item); await file(worker,item); await file(other,item,404); await file(outsider,item,404);
  }
  await submit(owner,"projects/"+project.id,"PATCH",listing,[pdfFile("late.pdf","CLIENT_ONLY")],409);
  await submit(owner,url,"PATCH",{...terms,action:"COUNTER",version:3},[pdfFile("late.pdf")],409);
  const id=accepted.offers[2].attachments[0].id;
  await assert.rejects(fx.pool.query("UPDATE collaboration_attachments SET filename='changed.pdf' WHERE id=$1",[id]),/immutable/);
  const n=await fx.pool.query('SELECT count(*)::int AS n FROM collaboration_attachments WHERE "projectId"=$1',[project.id]);
  assert.equal(n.rows[0].n,4);
});

test("private bucket offload verifies the exact version, survives retries and preserves resource authorization",async()=>{
  const {project}=await submit(owner,"projects","POST",listing,[pdfFile("retained.pdf","CLIENT_ONLY")],201);
  const [item]=(await json(owner,"projects/"+project.id,"GET")).project.evidence;
  const options={env:{...process.env,DATABASE_URL:fx.databaseUrl}};
  const offload=()=>run(process.execPath,["scripts/offload-evidence.mjs"],options);
  simulateFailure=true;
  await assert.rejects(offload);
  assert.deepEqual(Buffer.from(await (await file(owner,item)).arrayBuffer()),pdf());
  simulateFailure=false;
  await offload();
  const {rows:[stored]}=await fx.pool.query('SELECT o.* FROM private_file_objects o JOIN collaboration_attachments a ON a."storageKey"=o.id WHERE a.id=$1',[item.id]);
  assert.equal(stored.bytes,null);
  assert.equal(stored.version,"fixture-v1");
  assert.equal(stored.bucket,"evidence-fixture");
  assert.deepEqual(Buffer.from(await (await file(owner,item)).arrayBuffer()),pdf());
  await file(outsider,item,404);
  assert.match((await offload()).stdout,/recorded: 0/);
  objects.delete("/evidence-fixture/precontract/v1/"+stored.id);
  await file(owner,item,503);
  await file(outsider,item,404);
  await file(owner,item,200,"?view=metadata");
});

test("JPEG and WebP references decode, suspended access is denied and JSON cannot select storage keys",async()=>{
  const files=await Promise.all(["jpeg","webp"].map(async ext=>({name:"sample."+ext,type:"image/"+ext,bytes:await image(ext),audience:"PROJECT_VIEWERS"})));
  const {project}=await submit(owner,"projects","POST",listing,files,201);
  await publish(project.id,"PUBLIC");
  const evidence=(await json(worker,"discovery/projects/"+project.id,"GET")).data.evidence;
  for(const [i,item] of evidence.entries()) assert.deepEqual(Buffer.from(await (await file(worker,item)).arrayBuffer()),files[i].bytes);
  await json(owner,"projects/"+project.id,"PATCH",{...listing,storageKey:randomUUID()},400);
  await fx.pool.query("UPDATE users SET status='SUSPENDED' WHERE id='other'");
  await file(other,evidence[0],403);
});
