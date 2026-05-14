"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    const res = await fetch(
      "/api/auth/forgot-password",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await res.json();

    setMessage(data.message);
  }

  return (
    <main className="flex min-h-screen items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow"
      >

        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-4 w-full rounded border p-3"
        />

        <button
          className="mt-4 w-full rounded bg-black p-3 text-white"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}

      </form>

    </main>
  );
}