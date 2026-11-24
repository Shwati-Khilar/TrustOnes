import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import bcrypt from "bcryptjs";
import { startFixture } from "./auth-fixture.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fixture = await startFixture();
const baseline = process.argv.includes("--baseline");
const phase = baseline ? "before" : "after";
const errors = [];
const sessions = [];
const browser = await chromium.launch({ executablePath: process.env.CHROME_EXECUTABLE });
const secret = randomBytes(20).toString("hex");
const hash = await bcrypt.hash(secret, 10);
async function visitor(id, role) {
  await fixture.pool.query('INSERT INTO users(id,name,email,role,status,"emailVerified","passwordHash","updatedAt") VALUES ($1,$1,$2,$3,\'ACTIVE\',true,$4,NOW())', [id,id+"@example.invalid",role,hash]);
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const csrf = await (await context.request.get(fixture.origin+"/api/auth/csrf")).json();
  await context.request.post(fixture.origin+"/api/auth/callback/credentials",{form:{email:id+"@example.invalid",password:secret,csrfToken:csrf.csrfToken,json:"true"}});
  const page = await context.newPage();
  page.on("dialog", dialog => dialog.accept());
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if(m.type()==="error") errors.push(m.text()); });
  sessions.push(page);
  return page;
}
async function visit(page, route) {
  await page.goto(fixture.origin+route);
  await page.waitForLoadState("networkidle");
  assert.equal(new URL(page.url()).pathname,route);
}
async function capture(page, route, label=route.slice(1).replaceAll("/","-")) {
  await visit(page,route);
  for(const [size,width,height] of [["desktop",1440,900],["mobile",390,844]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(()=>document.fonts.ready);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), route+" overflow");
    if (!baseline) {
      const clippedFields = await page.locator("form input:not([type=hidden]), form textarea, form select").evaluateAll(nodes =>
        nodes.filter(n => {
          const r = n.getBoundingClientRect();
          return r.width && r.height && (r.left < -1 || r.right > innerWidth + 1);
        }).map(n => n.name));
      assert.deepEqual(clippedFields,[],route+" clipped form controls at "+width);
    }
    if(process.env.S2_SCREENSHOTS) {
      await mkdir(process.env.S2_SCREENSHOTS,{recursive:true});
      await page.screenshot({path:path.join(process.env.S2_SCREENSHOTS,phase+"-"+label+"-"+size+".png"),animations:"disabled"});
    }
  }
}
try {
  const client=await visitor("buyer","CLIENT"), freelancer=await visitor("designer","FREELANCER"), admin=await visitor("admin","ADMIN");
  for (const [page,routes] of [[client,["dashboard","projects","projects/create","freelancers","settings","profile"].map(x=>"/client/"+x)],[freelancer,["dashboard","invites","projects","profile","settings"].map(x=>"/freelancer/"+x)],[admin,["/admin/dashboard"]]]) {
    for(const route of routes) await capture(page,route);
  }
  if(!baseline) await scenarios(client,freelancer);
  assert.deepEqual(errors,[]);
  console.log(phase+" browser checks passed");
} catch (error) {
  for (const page of sessions) {
    console.error(new URL(page.url()).pathname, await page.locator("main").innerText({timeout:2000}).catch(() => ""));
  }
  if (errors.length) console.error(errors);
  throw error;
} finally { await browser.close(); await fixture.stop(); }

async function scenarios(client,worker) {
  for (const [page,label,route] of [[client,"Freelancers","/client/freelancers"],[worker,"Discover projects","/freelancer/discover"]]) {
    await page.locator("summary").filter({hasText:"Menu"}).click();
    await page.locator("details[open]").getByRole("link",{name:label,exact:true}).click();
    await page.waitForURL(u => u.pathname === route);
  }
  const competitor=await visitor("illustrator","FREELANCER");
  const tomorrow=new Date(Date.now()+86400000*40).toISOString().slice(0,10);
  async function create(title,visibility) {
    await visit(client,"/client/projects/create");
    for(const [name,value] of Object.entries({title,description:"Design and deliver "+title,skills:"Design, Research",budget:"21000",deadline:tomorrow})) {
      await client.locator("form [name="+name+"]").fill(value);
    }
    await client.locator("[name=category]").selectOption("Design");
    await client.locator("[name=visibility]").selectOption(visibility);
    await client.getByRole("button",{name:"Create Project",exact:true}).last().click();
    await client.waitForURL(u=>/\/client\/projects\/[^/]+$/.test(u.pathname)&&!u.pathname.endsWith("create"));
    const id=new URL(client.url()).pathname.split("/").at(-1);
    await client.getByRole("button",{name:"Publish project"}).click();
    await client.getByText(visibility,{exact:true}).first().waitFor();
    return id;
  }
  async function fillTerms(page,amount,days,note) {
    await page.locator("input[name=amount]").fill(String(amount));
    await page.locator("input[name=days]").fill(String(days));
    await page.locator("textarea[name=scope]").fill("Design files and documentation");
    await page.locator("textarea[name=note]").fill(note);
  }
  async function application(page,title) {
    await visit(page,"/freelancer/discover");
    await page.getByLabel("Title, description or skill").fill(title);
    await page.getByRole("button",{name:"Search",exact:true}).click();
    await page.locator("article").filter({hasText:title}).getByRole("link",{name:"View project"}).click();
    await page.waitForURL(u => /^\/freelancer\/discover\/[^/]+$/.test(u.pathname));
    if (title === "Public design A") await capture(page,new URL(page.url()).pathname,"freelancer-public-project");
    await fillTerms(page,17000,12,"Please consider my application.");
    await page.getByRole("button",{name:"Submit proposal"}).click();
    await page.waitForURL(u=>u.pathname.startsWith("/freelancer/offers/"));
    return new URL(page.url()).pathname.split("/").at(-1);
  }
  async function invitation(id,name) {
    await visit(client,"/client/freelancers");
    await client.locator("article").filter({has:client.getByRole("heading",{name,exact:true})}).getByRole("link",{name:"View profile"}).click();
    await client.getByLabel("Your project").selectOption(id);
    await fillTerms(client,15000,15,"Initial private invitation");
    await client.getByRole("button",{name:"Send invitation"}).click();
    await client.waitForURL(u=>u.pathname.startsWith("/client/offers/"));
    return new URL(client.url()).pathname.split("/").at(-1);
  }
  const actions = /^(Accept offer|Reject offer|Counteroffer|Withdraw)$/;
  const patchResponse = page => page.waitForResponse(response =>
    response.request().method() === "PATCH" && new URL(response.url()).pathname.startsWith("/api/negotiations/"));
  async function reply(page,action,version) {
    const [response] = await Promise.all([patchResponse(page),page.getByRole("button",{name:action,exact:true}).click()]);
    const body = await response.json();
    assert.equal(response.status(),200,body.message);
    const status = {"Accept offer":"ACCEPTED","Reject offer":"REJECTED","Withdraw":"WITHDRAWN"}[action];
    assert.equal(body.data.status,status);
    const title = "Offer " + version + " · " + (status === "ACCEPTED" ? "Agreed terms" : status[0]+status.slice(1).toLowerCase());
    await page.getByRole("heading",{name:title,exact:true}).waitFor();
    await page.getByText("Response saved.",{exact:true}).waitFor();
    assert.equal(await page.getByRole("button",{name:actions}).count(),0);
  }
  async function openStaleTab(page,id) {
    const tab=await page.context().newPage();
    tab.on("dialog",dialog => dialog.accept());
    tab.on("pageerror",e => errors.push(e.message));
    tab.on("console",msg => {
      if (msg.type() !== "error") return;
      if (msg.location().url === fixture.origin+"/api/negotiations/"+id && /409/.test(msg.text())) return;
      errors.push(msg.text());
    });
    await visit(tab,"/freelancer/offers/"+id);
    return tab;
  }
  async function staleAccept(tab,canonicalHeading) {
    const [response] = await Promise.all([patchResponse(tab), tab.getByRole("button",{name:"Accept offer",exact:true}).click()]);
    assert.equal(response.status(),409);
    await tab.getByRole("heading",{name:canonicalHeading,exact:true}).waitFor();
    await tab.getByText("Offer changed or closed. Refresh its history.",{exact:true}).waitFor();
    assert.equal(await tab.getByText("Response saved.",{exact:true}).count(),0);
    assert.equal(await tab.getByRole("button",{name:"Accept offer",exact:true}).count(),0);
    await tab.close();
  }
  async function counter(page,amount,days,version) {
    await page.getByRole("button",{name:"Counteroffer",exact:true}).click();
    await fillTerms(page,amount,days,"Updated delivery conditions");
    const [response] = await Promise.all([
      page.waitForResponse(r => r.request().method() === "PATCH" && new URL(r.url()).pathname.startsWith("/api/negotiations/")),
      page.getByRole("button",{name:"Send counteroffer"}).click(),
    ]);
    const body = await response.json();
    assert.equal(response.status(),200,body.message);
    assert.equal(body.data.version,version);
    await page.getByRole("heading",{name:"Offer "+version+" · Pending",exact:true}).waitFor();
  }
  await visit(client,"/client/projects");await client.getByText("No projects match this view").waitFor();
  await capture(worker,"/freelancer/discover");await worker.getByText("No published projects match this search.").waitFor();
  for(const [page,route,expect] of [[client,"/client/messages","Project messaging is unavailable."],[client,"/client/reviews","Bilateral reviews are unavailable."],
    [client,"/client/escrow","No simulated funding records yet."],[worker,"/freelancer/wallet","No simulated funding records yet."],
    [worker,"/freelancer/disputes","Dispute filing and adjudication are unavailable."]]){
    await visit(page,route);await page.getByText(expect,{exact:true}).waitFor();
  }
  console.log("F: Empty project discovery and future-feature states passed");
  let project=await create("Public design A","PUBLIC");
  let n=await application(worker,"Public design A");
  await capture(client,"/client/offers");await client.getByRole("link",{name:"View negotiation"}).first().click();
  await client.getByRole("link",{name:"Freelancer profile"}).click();
  await client.getByRole("heading",{name:"designer",exact:true}).waitFor();
  await visit(client,"/client/offers/"+n);await reply(client,"Accept offer",1);
  await capture(client,"/client/projects/"+project,"client-assigned-project");
  await client.getByText("Assigned to designer",{exact:true}).waitFor();
  await visit(worker,"/freelancer/discover/"+project);await worker.getByRole("link",{name:"Open deal room"}).click();
  await worker.waitForURL(u=>u.pathname.endsWith("/deal-rooms/"+project));
  await capture(worker,"/freelancer/deal-rooms/"+project,"freelancer-assigned-room");
  console.log("A: Public proposal accepted, both portals see the assignment");
  project=await create("Private design B","PRIVATE");
  n=await invitation(project,"designer");
  await capture(client,"/client/freelancers/designer","client-professional");
  await visit(competitor,"/freelancer/discover");assert.equal(await competitor.getByText("Private design B",{exact:true}).count(),0);
  await capture(worker,"/freelancer/invites","freelancer-received-invitation");await worker.locator("article").filter({hasText:"Private design B"}).getByRole("link").click();
  const oldTerms = await openStaleTab(worker,n);
  await counter(worker,20000,20,2);
  await staleAccept(oldTerms,"Offer 2 · Pending");
  await visit(client,"/client/offers/"+n);await counter(client,18000,20,3);
  await capture(worker,"/freelancer/offers/"+n,"freelancer-negotiation");
  await reply(worker,"Accept offer",3);await capture(client,"/client/offers/"+n,"client-agreement");
  for(const page of [worker,client]) {
    const agreement=page.getByRole("region",{name:"Accepted agreement"});
    await agreement.getByText("₹18,000",{exact:true}).waitFor();
    await agreement.getByText("20 days",{exact:true}).waitFor();
  }
  console.log("B: Private invitation, two counters, agreed INR 18000 / 20 days");
  project=await create("Public design C","PUBLIC");n=await application(worker,"Public design C");
  await visit(client,"/client/offers/"+n);await counter(client,13000,8,2);
  await visit(worker,"/freelancer/offers/"+n);await reply(worker,"Accept offer",2);
  assert.equal(await worker.getByRole("heading",{name:/^Offer [0-9]/}).count(),2);
  console.log("C: Freelancer accepted client counter on public proposal");
  project=await create("Private design D","PRIVATE");n=await invitation(project,"designer");
  await visit(worker,"/freelancer/offers/"+n);
  const rejectedTab = await openStaleTab(worker,n);
  await reply(worker,"Reject offer",1);
  await staleAccept(rejectedTab,"Offer 1 · Rejected");
  for (const [page,role] of [[client,"client"],[worker,"freelancer"]]) {
    await visit(page,"/"+role+"/offers/"+n);
    await page.getByRole("heading",{name:"Offer 1 · Rejected",exact:true}).waitFor();
    assert.equal(await page.getByRole("button",{name:actions}).count(),0);
  }
  n=await invitation(project,"illustrator");await reply(client,"Withdraw",1);
  await visit(competitor,"/freelancer/offers/"+n);assert.equal(await competitor.getByRole("button",{name:"Accept offer"}).count(),0);
  console.log("D: Declined and withdrawn invitations stayed closed; stale tabs recovered authoritative state after 409");
  project=await create("Public design E","PUBLIC");const win=await application(worker,"Public design E"),lose=await application(competitor,"Public design E");
  await visit(client,"/client/offers/"+win);await reply(client,"Accept offer",1);
  await visit(competitor,"/freelancer/offers/"+lose);await competitor.getByRole("heading",{name:"Offer 1 · Closed"}).waitFor();
  const denied=await competitor.context().request.get(fixture.origin+"/api/freelancer/deal-rooms/"+project);
  assert.equal(denied.status(),404);console.log("E: One winner, losing candidate denied deal-room access");
}
