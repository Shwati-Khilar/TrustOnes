"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const D = "var(--font-display)";
  const B = "var(--font-body)";

  return (
    <main style={{ minHeight: "100vh", background: "#eeeae4", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: B }}>
      <div style={{ width: "100%", maxWidth: 900, background: "#f5f2ed", borderRadius: 24, overflow: "hidden", display: "flex", boxShadow: "0 8px 48px rgba(0,0,0,0.10)", minHeight: 520 }}>
        <div style={{ flex: 1, padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#ebe6de", border: "1px solid #d8d2c8", borderRadius: 20, padding: "5px 14px", width: "fit-content", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c5c3e" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#7c5c3e", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: D }}>Account Recovery</span>
          </div>
          <h1 style={{ fontFamily: D, fontWeight: 800, fontSize: 36, color: "#18160f", letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 14 }}>Forgot your<br />password?</h1>
          <p style={{ fontFamily: B, fontSize: 14, color: "#7a7570", lineHeight: 1.7, marginBottom: 36, maxWidth: 340 }}>No worries. Enter your email address and we'll send you a secure link to reset your password.</p>
          <form onSubmit={handleSubmit}>
            <label style={{ fontFamily: B, fontSize: 13, fontWeight: 500, color: "#3d3a35", display: "block", marginBottom: 8 }}>Email address</label>
            <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ display: "block", width: "100%", padding: "13px 16px", fontSize: 14, fontFamily: B, background: "#ffffff", border: "1px solid #dedad4", borderRadius: 10, outline: "none", color: "#18160f", marginBottom: 16, transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#7c5c3e"}
              onBlur={e => e.target.style.borderColor = "#dedad4"}
            />
            <button type="submit" disabled={loading}
              style={{ display: "block", width: "100%", padding: "13px 20px", fontSize: 14, fontWeight: 700, fontFamily: D, letterSpacing: "0.01em", background: loading ? "#a08060" : "#6b4226", color: "#ffffff", border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", marginBottom: 20 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#7d4f30"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#6b4226"; }}
            >{loading ? "Sending…" : "Send Reset Link"}</button>
            {message && (<div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", fontFamily: B, fontSize: 13, color: "#15803d", marginBottom: 16, lineHeight: 1.5 }}>✓ {message}</div>)}
            <p style={{ fontFamily: B, fontSize: 13, color: "#9a9690", textAlign: "center" }}>
              Remember your password?{" "}<Link href="/login" style={{ fontFamily: B, color: "#6b4226", fontWeight: 600, textDecoration: "none" }}>Back to login</Link>
            </p>
          </form>
        </div>
        <div style={{ width: 380, flexShrink: 0, background: "linear-gradient(160deg, #2a1f14 0%, #1a1208 60%, #0e0b06 100%)", borderRadius: "0 24px 24px 0", padding: "40px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.045, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)", pointerEvents: "none" }} />
          <div style={{ display: "flex", gap: 8, position: "relative" }}>
            <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "6px 15px", fontFamily: D, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>TrustOnes</div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 15px", fontFamily: B, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>For independent talent</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, position: "relative" }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(192,149,53,0.14)", border: "1px solid rgba(192,149,53,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="38" height="38" fill="none" viewBox="0 0 38 38">
                <rect x="7" y="17" width="24" height="16" rx="3.5" stroke="rgba(192,149,53,0.95)" strokeWidth="1.8"/>
                <path d="M13 17v-5.5A6 6 0 0125 11.5V17" stroke="rgba(192,149,53,0.95)" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="19" cy="25" r="2.5" fill="rgba(192,149,53,0.95)"/>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: D, fontWeight: 800, fontSize: 24, color: "#f5f2ed", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 10 }}>Secure recovery.<br />Every time.</div>
              <p style={{ fontFamily: B, fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, maxWidth: 230 }}>Reset links expire in 15 minutes and can only be used once.</p>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontFamily: D, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.38)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Security Status</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: D, fontSize: 15, fontWeight: 700, color: "#f5f2ed" }}>256-bit encrypted</span>
              <div style={{ background: "rgba(192,149,53,0.18)", border: "1px solid rgba(192,149,53,0.4)", borderRadius: 7, padding: "4px 10px", fontFamily: D, fontSize: 11, fontWeight: 700, color: "#c09535" }}>✓ Safe</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}