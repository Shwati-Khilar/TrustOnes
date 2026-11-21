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
const emailFor = (id) => id + "@example.invalid";
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
