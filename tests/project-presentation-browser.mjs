import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { startFixture } from "./auth-fixture.mjs";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseline = process.argv.includes("--baseline");
const fixture = await startFixture();
const errors = [];
const today = new Date();
const year = today.getUTCFullYear() + (today.getUTCMonth() === 11 ? 1 : 0);
const deadline = year + "-12-23";
const brief = [
  "Design a packaging system for our seasonal coffee collection. The campaign launches on 30 December " + year + ".",
  "## Project requirements",
  "1. Design **three original labels** for our single-origin coffees.\n2. Supply print-ready artwork and a production guide.",
  "### Visual direction",
  "- Keep the typography *understated*.\n- Use the [brand guide](https://example.invalid/guide) for spacing.",
  "Retain this line break.\nArt direction and prepress review are separate steps.",
  "Use a consistent grid and distinguish the origins with colour. ".repeat(14).trim(),
].join("\n\n");
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
  await page.goto(fixture.origin+route);
  await page.waitForLoadState("networkidle");
  for(const [size,width,height] of [["desktop",1440,900],["tablet",820,1180],["mobile",390,844]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(()=>document.fonts.ready);
    if(!baseline) assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+" overflow at "+width);
    if(process.env.PHASE1_EVIDENCE) {
      await mkdir(process.env.PHASE1_EVIDENCE,{recursive:true});
      await page.screenshot({path:path.join(process.env.PHASE1_EVIDENCE,(baseline?"before":"after")+"-"+label+"-"+size+".png"),animations:"disabled"});
    }
  }
}
try {
  browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE});
  const owner=await account("roaster","Northline Coffee","CLIENT");
  const worker=await account("studio","Cedar Studio","FREELANCER");
  const listing={title:"Seasonal coffee packaging",description:brief,category:"Design",budget:"48000.50",skills:["Packaging","Typography","Art direction","Illustration","Print"],deadline};
  async function publish(fields) {
    const {project}=await api(owner,"POST","projects",{...listing,...fields});
    await api(owner,"POST","projects/"+project.id+"/publish",{visibility:"PUBLIC"});
    return project.id;
  }
  const id=await publish({});
  await publish({title:"Product photography brief",budget:22000,description:"Plan a product shoot for our spring collection.",skills:["Photography"]});
  const active=await publish({title:"Coffee subscription identity"});
  const {proposal}=await api(worker,"POST","projects/"+active+"/proposals",{bidAmount:42500,estimatedDays:20,coverLetter:"Identity and print guidelines",scope:"Identity system and production-ready files."});
  await api(owner,"PATCH","negotiations/"+proposal.id,{action:"ACCEPT",version:1});
  await api(owner,"POST","projects/"+active+"/milestones",{title:"Identity concepts",description:"Two creative directions",amount:10000,dueDate:new Date(Date.now()+86400000*4).toISOString()});
  await capture(worker,"/freelancer/discover","discovery");
  if(!baseline) {
    const card=worker.locator("article").filter({has:worker.getByRole("heading",{name:listing.title})});
    assert.equal(await card.getByRole("link",{name:"View project",exact:true}).count(),1);
    const preview=card.locator("[data-project-preview]");
    assert.ok((await preview.innerText()).length < 300);
    assert.equal(await preview.evaluate(e=>getComputedStyle(e).webkitLineClamp),"3");
    assert.ok(!(await preview.innerText()).includes("**"));
    await card.getByText("23 Dec "+year,{exact:true}).waitFor();
    const filters=worker.locator("summary").filter({hasText:"More filters"});
    await filters.focus();
    await worker.keyboard.press("Enter");
    assert.ok(await worker.getByLabel("Deadline by").isVisible());
    await worker.getByLabel("Deadline by").fill(deadline);
    await worker.getByRole("button",{name:"Search",exact:true}).click();
    await worker.waitForURL(u => u.searchParams.get("by") === deadline);
    await card.getByRole("link",{name:"View project",exact:true}).focus();
    await worker.keyboard.press("Enter");
    await worker.waitForURL(u => u.pathname === "/freelancer/discover/"+id);
  }
  await capture(worker,"/freelancer/discover/"+id,"freelancer-brief");
  await capture(owner,"/client/projects","client-list");
  if(!baseline) {
    const card=owner.locator("article").filter({has:owner.getByRole("heading",{name:listing.title})});
    assert.equal(await card.locator('a[href="/client/projects/'+id+'"]').count(),1);
  }
  await capture(owner,"/client/projects/"+id,"client-open");
  if(!baseline) {
    for (const page of [owner,worker]) {
      await page.getByRole("heading",{name:"Project requirements",exact:true}).waitFor();
      const rich=page.locator("[data-project-description]").first();
      assert.equal(await rich.locator("ol li").count(),2);
      assert.equal(await rich.locator("ul li").count(),2);
      assert.equal(await rich.locator("strong").innerText(),"three original labels");
      assert.equal(await rich.locator("em").innerText(),"understated");
      assert.equal(await rich.getByRole("link",{name:"brand guide"}).getAttribute("href"),"https://example.invalid/guide");
      assert.ok(await rich.locator("br").count()>0);
      await page.getByText("23 Dec "+year,{exact:true}).first().waitFor();
    }
    await owner.goto(fixture.origin+"/client/projects/"+id+"/edit");
    assert.equal(await owner.locator("textarea[name=description]").inputValue(),brief);
    assert.equal(await owner.locator("input[name=deadline]").inputValue(),deadline);
    const revised = brief + "\n\nFinal print notes\nKeep the proof on uncoated paper.";
    await owner.getByLabel("Project Description",{exact:true}).fill(revised);
    assert.ok(await owner.locator("input[name=budget]").evaluate(input => input.validity.valid), "Stored fractional INR budget must stay editable");
    await owner.getByRole("button",{name:"Save Changes"}).click();
    await owner.waitForURL(u => u.pathname === "/client/projects/"+id);
    const saved = (await api(owner,"GET","projects/"+id)).project;
    assert.equal(saved.description,revised);
    assert.equal(saved.deadline.slice(0,10),deadline);
    await owner.goto(fixture.origin+"/client/projects/create");
    await owner.getByLabel("Project Title",{exact:true}).fill("Print handoff");
    await owner.getByLabel("Description",{exact:true}).fill(revised);
    await owner.getByLabel("Category",{exact:true}).selectOption("Design");
    await owner.locator("input[name=budget]").fill("16000");
    await owner.getByLabel("Deadline",{exact:true}).fill(deadline);
    await owner.getByRole("button",{name:"Create Project",exact:true}).last().click();
    await owner.waitForURL(u => /\/client\/projects\/[^/]+$/.test(u.pathname) && !u.pathname.endsWith("/create"));
    const created = (await api(owner,"GET","projects/"+new URL(owner.url()).pathname.split("/").at(-1))).project;
    assert.equal(created.description,revised);
    assert.equal(created.deadline.slice(0,10),deadline);
  }
  await capture(owner,"/client/projects/"+active,"client-active");
  if(!baseline) {
    await owner.getByText("Agreed delivery",{exact:true}).waitFor();
    await owner.getByRole("link",{name:"Open milestone workspace"}).click();
    await owner.waitForURL(u => u.hash === "#milestones");
    await owner.getByRole("button",{name:/create milestone/i}).click();
    await owner.getByRole("button",{name:"Cancel",exact:true}).last().click();
    await owner.getByRole("link",{name:"View accepted agreement"}).click();
    await owner.getByRole("heading",{name:"Offer 1 · Agreed terms"}).waitFor();
    const guard=await publish({title:"Formatting fixture",description:"Plain text\n<script>testMarker()</script>\n[invalid](javascript:example) and [valid](https://example.invalid/safe)"});
    await worker.goto(fixture.origin+"/freelancer/discover/"+guard);
    const rich=worker.locator("[data-project-description]").first();
    await rich.getByRole("link",{name:"valid",exact:true}).waitFor();
    assert.equal(await rich.locator("script").count(),0);
    assert.equal(await rich.locator('a[href^="javascript:"]').count(),0);
    assert.ok((await rich.innerText()).includes("<script>"));
  }
  assert.deepEqual(errors,[]);
  console.log((baseline?"Before":"After")+" project presentation checks passed: five views at three viewport sizes");
} finally { await browser?.close(); await fixture.stop(); }
