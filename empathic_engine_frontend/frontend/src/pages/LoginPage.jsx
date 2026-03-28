// ─────────────────────────────────────────────────────────────────
// SCREEN 1 — Login / Sign Up
// File: src/pages/LoginPage.jsx
// Dependencies: none (pure React + inline styles)
// On success: call props.onLogin({ role: 'admin' | 'user', name })
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";

const agents = [
  { icon: "⬡", label: "Decomposer",     sub: "Breaks goals into micro-tasks",      color: "#7C5CFC" },
  { icon: "◈", label: "Matchmaker",     sub: "Assigns by skill + velocity",         color: "#10D9A0" },
  { icon: "◉", label: "Scout",          sub: "RAG search — finds past solutions",   color: "#F59E0B" },
  { icon: "◫", label: "Bridge",         sub: "Books syncs in deep-work gaps",       color: "#60A5FA" },
  { icon: "◧", label: "Founder's Lens", sub: "Early-warning digest for founders",  color: "#A78BFA" },
  { icon: "◰", label: "Profiler",       sub: "Parses resumes into skill profiles",  color: "#EC4899" },
  { icon: "◱", label: "Team Architect", sub: "Builds teams by compatibility",       color: "#FB923C" },
];

export default function LoginPage({ onLogin }) {
  const [tab,      setTab]      = useState("signin");
  const [role,     setRole]     = useState("admin");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // ── INTEGRATION POINT ──────────────────────────────────────
    // Replace this mock with your actual API call:
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await res.json();
    // if (!res.ok) { setError(data.message); setLoading(false); return; }
    // onLogin({ role: data.role, name: data.name, token: data.token });
    // ───────────────────────────────────────────────────────────
    await new Promise(r => setTimeout(r, 1200)); // remove when using real API
    setLoading(false);
    onLogin({ role, name: name || email.split("@")[0] });
  };

  return (
    <div style={s.root}>
      {/* ── LEFT PANEL ── */}
      <div style={s.left}>
        <div style={s.gridBg} />
        <div style={s.glowBlob1} />
        <div style={s.glowBlob2} />

        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoMark}>E</div>
          <span style={s.logoText}>Empathic <span style={{ color: "#6B6880", fontWeight: 400 }}>Engine</span></span>
        </div>

        {/* Hero */}
        <div style={s.hero}>
          <div style={s.eyebrow}>
            <span style={s.dot} />
            7 AI Agents Active
          </div>
          <h1 style={s.heroH1}>
            Build teams<br />
            that <em style={s.heroEm}>never</em><br />
            burn out.
          </h1>
          <p style={s.heroP}>
            An autonomous AI system that decomposes goals, balances cognitive
            load, unblocks developers, and warns you before fatigue becomes a crisis.
          </p>
        </div>

        {/* Agent chips */}
        <div style={s.agentList}>
          {agents.map((a, i) => (
            <div key={i} style={s.agentChip}>
              <div style={{ ...s.chipIcon, background: a.color + "22", color: a.color }}>
                {a.icon}
              </div>
              <div>
                <div style={s.chipName}>{a.label}</div>
                <div style={s.chipSub}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={s.right}>
        <div style={s.formBox}>
          {/* Tabs */}
          <div style={s.tabs}>
            {["signin", "signup"].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
              >
                {t === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {tab === "signup" && (
              <>
                <Label>Full name</Label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <Label>You are joining as</Label>
                <div style={s.roleGrid}>
                  {[
                    { val: "admin", icon: "🏢", label: "Admin",       sub: "Manage the full org" },
                    { val: "user",  icon: "👤", label: "Team member", sub: "Personal dashboard" },
                  ].map(r => (
                    <div
                      key={r.val}
                      onClick={() => setRole(r.val)}
                      style={{ ...s.roleCard, ...(role === r.val ? s.roleCardActive : {}) }}
                    >
                      <div style={s.roleIcon}>{r.icon}</div>
                      <div style={s.roleName}>{r.label}</div>
                      <div style={s.roleSub}>{r.sub}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {error && <div style={s.errorMsg}>{error}</div>}

            <button type="submit" style={s.btnPrimary} disabled={loading}>
              {loading
                ? <span style={s.spinner} />
                : tab === "signin" ? "Sign in to Engine" : "Create account"}
            </button>
          </form>

          <div style={s.divider}><span>or</span></div>

          <button style={s.btnGoogle}>
            <GoogleIcon />
            Continue with Google
          </button>

          <p style={s.footerNote}>
            By continuing you agree to our{" "}
            <a href="#" style={s.link}>Terms</a> and{" "}
            <a href="#" style={s.link}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──
function Label({ children }) {
  return (
    <div style={{
      fontSize: 11, color: "#6B6880", textTransform: "uppercase",
      letterSpacing: "0.8px", marginBottom: 7, marginTop: 4,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </div>
  );
}

function Input({ type, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", display: "block",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "#7C5CFC" : "#1C1C30"}`,
        borderRadius: 10, padding: "12px 14px",
        color: "#F0EEF8", fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, outline: "none", marginBottom: 16,
        transition: "border-color 0.2s",
      }}
    />
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

// ── Styles ──
const s = {
  root: {
    display: "flex", minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    background: "#09090F", color: "#F0EEF8",
    overflow: "hidden",
  },
  left: {
    width: "52%", flexShrink: 0,
    display: "flex", flexDirection: "column",
    justifyContent: "space-between",
    padding: "44px 48px", position: "relative",
    overflow: "hidden",
  },
  gridBg: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "linear-gradient(rgba(124,92,252,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,252,0.04) 1px,transparent 1px)",
    backgroundSize: "48px 48px",
  },
  glowBlob1: {
    position: "absolute", bottom: 0, left: 0,
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(124,92,252,0.14) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  glowBlob2: {
    position: "absolute", top: 0, right: 80,
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(192,132,252,0.08) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  logo: {
    position: "relative", zIndex: 1,
    display: "flex", alignItems: "center", gap: 12,
  },
  logoMark: {
    width: 38, height: 38, borderRadius: 10,
    background: "#7C5CFC",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#fff",
  },
  logoText: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 18, letterSpacing: "-0.4px",
  },
  hero: { position: "relative", zIndex: 1 },
  eyebrow: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(124,92,252,0.12)",
    border: "1px solid rgba(124,92,252,0.25)",
    borderRadius: 100, padding: "5px 14px",
    fontSize: 11, color: "#A78BFA",
    letterSpacing: "0.6px", textTransform: "uppercase",
    marginBottom: 20,
  },
  dot: {
    display: "inline-block", width: 6, height: 6,
    borderRadius: "50%", background: "#10D9A0",
    animation: "pulse 2s infinite",
  },
  heroH1: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 52, fontWeight: 800,
    lineHeight: 1.05, letterSpacing: "-2px",
    marginBottom: 18,
  },
  heroEm: {
    fontStyle: "normal",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    backgroundImage: "linear-gradient(135deg,#7C5CFC,#C084FC)",
  },
  heroP: { fontSize: 15, color: "#6B6880", lineHeight: 1.7, maxWidth: 380 },
  agentList: {
    position: "relative", zIndex: 1,
    display: "flex", flexDirection: "column", gap: 8,
  },
  agentChip: {
    display: "flex", alignItems: "center", gap: 12,
    background: "rgba(255,255,255,0.025)",
    border: "1px solid #1C1C30",
    borderRadius: 10, padding: "10px 14px",
    transition: "border-color 0.2s",
  },
  chipIcon: {
    width: 30, height: 30, borderRadius: 7,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, flexShrink: 0,
  },
  chipName: { fontSize: 12, fontWeight: 500, color: "#F0EEF8" },
  chipSub:  { fontSize: 11, color: "#6B6880" },

  right: {
    flex: 1,
    background: "#0F0F1A",
    borderLeft: "1px solid #1C1C30",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "48px 44px",
  },
  formBox: { width: "100%", maxWidth: 380 },
  tabs: {
    display: "flex",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid #1C1C30",
    borderRadius: 12, padding: 4,
    marginBottom: 28,
  },
  tab: {
    flex: 1, padding: "9px 0",
    border: "none", background: "transparent",
    color: "#6B6880", fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, fontWeight: 500,
    borderRadius: 9, cursor: "pointer",
    transition: "all 0.18s",
  },
  tabActive: { background: "#7C5CFC", color: "#fff" },
  roleGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 10, marginBottom: 16,
  },
  roleCard: {
    border: "1px solid #1C1C30",
    borderRadius: 10, padding: "12px 14px",
    cursor: "pointer", transition: "all 0.18s",
    background: "rgba(255,255,255,0.02)",
  },
  roleCardActive: {
    border: "1px solid #7C5CFC",
    background: "rgba(124,92,252,0.08)",
  },
  roleIcon: { fontSize: 20, marginBottom: 6 },
  roleName: { fontSize: 13, fontWeight: 500 },
  roleSub:  { fontSize: 11, color: "#6B6880" },
  errorMsg: {
    background: "rgba(248,113,113,0.1)",
    border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: 8, padding: "9px 14px",
    fontSize: 12, color: "#F87171",
    marginBottom: 14,
  },
  btnPrimary: {
    width: "100%", padding: "13px 0",
    background: "#7C5CFC", border: "none",
    borderRadius: 10, color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, fontWeight: 500,
    cursor: "pointer", marginTop: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "opacity 0.2s, transform 0.1s",
  },
  spinner: {
    width: 18, height: 18, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  divider: {
    display: "flex", alignItems: "center", gap: 12,
    color: "#4A4760", fontSize: 12, margin: "18px 0",
  },
  btnGoogle: {
    width: "100%", padding: "12px 0",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid #1C1C30",
    borderRadius: 10, color: "#F0EEF8",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, cursor: "pointer",
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: 10,
    transition: "border-color 0.2s",
  },
  footerNote: {
    textAlign: "center", fontSize: 11,
    color: "#6B6880", marginTop: 20,
  },
  link: { color: "#7C5CFC", textDecoration: "none" },
};
