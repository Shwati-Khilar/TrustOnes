import { storeEvidence, references, revisionFiles } from "./evidence-storage";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { AccountInputError } from "@/lib/account-api";

export function fail(status, message) { throw new AccountInputError(message, status); }
export const money = z.union([z.string(), z.number()]).transform(String)
  .pipe(z.string().regex(/^\d{1,10}(?:\.\d{1,2})?$/, "Enter an INR amount with up to two decimal places."))
  .refine(value => /[1-9]/.test(value), "Amount must be positive.");
const text = limit => z.string().trim().min(1).max(limit);
const termFields = { amount: money, days: z.coerce.number().int().min(1).max(3650),
  scope: text(8000), note: z.string().trim().max(4000).default("") };
const termsSchema = z.strictObject(termFields);
const profileSelect = { professionalTitle:true, bio:true, location:true, skills:true, experienceLevel:true,
  startingPrice:true, availability:true, portfolioLinks:true, educationHighlight:true };
const person = { id:true, name:true, image:true };
const eligible = { status:"ACTIVE", emailVerified:true };
const visibleWorker = { ...eligible, role:"FREELANCER", OR:[{userPreference:null},{userPreference:{profileVisible:true}}] };
const applicationWindow = () => ({status:"OPEN",freelancerId:null,publishedAt:{not:null},deadline:{gt:new Date()},client:{...eligible,role:"CLIENT"}});
const projectSelect = { id:true,title:true,description:true,category:true,skills:true,budget:true,deadline:true,
  visibility:true,publishedAt:true,status:true,client:{select:person} };
const responseSelect = { id:true,kind:true,status:true,version:true,createdAt:true,projectId:true,freelancerId:true,
  freelancer:{select:person},project:{select:{id:true,title:true,clientId:true,client:{select:person},status:true}},
  offers:{orderBy:{version:"asc"},include:{attachments:revisionFiles}} };

async function lockProject(tx,id) {
  await tx.$queryRaw`SELECT id FROM projects WHERE id=${id} FOR UPDATE`;
  const project = await tx.project.findUnique({where:{id}});
  if(!project) fail(404,"Project unavailable.");
  return project;
}
function owner(project,id) { if(project.clientId!==id) fail(404,"Project unavailable."); }
function open(project) {
  if(project.status!=="OPEN" || project.freelancerId) fail(409,"Project is closed to offers.");
}
async function checkPeople(tx,project,freelancerId) {
  const users=await tx.$queryRaw`SELECT id,role,status,"emailVerified" FROM users WHERE id IN (${project.clientId},${freelancerId}) ORDER BY id FOR SHARE`;
  for(const [id,role] of [[project.clientId,"CLIENT"],[freelancerId,"FREELANCER"]]) {
    if(!users.some(u=>u.id===id && u.role===role && u.status==="ACTIVE" && u.emailVerified)) fail(409,"A participant is no longer eligible.");
  }
}

export const listingFields=z.strictObject({title:text(180),description:z.string().max(8000).refine(value => value.trim().length > 0, "Enter a project description."),category:text(100),budget:money,
  deadline:z.coerce.date().refine(date=>date>new Date(),"Choose a future deadline."),
  skills:z.array(text(40)).max(24).optional(),visibility:z.enum(["PRIVATE","PUBLIC"]).optional()});
export function createDraft(clientId,input,files=[]) {
  const data=listingFields.parse(input);
  return prisma.$transaction(async tx=>{
    const project=await tx.project.create({data:{...data,clientId}});
    await storeEvidence(tx,files,clientId,project.id);
    return project;
  });
}
export function editListing(id,projectId,input,files=[]) {
  const data=listingFields.parse(input);
  return prisma.$transaction(async tx=>{
    const p=await lockProject(tx,projectId); owner(p,id); open(p);
    if(await tx.proposal.count({where:{projectId,status:"PENDING"}})) fail(409,"Resolve outstanding negotiations before editing the listing.");
    if(p.publishedAt && data.visibility && data.visibility!==p.visibility) fail(409,"Published visibility is fixed.");
    await storeEvidence(tx,files,id,projectId);
    return tx.project.update({where:{id:projectId},data});
  });
}
export function publish(id,input,{projectId}) {
  const {visibility}=z.strictObject({visibility:z.enum(["PUBLIC","PRIVATE"])}).parse(input);
  return prisma.$transaction(async tx=>{
    const p=await lockProject(tx,projectId); owner(p,id); open(p);
    if(p.publishedAt || p.deadline<=new Date()) fail(409,"Already published or past its deadline.");
    return tx.project.update({where:{id:projectId},data:{visibility,publishedAt:new Date()}});
  });
}
export function cancelListing(id,projectId) {
  return prisma.$transaction(async tx=>{
    const p=await lockProject(tx,projectId); owner(p,id); open(p);
    await tx.proposal.updateMany({where:{projectId,status:"PENDING"},data:{status:"CLOSED"}});
    return tx.project.update({where:{id:projectId},data:{status:"CANCELLED"}});
  });
}

const paging = { q:z.string().trim().max(150).default(""),page:z.coerce.number().int().min(1).max(100000).default(1) };
const batch=24;
function results(rows,page) { return {items:rows.slice(0,batch),page,hasNext:rows.length>batch}; }
// Both directory actions and profile project choices use the same owner-scoped read.
function invitableProjectsQuery(clientId, workerId) {
  return Prisma.sql`SELECT p.id, p.title, p.deadline, p."createdAt" FROM projects p WHERE p."clientId"=${clientId} AND p.status='OPEN'
          AND p."freelancerId" IS NULL AND p."publishedAt" IS NOT NULL AND p.deadline>CURRENT_TIMESTAMP
          AND NOT EXISTS (SELECT p.id, p.title, p.deadline, p."createdAt" FROM proposals n WHERE n."projectId"=p.id AND n."freelancerId"=${workerId} AND n.status='PENDING')`;
}

export async function directory(clientId,query) {
  const {q,page,availability}=z.strictObject({...paging,availability:z.enum(["AVAILABLE","BUSY_OPEN","NOT_AVAILABLE"]).optional()}).parse(query);
  // Apply search, visibility and pagination together, including case-insensitive array elements.
  const [matches]=await prisma.$queryRaw`
    WITH matches AS (SELECT u.id FROM users u LEFT JOIN freelancer_profiles f ON f."userId"=u.id
    LEFT JOIN user_preferences prefs ON prefs."userId"=u.id
    WHERE u.role='FREELANCER' AND u.status='ACTIVE' AND u."emailVerified"
      AND COALESCE(prefs."profileVisible",true)
      AND (${availability ?? ""}='' OR f.availability::text=${availability ?? ""})
      AND (position(lower(${q}) in lower(u.name))>0 OR position(lower(${q}) in lower(f."professionalTitle"))>0
        OR EXISTS (SELECT 1 FROM unnest(f.skills) skill WHERE position(lower(${q}) in lower(skill))>0))
    ), page_ids AS (SELECT id FROM matches ORDER BY id LIMIT ${batch} OFFSET ${(page-1)*batch})
    SELECT (SELECT count(*)::int FROM matches) AS total,
      ARRAY(SELECT id FROM page_ids) AS ids,
      ARRAY(SELECT w.id FROM page_ids w WHERE EXISTS (
        ${invitableProjectsQuery(clientId, Prisma.sql`w.id`)}
      )) AS invitees`;
  const rows=await prisma.user.findMany({where:{...visibleWorker,id:{in:matches.ids}},orderBy:{id:"asc"},
    select:{...person,freelancerProfile:{select:profileSelect}}});
  const invitees = new Set(matches.invitees);
  return {items:rows.map(worker => ({...worker, canInvite:invitees.has(worker.id)})), page,
    total:matches.total, hasNext:page*batch < matches.total};
}

export function invitationProjects(clientId, freelancerId) {
  return prisma.$queryRaw`SELECT id, title, deadline FROM (
    ${invitableProjectsQuery(clientId, freelancerId)}
  ) eligible_projects ORDER BY "createdAt" DESC, id`;
}
export async function workerProfile(_id,_input,{workerId}) {
  const worker=await prisma.user.findFirst({where:{...visibleWorker,id:workerId},select:{...person,freelancerProfile:{select:profileSelect}}});
  if(!worker) fail(404,"Freelancer unavailable.");
  return worker;
}
export async function discover(id,query) {
  const {q,page,category,min,max,by}=z.strictObject({...paging,category:text(100).optional(),min:money.optional(),max:money.optional(),by:z.coerce.date().optional()}).parse(query);
  // A calendar-date filter includes all deadlines on that UTC day. Timestamp inputs retain their precision.
  if (by && /^\d{4}-\d{2}-\d{2}$/.test(query.by)) by.setUTCHours(23,59,59,999);
  const ids=await prisma.$queryRaw`
    SELECT p.id FROM projects p JOIN users u ON u.id=p."clientId"
    WHERE u.status='ACTIVE' AND u."emailVerified" AND u.role='CLIENT' AND p.visibility='PUBLIC'
      AND p."publishedAt" IS NOT NULL AND p.status='OPEN' AND p."freelancerId" IS NULL AND p.deadline>CURRENT_TIMESTAMP
      AND (${category ?? ""}='' OR lower(p.category)=lower(${category ?? ""}))
      AND p.budget>=${min ?? "0"}::numeric AND p.budget<=${max ?? "9999999999.99"}::numeric
      AND (${by ?? null}::timestamp IS NULL OR p.deadline<=${by ?? null}::timestamp)
      AND (position(lower(${q}) in lower(p.title))>0 OR position(lower(${q}) in lower(p.description))>0
        OR EXISTS(SELECT 1 FROM unnest(p.skills) skill WHERE position(lower(${q}) in lower(skill))>0))
    ORDER BY p.id LIMIT ${batch+1} OFFSET ${(page-1)*batch}`;
  const rows=await prisma.project.findMany({where:{...applicationWindow(),visibility:"PUBLIC",id:{in:ids.map(x=>x.id)}},
    orderBy:{id:"asc"},select:{...projectSelect,proposals:{where:{freelancerId:id},select:{id:true,status:true,kind:true}}}});
  return results(rows,page);
}
export function freelancerListingAccess(id) {
  return {OR:[{...applicationWindow(),visibility:"PUBLIC"}, {freelancerId:id},
    {...applicationWindow(),proposals:{some:{freelancerId:id,kind:"INVITATION",status:"PENDING"}}}]};
}
export async function sharedListing(id,_input,{projectId}) {
  const p=await prisma.project.findFirst({where:{id:projectId,...freelancerListingAccess(id)},
    select:{...projectSelect,evidence:references(true),freelancerId:true,acceptedAt:true,advertisedBudget:true,advertisedDeadline:true,acceptedOffer:true,
      proposals:{where:{freelancerId:id},select:{id:true,status:true,kind:true}}}});
  if(!p) fail(404,"Project unavailable.");
  return p;
}

export async function startNegotiation(actor,input,{projectId},kind,files=[]) {
  const invitation=kind==="INVITATION";
  const parsed=(invitation?termsSchema.extend({freelancerId:text(150)}):termsSchema).parse(input);
  const {freelancerId=actor,...terms}=parsed;
  return prisma.$transaction(async tx=>{
    const project=await lockProject(tx,projectId);
    if(invitation) owner(project,actor);
    else if(project.visibility!=="PUBLIC" || !project.publishedAt) fail(404,"Project unavailable.");
    open(project);
    if(!project.publishedAt || project.deadline<=new Date()) fail(409,"Publish an eligible project before opening negotiations.");
    if(invitation && !await tx.user.findFirst({where:{...visibleWorker,id:freelancerId},select:{id:true}})) fail(404,"Freelancer unavailable.");
    await checkPeople(tx,project,freelancerId);
    const prior=await tx.proposal.findFirst({where:{projectId,freelancerId,OR:[{status:"PENDING"},...(!invitation?[{kind:"PROPOSAL"}]:[])]}});
    if(prior) fail(409,"A negotiation or application already exists for this project and freelancer.");
    const thread=await tx.proposal.create({data:{projectId,freelancerId,kind,coverLetter:terms.note || terms.scope,bidAmount:terms.amount,
      estimatedDays:terms.days,offers:{create:{...terms,version:1,senderId:actor,recipientId:invitation?freelancerId:project.clientId}}},select:responseSelect});
    if (!files.length) return thread;
    await storeEvidence(tx,files,actor,projectId,thread.offers[0].id);
    return readNegotiation(tx,actor,thread.id);
  });
}
export function invite(actor,input,params,files) { return startNegotiation(actor,input,params,"INVITATION",files); }
const participant=id=>({OR:[{freelancerId:id},{project:{clientId:id}}]});
export async function inbox(id,query) {
  const {page, projectId, status, search, kind} = z.strictObject({
    page: paging.page, projectId: text(150).optional(),
    status: z.enum(["ALL","PENDING","ACCEPTED","REJECTED","WITHDRAWN","CLOSED"]).optional(),
    search: paging.q, kind: z.enum(["INVITATION","PROPOSAL"]).optional(),
  }).parse(query);
  const where = { ...participant(id), projectId, kind, status: status === "ALL" ? undefined : status };
  if (search) {
    const term = { contains: search, mode: "insensitive" };
    where.AND = { OR: [{ coverLetter: term }, { freelancer: {name:term} }, { project: { title: term } },
      { project: { description: term } }, { project: { category: term } }, { project: { client: { name: term } } }] };
  }
  const [rows, groups] = await prisma.$transaction([
    prisma.proposal.findMany({where, skip:(page-1)*batch, take:batch+1,
      orderBy:[{updatedAt:"desc"},{id:"asc"}],
      select:{...responseSelect, updatedAt:true, offers:{orderBy:{version:"desc"},take:1}}}),
    prisma.proposal.groupBy({by:["status"],where,_count:{_all:true}}),
  ], {isolationLevel:"RepeatableRead"});
  const counts = Object.fromEntries(groups.map(group => [group.status, group._count._all]));
  return {...results(rows,page), total:Object.values(counts).reduce((sum,n) => sum+n,0), counts};
}
export async function negotiation(id,_input,{negotiationId}) {
  return readNegotiation(prisma,id,negotiationId);
}
async function readNegotiation(db,id,negotiationId) {
  const item=await db.proposal.findFirst({where:{id:negotiationId,...participant(id)},select:responseSelect});
  if(!item) fail(404,"Negotiation unavailable.");
  const [listing, visible, openForTerms] = await Promise.all([
    db.project.findFirst({where:{id:item.projectId,...freelancerListingAccess(item.freelancerId)},
      select:{deadline:true,advertisedDeadline:true,acceptedAt:true,publishedAt:true,evidence:references(true)}}),
    db.user.findFirst({where:{id:item.freelancerId,...visibleWorker},select:{id:true}}),
    item.status === "PENDING" && db.project.findFirst({where:{id:item.projectId,...applicationWindow(),
      proposals:{some:{id:negotiationId,freelancer:{...eligible,role:"FREELANCER"}}}},select:{id:true}}),
  ]);
  item.project.references=listing?.evidence || [];
  item.freelancerCanOpenProject = Boolean(listing);
  item.canOpenProfessionalProfile = Boolean(visible);
  item.canExchangeTerms = Boolean(openForTerms);
  if (listing?.publishedAt) item.project.listedDeadline = listing.advertisedDeadline ?? (listing.acceptedAt ? null : listing.deadline);
  if (item.status === "ACCEPTED") {
    const assignment = await db.project.findFirst({
      where: { id: item.projectId, freelancerId: item.freelancerId, acceptedOffer: { negotiationId } },
      select: { acceptedAt: true, deadline: true, acceptedOfferId:true },
    });
    Object.assign(item.project, assignment);
  }
  return item;
}

const version=z.number().int().positive();
const actionSchema=z.discriminatedUnion("action",[
  z.strictObject({action:z.literal("COUNTER"),version,...termFields}),
  z.strictObject({action:z.enum(["ACCEPT","REJECT","WITHDRAW"]),version}),
]);
export async function respond(actor,input,{negotiationId},files=[]) {
  const {action,version:expected,...terms}=actionSchema.parse(input);
  if(files.length && action!=="COUNTER") fail(400,"Only new offer revisions can carry files.");
  return prisma.$transaction(async tx=>{
    const ref=await tx.proposal.findFirst({where:{id:negotiationId,...participant(actor)},select:{projectId:true}});
    if(!ref) fail(404,"Negotiation unavailable.");
    const project=await lockProject(tx,ref.projectId);
    const row=await tx.proposal.findUniqueOrThrow({where:{id:negotiationId},include:{offers:{orderBy:{version:"desc"},take:1}}});
    const current=row.offers[0];
    if(row.status!=="PENDING" || row.version!==expected || current?.version!==expected) fail(409,"Offer changed or closed. Refresh its history.");
    open(project);
    const originator=row.kind==="INVITATION"?project.clientId:row.freelancerId;
    if(actor!==(action==="WITHDRAW"?originator:current.recipientId)) fail(403,"This action belongs to the other participant.");
    if(action==="COUNTER" || action==="ACCEPT") {
      if(!project.publishedAt || project.deadline<=new Date()) fail(409,"The project is not accepting offers.");
      await checkPeople(tx,project,row.freelancerId);
    }
    if(action==="COUNTER") {
      const revision=await tx.offerRevision.create({data:{...terms,negotiationId,version:expected+1,senderId:actor,recipientId:current.senderId}});
      await storeEvidence(tx,files,actor,project.id,revision.id);
      await tx.proposal.update({where:{id:row.id},data:{version:{increment:1}}});
    } else {
      const status={ACCEPT:"ACCEPTED",REJECT:"REJECTED",WITHDRAW:"WITHDRAWN"}[action];
      await tx.proposal.update({where:{id:row.id},data:{status}});
      if(action==="ACCEPT") {
        const acceptedAt=new Date();
        const changed=await tx.project.updateMany({where:{id:project.id,status:"OPEN",freelancerId:null,acceptedOfferId:null},
          data:{status:"ACTIVE",freelancerId:row.freelancerId,acceptedOfferId:current.id,acceptedAt,
            advertisedBudget:project.budget,advertisedDeadline:project.deadline,budget:current.amount,deadline:new Date(acceptedAt.getTime()+current.days*86400000)}});
        if(changed.count!==1) fail(409,"Project already assigned.");
        await tx.proposal.updateMany({where:{projectId:project.id,status:"PENDING"},data:{status:"CLOSED"}});
      }
    }
    return readNegotiation(tx,actor,negotiationId);
  });
}
export async function marketplaceCounts(id,role) {
  const client=role==="CLIENT";
  const party=client?{project:{clientId:id}}:{freelancerId:id};
  const project=client?{clientId:id}:{freelancerId:id};
  const [projects,drafts,published,proposals,invitations,waiting,active]=await Promise.all([
    prisma.project.count({where:project}),client?prisma.project.count({where:{...project,status:"OPEN",publishedAt:null}}):0,
    client?prisma.project.count({where:{...project,status:"OPEN",publishedAt:{not:null}}}):0,
    prisma.proposal.count({where:{...party,kind:"PROPOSAL",...(client?{status:"PENDING"}:{})}}),
    prisma.proposal.count({where:{...party,kind:"INVITATION"}}),
    prisma.$queryRaw`SELECT count(*)::int AS n FROM proposals p JOIN offer_revisions o ON o."negotiationId"=p.id AND o.version=p.version WHERE p.status='PENDING' AND o."recipientId"=${id}`,
    prisma.project.count({where:{...project,status:"ACTIVE"}})]);
  return {projects,drafts,published,proposals,invitations,waiting:waiting[0].n,active};
}
