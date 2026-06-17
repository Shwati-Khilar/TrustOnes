"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function EyeIcon({ open }) {
  return (
    <svg width="17" height="17" fill="none" viewBox="0 0 17 17">
      {open ? (
        <>
          <path d="M1.5 8.5s2.8-5.5 7-5.5 7 5.5 7 5.5-2.8 5.5-7 5.5-7-5.5-7-5.5z"
            stroke="#9a9690" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8.5" cy="8.5" r="2.2" stroke="#9a9690" strokeWidth="1.3" />
        </>
      ) : (
        <>
          <path d="M2 2l13 13M7 7.2A2.2 2.2 0 0010.5 10M4.5 4.6C2.8 5.8 1.5 8.5 1.5 8.5s2.8 5.5 7 5.5c1.5 0 2.8-.5 3.9-1.2M7.5 3.1C7.8 3 8.1 3 8.5 3c4.2 0 7 5.5 7 5.5s-.8 1.5-2 2.9"
            stroke="#9a9690" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  let label, color, width;
  if (password.length < 6) { label = "Too short"; color = "#e07070"; width = "20%"; }
  else if (password.length < 8) { label = "Weak"; color = "#e07070"; width = "38%"; }
  else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 10) { label = "Strong"; color = "#4ade80"; width = "100%"; }
  else { label = "Fair"; color = "#c09535"; width = "65%"; }

  return (
    <div style={{ marginTop: 8, marginBottom: 4 }}>
      <div style={{ height: 4, background: "#e8e4de", borderRadius: 4, overflow: "hidden", marginBottom: 5 }}>
        <div style={{ height: "100%", width, background: color, borderRadius: 4, transition: "width 0.35s, background 0.35s" }} />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600, fontFamily: "var(--font-body)" }}>{label}</span>
    </div>
  );
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Something went wrong."); return; }
      setSuccess("Password reset successful! Redirecting to login…");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const D = "var(--font-display)";
  const B = "var(--font-body)";

  return (
    <main style={{
      minHeight: "100vh",
      background: "#eeeae4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: B,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 900,
        background: "#f5f2ed",
        borderRadius: 24,
        overflow: "hidden",
        display: "flex",
        boxShadow: "0 8px 48px rgba(0,0,0,0.10)",
        minHeight: 580,
      }}>

        {/* ── LEFT: Form ── */}
        <div style={{
          flex: 1, padding: "52px 48px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#ebe6de", border: "1px solid #d8d2c8",
            borderRadius: 20, padding: "5px 14px",
            width: "fit-content", marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c5c3e" }} />
            <span style={{ fontFamily: D, fontSize: 11, fontWeight: 600, color: "#7c5c3e", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Set New Password
            </span>
          </div>

          <h1 style={{ fontFamily: D, fontWeight: 800, fontSize: 36, color: "#18160f", letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 14 }}>
            Reset your<br />password
          </h1>
          <p style={{ fontFamily: B, fontSize: 14, color: "#7a7570", lineHeight: 1.7, marginBottom: 32, maxWidth: 340 }}>
            Choose a strong password to keep your TrustOnes account secure.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: "#fff1f0", border: "1px solid #ffc9c9", borderRadius: 10, padding: "12px 16px", fontFamily: B, fontSize: 13, color: "#c0392b", marginBottom: 18, lineHeight: 1.5 }}>
                ✕ {error}
              </div>
            )}
            {success && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", fontFamily: B, fontSize: 13, color: "#15803d", marginBottom: 18, lineHeight: 1.5 }}>
                ✓ {success}
              </div>
            )}

            <label style={{ fontFamily: B, fontSize: 13, fontWeight: 500, color: "#3d3a35", display: "block", marginBottom: 8 }}>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: "block", width: "100%", padding: "13px 44px 13px 16px", fontSize: 14, fontFamily: B, background: "#ffffff", border: "1px solid #dedad4", borderRadius: 10, outline: "none", color: "#18160f", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#7c5c3e"}
                onBlur={e => e.target.style.borderColor = "#dedad4"}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
            <PasswordStrength password={password} />
            <div style={{ marginBottom: 20 }} />

            <label style={{ fontFamily: B, fontSize: 13, fontWeight: 500, color: "#3d3a35", display: "block", marginBottom: 8 }}>Confirm Password</label>
            <div style={{ position: "relative", marginBottom: mismatch ? 6 : 0 }}>
              <input
                type={showConfirm ? "text" : "password"}
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ display: "block", width: "100%", padding: "13px 44px 13px 16px", fontSize: 14, fontFamily: B, background: "#ffffff", border: `1px solid ${mismatch ? "#ffc9c9" : "#dedad4"}`, borderRadius: 10, outline: "none", color: "#18160f", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = mismatch ? "#ffc9c9" : "#7c5c3e"}
                onBlur={e => e.target.style.borderColor = mismatch ? "#ffc9c9" : "#dedad4"}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}>
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {mismatch && <p style={{ fontFamily: B, fontSize: 12, color: "#c0392b", marginBottom: 4 }}>Passwords do not match</p>}
            <div style={{ marginBottom: 24 }} />

            <button
              type="submit"
              disabled={loading}
              style={{ display: "block", width: "100%", padding: "13px 20px", fontSize: 14, fontWeight: 700, fontFamily: D, letterSpacing: "0.01em", background: loading ? "#a08060" : "#6b4226", color: "#ffffff", border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", marginBottom: 20 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#7d4f30"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#6b4226"; }}
            >
              {loading ? "Resetting…" : "Reset Password"}
            </button>

            <p style={{ fontFamily: B, fontSize: 13, color: "#9a9690", textAlign: "center" }}>
              <Link href="/login" style={{ fontFamily: B, color: "#6b4226", fontWeight: 600, textDecoration: "none" }}>← Back to login</Link>
            </p>
          </form>
        </div>

        {/* ── RIGHT: Dark panel ── */}
        <div style={{
          width: 380,
          flexShrink: 0,
          background: "linear-gradient(160deg, #2a1f14 0%, #1a1208 60%, #0e0b06 100%)",
          borderRadius: "0 24px 24px 0",
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          /* FIX: space-between pushes pills top, card bottom, center fills middle */
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Grid texture */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.045, pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px)," +
              "repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
          }} />

          {/* TOP: Pills */}
          <div style={{ display: "flex", gap: 8, position: "relative", flexShrink: 0 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "6px 15px", fontFamily: D, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
              TrustOnes
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 15px", fontFamily: B, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
              For independent talent
            </div>
          </div>

          {/* MIDDLE: Icon + text + checklist — centered in remaining space */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 18,
            position: "relative",
            /* no flex:1 — let space-between do the work */
            paddingTop: 8,
            paddingBottom: 8,
          }}>
            {/* Shield icon */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(192,149,53,0.14)",
              border: "1px solid rgba(192,149,53,0.32)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="38" height="38" fill="none" viewBox="0 0 38 38">
                <path d="M19 3L6 8.5v9c0 7.5 5.6 14.5 13 16.5 7.4-2 13-9 13-16.5v-9L19 3z"
                  stroke="rgba(192,149,53,0.9)" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M13 19l4 4 8-8"
                  stroke="rgba(192,149,53,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <div style={{ fontFamily: D, fontWeight: 800, fontSize: 22, color: "#f5f2ed", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 10 }}>
                Secure account<br />recovery.
              </div>
              <p style={{ fontFamily: B, fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, maxWidth: 240, margin: "0 auto" }}>
                Your password reset request is protected with secure encrypted authentication.
              </p>
            </div>

            {/* Checklist — left-aligned inside centered container */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 11,
                paddingLeft: 60,
              }}
            >
              {[
                "Password encrypted at rest",
                "Token expires in 15 minutes",
                "Single-use reset link",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    width: 230,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(192,149,53,0.18)",
                    border: "1px solid rgba(192,149,53,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="9" height="9" fill="none" viewBox="0 0 9 9">
                      <path d="M1.5 4.5l2 2 4-4" stroke="#c09535" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: B, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM: Security card */}
          <div style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "18px 20px",
            position: "relative",
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: D, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.38)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Security Status
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div>
                <div style={{ fontFamily: D, fontSize: 15, fontWeight: 700, color: "#f5f2ed", marginBottom: 4 }}>
                  Protected Authentication
                </div>
                <p style={{ fontFamily: B, fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>
                  Secure reset flow with encrypted credentials.
                </p>
              </div>
              <div style={{
                background: "rgba(192,149,53,0.18)", border: "1px solid rgba(192,149,53,0.4)",
                borderRadius: 999, padding: "6px 14px",
                fontFamily: D, fontSize: 11, fontWeight: 700, color: "#c09535", flexShrink: 0,
              }}>
                Secure
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}