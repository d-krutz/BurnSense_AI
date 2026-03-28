// ─────────────────────────────────────────────────────────────────
// App.jsx — Root router, wires all 4 screens
// File: src/App.jsx
//
// This is the single file to drop into your IDE root.
// It manages auth state and routing between all screens.
//
// Navigation flow:
//   Login → Admin Dashboard (role=admin)
//   Login → User Dashboard  (role=user)
//   User Dashboard "Ask the Engine" → Chat
//   Admin sidebar nav → relevant page
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import LoginPage       from "./pages/LoginPage";
import AdminDashboard  from "./pages/AdminDashboard";
import UserDashboard   from "./pages/UserDashboard";
import ChatPage        from "./pages/ChatPage";

// Global CSS keyframes — injected once at app root
const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg:      #09090F;
  --panel:   #0F0F1A;
  --border:  #1C1C30;
  --accent:  #7C5CFC;
  --accent2: #A78BFA;
  --text:    #F0EEF8;
  --muted:   #6B6880;
  --success: #10D9A0;
  --warn:    #F59E0B;
  --danger:  #F87171;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: #09090F;
  color: #F0EEF8;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1C1C30; border-radius: 4px; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

export default function App() {
  // ── Auth state ──────────────────────────────────────────────
  // user: null (logged out) | { name, role: 'admin'|'user' }
  const [user, setUser] = useState(null);

  // ── Page routing ────────────────────────────────────────────
  // page: 'login' | 'admin' | 'user' | 'chat'
  const [page, setPage] = useState("login");

  const handleLogin = (userData) => {
    setUser(userData);
    setPage(userData.role === "admin" ? "admin" : "user");
  };

  const handleNavigate = (target) => {
    // Map sidebar nav IDs to page names
    const pageMap = {
      admin:     "admin",
      user:      "user",
      chat:      "chat",
      // All other sidebar items stay on current page for now
      // Add routes as you build out more pages
    };
    if (pageMap[target]) setPage(pageMap[target]);
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      {/* Inject global styles */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLE }} />

      {page === "login" && (
        <LoginPage onLogin={handleLogin} />
      )}

      {page === "admin" && user && (
        <AdminDashboard
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {page === "user" && user && (
        <UserDashboard
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {page === "chat" && user && (
        <ChatPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
