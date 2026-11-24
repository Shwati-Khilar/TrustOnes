import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaPackage from "@prisma/client";
import { SessionClient, startFixture } from "./auth-fixture.mjs";

let fx,db,owner,other,a,b,hidden;
const password=randomBytes(24).toString("hex");
const deadline=new Date(Date.now()+86400000*30).toISOString();
const terms={amount:"15000.25",days:15,scope:"Design and deliver the approved pages",note:"Please review"};
const data={title:"Public prototype",description:"Interface design",budget:"23000.50",category:"Design",skills:["Design","UX"],deadline};
async function account(id,role) {
  await db.user.create({data:{id,name:id,email:id+"@example.invalid",role,status:"ACTIVE",emailVerified:true,passwordHash:await bcrypt.hash(password,6)}});
  return login(id);
}
async function login(id) {const client=new SessionClient(fx.origin);await client.auth("callback/credentials",{email:id+"@example.invalid",password});return client;}
async function request(session,path,method="GET",input,status=200) {
  const r=await session.request("/api/"+path,{method,headers:{"Content-Type":"application/json"},body:input===undefined?undefined:JSON.stringify(input)});
  const value=await r.json();assert.equal(r.status,status,path+" "+JSON.stringify(value.message));return value;
}
const patch=(s,path,input,status)=>request(s,path,"PATCH",input,status);
const post=(s,path,input,status)=>request(s,path,"POST",input,status);
async function draft(extra={}) {return (await post(owner,"projects",{...data,...extra},201)).project;}
async function listing(visibility="PUBLIC") {const p=await draft();await post(owner,"projects/"+p.id+"/publish",{visibility});return p;}
async function apply(p,session=a,status=201) {return (await post(session,"projects/"+p.id+"/proposals",{bidAmount:"14500.75",estimatedDays:11,coverLetter:"Application letter",scope:"Defined scope"},status)).proposal;}
async function invite(p,worker="alice",status=201) {return (await post(owner,"projects/"+p.id+"/invitations",{...terms,freelancerId:worker},status)).data;}
const action=(session,n,op,version=1,status=200,more={})=>patch(session,"negotiations/"+n.id,{action:op,version,...more},status);
const details=async(s,n)=>(await request(s,"negotiations/"+n.id)).data;
before(async()=>{
  fx=await startFixture({beforeMigration:async(pool,name)=>{
    if(!name.endsWith("_marketplace"))return;
    await pool.query(`INSERT INTO users(id,name,email,role,"updatedAt") VALUES ('legacy-c','Legacy','lc@example.invalid','CLIENT',now()),('legacy-f','Legacy','lf@example.invalid','FREELANCER',now());
      INSERT INTO projects(id,title,description,category,budget,deadline,"clientId","updatedAt") VALUES('legacy-p','Legacy','Original scope','Design',100,now()+interval '10 days','legacy-c',now());
      INSERT INTO proposals(id,"projectId","freelancerId","coverLetter","bidAmount","estimatedDays","updatedAt") VALUES('legacy-n','legacy-p','legacy-f','Original letter',91.25,3,now());
      INSERT INTO projects(id,title,description,category,budget,deadline,status,"clientId","freelancerId","updatedAt") VALUES('legacy-active','Existing assignment','Existing scope','Design',250,now()+interval '4 days','ACTIVE','legacy-c','legacy-f',now());
      INSERT INTO milestones(id,title,amount,"dueDate",status,"projectId","updatedAt") VALUES('legacy-m','Design files',75.55,now()+interval '2 days','SUBMITTED','legacy-active',now());
      INSERT INTO milestone_fundings(id,"milestoneId","clientId","freelancerId",amount,"freelancerReceivable",status,"updatedAt") VALUES('legacy-funding','legacy-m','legacy-c','legacy-f',75.55,75.55,'FUNDED_LOCKED',now());
      INSERT INTO payment_transactions(id,"milestoneFundingId","clientId",provider,amount,"updatedAt") VALUES('legacy-pay','legacy-funding','legacy-c','SIMULATED',75.55,now());
      INSERT INTO milestone_submissions(id,"milestoneId","freelancerId",title,"updatedAt") VALUES('legacy-sub','legacy-m','legacy-f','Existing submission',now());`);
  }});
  db=new prismaPackage.PrismaClient({adapter:new PrismaPg({connectionString:fx.databaseUrl})});
  [owner,other,a,b,hidden]=await Promise.all([account("buyer","CLIENT"),account("second","CLIENT"),account("alice","FREELANCER"),account("bob","FREELANCER"),account("hidden","FREELANCER")]);
});
after(async()=>{await db?.$disconnect();await fx?.stop();});

test("upgrade preserves legacy terms, privacy and existing rows; revisions cannot be rewritten",async()=>{
  const p=await db.project.findUniqueOrThrow({where:{id:"legacy-p"}});
  assert.equal(p.publishedAt,null);assert.equal(p.visibility,"PRIVATE");assert.equal(p.budget.toString(),"100");
  const o=await db.offerRevision.findUniqueOrThrow({where:{id:"legacy-legacy-n"}});
  assert.equal(o.amount.toString(),"91.25");assert.equal(o.note,"Original letter");assert.equal(o.scope,"Original scope");
  await assert.rejects(db.offerRevision.update({where:{id:o.id},data:{days:10}}));
});
test("published public discovery, precise filters, profile privacy and publication controls",async()=>{
  assert.equal((await request(a,"discovery/projects")).data.items.length,0);
  assert.equal((await request(owner,"directory/freelancers?q=absent")).data.items.length,0);
  await patch(a,"freelancer/profile",{professionalTitle:"Product designer",skills:["Wireframing"],phone:"Private phone",location:"Delhi"});
  await patch(hidden,"freelancer/settings",{preferences:{profileVisible:false}});
  const suspended=await account("inactive","FREELANCER");
  await db.user.update({where:{id:"inactive"},data:{status:"SUSPENDED"}});
  await request(suspended,"discovery/projects","GET",undefined,403);
  const directory=(await request(owner,"directory/freelancers?q=wireframe".replace("wireframe","wirefram"))).data;
  assert.deepEqual(directory.items.map(x=>x.id),["alice"]);
  const profile=(await request(owner,"directory/freelancers/alice")).data;
  for(const key of ["email","passwordHash","userPreference","supportTickets","status","resetPasswordToken"])assert.equal(profile[key],undefined);
  assert.equal(profile.freelancerProfile.phone,undefined);
  for(const who of ["hidden","inactive"])await request(owner,"directory/freelancers/"+who,"GET",undefined,404);
  const p=await draft();assert.equal(p.publishedAt,null);
  await request(a,"discovery/projects/"+p.id,"GET",undefined,404);
  await patch(other,"projects/"+p.id,data,404);
  await post(other,"projects/"+p.id+"/publish",{visibility:"PUBLIC"},404);
  await post(owner,"projects",{...data,budget:"0.001"},400);
  await post(owner,"projects",{...data,deadline:"2001-01-01"},400);
  await patch(owner,"projects/"+p.id,{...data,title:"Filtered listing"});
  await post(owner,"projects/"+p.id+"/publish",{visibility:"PUBLIC"});
  assert.ok((await request(a,"discovery/projects?q=ux&category=Design&min=100&max=24000")).data.items.some(x=>x.id===p.id));
  assert.equal((await request(a,"discovery/projects?by=2001-01-01")).data.items.length,0);
  await request(owner,"discovery/projects","GET",undefined,403);
});
test("private invitation, turn taking, stale version, scope and accepted snapshot survive fresh sessions",async()=>{
  const p=await listing("PRIVATE");
  const n=await invite(p);
  await invite(p,"alice",409);await apply(p,b,404);
  assert.ok(!(await request(b,"discovery/projects")).data.items.some(x=>x.id===p.id));
  await request(b,"discovery/projects/"+p.id,"GET",undefined,404);
  await request(b,"negotiations/"+n.id,"GET",undefined,404);
  await action(other,n,"ACCEPT",1,404);await action(owner,n,"ACCEPT",1,403);
  await patch(owner,"projects/"+p.id,data,409);
  await action(a,n,"COUNTER",1,400,{...terms,amount:"-1"});assert.equal((await details(a,n)).offers.length,1);
  await action(a,n,"COUNTER",1,200,{...terms,amount:"20000",days:20});
  await action(owner,n,"ACCEPT",1,409);
  await action(owner,n,"COUNTER",2,200,{...terms,amount:"18000",days:20,scope:"Final scope"});
  await db.user.update({where:{id:"alice"},data:{emailVerified:false}});
  await action(a,n,"ACCEPT",3,403);
  await db.user.update({where:{id:"alice"},data:{emailVerified:true}});
  await action(a,n,"ACCEPT",3);
  await action(a,n,"ACCEPT",3,409);await action(owner,n,"COUNTER",3,409,terms);
  const buyerView=await details(await login("buyer"),n),workerView=await details(await login("alice"),n);
  assert.deepEqual(buyerView,workerView);
  assert.deepEqual(buyerView.offers.map(o=>[o.version,o.amount,o.days]),[[1,"15000.25",15],[2,"20000",20],[3,"18000",20]]);
  const actual=(await request(owner,"projects/"+p.id)).project;
  assert.equal(actual.freelancerId,"alice");assert.equal(actual.budget,"18000");assert.equal(actual.advertisedBudget,"23000.5");
  assert.equal(actual.acceptedOffer.scope,"Final scope");assert.equal(actual.acceptedOfferId,buyerView.offers.at(-1).id);
  assert.equal(Date.parse(actual.deadline)-Date.parse(actual.acceptedAt),20*86400000);
  await patch(owner,"projects/"+p.id,data,409);await patch(owner,"projects/"+p.id+"/cancel",{},409);
  assert.equal(await db.paymentTransaction.count({where:{funding:{milestone:{projectId:p.id}}}}),0);
  assert.equal(await db.milestone.count({where:{projectId:p.id}}),0);
});
test("proposals and invitations reject, withdraw, cancel and preserve all histories",async()=>{
  const p=await listing(); const n=await apply(p);
  await apply(p,a,409); await action(b,n,"ACCEPT",1,404);
  await action(a,n,"WITHDRAW"); await action(owner,n,"ACCEPT",1,409);
  const i=await invite(p);await action(a,i,"REJECT");await action(a,i,"ACCEPT",1,409);
  const i2=await invite(p);await action(owner,i2,"WITHDRAW");await action(a,i2,"ACCEPT",1,409);
  const otherThread=await invite(p,"bob");await patch(owner,"projects/"+p.id+"/cancel",{});
  assert.equal((await details(b,otherThread)).status,"CLOSED");await action(b,otherThread,"ACCEPT",1,409);await apply(p,b,409);
  const second=await listing();const application=await apply(second);await action(owner,application,"REJECT");
  assert.equal((await details(a,application)).status,"REJECTED");
});

async function race(s,n,op,extra={}) {
  const result=await s.request("/api/negotiations/"+n.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({version:1,action:op,...extra})});
  return result.status;
}
test("competing proposal and invitation acceptances serialize to one agreement",async()=>{
  const p=await listing(),application=await apply(p),invitation=await invite(p,"bob");
  assert.deepEqual((await Promise.all([race(owner,application,"ACCEPT"),race(b,invitation,"ACCEPT")])).sort(),[200,409]);
  const threads=await db.proposal.findMany({where:{projectId:p.id}});
  assert.deepEqual(threads.map(n=>n.status).sort(),["ACCEPTED","CLOSED"]);
  const won=threads.find(n=>n.status==="ACCEPTED");
  await request(won.freelancerId==="alice"?a:b,"freelancer/deal-rooms/"+p.id);
  await request(won.freelancerId==="alice"?b:a,"freelancer/deal-rooms/"+p.id,"GET",undefined,404);
});
test("counter, duplicate acceptance and cancellation races preserve consistent project state",async()=>{
  let p=await listing(),n=await apply(p);
  assert.deepEqual((await Promise.all([race(owner,n,"COUNTER",terms),race(owner,n,"ACCEPT")])).sort(),[200,409]);
  const result=await details(owner,n);assert.ok(result.status==="ACCEPTED" || result.version===2);
  if(result.version===2){await action(a,n,"ACCEPT",2);assert.equal((await details(a,n)).status,"ACCEPTED");}
  p=await listing();n=await apply(p);
  assert.deepEqual((await Promise.all([race(owner,n,"ACCEPT"),race(owner,n,"ACCEPT")])).sort(),[200,409]);
  p=await listing();n=await apply(p);
  const cancel=owner.request("/api/projects/"+p.id+"/cancel",{method:"PATCH"}).then(r=>r.status);
  assert.deepEqual((await Promise.all([race(owner,n,"ACCEPT"),cancel])).sort(),[200,409]);
  const record=await db.project.findUnique({where:{id:p.id}});
  assert.equal(Boolean(record.acceptedOfferId),record.status==="ACTIVE");
});

test("directory pages are bounded, disjoint and filtered by professional availability", async () => {
  const users = Array.from({length:26}, (_,index) => ({
    id: "paging-" + String(index).padStart(2,"0"), name: "Paging professional " + index,
    email: "paging-" + index + "@example.invalid", role: "FREELANCER", status: "ACTIVE", emailVerified: true,
  }));
  await db.user.createMany({data:users});
  const first = (await request(owner,"directory/freelancers?q=paging")).data;
  const second = (await request(owner,"directory/freelancers?q=paging&page=2")).data;
  assert.equal(first.total,26);
  assert.equal(second.total,26);
  const beyond = (await request(owner,"directory/freelancers?q=paging&page=3")).data;
  assert.equal(beyond.total,26);
  assert.deepEqual(beyond.items,[]);
  assert.equal(first.hasNext,true); assert.equal(second.hasNext,false);
  assert.equal(first.items.length,24); assert.equal(second.items.length,2);
  assert.equal(new Set([...first.items,...second.items].map(row=>row.id)).size,26);
  assert.equal((await request(owner,"directory/freelancers?q=paging&availability=BUSY_OPEN")).data.items.length,0);
  await request(owner,"directory/freelancers?page=0","GET",undefined,400);
});

test("client accepts a freelancer counter and legacy read filters retain proposal semantics", async () => {
  const p = await listing("PRIVATE");
  await post(owner,"projects/"+p.id+"/invitations",{...terms,freelancerId:"bob",clientId:"second"},400);
  const thread = await invite(p,"bob");
  await action(b,thread,"COUNTER",1,200,{...terms,amount:"19000.95",days:18});
  await action(owner,thread,"ACCEPT",2);
  const winner = (await request(owner,"projects/"+p.id)).project;
  assert.equal(winner.budget,"19000.95");
  assert.equal(winner.acceptedOffer.version,2);
  const filtered = (await request(b,"freelancer/invites?status=ACCEPTED&search=prototype")).data;
  assert.ok(filtered.invitations.some(row=>row.id===thread.id));
  assert.ok(filtered.proposals.every(row=>row.id!==thread.id && row.status==="ACCEPTED"));
  const profile = await request(b,"freelancer/profile");
  assert.equal(profile.data.stats.totalProposals,await db.proposal.count({where:{freelancerId:"bob",kind:"PROPOSAL"}}));
  await request(other,"negotiations/"+thread.id,"GET",undefined,404);
});

test("upgrade preserves previously assigned work, submission evidence and simulated payment history", async () => {
  const project = await db.project.findUniqueOrThrow({where:{id:"legacy-active"},
    include:{milestones:{include:{funding:{include:{payments:true}},submissions:true}}}});
  assert.equal(project.status,"ACTIVE");
  assert.equal(project.freelancerId,"legacy-f");
  assert.equal(project.acceptedOfferId,null);
  assert.equal(project.budget.toString(),"250");
  const [milestone] = project.milestones;
  assert.equal(milestone.status,"SUBMITTED");
  assert.equal(milestone.submissions[0].id,"legacy-sub");
  assert.equal(milestone.funding.status,"FUNDED_LOCKED");
  assert.equal(milestone.funding.payments[0].amount.toString(),"75.55");
  assert.equal(milestone.funding.payments[0].provider,"SIMULATED");
  await db.user.update({where:{id:"legacy-c"},data:{email:"legacy-c@example.invalid",passwordHash:await bcrypt.hash(password,6),emailVerified:true,status:"ACTIVE"}});
  const legacyOwner = await login("legacy-c");
  await request(legacyOwner,"projects/legacy-active/milestones/legacy-m","DELETE",undefined,409);
  assert.equal(await db.paymentTransaction.count({where:{id:"legacy-pay"}}),1);
  assert.equal(await db.milestoneSubmission.count({where:{id:"legacy-sub"}}),1);
});

test("each successful mutation returns the persisted history and stale writes preserve both portal views", async () => {
  const project = await listing();
  for (const terminal of ["REJECT","WITHDRAW","ACCEPT"]) {
    const thread = await invite(project);
    const counter = (await action(a,thread,"COUNTER",1,200,{...terms,amount:"18400.20"})).data;
    assert.deepEqual(counter,await details(owner,thread));
    assert.equal(counter.offers.at(-1).recipientId,"buyer");
    await action(a,thread,"ACCEPT",1,409);
    const result = (await action(owner,thread,terminal,2)).data;
    assert.equal(result.status,({REJECT:"REJECTED",WITHDRAW:"WITHDRAWN",ACCEPT:"ACCEPTED"})[terminal]);
    assert.deepEqual(result,await details(owner,thread));
    assert.deepEqual(result,await details(a,thread));
    await action(owner,thread,"ACCEPT",2,409);
    assert.deepEqual(await details(a,thread),result);
  }
});

test("directory invitation eligibility follows the owning client, publication and pending negotiations", async () => {
  const client = await account("directory-client","CLIENT");
  const route = "directory/freelancers?q=alice";
  const view = async () => (await request(client,route)).data.items[0];
  const project = (await post(client,"projects",data,201)).project;
  const endpoint = "projects/"+project.id+"/invitations";
  const offer = {...terms,freelancerId:"alice"};
  assert.equal((await view()).canInvite,false);
  await post(client,"projects/"+project.id+"/publish",{visibility:"PRIVATE"});
  assert.equal((await view()).canInvite,true);
  await post(other,endpoint,offer,404);
  const sent = (await post(client,endpoint,offer,201)).data;
  assert.equal((await view()).canInvite,false);
  await post(client,endpoint,offer,409);
  await action(client,sent,"WITHDRAW");
  assert.equal((await view()).canInvite,true);
});

test("filtered inbox totals, latest activity and navigation respect participants and listing access",async()=>{
  const project=await listing("PRIVATE");
  const n=await invite(project);
  const url="negotiations?projectId="+project.id+"&kind=INVITATION&search=alice";
  for(const session of [owner,a]) {
    const page=(await request(session,url)).data;
    assert.equal(page.total,1);
    assert.equal(page.counts.PENDING,1);
    assert.deepEqual(page.items.map(row=>row.id),[n.id]);
    assert.equal(page.items[0].offers.length,1);
    assert.ok(Number.isFinite(Date.parse(page.items[0].updatedAt)));
    assert.equal((await details(session,n)).freelancerCanOpenProject,true);
  }
  for(const session of [other,b]) {
    const page=(await request(session,url)).data;
    assert.equal(page.total,0);
    assert.deepEqual(page.counts,{});
    await request(session,"negotiations/"+n.id,"GET",undefined,404);
  }
  assert.equal((await details(a,n)).canExchangeTerms,true);
  await db.project.update({where:{id:project.id},data:{deadline:new Date(Date.now()-60000)}});
  assert.equal((await details(a,n)).canExchangeTerms,false);
  await action(a,n,"ACCEPT",1,409);
  await action(a,n,"REJECT");
  assert.equal((await details(a,n)).freelancerCanOpenProject,false);
  assert.equal((await request(owner,url+"&status=REJECTED")).data.counts.REJECTED,1);
  assert.equal((await request(owner,url+"&status=PENDING")).data.total,0);
  assert.equal((await request(owner,"negotiations?projectId="+project.id+"&kind=PROPOSAL")).data.total,0);
});
