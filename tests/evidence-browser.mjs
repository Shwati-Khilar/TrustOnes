import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pdf,image } from "./evidence-samples.mjs";
import { readFile } from "node:fs/promises";
import bcrypt from "bcryptjs";
import { startFixture } from "./auth-fixture.mjs";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");

const fixture = await startFixture();
const errors = [];
let browser;
async function account(id,name,role) {
  const password=randomUUID();
  await fixture.pool.query('INSERT INTO users(id,name,email,role,status,"emailVerified","passwordHash","updatedAt") VALUES ($1,$2,$3,$4,\'ACTIVE\',true,$5,now())',[id,name,id+"@example.invalid",role,await bcrypt.hash(password,6)]);
  const ctx=await browser.newContext({timezoneId:"America/Los_Angeles",reducedMotion:"reduce"});
  const csrf=await (await ctx.request.get(fixture.origin+"/api/auth/csrf")).json();
  await ctx.request.post(fixture.origin+"/api/auth/callback/credentials",{form:{email:id+"@example.invalid",password,csrfToken:csrf.csrfToken,json:"true"}});
  const page=await ctx.newPage();
  page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
  page.on("pageerror",e=>errors.push(e.message));
  return page;
}
async function api(page,method,route,data) {
  const response=await page.request.fetch(fixture.origin+"/api/"+route,{method,data});
  const body=await response.json();
  assert.ok(response.ok(),route+" "+body.message);
  return body;
}
async function capture(page,route,label) {
  if (route) await page.goto(fixture.origin+route);
  await page.waitForLoadState("networkidle");
  for(const [size,width,height] of [["desktop",1440,900],["tablet",820,1180],["mobile",390,844]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(()=>document.fonts.ready);
    {
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+" overflow at "+width);
      const outside = await page.locator("article, #invite, form :is(select,input,textarea,button)").evaluateAll(nodes =>
        nodes.filter(node => {
          const box = node.getBoundingClientRect();
          return box.width && (box.left < -1 || box.right > innerWidth+1);
        }).map(node => node.tagName));
      assert.deepEqual(outside,[],label+" clipped content at "+width);
    }
    if(process.env.PHASE4_EVIDENCE) {
      await mkdir(process.env.PHASE4_EVIDENCE,{recursive:true});
      await page.screenshot({path:path.join(process.env.PHASE4_EVIDENCE,label+"-"+size+".png"),animations:"disabled",fullPage:true});
    }
  }
}
try {
  browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE});
  const owner=await account("buyer","Northline Coffee","CLIENT");
  const worker=await account("designer","Avery Sen","FREELANCER");
  const other=await account("other","Guest Freelancer","FREELANCER");
  const stranger=await account("second","Other Client","CLIENT");
  const origin=fixture.origin;
  const logo={name:"palette.png",mimeType:"image/png",buffer:await image()};
  const document=name=>({name,mimeType:"application/pdf",buffer:pdf()});
  const deadline=new Date(Date.now()+60*86400000).toISOString().slice(0,10);
  await owner.goto(origin+"/client/projects/create");
  await owner.locator("[name=title]").fill("Autumn packaging");
  await owner.getByRole("textbox",{name:"Description",exact:true}).fill("## Deliverables\n\n- Three print-ready labels\n- A digital proof");
  await owner.locator("[name=category]").selectOption("Design");
  await owner.locator("[name=budget]").fill("25000");
  await owner.locator("[name=deadline]").fill(deadline);
  await owner.locator("[name=visibility]").selectOption("PUBLIC");
  await owner.locator("input[type=file]").setInputFiles([logo,document("costs.pdf"),document("discard.pdf")]);
  await owner.getByRole("button",{name:"Remove discard.pdf"}).click();
  await owner.getByLabel("Access for palette.png").selectOption("PROJECT_VIEWERS");
  await capture(owner,null,"selected-project-files");
  await owner.getByRole("button",{name:"Create Project",exact:true}).last().click();
  await owner.waitForURL(u=>u.pathname.startsWith("/client/projects/")&&!u.pathname.endsWith("/create"));
  const project=new URL(owner.url()).pathname.split("/").at(-1);
  await capture(owner,"/client/projects/"+project,"client-references");
  const secret=await owner.getByRole("link",{name:"Download costs.pdf"}).getAttribute("href");
  await owner.goto(origin+"/client/projects/"+project+"/edit");
  await owner.getByRole("link",{name:"Download costs.pdf"}).waitFor();
  await owner.locator("input[type=file]").setInputFiles(document("press.pdf"));
  await owner.getByRole("button",{name:"Save Changes"}).click();
  await owner.waitForURL(u=>u.pathname==="/client/projects/"+project);
  await owner.getByRole("link",{name:"Download press.pdf"}).waitFor();
  await owner.getByRole("button",{name:"Publish project"}).click();
  await owner.getByText("PUBLIC",{exact:true}).first().waitFor();
  await worker.goto(origin+"/freelancer/discover");
  await worker.locator("article").filter({hasText:"Autumn packaging"}).getByRole("link",{name:"View project"}).click();
  await worker.locator("[data-project-description] li").filter({hasText:"Three print-ready labels"}).waitFor();
  const preview=worker.getByRole("link",{name:"Preview palette.png"});
  await preview.waitFor();
  const picture=preview.locator("img"); await picture.evaluate(img=>img.decode());
  assert.equal(await worker.getByRole("link",{name:"Download costs.pdf"}).count(),0);
  await worker.locator("input[type=file]").setInputFiles(document("technical-approach.pdf"));
  async function terms(page,amount,days,scope) {
    await page.locator("[name=amount]").fill(String(amount)); await page.locator("[name=days]").fill(String(days));
    await page.locator("[name=scope]").fill(scope); await page.locator("[name=note]").fill("Please review this version.");
  }
  await terms(worker,21000,16,"Packaging concept proposal");
  await worker.getByRole("button",{name:"Submit proposal"}).click();
  await worker.waitForURL(u=>u.pathname.startsWith("/freelancer/offers/"));
  const proposal=new URL(worker.url()).pathname.split("/").at(-1);
  await owner.goto(origin+"/client/offers");
  await owner.getByRole("link",{name:"View negotiation"}).click();
  await owner.getByRole("link",{name:"Download technical-approach.pdf"}).waitFor();
  await owner.getByRole("link",{name:"Freelancer profile"}).click();
  await owner.getByRole("heading",{name:"Avery Sen",exact:true}).waitFor();
  await owner.goto(origin+"/client/offers/"+proposal);
  await owner.getByRole("button",{name:"Counteroffer",exact:true}).click();
  await terms(owner,"20500.50",18,"Three print-ready labels and a digital proof.");
  await owner.locator("input[type=file]").setInputFiles(document("accepted-spec.pdf"));
  await owner.getByRole("button",{name:"Send counteroffer"}).click();
  await owner.getByRole("link",{name:"Download accepted-spec.pdf"}).waitFor();
  await worker.reload();
  await worker.getByRole("link",{name:"Download accepted-spec.pdf"}).waitFor();
  worker.once("dialog",dialog=>dialog.accept());
  await worker.getByRole("button",{name:"Accept offer"}).click();
  await worker.getByRole("region",{name:"Accepted agreement"}).waitFor();
  const agreement=async(page,thread)=>(await api(page,"GET","negotiations/"+thread)).data;
  const agreed=await agreement(owner,proposal);
  assert.deepEqual(await agreement(worker,proposal),agreed);
  assert.equal(agreed.project.acceptedOfferId,agreed.offers[1].id);
  assert.equal(agreed.freelancerId,"designer");
  const assignment=(await api(owner,"GET","projects/"+project)).project;
  assert.equal(assignment.freelancerId,agreed.freelancerId);
  assert.equal(agreed.project.status,"ACTIVE");
  assert.equal(Number(agreed.offers[1].amount),20500.50);
  assert.equal(agreed.offers[1].days,18);
  assert.deepEqual(agreed.offers.map(offer=>offer.attachments.map(file=>file.filename)),[["technical-approach.pdf"],["accepted-spec.pdf"]]);
  assert.deepEqual(agreed.project.references.map(file=>file.filename),["palette.png"]);
  await worker.getByRole("link",{name:"Open deal room"}).click();
  await worker.waitForURL(u=>u.pathname==="/freelancer/deal-rooms/"+project);
  await worker.getByText("₹20,500.50",{exact:true}).first().waitFor();
  await worker.getByText(agreed.offers[1].scope,{exact:true}).waitFor();

  const {project:privateProject}=await api(owner,"POST","projects",{title:"Private label collection",description:"Design a new collection.",category:"Design",deadline,budget:26000});
  await api(owner,"POST","projects/"+privateProject.id+"/publish",{visibility:"PRIVATE"});
  await owner.goto(origin+"/client/freelancers");
  await owner.locator("article").filter({hasText:"Avery Sen"}).getByRole("link",{name:"View profile"}).click();
  await owner.getByLabel("Your project").selectOption(privateProject.id);
  await terms(owner,15000,15,"Design three labels.");
  await owner.locator("input[type=file]").setInputFiles(document("invitation.pdf"));
  await owner.getByRole("button",{name:"Send invitation"}).click();
  await owner.waitForURL(u=>u.pathname.startsWith("/client/offers/"));
  const id=new URL(owner.url()).pathname.split("/").at(-1);
  const path=role=>"/"+role+"/offers/"+id;
  await worker.goto(origin+path("freelancer"));
  const dl=worker.getByRole("link",{name:"Download invitation.pdf"});
  const privateUrl=await dl.getAttribute("href");
  const [download]=await Promise.all([worker.waitForEvent("download"),dl.click()]);
  assert.deepEqual(await readFile(await download.path()),pdf());
  for(const [page,role,name,amount] of [[worker,"freelancer","proposal-proof.pdf",20000],[owner,"client","agreed-print.pdf",18000]]) {
    await page.goto(origin+path(role));
    await page.getByRole("button",{name:"Counteroffer",exact:true}).click();
    await terms(page,amount,20,"Final labels and press proofs.");
    await page.locator("input[type=file]").setInputFiles(document(name));
    if(role==="freelancer") await capture(page,null,"selected-counter-files");
    await page.getByRole("button",{name:"Send counteroffer"}).click();
    await page.getByRole("link",{name:"Download "+name}).waitFor();
  }
  await capture(worker,path("freelancer"),"freelancer-counter");
  worker.once("dialog",dialog=>dialog.accept());
  await worker.getByRole("button",{name:"Accept offer"}).click();
  await worker.getByRole("region",{name:"Accepted agreement"}).waitFor();
  assert.deepEqual(await agreement(owner,id),await agreement(worker,id));
  for(const [page,role] of [[owner,"client"],[worker,"freelancer"]]) {
    await capture(page,path(role),role+"-agreement");
    await page.getByRole("region",{name:"Accepted revision files"}).getByRole("link",{name:"Download agreed-print.pdf"}).waitFor();
    const history=page.locator("[data-history] details");
    for(const [i,name] of ["invitation.pdf","proposal-proof.pdf"].entries()) {
      await history.nth(i).locator("summary").click();
      await history.nth(i).getByRole("link",{name:"Download "+name}).waitFor();
    }
  }
  for(const page of [other,stranger]) {
    for(const url of [secret,privateUrl]) assert.equal((await page.request.get(origin+url)).status(),404);
  }
  assert.deepEqual(errors,[]);
  console.log("A–F passed: project create/edit and visibility, invitation download, proposal, bilateral counteroffers, accepted and historical files, unrelated clients and freelancers denied. Six views at three sizes.");
} finally { await browser?.close(); await fixture.stop(); }
