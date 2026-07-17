import crypto from "crypto";

export function createRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Token must be a non-empty string.");
  }

  return crypto.createHash("sha256").update(token).digest("hex");
}
