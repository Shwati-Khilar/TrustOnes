import { z } from "zod";

export const passwordPolicy = z.string().min(8, "Use at least 8 characters.")
  .refine(value => Buffer.byteLength(value, "utf8") <= 72, "Use at most 72 UTF-8 bytes.");
