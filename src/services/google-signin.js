export async function signInWithGoogle(users, user, profile) {
  const email = user.email?.trim().toLowerCase();
  if (!email || profile?.email_verified !== true) return false;

  // Preserve suspension, pending status and existing credentials on every login.
  const identity = await users.upsert({
    where: { email },
    create: {
      email, name: user.name || "Google User", image: user.image || null,
      provider: "google", emailVerified: true, status: "PENDING",
    },
    update: {},
    select: { id: true, emailVerified: true, status: true, role: true },
  });
  if (identity.status === "SUSPENDED") return "/unauthorized";
  if (!identity.emailVerified || (identity.status === "PENDING" && identity.role)) return false;
  return true;
}
