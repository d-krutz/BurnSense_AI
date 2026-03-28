// ─────────────────────────────────────────────────────────────────
// Shared Sidebar Component
// File: src/components/Sidebar.jsx
// Props:
//   activePage  — string: 'admin' | 'user' | 'chat'
//   role        — string: 'admin' | 'user'
//   user        — { name, role }
//   onNavigate  — fn(page: string)
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";

const adminNav = [
  { section: "Overview", items: [
    { id: "admin",   icon: "⬡", label: "Dashboard"      },
    { id: "agents",  icon: "◈", label: "Agent Activity" },
    { id: "alerts",  icon: "◉", label: "Alerts", badge: "3" },
  ]},
  { section: "Team", items: [
    { id: "members", icon: "◫", label: "Members"      },
    { id: "builder", icon: "◧", label: "Team Builder" },
    { id: "hires",   icon: "⬖", label: "New Hires"   },
  ]},
  { section: "Projects", items: [
    { id: "tasks",     icon: "◰", label: "Task Boards"    },
    { id: "syncs",     icon: "◱", label: "Micro-Syncs"    },
    { id: "knowledge", icon: "◲", label: "Knowledge Base" },
  ]},
  { section: "Reports", items: [
    { id: "lens",     icon: "◳", label: "Founder's Lens" },
    { id: "settings", icon: "◴", label: "Settings"       },
  ]},
];

const userNav = [
  { section: "My Space", items: [
    { id: "user",  icon: "⬡", label: "My Dashboard"  },
    { id: "tasks", icon: "◈", label: "My Tasks"      },
    { id: "syncs", icon: "◉", label: "Micro-Syncs", badge: "1" },
  ]},
  { section: "Team", items: [
    { id: "team",      icon: "◫", label: "My Team"       },
    { id: "knowledge", icon: "◧", label: "Knowledge Base" },
  ]},
  { section: "Help", items: [
    { id: "chat",     icon: "◰", label: "Ask the Engine" },
    { id: "settings", icon: "◱", label: "Settings"       },
  ]},
];

export default function Sidebar({ activePage, role, user, onNavigate }) {
  const nav = role === "admin" ? adminNav : userNav;

  return (
    <div style={s.sidebar}>
      {/* Logo */}
      <div style={s.logoArea}>
        <div style={s.logoMark}>E</div>
        <div style={s.logoText}>Empathic Engine</div>
      </div>

      {/* Nav */}
      <div style={s.nav}>
        {nav.map(group => (
          <div key={group.section}>
            <div style={s.section}>{group.section}</div>
            {group.items.map(item => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  ...s.navItem,
                  ...(activePage === item.id ? s.navItemActive : {}),
                }}
              >
                <span style={s.navIcon}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={s.badge}>{item.badge}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.avatar}>
          {(user?.name || "U").substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={s.userName}>{user?.name || "User"}</div>
          <div style={s.userRole}>
            {role === "admin" ? "Admin · Founder" : user?.role || "Team Member"}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  sidebar: {
    width: 220, flexShrink: 0,
    background: "#0F0F1A",
    borderRight: "1px solid #1C1C30",
    display: "flex", flexDirection: "column",
    height: "100vh", position: "sticky", top: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  logoArea: {
    padding: "20px 18px 18px",
    borderBottom: "1px solid #1C1C30",
    display: "flex", alignItems: "center", gap: 10,
  },
  logoMark: {
    width: 32, height: 32, borderRadius: 8,
    background: "#7C5CFC",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Syne', sans-serif", fontWeight: 800,
    fontSize: 14, color: "#fff", flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 14, letterSpacing: "-0.3px", color: "#F0EEF8",
  },
  nav: { flex: 1, overflowY: "auto", padding: "12px 10px" },
  section: {
    fontSize: 10, color: "#4A4760",
    textTransform: "uppercase", letterSpacing: "1px",
    padding: "14px 8px 6px",
  },
  navItem: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "8px 10px", borderRadius: 8,
    color: "#6B6880", fontSize: 13,
    cursor: "pointer", transition: "all 0.15s",
    marginBottom: 1,
  },
  navItemActive: {
    background: "rgba(124,92,252,0.14)",
    color: "#A78BFA",
  },
  navIcon: { fontSize: 14, width: 18, textAlign: "center", flexShrink: 0 },
  badge: {
    background: "#F87171", color: "#fff",
    borderRadius: 100, padding: "1px 6px",
    fontSize: 10, fontWeight: 600,
  },
  footer: {
    padding: "14px 18px",
    borderTop: "1px solid #1C1C30",
    display: "flex", alignItems: "center", gap: 10,
  },
  avatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "#7C5CFC",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 600, color: "#fff", flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 500, color: "#F0EEF8" },
  userRole: { fontSize: 11, color: "#6B6880" },
};
