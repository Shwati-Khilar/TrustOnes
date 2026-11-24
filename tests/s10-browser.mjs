import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { startFixture } from "./auth-fixture.mjs";

// Use an installed Playwright and browser. S1_TEST_PG_URL must refer to a disposable server.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const screenshotDir = process.env.S10_SCREENSHOTS;
const fixture = await startFixture();
const db = new prismaPackage.PrismaClient({ adapter: new PrismaPg({ connectionString: fixture.databaseUrl }) });
let browser;
const errors = [];

async function account(role, name, social = false) {
  const password = randomBytes(16).toString("hex");
  const email = name.toLowerCase().replaceAll(" ", "-") + "@example.invalid";
  const user = await db.user.create({ data: {
    name, email, role, status: "ACTIVE", emailVerified: true,
    provider: social ? "google" : "credentials", passwordHash: social ? null : await bcrypt.hash(password, 10),
  } });
  return { ...user, password };
}

async function login(context, email, password) {
  const csrf = await (await context.request.get(fixture.origin + "/api/auth/csrf")).json();
  await context.request.post(fixture.origin + "/api/auth/callback/credentials", {
    form: { csrfToken: csrf.csrfToken, email, password, json: "true" },
  });
}

async function openPage(context) {
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") {
      const resource = new URL(message.location().url || page.url());
      errors.push(resource.hostname + " " + message.text());
    }
  });
  return page;
}

async function checkViews(page, role) {
  for (const view of ["profile", "settings"]) {
    const route = "/" + role + "/" + view;
    await page.goto(fixture.origin + route);
    await page.waitForLoadState("networkidle");
    assert.equal(new URL(page.url()).pathname, route);
    for (const [size, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route + " horizontal overflow");
      const clipped = await page.locator("input:visible, select:visible, textarea:visible").evaluateAll(fields =>
        fields.filter(field => { const rect = field.getBoundingClientRect(); return rect.left < -1 || rect.right > innerWidth + 1; })
          .map(field => field.name || field.placeholder || field.tagName)
      );
      assert.deepEqual(clipped, [], route + " clipped form fields at " + size);
      if (screenshotDir) await page.screenshot({ path: path.join(screenshotDir, ["after", role, view, size].join("-") + ".png"), animations: "disabled" });
    }
  }
}

async function checkPortal(role) {
  const isClient = role === "client";
  const user = await account(role.toUpperCase(), "Review " + role);
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  try {
    await login(context, user.email, user.password);
    const page = await openPage(context);
    await checkViews(page, role);
    await page.goto(fixture.origin + "/" + role + "/profile");
    const editor = isClient ? page.getByRole("textbox", { name: "Full name" }) : page.getByRole("textbox", { name: "Public Bio" });
    const value = isClient ? "Edited client name" : "Biography updated in the mobile browser.";
    await editor.fill(value);
    await page.getByRole("button", { name: isClient ? "Save name" : "Save Profile", exact: true }).click();
    await page.getByText(isClient ? "Name saved." : "Profile saved successfully.", { exact: true }).waitFor();
    await page.reload();
    await page.waitForLoadState("networkidle");
    assert.equal(await editor.inputValue(), value);

    const toggle = page.getByRole("switch", { name: "Email notifications", exact: true }).first();
    if (isClient) {
      let release;
      const gate = new Promise(resolve => { release = resolve; });
      await page.route("**/api/user/me", async route => { await gate; await route.continue(); });
      try {
        await page.goto(fixture.origin + "/client/settings", { waitUntil: "domcontentloaded" });
        await toggle.waitFor();
        assert.equal(await toggle.isDisabled(), true, "Loading preferences must lock the switches");
      } finally { release(); }
    } else {
      await page.goto(fixture.origin + "/freelancer/settings");
    }
    await toggle.click();
    await page.getByRole("button", { name: isClient ? "Save changes" : "Save Settings", exact: true }).click();
    await page.getByText(isClient ? "Settings saved." : "Settings saved successfully.", { exact: true }).waitFor();
    await page.reload();
    await page.waitForLoadState("networkidle");
    assert.equal(await toggle.getAttribute("aria-checked"), "false");

    const subject = role + " support case";
    const title = isClient ? page.getByLabel("Subject", { exact: true }) : page.getByPlaceholder("Short issue title");
    const description = isClient ? page.getByLabel("Description") : page.getByPlaceholder("Explain the support issue clearly...");
    await title.fill(subject);
    await description.fill("Please review this request from my portal.");
    await page.getByRole("button", { name: isClient ? "Submit ticket" : "Submit Support Request" }).click();
    await page.getByText(subject, { exact: true }).waitFor();

    const current = isClient ? page.locator("[name=currentPassword]") : page.getByPlaceholder("Enter current password");
    const next = isClient ? page.locator("[name=newPassword]") : page.getByPlaceholder("Minimum 8 characters");
    const confirm = isClient ? page.locator("[name=confirmPassword]") : page.getByPlaceholder("Confirm new password");
    const replacement = randomBytes(16).toString("hex");
    await current.fill(user.password);
    if (!isClient) {
      await page.getByRole("button", { name: "Show current password" }).click();
      assert.equal(await current.getAttribute("type"), "text");
      await page.getByRole("button", { name: "Hide current password" }).click();
    }
    await next.fill(replacement);
    await confirm.fill(replacement + "different");
    await page.getByRole("button", { name: /^update password$/i }).click();
    await page.getByText(/passwords must match|confirm password do not match/i).waitFor();
    await confirm.fill(replacement);
    await page.getByRole("button", { name: /^update password$/i }).click();
    await page.waitForURL(url => url.pathname === "/login");
    await login(context, user.email, replacement);
    await page.goto(fixture.origin + "/" + role + "/settings");
    await page.getByText(subject, { exact: true }).waitFor();
    assert.equal(await toggle.getAttribute("aria-checked"), "false");
    console.log(role + " profile, preferences, support, password change and fresh login passed");
  } finally { await context.close(); }
}

async function checkTriage() {
  const admin = await account("ADMIN", "Review admin");
  const context = await browser.newContext();
  try {
    await login(context, admin.email, admin.password);
    const page = await openPage(context);
    await page.goto(fixture.origin + "/admin/dashboard");
    await page.getByRole("link", { name: "Support requests" }).click();
    const ticket = page.locator("article").filter({ hasText: "client support case" });
    await ticket.getByLabel("Status").selectOption("IN_REVIEW");
    await ticket.getByRole("button", { name: "Update status" }).click();
    await ticket.getByText("Status saved.").waitFor();
    await page.reload();
    assert.equal(await ticket.getByLabel("Status").inputValue(), "IN_REVIEW");
    console.log("Admin triage and reload passed");
  } finally { await context.close(); }
}

async function checkSocial(role) {
  const user = await account(role.toUpperCase(), "Social " + role, true);
  const context = await browser.newContext();
  try {
    const token = await encode({ secret: fixture.secret, token: { id: user.id, credentialStamp: null } });
    await context.addCookies([{ name: "next-auth.session-token", value: token, url: fixture.origin }]);
    const page = await openPage(context);
    await page.goto(fixture.origin + "/" + role + "/settings");
    await page.getByText(role === "client" ? "Manage your password with your sign-in provider." : "Password change is not available for social login accounts.").waitFor();
    assert.equal(await page.locator('input[type="password"]:enabled').count(), 0);
  } finally { await context.close(); }
}

try {
  if (screenshotDir) await mkdir(screenshotDir, { recursive: true });
  browser = await chromium.launch({ executablePath: process.env.CHROME_EXECUTABLE, headless: true });
  await checkPortal("client");
  await checkPortal("freelancer");
  await checkTriage();
  await checkSocial("client");
  await checkSocial("freelancer");
  assert.deepEqual(errors, []);
  console.log("Social account controls passed for both roles. No browser console or page errors.");
} finally {
  await browser?.close();
  await db.$disconnect();
  await fixture.stop();
}
