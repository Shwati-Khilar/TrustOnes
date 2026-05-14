"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
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
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        setFieldErrors(data.errors || {});
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error("REGISTER_FORM_ERROR", err);
      setError("Something went wrong. Please try again.");
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
        Create your account
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Register as a client or freelancer.
      </p>

      {error && (
        <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.name[0]}
            </p>
          )}
        </div>

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
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.email[0]}
            </p>
          )}
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
            placeholder="Minimum 8 characters"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.password[0]}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Register As
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          >
            <option value="CLIENT">Client</option>
            <option value="FREELANCER">Freelancer</option>
          </select>
          {fieldErrors.role && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.role[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-slate-900"
        >
          Login
        </button>
      </p>
    </form>
  );
}