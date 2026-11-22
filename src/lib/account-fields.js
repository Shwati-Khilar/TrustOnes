import { z } from "zod";

export const accountName = z.string().trim().min(2).max(80);
export const availability = z.enum(["AVAILABLE", "BUSY_OPEN", "NOT_AVAILABLE"]);
export const nonemptyPatch = fields => z.strictObject(fields).partial()
  .refine(value => Object.keys(value).length > 0, "Provide at least one field.");
