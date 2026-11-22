import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { signInWithGoogle } from "../src/services/google-signin.js";
import { SessionClient, startFixture } from "./auth-fixture.mjs";

let fixture, prisma, passwordHash;
const password = randomBytes(24).toString("hex");
const emailFor = (id) => id.toLowerCase() + "@example.invalid";
const client = () => new SessionClient(fixture.origin);

before(async () => {
  fixture = await startFixture();
  prisma = new prismaPackage.PrismaClient({ adapter: new PrismaPg({ connectionString: fixture.databaseUrl }) });
  passwordHash = await bcrypt.hash(password, 10);
});

after(async () => {
  try {
    await prisma?.$disconnect();
  } finally {
    await fixture?.stop();
  }
});

function account(id, role, overrides = {}) {
  return prisma.user.create({ data: {
    id, name: id, email: emailFor(id), role, status: "ACTIVE", emailVerified: true, passwordHash, ...overrides,
  } });
}

async function login(id, suppliedPassword = password) {
  const browser = client();
  await browser.auth("callback/credentials", { email: emailFor(id), password: suppliedPassword });
  return browser;
}

async function expectRedirect(response, pathname) {
  const html = await response.text();
  if (response.status >= 300 && response.status < 400) {
    assert.equal(new URL(response.headers.get("location"), fixture.origin).pathname, pathname);
  } else {
    // App Router can encode a server component redirect in a streamed response.
    assert.equal(response.status, 200);
    assert.ok(html.includes("NEXT_REDIRECT") && html.includes(pathname), "expected a server redirect to " + pathname);
  }
}

function latestToken() {
  const token = fixture.messages.at(-1)?.match(/token=([a-f0-9]{64})/)?.[1];
  assert.ok(token, "expected an emailed link in the local SMTP sink");
  return token;
}

for (const role of ["CLIENT", "FREELANCER", "ADMIN"]) {
  test(role + " credentials, portal access, refresh, cross-role denial and logout", async () => {
    const id = role.toLowerCase();
    await account(id, role);
    const browser = await login(id);
    for (let refresh = 0; refresh < 2; refresh++) {
      const session = await (await browser.request("/api/auth/session")).json();
      assert.equal(session.user?.id, id);
      assert.equal(session.user?.role, role);
      assert.equal(session.user?.passwordHash, undefined);
    }
    const dashboard = await browser.request("/" + id + "/dashboard");
    assert.equal(dashboard.status, 200);
    assert.ok(!(await dashboard.text()).includes("NEXT_REDIRECT"));
    await expectRedirect(await browser.request("/redirect"), "/" + id + "/dashboard");
    const other = role === "CLIENT" ? "freelancer" : "client";
    await expectRedirect(await browser.request("/" + other + "/dashboard"), "/unauthorized");
    assert.equal((await browser.request(other === "client" ? "/api/projects" : "/api/freelancer/profile")).status, 403);
    assert.equal((await browser.post("/api/user/complete-profile", { role: "CLIENT" })).status, 403);
    assert.equal((await prisma.user.findUnique({ where: { id } })).role, role);
    await browser.auth("signout");
    assert.equal((await browser.request("/api/user/me")).status, 401);
  });
}

test("anonymous, invalid credentials, pending and suspended accounts", async () => {
  const anonymous = client();
  for (const prefix of ["client", "freelancer", "admin"]) {
    await expectRedirect(await anonymous.request("/" + prefix + "/dashboard"), "/login");
  }
  assert.equal((await anonymous.request("/api/projects")).status, 401);
  assert.equal((await anonymous.post("/api/user/complete-profile", { role: "ADMIN" })).status, 401);
  await account("inactive", "CLIENT");
  const invalid = await login("inactive", "incorrect-password");
  assert.equal((await invalid.request("/api/user/me")).status, 401);
  const signedIn = await login("inactive");
  await prisma.user.update({ where: { id: "inactive" }, data: { status: "SUSPENDED" } });
  assert.equal((await signedIn.request("/api/projects")).status, 403);
  await expectRedirect(await signedIn.request("/client/dashboard"), "/unauthorized");
  for (const status of ["SUSPENDED", "PENDING"]) {
    await prisma.user.update({ where: { id: "inactive" }, data: { status } });
    assert.equal((await (await login("inactive")).request("/api/user/me")).status, 401);
  }
});

test("expired and orphaned sessions cannot authorize requests", async () => {
  const user = await account("expiry", "CLIENT");
  const expired = client();
  expired.cookies.set("next-auth.session-token", await encode({
    secret: fixture.secret, maxAge: -3600, token: { id: user.id, email: user.email },
  }));
  assert.equal((await expired.request("/api/projects")).status, 401);
  await expectRedirect(await expired.request("/client/dashboard"), "/login");
  const browser = await login("expiry");
  await prisma.user.delete({ where: { id: user.id } });
  await account("replacement", "CLIENT", { email: user.email });
  assert.equal((await browser.request("/api/user/me")).status, 401);
  assert.equal((await browser.request("/api/projects")).status, 401);
});

test("client project list and notifications render inside the protected portal", async () => {
  await account("pages", "CLIENT");
  const browser = await login("pages");
  for (const route of ["/client/projects", "/client/notifications"]) {
    const response = await browser.request(route);
    assert.equal(response.status, 200);
    const page = await response.text();
    assert.ok(!page.includes("NEXT_REDIRECT") && !page.includes("NEXT_HTTP_ERROR_FALLBACK"));
    assert.match(page, /<aside\b/);
  }
});

test("registration, resend, verification expiry and atomic single use", async () => {
  const browser = client();
  const email = emailFor("registered");
  assert.equal((await browser.post("/api/auth/register", { name: "Registered Client", email, password, role: "CLIENT" })).status, 201);
  const original = latestToken();
  assert.equal((await (await login("registered")).request("/api/user/me")).status, 401);
  await prisma.user.update({ where: { email }, data: { verificationTokenExpiry: new Date(0) } });
  const verify = (token) => browser.request("/api/auth/verify-email?token=" + token);
  assert.match((await verify(original)).headers.get("location"), /expired-token/);
  assert.match((await browser.request("/api/auth/verify-email")).headers.get("location"), /missing-token/);
  assert.equal((await browser.post("/api/auth/resend-email-verification", { email })).status, 200);
  const token = latestToken();
  assert.notEqual(token === original, true);
  assert.match((await verify(original)).headers.get("location"), /invalid-token/);
  const results = await Promise.all([verify(token), verify(token)]);
  assert.equal(results.filter((r) => r.headers.get("location")?.endsWith("/login?verified=true")).length, 1);
  assert.match((await verify(token)).headers.get("location"), /invalid-token/);
  const signedIn = await login("registered");
  assert.equal((await signedIn.request("/api/projects")).status, 200);
});

test("verification and resend preserve suspension", async () => {
  const browser = client();
  const email = emailFor("suspended");
  await browser.post("/api/auth/register", { name: "Suspended User", email, password, role: "FREELANCER" });
  const token = latestToken();
  await prisma.user.update({ where: { email }, data: { status: "SUSPENDED" } });
  const messageCount = fixture.messages.length;
  await browser.post("/api/auth/resend-email-verification", { email });
  assert.equal(fixture.messages.length, messageCount);
  await browser.request("/api/auth/verify-email?token=" + token);
  const user = await prisma.user.findUnique({ where: { email } });
  assert.equal(user.status, "SUSPENDED");
  assert.equal(user.emailVerified, false);
});

test("reset stores a digest, rejects expiry and reuse, and invalidates the previous session", async () => {
  const user = await account("reset", "CLIENT");
  const browser = await login("reset");
  const reset = (token, value) => browser.post("/api/auth/reset-password", { token, password: value });
  await browser.post("/api/auth/forgot-password", { email: user.email });
  const expired = latestToken();
  const stored = await prisma.user.findUnique({ where: { id: user.id } });
  assert.ok(stored.resetPasswordToken === createHash("sha256").update(expired).digest("hex"));
  await prisma.user.update({ where: { id: user.id }, data: { resetPasswordExpiry: new Date(0) } });
  assert.equal((await reset(expired, password)).status, 400);
  await browser.post("/api/auth/forgot-password", { email: user.email });
  const fresh = latestToken();
  const replacement = randomBytes(24).toString("hex");
  assert.equal((await reset(fresh, "short")).status, 400);
  const results = await Promise.all([reset(fresh, replacement), reset(fresh, replacement)]);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 400]);
  assert.equal((await reset(fresh, password)).status, 400);
  assert.equal((await browser.request("/api/user/me")).status, 401);
  assert.equal((await (await login("reset", replacement)).request("/api/projects")).status, 200);
});

test("Google callback and one-time onboarding use the current verified identity", async () => {
  const user = { name: "OAuth Fixture", email: emailFor("google") };
  assert.equal(await signInWithGoogle(prisma.user, user, { email_verified: false }), false);
  assert.equal(await signInWithGoogle(prisma.user, user, { email_verified: true }), true);
  const identity = await prisma.user.findUnique({ where: { email: user.email } });
  assert.equal(identity.status, "PENDING");
  assert.equal(identity.role, null);
  // The provider's network handshake is outside this fixture. Start at its issued session.
  const browser = client();
  browser.cookies.set("next-auth.session-token", await encode({
    secret: fixture.secret, token: { id: identity.id, email: identity.email },
  }));
  await expectRedirect(await browser.request("/client/dashboard"), "/complete-profile");
  assert.equal((await browser.request("/api/freelancer/profile")).status, 403);
  assert.equal((await browser.post("/api/user/complete-profile", { role: "ADMIN" })).status, 400);
  assert.equal((await browser.post("/api/user/complete-profile", { role: "FREELANCER" })).status, 200);
  assert.equal((await browser.post("/api/user/complete-profile", { role: "CLIENT" })).status, 403);
  assert.equal((await browser.request("/api/freelancer/profile")).status, 200);
  await prisma.user.update({ where: { id: identity.id }, data: { status: "SUSPENDED" } });
  assert.equal(await signInWithGoogle(prisma.user, user, { email_verified: true }), "/unauthorized");
});

test("client records are owner-scoped and freelancer reads use session identity", async () => {
  await account("owner", "CLIENT");
  await account("other", "CLIENT");
  await account("worker", "FREELANCER");
  const owner = await login("owner"), other = await login("other"), worker = await login("worker");
  const project = await prisma.project.create({ data: {
    title: "Owner project", category: "Development", description: "Assigned work", budget: 100,
    deadline: new Date(Date.now() + 86400000), clientId: "owner", freelancerId: "worker", status: "ACTIVE",
  } });
  const path = "/api/projects/" + project.id;
  assert.equal((await owner.request(path)).status, 200);
  assert.equal((await other.request(path)).status, 404);
  assert.equal((await worker.request(path)).status, 403);
  const milestone = await prisma.milestone.create({ data: {
    projectId: project.id, title: "Plan", amount: 25, dueDate: project.deadline,
  } });
  assert.equal((await other.request(path + "/milestones/" + milestone.id, { method: "DELETE" })).status, 404);
  assert.equal((await owner.request("/api/projects/wrong-parent/milestones/" + milestone.id, { method: "DELETE" })).status, 404);
  assert.ok(await prisma.milestone.findUnique({ where: { id: milestone.id } }));
  const profile = await (await worker.request("/api/freelancer/profile?freelancerId=other")).json();
  assert.equal(profile.data.profile.id, "worker");
});

function patch(browser, pathname, data) {
  return browser.request(pathname, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function jsonAt(response, status) {
  assert.equal(response.status, status);
  return response.json();
}

test("client preferences persist sparse changes only for the current active client", async () => {
  await account("prefclient", "CLIENT");
  await account("prefother", "CLIENT");
  await account("prefworker", "FREELANCER");
  const owner = await login("prefclient");
  const update = (browser, data) => patch(browser, "/api/user/me", data);
  await jsonAt(await update(owner, { language: "HI", emailNotifications: false }), 200);
  const result = await jsonAt(await update(owner, { timezone: "UTC", userId: "prefother" }), 200);
  assert.deepEqual(result.updatedFields, ["timezone"]);
  const current = await jsonAt(await owner.request("/api/user/me"), 200);
  assert.equal(current.preferences.language, "HI");
  assert.equal(current.preferences.emailNotifications, false);
  assert.equal(current.preferences.timezone, "UTC");
  assert.equal(await prisma.userPreference.count({ where: { userId: "prefother" } }), 0);
  assert.equal((await update(owner, { timezone: "not-a-zone" })).status, 400);
  assert.equal((await update(client(), { language: "EN" })).status, 401);
  assert.equal((await update(await login("prefworker"), { language: "EN" })).status, 403);
  await prisma.user.update({ where: { id: "prefclient" }, data: { emailVerified: false } });
  assert.equal((await update(owner, { language: "EN" })).status, 403);
  assert.equal((await (await owner.request("/api/user/me")).json()).preferences, null);
});

test("project assignment, nested milestone operations, simulated funding and freelancer submission", async () => {
  await account("flowclient", "CLIENT");
  await account("flowworker", "FREELANCER");
  await account("flowother", "CLIENT");
  const owner = await login("flowclient"), worker = await login("flowworker"), other = await login("flowother");
  const draft = { title: "Web project", description: "A project for the integration suite",
    deadline: new Date(Date.now() + 86400000 * 8).toISOString(), budget: 500, category: "Development" };
  const { project } = await jsonAt(await owner.post("/api/projects", draft), 201);
  const path = "/api/projects/" + project.id;
  await jsonAt(await patch(owner, path, { ...draft, title: "Revised project" }), 200);
  assert.equal((await jsonAt(await owner.request(path), 200)).project.title, "Revised project");
  const { proposal } = await jsonAt(await worker.post(path + "/proposals", {
    bidAmount: 450, estimatedDays: 4, coverLetter: "I can deliver this project.",
  }), 201);
  assert.equal((await jsonAt(await owner.request(path + "/proposals"), 200)).proposals[0].id, proposal.id);
  await jsonAt(await patch(owner, "/api/proposals/" + proposal.id + "/accept", {}), 200);
  assert.equal((await jsonAt(await owner.request(path), 200)).project.freelancerId, "flowworker");
  const room = await jsonAt(await worker.request("/api/freelancer/deal-rooms/" + project.id), 200);
  assert.equal(room.data.dealRoom.id, project.id);
  const terms = { title: "Preview", amount: 100, dueDate: new Date(Date.now() + 86400000 * 2).toISOString() };
  const milestones = path + "/milestones";
  const removable = (await jsonAt(await owner.post(milestones, terms), 201)).milestone;
  await jsonAt(await patch(owner, milestones + "/" + removable.id, { ...terms, amount: 80 }), 200);
  await jsonAt(await owner.request(milestones + "/" + removable.id, { method: "DELETE" }), 200);
  const { milestone } = await jsonAt(await owner.post(milestones, terms), 201);
  const fund = milestones + "/" + milestone.id + "/fund";
  for (const [visitor, status] of [[client(), 401], [worker, 403], [other, 403]]) {
    assert.equal((await visitor.post(fund, {})).status, status);
  }
  assert.equal((await owner.post(fund.replace(project.id, "wrong-parent"), {})).status, 404);
  await prisma.user.update({ where: { id: "flowclient" }, data: { status: "SUSPENDED" } });
  assert.equal((await owner.post(fund, {})).status, 403);
  await prisma.user.update({ where: { id: "flowclient" }, data: { status: "ACTIVE", emailVerified: false } });
  assert.equal((await owner.post(fund, {})).status, 403);
  assert.equal(await prisma.milestoneFunding.count({ where: { milestoneId: milestone.id } }), 0);
  await prisma.user.update({ where: { id: "flowclient" }, data: { emailVerified: true } });
  const funded = await jsonAt(await owner.post(fund, {}), 200);
  assert.equal(funded.funding.status, "FUNDED_LOCKED");
  assert.equal(funded.payment.provider, "SIMULATED");
  assert.equal(funded.payment.status, "CREATED");
  assert.equal(funded.milestone.status, "IN_PROGRESS");
  assert.equal((await owner.post(fund, {})).status, 400);
  assert.equal(await prisma.paymentTransaction.count({ where: { milestoneFundingId: funded.funding.id } }), 1);
  const history = "/api/freelancer/milestones/" + milestone.id + "/submissions";
  await jsonAt(await worker.post(history, { title: "First preview", previewUrl: "https://example.invalid/preview",
    finalDeliveryUrl: "https://example.invalid/private" }), 201);
  const submitted = await jsonAt(await worker.request(history), 200);
  assert.equal(submitted.data.latestSubmission.versionNumber, 1);
  assert.equal(submitted.data.latestSubmission.isFinalDeliveryLocked, true);
  assert.equal((await owner.request(history)).status, 403);
  const next = (await jsonAt(await owner.post("/api/projects", draft), 201)).project;
  assert.equal((await jsonAt(await patch(owner, "/api/projects/" + next.id + "/cancel", {}), 200)).project.status, "CANCELLED");
});

test("freelancer read contracts and self-service remain available", async () => {
  await account("selfservice", "FREELANCER");
  const worker = await login("selfservice");
  for (const endpoint of ["dashboard", "projects", "invites", "deal-rooms", "milestones", "wallet", "notifications", "profile", "settings"]) {
    const result = await jsonAt(await worker.request("/api/freelancer/" + endpoint), 200);
    assert.equal(result.success, true, endpoint);
    assert.ok(result.data, endpoint);
  }
  await jsonAt(await patch(worker, "/api/freelancer/profile", { professionalTitle: "Test designer" }), 200);
  const saved = await jsonAt(await patch(worker, "/api/freelancer/settings", {
    name: "Fixture Designer", availability: "AVAILABLE", preferences: { preferredCurrency: "EUR" },
  }), 200);
  assert.equal(saved.data.preferences.preferredCurrency, "EUR");
  const ticket = await worker.post("/api/freelancer/settings", {
    type: "PROJECT", title: "Regression check", message: "Please check this fixture project.",
  });
  assert.ok([200, 201].includes(ticket.status));
  const settings = await jsonAt(await worker.request("/api/freelancer/settings"), 200);
  assert.equal(settings.data.supportTickets[0].title, "Regression check");
});

test("profile PATCH validates all fields before updating either table and preserves omitted fields", async () => {
  const id = "s10-profile";
  await account(id, "FREELANCER");
  const worker = await login(id);
  const url = "/api/freelancer/profile";
  const edit = data => patch(worker, url, data);
  const stored = () => prisma.freelancerProfile.findUniqueOrThrow({ where: { userId: id } });
  const link = { label: "Work", url: "https://example.invalid/portfolio" };
  await jsonAt(await edit({ name: "New name", professionalTitle: "Designer", bio: "Original", location: "Delhi",
    availability: "BUSY_OPEN", experienceLevel: "EXPERT", skills: ["UX"], portfolioLinks: [link], startingPrice: 0 }), 200);
  await jsonAt(await edit({ bio: "Edited" }), 200);
  assert.equal((await stored()).location, "Delhi");
  assert.deepEqual((await stored()).skills, ["UX"]);
  await jsonAt(await edit({ skills: ["UI"] }), 200);
  assert.equal((await stored()).bio, "Edited");
  assert.deepEqual((await stored()).portfolioLinks, [link]);
  for (const data of [{ experienceLevel: "OTHER" }, { availability: null }, { skills: null },
    { startingPrice: -1 }, { portfolioLinks: [{ ...link, url: "file:///example" }] },
    { portfolioLinks: [{ ...link, url: "invalid" }] }, { userId: "other" }, { role: "ADMIN" }, { emailVerified: false }]) {
    assert.equal((await edit({ name: "Must not persist", ...data })).status, 400);
  }
  const current = (await jsonAt(await worker.request(url), 200)).data;
  assert.equal(current.profile.name, "New name");
  assert.equal(current.freelancerProfile.startingPrice, 0);
  assert.equal(current.freelancerProfile.availability, "BUSY_OPEN");
  assert.equal(current.preferences, undefined);
  await jsonAt(await edit({ bio: null, location: null, startingPrice: null, skills: [], portfolioLinks: [] }), 200);
  const cleared = await stored();
  assert.equal(cleared.bio, null);
  assert.equal(cleared.location, null);
  assert.equal(cleared.startingPrice, null);
  assert.deepEqual(cleared.skills, []);
  assert.deepEqual(cleared.portfolioLinks, []);
});

test("client name and both preference contracts preserve ownership and independent concurrent writes", async () => {
  for (const role of ["CLIENT", "FREELANCER"]) {
    const id = "s10-prefs-" + role;
    await account(id, role);
    const session = await login(id);
    const isClient = role === "CLIENT";
    const url = isClient ? "/api/user/me" : "/api/freelancer/settings";
    const save = data => patch(session, url, isClient ? data : { preferences: data });
    assert.equal(await prisma.userPreference.count({ where: { userId: id } }), 0);
    const results = await Promise.all([save({ emailNotifications: false }), save({ language: "HI" })]);
    assert.deepEqual(results.map(r => r.status), [200, 200]);
    await jsonAt(await save({ paymentAlerts: false }), 200);
    const invalid = await save({ preferredCurrency: "UNKNOWN", language: "EN" });
    assert.equal(invalid.status, 400);
    if (isClient) {
      await jsonAt(await patch(session, "/api/client/profile", { name: "Client Updated" }), 200);
      for (const field of ["status", "role", "userId", "emailVerified"]) {
        assert.equal((await patch(session, "/api/client/profile", { name: "Incorrect", [field]: "other" })).status, 400);
      }
    } else {
      await jsonAt(await patch(session, url, { availability: "NOT_AVAILABLE" }), 200);
      await jsonAt(await patch(session, url, { name: "Worker Updated" }), 200);
      assert.equal((await prisma.freelancerProfile.findUnique({ where: { userId: id } })).availability, "NOT_AVAILABLE");
      assert.equal((await patch(session, url, { role: "ADMIN" })).status, 400);
    }
    const result = await jsonAt(await (await login(id)).request(url), 200);
    const prefs = isClient ? result.preferences : result.data.preferences;
    assert.equal(isClient ? result.user.name : result.data.account.name, isClient ? "Client Updated" : "Worker Updated");
    assert.equal(prefs.emailNotifications, false);
    assert.equal(prefs.paymentAlerts, false);
    assert.equal(prefs.language, "HI");
    assert.equal(prefs.pushNotifications, true);
  }
});

test("support history is requester-scoped and only admins can triage existing tickets", async () => {
  for (const role of ["CLIENT", "FREELANCER", "ADMIN"]) await account("s10-help-" + role, role);
  const [owner, worker, admin] = await Promise.all(["CLIENT", "FREELANCER", "ADMIN"].map(role => login("s10-help-" + role)));
  const fields = { title: "Review request", type: "ACCOUNT_DELETION", message: "Please review this request." };
  const submit = async session => (await jsonAt(await session.post("/api/support", fields), 201)).data;
  const ticket = await submit(owner);
  const other = await submit(worker);
  for (const bad of [{ type: "ANY" }, { title: " " }, { message: " short " }, { userId: other.userId }, { status: "CLOSED" }]) {
    assert.equal((await owner.post("/api/support", { ...fields, ...bad })).status, 400);
  }
  const uri = "/api/admin/support/" + ticket.id;
  for (const session of [owner, worker]) {
    assert.equal((await session.request("/api/admin/support")).status, 403);
    assert.equal((await patch(session, uri, { status: "CLOSED" })).status, 403);
  }
  const queue = (await jsonAt(await admin.request("/api/admin/support"), 200)).data;
  assert.ok(queue.some(row => row.id === other.id && row.message === fields.message));
  assert.equal((await patch(admin, uri, { status: "UNKNOWN" })).status, 400);
  assert.equal((await patch(admin, uri, { status: "CLOSED", userId: other.userId })).status, 400);
  await jsonAt(await patch(admin, uri, { status: "IN_REVIEW" }), 200);
  const mine = (await jsonAt(await owner.request("/api/support"), 200)).data;
  assert.deepEqual(mine.map(row => [row.id, row.status]), [[ticket.id, "IN_REVIEW"]]);
  assert.deepEqual((await jsonAt(await worker.request("/api/support"), 200)).data.map(row => row.id), [other.id]);
  assert.equal((await prisma.user.findUnique({ where: { id: ticket.userId } })).status, "ACTIVE");
});

function putPassword(session, body, url = "/api/user/password") {
  return session.request(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

test("password changes enforce S1 limits, clear reset tokens and invalidate existing sessions for both roles", async () => {
  for (const role of ["CLIENT", "FREELANCER"]) {
    const id = "s10-password-" + role;
    await account(id, role, { resetPasswordToken: randomBytes(32).toString("hex") });
    const a = await login(id), b = await login(id);
    const url = role === "CLIENT" ? "/api/user/password" : "/api/freelancer/settings";
    const next = randomBytes(20).toString("hex");
    for (const bad of [{ currentPassword: "incorrect" }, { newPassword: "short" }, { newPassword: "\u00e9".repeat(37) }, { confirmPassword: "mismatch" }]) {
      assert.equal((await putPassword(a, { currentPassword: password, newPassword: next, ...bad }, url)).status, 400);
    }
    await jsonAt(await putPassword(a, { currentPassword: password, newPassword: next, confirmPassword: next }, url), 200);
    for (const old of [a, b, await login(id)]) assert.equal((await old.request("/api/user/me")).status, 401);
    const fresh = (await jsonAt(await (await login(id, next)).request("/api/user/me"), 200)).user;
    assert.equal(fresh.hasPassword, true);
    assert.equal(fresh.passwordHash, undefined);
    const stored = await prisma.user.findUnique({ where: { id } });
    assert.equal(stored.resetPasswordToken, null);
    assert.ok(await bcrypt.compare(next, stored.passwordHash));
  }
  const social = await account("s10-social", "CLIENT", { provider: "google", passwordHash: null });
  const session = client();
  session.cookies.set("next-auth.session-token", await encode({ secret: fixture.secret, token: { id: social.id, credentialStamp: null } }));
  assert.equal((await jsonAt(await session.request("/api/user/me"), 200)).user.hasPassword, false);
  assert.equal((await putPassword(session, { currentPassword: "irrelevant", newPassword: password })).status, 400);
});

test("profile, preference, password and support routes enforce live portal access", async () => {
  const id = "s10-access";
  await account(id, "CLIENT");
  const session = await login(id);
  assert.equal((await patch(session, "/api/freelancer/profile", { name: "Denied" })).status, 403);
  assert.equal((await patch(session, "/api/freelancer/settings", { name: "Denied" })).status, 403);
  for (const [state, expected] of [["anonymous", 401], ["PENDING", 403], ["SUSPENDED", 403]]) {
    if (state !== "anonymous") await prisma.user.update({ where: { id }, data: { status: state } });
    const subject = state === "anonymous" ? client() : session;
    for (const response of await Promise.all([
      patch(subject, "/api/client/profile", { name: "Denied" }), patch(subject, "/api/user/me", { language: "EN" }),
      putPassword(subject, { currentPassword: password, newPassword: password }),
      subject.request("/api/support"), subject.post("/api/support", {}),
      subject.request("/api/admin/support"), patch(subject, "/api/admin/support/nonexistent", {}),
    ])) assert.equal(response.status, expected);
  }
});
