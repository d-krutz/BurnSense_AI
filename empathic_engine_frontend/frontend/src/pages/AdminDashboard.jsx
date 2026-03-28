// ─────────────────────────────────────────────────────────────────
// SCREEN 2 — Admin Dashboard
// File: src/pages/AdminDashboard.jsx
// Props:
//   user       — { name, role }
//   onNavigate — fn(page: string)
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import Sidebar from "../components/Sidebar";

// ── MOCK DATA — replace with API calls ──────────────────────────
// GET /api/dashboard/stats
const STATS = [
  { label: "Active agents",        value: "7",    delta: "↑ 2 new this week",              color: "#7C5CFC", dimColor: "rgba(124,92,252,0.12)"  },
  { label: "Hours saved today",    value: "4.2",  delta: "↑ via 3 micro-syncs",            color: "#10D9A0", dimColor: "rgba(16,217,160,0.12)"   },
  { label: "Members at risk",      value: "2",    delta: "⚠ Medium burnout signal",        color: "#F59E0B", dimColor: "rgba(245,158,11,0.12)"   },
  { label: "Active blockers",      value: "1",    delta: "Scout searching now…",            color: "#F87171", dimColor: "rgba(248,113,113,0.12)"  },
];

// GET /api/agents/activity
const AGENTS = [
  { name: "Decomposer",     stat: "12 tasks created",  pct: 90,  color: "#7C5CFC" },
  { name: "Matchmaker",     stat: "8 assignments",     pct: 65,  color: "#10D9A0" },
  { name: "Scout",          stat: "1 active search",   pct: 20,  color: "#F59E0B" },
  { name: "Bridge",         stat: "3 syncs booked",    pct: 50,  color: "#60A5FA" },
  { name: "Founder's Lens", stat: "Digest ready",      pct: 100, color: "#A78BFA" },
  { name: "Profiler",       stat: "2 resumes parsed",  pct: 40,  color: "#EC4899" },
  { name: "Team Architect", stat: "1 team proposed",   pct: 30,  color: "#FB923C" },
];

// GET /api/team/burnout
const TEAM = [
  { name: "Harshil", score: 18, level: "low"  },
  { name: "Ayush",   score: 24, level: "low"  },
  { name: "Dhruv",   score: 61, level: "med"  },
  { name: "Priya",   score: 78, level: "high" },
  { name: "Rohan",   score: 29, level: "low"  },
  { name: "Sneha",   score: 33, level: "low"  },
  { name: "Karan",   score: 55, level: "med"  },
  { name: "Meera",   score: 21, level: "low"  },
];

// GET /api/syncs/recent
const SYNCS = [
  { people: ["YO","DH"], names: "You + Dhruv",    time: "Today 3:00 PM",       topic: "Shape mismatch fix", saved: "−2h",   c1:"#7C5CFC", c2:"#10D9A0" },
  { people: ["HA","AY"], names: "Harshil + Ayush", time: "Today 11:30 AM",     topic: "API schema align",   saved: "−1.2h", c1:"#F59E0B", c2:"#A78BFA" },
  { people: ["PR","KA"], names: "Priya + Karan",   time: "Yesterday 4:00 PM",  topic: "DB migration",       saved: "−1h",   c1:"#EC4899", c2:"#60A5FA" },
];

// GET /api/hires
const HIRES = [
  { initials:"RA", name:"Riya Anand",   team:"Team Alpha", skills:["React","TypeScript","Figma"],        reason:"Fills UI gap · Junior · Balanced seniority",  color:"#EC4899" },
  { initials:"AM", name:"Arjun Mehta",  team:"Team Beta",  skills:["Python","PyTorch","MLOps"],           reason:"Covers ML gap · Mid-level · Strong domain match", color:"#60A5FA" },
  { initials:"SK", name:"Sana Khan",    team:"Team Gamma", skills:["FastAPI","PostgreSQL","Docker"],      reason:"Backend specialist · Senior · Mentor potential",   color:"#10D9A0" },
];
// ────────────────────────────────────────────────────────────────

const riskStyle = {
  low:  { bg: "rgba(16,217,160,0.1)",  border: "rgba(16,217,160,0.2)",  color: "#10D9A0" },
  med:  { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)",  color: "#F59E0B" },
  high: { bg: "rgba(248,113,113,0.12)",border: "rgba(248,113,113,0.25)",color: "#F87171" },
};

export default function AdminDashboard({ user, onNavigate }) {
  const [activePage, setActivePage] = useState("admin");

  const navigate = (page) => {
    setActivePage(page);
    if (onNavigate) onNavigate(page);
  };

  return (
    <div style={s.root}>
      <Sidebar activePage={activePage} role="admin" user={user} onNavigate={navigate} />

      <div style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.pageTitle}>Admin Dashboard</div>
          <div style={s.topRight}>
            <div style={s.datePill}>Mar 19, 2026</div>
            <button style={s.iconBtn}>🔔</button>
          </div>
        </div>

        {/* Content */}
        <div style={s.content}>

          {/* Stat Cards */}
          <div style={s.statGrid}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ ...s.statCard, background: stat.dimColor, border: `1px solid ${stat.color}33` }}>
                <div style={s.statLabel}>{stat.label}</div>
                <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
                <div style={{ ...s.statDelta, color: stat.color }}>{stat.delta}</div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div style={s.mainGrid}>

            {/* Agent Activity */}
            <Card title="Agent activity today" action="View all →">
              {AGENTS.map((a, i) => (
                <div key={i} style={s.agentRow}>
                  <div style={{ ...s.agentDot, background: a.color }} />
                  <div style={s.agentName}>{a.name}</div>
                  <div style={s.agentStat}>{a.stat}</div>
                  <div style={s.barWrap}>
                    <div style={{ ...s.bar, width: `${a.pct}%`, background: a.color }} />
                  </div>
                </div>
              ))}
            </Card>

            {/* Burnout Heatmap */}
            <Card title="Team burnout risk" action="Details →">
              <div style={s.heatGrid}>
                {TEAM.map((m, i) => {
                  const rs = riskStyle[m.level];
                  return (
                    <div key={i} style={{ ...s.heatCell, background: rs.bg, border: `1px solid ${rs.border}` }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: rs.color, marginBottom: 2 }}>{m.name}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: rs.color }}>{m.score}</div>
                      <div style={{ fontSize: 10, color: rs.color, opacity: 0.8 }}>
                        {m.level === "low" ? "Low risk" : m.level === "med" ? "Medium risk" : "High risk"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Bottom grid */}
          <div style={s.bottomGrid}>

            {/* Micro Syncs */}
            <Card title="Recent micro-syncs" action="View all →">
              {SYNCS.map((sync, i) => (
                <div key={i} style={s.syncRow}>
                  <div style={s.syncAvatars}>
                    <div style={{ ...s.syncAv, background: sync.c1 + "40" }}>{sync.people[0]}</div>
                    <div style={{ ...s.syncAv, background: sync.c2 + "40", marginLeft: -8 }}>{sync.people[1]}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{sync.names}</div>
                    <div style={{ fontSize: 11, color: "#6B6880" }}>{sync.time} · {sync.topic}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#10D9A0", fontWeight: 500 }}>{sync.saved} saved</div>
                </div>
              ))}
            </Card>

            {/* Founder's Lens */}
            <Card title="Founder's Lens — Today" action="Full report →">
              <div style={s.digestBox}>
                Project Dello is <strong>70% complete</strong>. Morale is high overall.{" "}
                Priya is showing early fatigue signals — 3 consecutive long days.{" "}
                Recommend reducing her load by 30% tomorrow. We saved{" "}
                <strong>4.2 hours</strong> of stuck time today via 3 micro-syncs.
              </div>
              <div style={{ fontSize: 11, color: "#6B6880" }}>
                Generated by Agent 5 · Mar 19, 2026 at 6:00 PM
              </div>
            </Card>
          </div>

          {/* New Hires */}
          <Card title="New hire profiles — Team Architect recommendations" action="Upload resume →">
            <div style={s.hireGrid}>
              {HIRES.map((h, i) => (
                <div key={i} style={s.hireCard}>
                  <div style={s.hireTop}>
                    <div style={{ ...s.hireAv, background: h.color + "33", color: h.color }}>{h.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{h.name}</div>
                      <div style={{ fontSize: 11, color: "#A78BFA" }}>→ {h.team} (recommended)</div>
                    </div>
                  </div>
                  <div style={s.skillPills}>
                    {h.skills.map(sk => (
                      <span key={sk} style={s.pill}>{sk}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B6880", marginTop: 8 }}>{h.reason}</div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

// ── Card wrapper ──
function Card({ title, action, children }) {
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <div style={s.cardTitle}>{title}</div>
        {action && <div style={s.cardAction}>{action}</div>}
      </div>
      {children}
    </div>
  );
}

const s = {
  root:     { display: "flex", minHeight: "100vh", background: "#09090F", color: "#F0EEF8", fontFamily: "'DM Sans',sans-serif" },
  main:     { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar:   { height: 58, borderBottom: "1px solid #1C1C30", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", flexShrink: 0 },
  pageTitle:{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18 },
  topRight: { display: "flex", alignItems: "center", gap: 10 },
  datePill: { background: "rgba(255,255,255,0.04)", border: "1px solid #1C1C30", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#6B6880" },
  iconBtn:  { width: 34, height: 34, borderRadius: 8, border: "1px solid #1C1C30", background: "none", color: "#F0EEF8", cursor: "pointer", fontSize: 15 },
  content:  { flex: 1, overflowY: "auto", padding: "22px 26px", display: "flex", flexDirection: "column", gap: 16 },

  statGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 },
  statCard: { borderRadius: 14, padding: "18px 20px" },
  statLabel:{ fontSize: 11, color: "#6B6880", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 },
  statValue:{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, lineHeight: 1, marginBottom: 5 },
  statDelta:{ fontSize: 12 },

  mainGrid:   { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 },
  card:       { background: "#0F0F1A", border: "1px solid #1C1C30", borderRadius: 14, padding: "18px 20px" },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  cardTitle:  { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 },
  cardAction: { fontSize: 12, color: "#7C5CFC", cursor: "pointer" },

  agentRow:  { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1C1C30" },
  agentDot:  { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  agentName: { flex: 1, fontSize: 12, fontWeight: 500 },
  agentStat: { fontSize: 11, color: "#6B6880", minWidth: 90, textAlign: "right" },
  barWrap:   { width: 70, height: 4, background: "#1C1C30", borderRadius: 2, overflow: "hidden", marginLeft: 8 },
  bar:       { height: "100%", borderRadius: 2, transition: "width 0.3s" },

  heatGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 },
  heatCell: { borderRadius: 10, padding: "11px 10px", cursor: "pointer", transition: "transform 0.15s" },

  bottomGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  syncRow:     { display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid #1C1C30" },
  syncAvatars: { display: "flex", flexShrink: 0 },
  syncAv:      { width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, border: "2px solid #0F0F1A" },
  digestBox:   { background: "rgba(124,92,252,0.06)", border: "1px solid rgba(124,92,252,0.18)", borderRadius: 10, padding: "13px 16px", fontSize: 13, lineHeight: 1.65, marginBottom: 10 },

  hireGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  hireCard: { border: "1px solid #1C1C30", borderRadius: 10, padding: 14 },
  hireTop:  { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  hireAv:   { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 },
  skillPills:{ display: "flex", flexWrap: "wrap", gap: 4 },
  pill:      { display: "inline-block", background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)", borderRadius: 100, padding: "2px 8px", fontSize: 10, color: "#A78BFA" },
};
