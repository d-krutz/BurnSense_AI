// ─────────────────────────────────────────────────────────────────
// SCREEN 3 — User Dashboard
// File: src/pages/UserDashboard.jsx
// Props:
//   user       — { name, role }
//   onNavigate — fn(page: string)
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import Sidebar from "../components/Sidebar";

// ── MOCK DATA — replace with API calls ──────────────────────────
// GET /api/user/me/wellness
const WELLNESS = { score: 72, label: "Good shape today", note: "You had a long day yesterday. Recovery mode active — Matchmaker assigned lighter tasks." };

// GET /api/user/me/sync-request
const SYNC_REQUEST = {
  from: "The Bridge",
  withPerson: "Harshil",
  time: "Today 3:00 PM",
  duration: "10 mins",
  topic: "FastAPI schema alignment",
  note: "Context snippet already shared with you.",
};

// GET /api/user/me/tasks
const TASKS = {
  todo: [
    { id: 1, title: "Write Decomposer prompt v2",     project: "Empathic Engine", cog: "low" },
    { id: 2, title: "Document Bridge agent API",       project: "Empathic Engine", cog: "low" },
  ],
  inprogress: [
    { id: 3, title: "Founder's Lens LLM chain",        project: "Empathic Engine", cog: "med" },
  ],
  done: [
    { id: 4, title: "Set up CrewAI scaffold",          project: "Empathic Engine", cog: "done" },
    { id: 5, title: "GPT-4o API key + test",            project: "Setup",           cog: "done" },
  ],
};

// GET /api/user/me/velocity
const VELOCITY = [
  { day: "Mon", hrs: 5.5, pct: 55 },
  { day: "Tue", hrs: 9.0, pct: 90, warn: true },
  { day: "Wed", hrs: 9.5, pct: 95, danger: true },
  { day: "Thu", hrs: 4.5, pct: 45 },
  { day: "Fri", hrs: 4.0, pct: 40 },
  { day: "Sat", hrs: 0,   pct: 0  },
  { day: "Sun", hrs: 1.5, pct: 15 },
];

// GET /api/team/status
const TEAM_STATUS = [
  { initials: "YO", name: "You (Lead)",   status: "Deep work",  statusColor: "#A78BFA", bg: "#7C5CFC" },
  { initials: "HA", name: "Harshil",      status: "Available",  statusColor: "#10D9A0", bg: "#10D9A0" },
  { initials: "AY", name: "Ayush",        status: "In meeting", statusColor: "#F59E0B", bg: "#F59E0B" },
  { initials: "DH", name: "Dhruv (you)",  status: "Available",  statusColor: "#10D9A0", bg: "#7C5CFC" },
];
// ────────────────────────────────────────────────────────────────

const cogColors = {
  low:  { bg: "rgba(16,217,160,0.1)",  color: "#10D9A0", label: "Low cog"  },
  med:  { bg: "rgba(167,139,250,0.1)", color: "#A78BFA", label: "Med cog"  },
  high: { bg: "rgba(245,158,11,0.1)",  color: "#F59E0B", label: "High cog" },
  done: { bg: "rgba(16,217,160,0.08)", color: "#10D9A0", label: "Done ✓"   },
};

export default function UserDashboard({ user, onNavigate }) {
  const [activePage, setActivePage] = useState("user");
  const [syncAccepted, setSyncAccepted] = useState(null); // null | 'accepted' | 'declined'

  const navigate = (page) => {
    setActivePage(page);
    if (onNavigate) onNavigate(page);
  };

  return (
    <div style={s.root}>
      <Sidebar activePage={activePage} role="user" user={user} onNavigate={navigate} />

      <div style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.pageTitle}>My Dashboard</div>
          <button style={s.chatBtn} onClick={() => navigate("chat")}>
            💬 Ask the Engine
          </button>
        </div>

        <div style={s.content}>

          {/* Welcome Banner */}
          <div style={s.welcomeBanner}>
            <div>
              <h2 style={s.welcomeH2}>Good morning, {user?.name || "there"} 👋</h2>
              <p style={s.welcomeSub}>
                You have {TASKS.todo.length + TASKS.inprogress.length} active tasks · 1 micro-sync pending · Wellness: Good
              </p>
              <p style={s.welcomeNote}>{WELLNESS.note}</p>
            </div>
            <WellnessRing score={WELLNESS.score} />
          </div>

          {/* Micro-Sync Alert */}
          {syncAccepted === null && (
            <div style={s.syncAlert}>
              <div style={{ fontSize: 22 }}>🔔</div>
              <div style={{ flex: 1 }}>
                <div style={s.syncTitle}>Micro-Sync request from {SYNC_REQUEST.from}</div>
                <div style={s.syncDesc}>
                  You + {SYNC_REQUEST.withPerson} · {SYNC_REQUEST.time} · {SYNC_REQUEST.duration} · {SYNC_REQUEST.topic} · {SYNC_REQUEST.note}
                </div>
              </div>
              <button style={s.btnGhost}  onClick={() => setSyncAccepted("declined")}>Decline</button>
              <button style={s.btnAccept} onClick={() => setSyncAccepted("accepted")}>Accept sync</button>
            </div>
          )}
          {syncAccepted && (
            <div style={{ ...s.syncAlert, background: syncAccepted === "accepted" ? "rgba(16,217,160,0.06)" : "rgba(248,113,113,0.06)", borderColor: syncAccepted === "accepted" ? "rgba(16,217,160,0.2)" : "rgba(248,113,113,0.2)" }}>
              <div style={{ fontSize: 22 }}>{syncAccepted === "accepted" ? "✅" : "❌"}</div>
              <div style={{ fontSize: 13, color: "#F0EEF8" }}>
                {syncAccepted === "accepted"
                  ? "Sync accepted! Calendar invite sent for 3:00 PM today."
                  : "Sync declined. The Bridge will find another slot."}
              </div>
            </div>
          )}

          {/* Tasks */}
          <div>
            <div style={s.sectionHeader}>
              <div style={s.sectionTitle}>My tasks today</div>
              <div style={s.sectionAction}>View full board →</div>
            </div>
            <div style={s.taskCols}>
              {[
                { label: "To do",       dotColor: "#6B6880", items: TASKS.todo },
                { label: "In progress", dotColor: "#F59E0B", items: TASKS.inprogress },
                { label: "Done",        dotColor: "#10D9A0", items: TASKS.done },
              ].map(col => (
                <div key={col.label}>
                  <div style={s.colHeader}>
                    <div style={{ ...s.colDot, background: col.dotColor }} />
                    {col.label}
                  </div>
                  {col.items.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div style={s.bottomGrid}>

            {/* Velocity */}
            <Card title="My work velocity — last 7 days">
              {VELOCITY.map((d, i) => (
                <div key={i} style={s.velRow}>
                  <div style={s.velDay}>{d.day}</div>
                  <div style={s.velBarWrap}>
                    <div style={{
                      ...s.velBar,
                      width: `${d.pct}%`,
                      background: d.danger ? "#F87171" : d.warn ? "#F59E0B" : "#7C5CFC",
                    }} />
                  </div>
                  <div style={s.velHrs}>{d.hrs}h</div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: "#F59E0B", marginTop: 10 }}>
                ⚠ High load Tue–Wed. Lighter tasks assigned today by Matchmaker.
              </div>
            </Card>

            {/* Team */}
            <Card title="My team" action="Message →">
              {TEAM_STATUS.map((m, i) => (
                <div key={i} style={s.memberRow}>
                  <div style={{ ...s.memberAv, background: m.bg + "44", color: m.bg }}>
                    {m.initials}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: m.statusColor }}>
                    ● {m.status}
                  </div>
                </div>
              ))}
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──
function WellnessRing({ score }) {
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div style={{ textAlign: "center", flexShrink: 0 }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r="30" fill="none" stroke="#1C1C30" strokeWidth="7" />
        <circle
          cx="44" cy="44" r="30" fill="none"
          stroke="#10D9A0" strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="44" y="40" textAnchor="middle" fill="#10D9A0"
          style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800 }}>
          {score}
        </text>
        <text x="44" y="54" textAnchor="middle" fill="#6B6880"
          style={{ fontSize: 9, fontFamily: "'DM Sans',sans-serif" }}>
          WELLNESS
        </text>
      </svg>
      <div style={{ fontSize: 11, color: "#6B6880", marginTop: 2 }}>Good shape today</div>
    </div>
  );
}

function TaskCard({ task }) {
  const cog = cogColors[task.cog];
  return (
    <div style={s.taskCard}>
      <div style={s.taskTitle}>{task.title}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "#6B6880" }}>{task.project}</div>
        <div style={{ ...s.cogBadge, background: cog.bg, color: cog.color }}>{cog.label}</div>
      </div>
    </div>
  );
}

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
  root:      { display: "flex", minHeight: "100vh", background: "#09090F", color: "#F0EEF8", fontFamily: "'DM Sans',sans-serif" },
  main:      { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar:    { height: 58, borderBottom: "1px solid #1C1C30", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", flexShrink: 0 },
  pageTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18 },
  chatBtn:   { background: "#7C5CFC", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  content:   { flex: 1, overflowY: "auto", padding: "22px 26px", display: "flex", flexDirection: "column", gap: 16 },

  welcomeBanner: { background: "linear-gradient(135deg,rgba(124,92,252,0.12),rgba(192,132,252,0.05))", border: "1px solid rgba(124,92,252,0.18)", borderRadius: 16, padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 },
  welcomeH2:     { fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 4 },
  welcomeSub:    { fontSize: 13, color: "#6B6880" },
  welcomeNote:   { fontSize: 12, color: "#6B6880", marginTop: 6, fontStyle: "italic" },

  syncAlert: { background: "rgba(124,92,252,0.06)", border: "1px solid rgba(124,92,252,0.22)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" },
  syncTitle: { fontWeight: 500, fontSize: 13, marginBottom: 2 },
  syncDesc:  { fontSize: 11, color: "#6B6880" },
  btnGhost:  { background: "none", border: "1px solid #1C1C30", borderRadius: 8, padding: "7px 14px", color: "#F0EEF8", fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" },
  btnAccept: { background: "#7C5CFC", border: "none", borderRadius: 8, padding: "7px 14px", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" },

  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle:  { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 },
  sectionAction: { fontSize: 12, color: "#7C5CFC", cursor: "pointer" },

  taskCols:  { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  colHeader: { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: "#6B6880", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 },
  colDot:    { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  taskCard:  { background: "#0F0F1A", border: "1px solid #1C1C30", borderRadius: 10, padding: "12px 14px", marginBottom: 8, cursor: "pointer", transition: "border-color 0.15s" },
  taskTitle: { fontSize: 13, fontWeight: 500, marginBottom: 8 },
  cogBadge:  { fontSize: 10, padding: "2px 7px", borderRadius: 100 },

  bottomGrid: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 },
  card:       { background: "#0F0F1A", border: "1px solid #1C1C30", borderRadius: 14, padding: "18px 20px" },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  cardTitle:  { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 },
  cardAction: { fontSize: 12, color: "#7C5CFC", cursor: "pointer" },

  velRow:    { display: "flex", alignItems: "center", gap: 10, marginBottom: 9 },
  velDay:    { fontSize: 11, color: "#6B6880", width: 28 },
  velBarWrap:{ flex: 1, height: 7, background: "#1C1C30", borderRadius: 4, overflow: "hidden" },
  velBar:    { height: "100%", borderRadius: 4, transition: "width 0.4s" },
  velHrs:    { fontSize: 11, color: "#6B6880", width: 28, textAlign: "right" },

  memberRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1C1C30" },
  memberAv:  { width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0 },
};
