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
    if(process.env.PHASE2_EVIDENCE) {
      await mkdir(process.env.PHASE2_EVIDENCE,{recursive:true});
      await page.screenshot({path:path.join(process.env.PHASE2_EVIDENCE,(baseline?"before":"after")+"-"+label+"-"+size+".png"),animations:"disabled",fullPage:true});
    }
  }
}
try {
  browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE});
  const owner=await account("buyer","Northline Coffee","CLIENT");
  const worker=await account("avery","Avery Sen","FREELANCER");
  await account("rowan","Rowan Das","FREELANCER");
  const iman=await account("iman","Iman Shah","FREELANCER");
  const portrait="/fixture-studio.png";
  await fixture.pool.query("UPDATE users SET image=$1 WHERE id='avery'",[portrait]);
  const sharp=createRequire(import.meta.url)("sharp");
  const mark=await sharp(Buffer.from('<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg"><rect width="180" height="180" fill="#244e49"/><path d="m25 125 48-84h30l-48 84zm57 0 30-52 33 52z" fill="#f8dfb2"/></svg>')).png().toBuffer();
  for (const page of [owner,worker]) {
    await page.context().route("**"+portrait,route=>route.fulfill({contentType:"image/png",body:mark}));
  }
  const portfolio="https://example.invalid/avery/work";
  const bio="I build visual identities and packaging for independent food brands, from the first pencil sketch to the final print proof.";
  await api(worker,"PATCH","freelancer/profile",{professionalTitle:"Brand & packaging designer",bio,location:"Pune, India",skills:["Typography","Packaging","Art direction","Print design"],experienceLevel:"EXPERT",availability:"BUSY_OPEN",startingPrice:"18500.50",portfolioLinks:[{label:"Selected identities",url:portfolio}],phone:"9876543210"});
  await api(iman,"PATCH","freelancer/profile",{professionalTitle:"Editorial illustrator",bio:"Hand-drawn illustrations for independent publications.",availability:"AVAILABLE",experienceLevel:"ADVANCED",location:"Kochi, India",skills:["Illustration","Editorial"],startingPrice:7500});
  const {project}=await api(owner,"POST","projects",{title:"Seasonal coffee identity",description:"Create the new collection identity.",category:"Design",budget:40000,deadline:new Date(Date.now()+86400000*90).toISOString()});
  await api(owner,"POST","projects/"+project.id+"/publish",{visibility:"PRIVATE"});
  const directory="/client/freelancers";
  await capture(owner,directory,"directory");
  await capture(owner,directory+"/avery","profile");
  await capture(owner,directory+"/rowan","sparse");
  await capture(owner,directory+"?q=no-such-specialty","empty");
  if(!baseline) {
    await owner.goto(fixture.origin+directory);
    await owner.getByRole("searchbox").waitFor();
    assert.equal(await owner.getByRole("searchbox").count(),1);
    const search=owner.getByRole("searchbox");
    await search.fill("typogra");
    await owner.keyboard.press("Tab");
    assert.equal(await owner.locator(":focus").getAttribute("name"),"availability");
    await owner.getByLabel("Availability",{exact:true}).selectOption("BUSY_OPEN");
    await owner.getByRole("button",{name:"Search",exact:true}).focus();
    await owner.keyboard.press("Enter");
    await owner.getByText("1 freelancer",{exact:true}).waitFor();
    const card=owner.locator("article").filter({hasText:"Avery Sen"});
    const photo = card.getByRole("img",{name:"Avery Sen"});
    await photo.evaluate(img=>img.decode());
    assert.ok(await photo.evaluate(img=>img.naturalWidth>0));
    await card.getByText("Busy",{exact:true}).waitFor();
    await card.getByText("Open to offers",{exact:true}).waitFor();
    await card.getByRole("link",{name:"View profile"}).click();
    await owner.getByRole("heading",{name:"Avery Sen"}).waitFor();
    await owner.getByText(bio,{exact:true}).waitFor();
    assert.equal(await owner.locator("dd").filter({hasText:/^Unrated$/}).count(),1);
    assert.equal(await owner.getByRole("link",{name:/Selected identities/}).getAttribute("href"),portfolio);
    assert.ok(!(await owner.locator("main").innerText()).includes("9876543210"));
    await owner.getByRole("link",{name:"Invite to project",exact:true}).click();
    await owner.getByLabel("Your project").selectOption(project.id);
    await owner.locator("[name=amount]").fill("24500");
    await owner.locator("[name=days]").fill("18");
    await owner.locator("[name=scope]").fill("Create an identity and three print-ready labels.");
    await owner.locator("[name=note]").fill("Include a proof review.");
    await owner.getByRole("button",{name:"Send invitation"}).click();
    await owner.waitForURL(u=>u.pathname.startsWith("/client/offers/"));
    await owner.getByText("Invitation sent.",{exact:true}).waitFor();
    await worker.goto(fixture.origin+"/freelancer/invites");
    await worker.locator("article").filter({hasText:project.title}).getByRole("link").click();
    await worker.getByRole("button",{name:"Accept offer"}).waitFor();
    await owner.goto(fixture.origin+directory+"/avery");
    assert.equal(await owner.getByRole("button",{name:"Send invitation"}).count(),0);
    await owner.getByText("You have no eligible published projects for this freelancer.").waitFor();
    await owner.getByRole("link",{name:"Create a project",exact:true}).waitFor();
    await owner.goto(fixture.origin+directory+"/rowan");
    await owner.getByText("RD",{exact:true}).waitFor();
    assert.equal(await owner.getByRole("heading",{name:"Portfolio"}).count(),0);
    assert.equal(await owner.getByRole("heading",{name:"About",exact:true}).count(),0);
    // A legacy photo URL can still return unreadable image data.
    await owner.context().route("**"+portrait,route=>route.fulfill({contentType:"image/png",body:"unreadable"}));
    await owner.goto(fixture.origin+directory+"/avery");
    await owner.getByText("AS",{exact:true}).waitFor();
  }
  assert.deepEqual(errors,[]);
  console.log((baseline?"Before":"After")+" freelancer discovery checks passed. Four screens at three sizes.");
} finally { await browser?.close(); await fixture.stop(); }
