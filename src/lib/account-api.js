import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { InvalidPreferenceError } from "@/services/client-settings.service";

export class AccountInputError extends Error {}

export function accountEndpoint(roles, operation, { body = false, status = 200, message } = {}) {
  return async function handler(request, context) {
    try {
      const session = await getServerSession(authOptions);
      const access = requireRole(session, roles);
      if (!access.allowed) return Response.json({ success: false, message: access.message }, { status: access.status });
      let input;
      if (body) {
        try { input = await request.json(); }
        catch { throw new AccountInputError("Enter a valid JSON object."); }
      }
      const data = await operation(session.user.id, input, await context?.params);
      return Response.json({ success: true, message, data }, { status, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        const field = issue.path.join(".");
        return Response.json({ success: false, field, message: [field, issue.message].filter(Boolean).join(": ") }, { status: 400 });
      }
      if (error instanceof AccountInputError || error instanceof InvalidPreferenceError) {
        return Response.json({ success: false, message: error.message }, { status: 400 });
      }
      if (error.code === "P2025") return Response.json({ success: false, message: "Record unavailable." }, { status: 404 });
      console.error("Account operation failed", error.name);
      return Response.json({ success: false, message: "Unable to complete this request." }, { status: 500 });
    }
  };
}
