"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDashboardRoute } from "@/lib/routes";

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      const sessionRes = await fetch("/api/user/me", {
        cache: "no-store",
      });

      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.user) {
        setError("Login succeeded, but session could not be loaded.");
        return;
      }

      const dashboardRoute = getDashboardRoute(sessionData.user.role);

      router.push(dashboardRoute);
      router.refresh();
    } catch (err) {
      console.error("LOGIN_FORM_ERROR", err);
      setError("Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
    >
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome back
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Login to access your dashboard.
      </p>

      {error && (
        <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          />
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      <button
        type="button"
        onClick={() =>
          signIn("google", {
           callbackUrl: "/redirect",
          })
        }
        className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="font-semibold text-slate-900"
        >
          Create account
        </button>
      </p>
    </form>
  );
}