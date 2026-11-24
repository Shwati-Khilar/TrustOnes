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
    if (!baseline) {
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+" overflow at "+width);
      const outside = await page.locator("article, #invite, form :is(select,input,textarea,button)").evaluateAll(nodes =>
        nodes.filter(node => {
          const box = node.getBoundingClientRect();
          return box.width && (box.left < -1 || box.right > innerWidth+1);
        }).map(node => node.tagName));
      assert.deepEqual(outside,[],label+" clipped content at "+width);
    }
    if(process.env.PHASE3_EVIDENCE) {
      await mkdir(process.env.PHASE3_EVIDENCE,{recursive:true});
      await page.screenshot({path:path.join(process.env.PHASE3_EVIDENCE,(baseline?"before":"after")+"-"+label+"-"+size+".png"),animations:"disabled",fullPage:true});
    }
  }
}
const scope = "Create the packaging system for our seasonal coffee collection.\n\n1. Develop **three label designs**.\n2. Deliver print-ready artwork and a production guide.";
const cover = "I can take the identity from sketch through print proof.";
try {
  browser = await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE});
  const client = await account("coffee","Northline Coffee","CLIENT");
  const worker = await account("studio","Avery Sen","FREELANCER");
  const other = await account("guest","Guest Studio","FREELANCER");
  const outsider = await account("other","Second Client","CLIENT");
  const deadline = new Date(Date.now()+90*86400000).toISOString();
  async function publish(title,visibility) {
    const {project} = await api(client,"POST","projects",{title,description:"Design an identity for our new collection.",category:"Design",budget:25000,deadline});
    await api(client,"POST","projects/"+project.id+"/publish",{visibility});
    return project.id;
  }
  const privateId = await publish("Seasonal coffee packaging","PRIVATE");
  const {data:invite} = await api(client,"POST","projects/"+privateId+"/invitations",{freelancerId:"studio",amount:15000,days:15,scope,note:"Please include a print proof."});
  const publicId = await publish("Editorial illustration series","PUBLIC");
  const {proposal} = await api(worker,"POST","projects/"+publicId+"/proposals",{bidAmount:"21500.75",estimatedDays:12,scope:"Illustrate the three growing regions.",coverLetter:cover});
  const address = (role,id) => "/"+role+"/offers/"+id;
  const endpoint = "negotiations/"+invite.id;
  await api(worker,"PATCH",endpoint,{action:"COUNTER",version:1,amount:20000,days:20,scope,note:"Include two proof reviews."});
  await api(client,"PATCH",endpoint,{action:"COUNTER",version:2,amount:18000,days:20,scope,note:"One consolidated proof review.\nPlease supply the final production files."});
  await capture(client,"/client/offers","client-inbox");
  await capture(worker,"/freelancer/invites","freelancer-inbox");
  await capture(worker,address("freelancer",invite.id),"freelancer-counter");
  await capture(client,address("client",proposal.id),"client-proposal");
  if (!baseline) {
    await worker.getByText("Client · Initiator",{exact:true}).waitFor();
    await client.getByText("Freelancer · Initiator",{exact:true}).waitFor();
    assert.ok((await worker.locator("[data-latest]").innerText()).includes("Client · Northline Coffee"));
    assert.equal(await worker.getByRole("button",{name:"Withdraw",exact:true}).count(),0);
    const current=client.getByRole("region",{name:"Current offer"});
    await current.getByText("₹21,500.75",{exact:true}).waitFor();
    await current.getByRole("heading",{name:"Cover letter"}).waitFor();
    await current.getByText(cover,{exact:true}).waitFor();
    await current.getByRole("heading",{name:"Scope and conditions"}).waitFor();
    assert.equal(await worker.locator("[data-latest] ol li").count(),2);
    await worker.getByText("₹20,000 → ₹18,000",{exact:true}).waitFor();
    const older=worker.locator("[data-history] details").first();
    await older.locator("summary").focus();
    await worker.keyboard.press("Enter");
    await older.getByText("Please include a print proof.",{exact:true}).waitFor();
    const stamp=worker.locator("[data-latest] time").first();
    const instant=new Date(await stamp.getAttribute("datetime"));
    const display=new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(instant)+" UTC";
    assert.equal(await stamp.innerText(),display);
    for (const page of [other,outsider]) {
      assert.equal((await page.request.get(fixture.origin+"/api/"+endpoint)).status(),404);
      const path=address(page===other?"freelancer":"client",invite.id);
      const view=await page.request.get(fixture.origin+path);
      assert.ok([200,404].includes(view.status())); // Next can stream the not-found boundary.
      const html=await view.text();
      assert.ok(!html.includes("Seasonal coffee packaging") && !html.includes("One consolidated proof review."));
      const unseen=await api(page,"GET","negotiations?search=Seasonal");
      assert.deepEqual(unseen.data.items,[]);
    }
    await client.goto(fixture.origin+"/client/offers");
    await client.getByLabel("Search negotiations",{exact:true}).fill("Editorial");
    await client.getByLabel("Type",{exact:true}).selectOption("PROPOSAL");
    await client.getByRole("button",{name:"Apply filters"}).click();
    await client.getByRole("heading",{name:"Editorial illustration series"}).waitFor();
    assert.equal(await client.locator("[data-negotiation-row]").count(),1);
    await client.getByLabel("Status",{exact:true}).selectOption("REJECTED");
    await client.getByRole("button",{name:"Apply filters"}).click();
    await client.getByText("No negotiations match these filters.").waitFor();
  }
  await api(worker,"PATCH",endpoint,{action:"ACCEPT",version:3});
  await capture(client,address("client",invite.id),"client-agreement");
  await capture(worker,address("freelancer",invite.id),"freelancer-agreement");
  if (!baseline) {
    for (const page of [client,worker]) {
      const agreed=page.getByRole("region",{name:"Accepted agreement"});
      await agreed.getByText("₹18,000",{exact:true}).waitFor();
      await agreed.getByText("20 days",{exact:true}).waitFor();
      await agreed.getByText("Avery Sen",{exact:true}).waitFor();
      assert.equal(await page.locator("[data-history] li[data-version]").count(),3);
      assert.equal(await page.getByRole("button",{name:"Accept offer"}).count(),0);
    }
  }
  if (!baseline) {
    const longScope="Field notes\n\n"+"Deliver print proofs and source files. ".repeat(120)+"\n\n"+"A".repeat(1100);
    await api(client,"PATCH","negotiations/"+proposal.id,{action:"COUNTER",version:1,amount:"22000.50",days:18,scope:longScope,note:"<script>example()</script>"});
    await worker.goto(fixture.origin+address("freelancer",proposal.id));
    const text=worker.locator("[data-latest]");
    await text.getByText("A".repeat(1100),{exact:true}).waitFor();
    await text.getByText("<script>example()</script>",{exact:true}).waitFor();
    for (const width of [390,820,1440]) {
      await worker.setViewportSize({width,height:900});
      assert.ok(await text.evaluate(node=>node.scrollWidth <= node.clientWidth+1));
    }
    await fixture.pool.query("UPDATE projects SET deadline=now()-interval '1 day' WHERE id=$1",[publicId]);
    await worker.reload();
    await worker.getByText("This project is no longer open to new terms or acceptance.").waitFor();
    assert.equal(await worker.getByRole("button",{name:"Accept offer"}).count(),0);
    assert.equal(await worker.getByRole("button",{name:"Counteroffer",exact:true}).count(),0);
    await worker.getByRole("button",{name:"Reject offer"}).waitFor();
    // Legacy accepted proposals can lack a linked contract snapshot.
    await fixture.pool.query("UPDATE proposals SET status='ACCEPTED' WHERE id=$1",[proposal.id]);
    await worker.reload();
    await worker.getByRole("region",{name:"Accepted offer",exact:true}).waitFor();
    assert.equal(await worker.getByText("Contract deadline",{exact:true}).count(),0);
  }
  assert.deepEqual(errors,[]);
  console.log((baseline?"Before":"After")+" negotiation presentation verified across six views and three viewport sizes.");
} finally { await browser?.close(); await fixture.stop(); }
