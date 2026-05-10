import { signOut } from "next-auth/react";

export async function logoutUser() {
  const data = await signOut({
    redirect: false,
    callbackUrl: "/login",
  });

  return data;
}