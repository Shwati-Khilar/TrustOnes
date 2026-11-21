import { randomBytes, randomUUID } from "node:crypto";
import { once } from "node:events";
import { readFile, readdir } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";

async function listen(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
}

// A local SMTP recipient captures the actual links emitted by Nodemailer.
function mailSink(messages) {
  return net.createServer((socket) => {
    socket.setEncoding("utf8");
    socket.write("220 localhost ESMTP\r\n");
    let buffer = "";
    let message = null;
    socket.on("data", (chunk) => {
      buffer += chunk;
      let end;
      while ((end = buffer.indexOf("\r\n")) !== -1) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (message !== null) {
          if (line !== ".") {
            message.push(line);
            continue;
          }
          messages.push(message.join("\r\n").replace(/=\r\n/g, "").replace(/=3D/gi, "="));
          message = null;
        } else if (line === "DATA") {
          message = [];
          socket.write("354 Send message\r\n");
          continue;
        } else if (line === "QUIT") {
          socket.end("221 Goodbye\r\n");
          break;
        }
        socket.write("250 OK\r\n");
      }
    });
  });
}

export async function startFixture() {
  const adminUrl = process.env.S1_TEST_PG_URL;
  if (!adminUrl) throw new Error("Set S1_TEST_PG_URL to a disposable PostgreSQL server with CREATEDB permission.");
  const admin = new pg.Client({ connectionString: adminUrl });
  const database = "trustones_s1_" + randomUUID().replaceAll("-", "");
  const url = new URL(adminUrl);
  url.pathname = "/" + database;
  const messages = [];
  const mail = mailSink(messages);
  let pool, app, closed, created = false;
  async function stop() {
    if (app && app.exitCode === null && app.signalCode === null) app.kill();
    if (closed) await closed;
    if (mail.listening) await new Promise((resolve) => mail.close(resolve));
    if (pool) await pool.end();
    // Only drop the randomly named database created by this invocation.
    try {
      if (created) await admin.query('DROP DATABASE "' + database + '" WITH (FORCE)');
    } finally {
      await admin.end();
    }
  }
  await admin.connect();
  try {
    await admin.query('CREATE DATABASE "' + database + '"');
    created = true;
    pool = new pg.Pool({ connectionString: url.href });
    for (const item of (await readdir("prisma/migrations", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      await pool.query(await readFile(path.join("prisma/migrations", item.name, "migration.sql"), "utf8"));
    }
    const smtpPort = await listen(mail);
    const probe = net.createServer();
    const port = await listen(probe);
    await new Promise((resolve) => probe.close(resolve));
    const origin = "http://127.0.0.1:" + port;
    const secret = randomBytes(32).toString("hex");
    app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], {
      windowsHide: true, stdio: "ignore",
      env: { ...process.env, NODE_ENV: "production", DATABASE_URL: url.href,
        NEXTAUTH_URL: origin, NEXTAUTH_URL_INTERNAL: origin, NEXT_PUBLIC_APP_URL: origin,
        NEXTAUTH_SECRET: secret, AUTH_SECRET: secret, SMTP_URL: "smtp://127.0.0.1:" + smtpPort,
        EMAIL_USER: "test@example.invalid", EMAIL_PASS: "", GOOGLE_CLIENT_ID: "fixture",
        GOOGLE_CLIENT_SECRET: "fixture", NEXT_TELEMETRY_DISABLED: "1" },
    });
    closed = once(app, "exit");
    for (let i = 0; i < 100; i++) {
      if (app.exitCode !== null) throw new Error("Test server exited. Run the production build before the integration suite.");
      try {
        if ((await fetch(origin + "/api/auth/providers")).ok) {
          return { origin, secret, pool, databaseUrl: url.href, messages, stop };
        }
      } catch { /* The HTTP listener is starting. */ }
      await delay(200);
    }
    throw new Error("Timed out waiting for the production test server.");
  } catch (error) {
    await stop();
    throw error;
  }
}

export class SessionClient {
  constructor(origin) {
    this.origin = origin;
    this.cookies = new Map();
  }
  async request(pathname, options = {}) {
    const headers = new Headers(options.headers);
    headers.set("cookie", [...this.cookies].map(([key, value]) => key + "=" + value).join("; "));
    const response = await fetch(this.origin + pathname, { ...options, headers, redirect: "manual" });
    for (const header of response.headers.getSetCookie()) {
      const pair = header.split(";", 1)[0];
      const index = pair.indexOf("=");
      this.cookies.set(pair.slice(0, index), pair.slice(index + 1));
    }
    return response;
  }
  post(pathname, data) {
    return this.request(pathname, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  }
  async auth(pathname, data = {}) {
    const { csrfToken } = await (await this.request("/api/auth/csrf")).json();
    return this.request("/api/auth/" + pathname, {
      method: "POST", body: new URLSearchParams({ csrfToken, json: "true", ...data }),
    });
  }
}
