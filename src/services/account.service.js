import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { passwordPolicy } from "@/lib/password-policy";
import { accountName } from "@/lib/account-fields";
import { AccountInputError } from "@/lib/account-api";

export async function updateClientProfile(id, input) {
  const data = z.strictObject({ name: accountName }).parse(input);
  return prisma.user.update({ where: { id }, data, select: { name: true } });
}

export async function changePassword(id, input) {
  const { currentPassword, newPassword } = z.strictObject({
    currentPassword: z.string().min(1), newPassword: passwordPolicy, confirmPassword: z.string().optional(),
  }).refine(v => v.confirmPassword === undefined || v.newPassword === v.confirmPassword,
    { message: "Passwords must match.", path: ["confirmPassword"] }).parse(input);
  const user = await prisma.user.findUniqueOrThrow({ where: { id }, select: { passwordHash: true } });
  if (!user.passwordHash) throw new AccountInputError("Manage your password with your sign-in provider.");
  if (!await bcrypt.compare(currentPassword, user.passwordHash)) throw new AccountInputError("Current password is incorrect.");
  const passwordHash = await bcrypt.hash(newPassword, 12);
  const changed = await prisma.user.updateMany({
    where: { id, passwordHash: user.passwordHash, status: "ACTIVE", emailVerified: true },
    data: { passwordHash, resetPasswordToken: null, resetPasswordExpiry: null },
  });
  if (!changed.count) throw new AccountInputError("Account credentials changed. Sign in again.");
  return { passwordUpdated: true };
}
