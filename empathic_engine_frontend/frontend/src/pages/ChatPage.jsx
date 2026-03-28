// ─────────────────────────────────────────────────────────────────
// SCREEN 4 — Chatbot (Ask the Engine)
// File: src/pages/ChatPage.jsx
// Props:
//   user       — { name, role }
//   onNavigate — fn(page: string)
// ─────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";

// ── INTEGRATION POINT ──────────────────────────────────────────
// Replace sendToAPI with your actual backend call:
// async function sendToAPI(message, history) {
//   const res = await fetch('/api/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ message, history })
//   });
//   return res.json(); // { reply, agent, tasks?, syncCard? }
// }
// ───────────────────────────────────────────────────────────────

const INITIAL_MESSAGES = [
  {
    id: 1, from: "engine",
    agent: "⬡ Empathic Engine",
    content: "Hey there! I'm your personal AI assistant backed by 7 agents. I have full context on your tasks, calendar, team, and projects. What do you need?",
    time: "just now",
  },
  {
    id: 2, from: "user",
    content: "I'm stuck on a shape mismatch error in the CNN inference pipeline.",
    time: "2 min ago",
  },
  {
    id: 3, from: "engine",
    agent: "🔍 Agent 3 — The Scout",
    content: "On it. I searched your team's GitHub and found something relevant — the founder solved an identical Conv2D shape mismatch last month in the v0.3-inference branch.\n\nThe fix was transposing the input tensor before the forward pass:",
    code: "x = x.permute(0, 3, 1, 2)",
    extraContent: "If it doesn't resolve it, I've briefed the founder and The Bridge is scheduling a 10-min sync.",
    syncCard: {
      title: "Micro-Sync offer from The Bridge",
      desc: "You + Founder · Today 3:00 PM · 10 mins · Shape mismatch deep-dive · Code snippet pre-shared.",
    },
    time: "1 min ago",
  },
  {
    id: 4, from: "user",
    content: "Great. What tasks should I focus on today? I had a rough couple of days.",
    time: "just now",
  },
  {
    id: 5, from: "engine",
    agent: "◈ Agent 2 — The Matchmaker",
    content: "The Matchmaker already handled this. I detected your load Tue–Wed was 9h+, so today's assignments are intentionally lighter — no heavy architecture work.",
    tasks: [
      { num: 1, title: "Write Decomposer prompt v2",  cog: "low" },
      { num: 2, title: "Document Bridge agent API",    cog: "low" },
      { num: 3, title: "Founder's Lens LLM chain",     cog: "med" },
    ],
    extraContent: "You're in recovery mode today. Don't push it.",
    time: "just now",
  },
];

const SUGGESTED = [
  "What's my burnout score?",
  "Who's free for a quick call?",
  "Show me today's team health",
  "Upload a resume for Profiler",
  "What's blocking Project Dello?",
];

const CHAT_HISTORY = [
  { id: "c1", label: "Shape mismatch — CNN pipeline",  active: true },
  { id: "c2", label: "What tasks should I do today?" },
  { id: "c3", label: "Who worked on CNN before?" },
  { id: "c4", label: "Reschedule sync with Harshil" },
  { id: "c5", label: "Explain my burnout score" },
];

const MOCK_REPLIES = [
  { agent: "⬡ Empathic Engine",         content: "Your wellness score today is 72/100 — Good. Compared to your weekly average of 68, you're trending upward. The Matchmaker's lighter load today is working. Keep it up." },
  { agent: "◫ Agent 2 — The Matchmaker", content: "Harshil and Ayush are both free right now. Rohan has a 30-min gap at 2:00 PM. Want me to schedule a quick call? The Bridge can book it without interrupting anyone's deep work." },
  { agent: "⬡ Agent 5 — Founder's Lens", content: "Team health today: 6 of 8 members in the green. Priya is showing medium-high fatigue (score 78). Karan is at 55 — borderline. Both flagged to the admin digest. No critical alerts right now." },
  { agent: "📎 Agent 6 — The Profiler",   content: "Got it — use the 📎 button to attach a resume PDF. I'll extract tech skills, seniority, domain experience, and soft skill signals, then pass the profile to the Team Architect for optimal placement." },
  { agent: "🔍 Agent 3 — The Scout",      content: "Searching now… I found 2 related GitHub issues in your repo and a past Slack thread where Harshil solved a similar blocker. Want me to summarise the key findings?" },
];

let replyIdx = 0;

export default function ChatPage({ user, onNavigate }) {
  const [activePage,   setActivePage]   = useState("chat");
  const [messages,     setMessages]     = useState(INITIAL_MESSAGES);
  const [input,        setInput]        = useState("");
  const [typing,       setTyping]       = useState(false);
  const [syncStates,   setSyncStates]   = useState({});
  const [activeChat,   setActiveChat]   = useState("c1");
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const fileRef        = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const navigate = (page) => {
    setActivePage(page);
    if (onNavigate) onNavigate(page);
  };

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content) return;
    setInput("");

    const userMsg = { id: Date.now(), from: "user", content, time: "just now" };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    // ── INTEGRATION POINT ─────────────────────────
    // const reply = await sendToAPI(content, messages);
    // setMessages(prev => [...prev, { id: Date.now()+1, from:"engine", ...reply }]);
    // ─────────────────────────────────────────────
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 600));
    const reply = MOCK_REPLIES[replyIdx % MOCK_REPLIES.length];
    replyIdx++;
    setTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, from: "engine", ...reply, time: "just now" }]);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sendMessage(`Attached resume: ${file.name} — please parse and profile this candidate.`);
  };

  const handleSyncAction = (msgId, action) => {
    setSyncStates(prev => ({ ...prev, [msgId]: action }));
  };

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <div style={s.leftSide}>
        <Sidebar activePage={activePage} role={user?.role || "user"} user={user} onNavigate={navigate} />
      </div>

      {/* Chat history panel */}
      <div style={s.historyPanel}>
        <div style={s.historyTop}>
          <button style={s.newChatBtn}>＋ New conversation</button>
        </div>
        <div style={s.historyList}>
          <div style={s.histSection}>Today</div>
          {CHAT_HISTORY.slice(0, 2).map(ch => (
            <div
              key={ch.id}
              onClick={() => setActiveChat(ch.id)}
              style={{ ...s.histItem, ...(activeChat === ch.id ? s.histItemActive : {}) }}
            >
              {ch.label}
            </div>
          ))}
          <div style={s.histSection}>Yesterday</div>
          {CHAT_HISTORY.slice(2).map(ch => (
            <div
              key={ch.id}
              onClick={() => setActiveChat(ch.id)}
              style={{ ...s.histItem, ...(activeChat === ch.id ? s.histItemActive : {}) }}
            >
              {ch.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat */}
      <div style={s.chatMain}>
        {/* Header */}
        <div style={s.chatHeader}>
          <div style={s.chatHeaderLeft}>
            <div style={s.chatTitle}>Ask the Engine</div>
            <div style={s.agentBadge}>
              <div style={s.activeDot} />
              <span style={{ fontSize: 12, color: "#A78BFA" }}>7 agents ready</span>
            </div>
          </div>
          <div style={s.ctxPills}>
            <span style={s.ctxPill}>📁 Project Dello</span>
            <span style={s.ctxPill}>👤 {user?.name || "My"} context</span>
            <span style={s.ctxPill}>📅 Today's calendar</span>
          </div>
        </div>

        {/* Messages */}
        <div style={s.messages}>
          {messages.map(msg => (
            <Message
              key={msg.id}
              msg={msg}
              user={user}
              syncState={syncStates[msg.id]}
              onSyncAction={(action) => handleSyncAction(msg.id, action)}
            />
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={s.msgRow}>
              <div style={s.engineAv}>⬡</div>
              <div style={s.bubble}>
                <div style={s.typingDots}>
                  <div style={{ ...s.typingDot, animationDelay: "0s"   }} />
                  <div style={{ ...s.typingDot, animationDelay: "0.2s" }} />
                  <div style={{ ...s.typingDot, animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div style={s.suggested}>
          {SUGGESTED.map((sug, i) => (
            <button key={i} style={s.sugChip} onClick={() => sendMessage(sug)}>
              {sug}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={s.inputArea}>
          <div style={s.inputWrap}>
            <input type="file" ref={fileRef} accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={handleFile} />
            <button style={s.attachBtn} onClick={() => fileRef.current?.click()} title="Attach resume">
              📎
            </button>
            <textarea
              ref={inputRef}
              style={s.textarea}
              placeholder="Ask anything — tasks, blockers, team health, syncs, or attach a resume…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button style={s.sendBtn} onClick={() => sendMessage()}>
              <SendIcon />
            </button>
          </div>
          <div style={s.inputHint}>
            Engine has full context on your tasks, calendar, and team · Attach a resume PDF to trigger Agent 6 (Profiler)
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Message component ──
function Message({ msg, user, syncState, onSyncAction }) {
  const isUser = msg.from === "user";
  return (
    <div style={{ ...s.msgRow, ...(isUser ? s.msgRowUser : {}) }}>
      {isUser
        ? <div style={s.userAv}>{(user?.name || "U").substring(0, 2).toUpperCase()}</div>
        : <div style={s.engineAv}>⬡</div>
      }
      <div style={{ maxWidth: "72%" }}>
        {isUser ? (
          <div style={s.userBubble}>{msg.content}</div>
        ) : (
          <div style={s.bubble}>
            {msg.agent && <div style={s.agentTag}>{msg.agent}</div>}
            <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.65 }}>{msg.content}</div>
            {msg.code && (
              <div style={s.codeBlock}>{msg.code}</div>
            )}
            {msg.extraContent && (
              <div style={{ fontSize: 13, lineHeight: 1.65, marginTop: 10 }}>{msg.extraContent}</div>
            )}
            {msg.tasks && (
              <div style={s.taskList}>
                {msg.tasks.map(t => (
                  <div key={t.num} style={s.taskItem}>
                    <div style={s.taskNum}>{t.num}</div>
                    <div style={{ flex: 1, fontSize: 12 }}>{t.title}</div>
                    <div style={{
                      ...s.cogBadge,
                      background: t.cog === "low" ? "rgba(16,217,160,0.1)" : "rgba(167,139,250,0.1)",
                      color:      t.cog === "low" ? "#10D9A0" : "#A78BFA",
                    }}>
                      {t.cog === "low" ? "Low cog" : "Med cog"}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {msg.syncCard && !syncState && (
              <div style={s.syncCard}>
                <div style={s.syncCardTitle}>🔔 {msg.syncCard.title}</div>
                <div style={s.syncCardDesc}>{msg.syncCard.desc}</div>
                <div style={s.syncActions}>
                  <button style={s.syncAccept}  onClick={() => onSyncAction("accepted")}>Accept sync</button>
                  <button style={s.syncDecline} onClick={() => onSyncAction("declined")}>Decline</button>
                </div>
              </div>
            )}
            {msg.syncCard && syncState && (
              <div style={{ ...s.syncCard, background: syncState === "accepted" ? "rgba(16,217,160,0.06)" : "rgba(248,113,113,0.06)", borderColor: syncState === "accepted" ? "rgba(16,217,160,0.2)" : "rgba(248,113,113,0.2)", marginTop: 10 }}>
                <div style={{ fontSize: 12, color: "#F0EEF8" }}>
                  {syncState === "accepted" ? "✅ Sync accepted! Invite sent for 3:00 PM." : "❌ Sync declined. Bridge will find another slot."}
                </div>
              </div>
            )}
          </div>
        )}
        <div style={{ fontSize: 10, color: "#4A4760", marginTop: 4, ...(isUser ? { textAlign: "right" } : {}) }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8L14 2L8 14L7 9L2 8Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const s = {
  root:        { display: "flex", height: "100vh", overflow: "hidden", background: "#09090F", color: "#F0EEF8", fontFamily: "'DM Sans',sans-serif" },
  leftSide:    { flexShrink: 0 },

  historyPanel:{ width: 220, flexShrink: 0, background: "#0F0F1A", borderRight: "1px solid #1C1C30", display: "flex", flexDirection: "column" },
  historyTop:  { padding: 16, borderBottom: "1px solid #1C1C30" },
  newChatBtn:  { width: "100%", padding: "9px 12px", background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.22)", borderRadius: 9, color: "#A78BFA", fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  historyList: { flex: 1, overflowY: "auto", padding: "12px 10px" },
  histSection: { fontSize: 10, color: "#4A4760", textTransform: "uppercase", letterSpacing: "0.8px", padding: "10px 8px 5px" },
  histItem:    { padding: "8px 10px", borderRadius: 7, fontSize: 12, color: "#6B6880", cursor: "pointer", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "all 0.15s" },
  histItemActive: { background: "rgba(124,92,252,0.12)", color: "#A78BFA" },

  chatMain:    { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  chatHeader:  { height: 58, borderBottom: "1px solid #1C1C30", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", flexShrink: 0 },
  chatHeaderLeft: { display: "flex", alignItems: "center", gap: 12 },
  chatTitle:   { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16 },
  agentBadge:  { display: "flex", alignItems: "center", gap: 7, background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)", borderRadius: 100, padding: "4px 12px" },
  activeDot:   { width: 6, height: 6, borderRadius: "50%", background: "#10D9A0", animation: "pulse 2s infinite" },
  ctxPills:    { display: "flex", gap: 7 },
  ctxPill:     { background: "rgba(255,255,255,0.04)", border: "1px solid #1C1C30", borderRadius: 100, padding: "4px 10px", fontSize: 11, color: "#6B6880" },

  messages:    { flex: 1, overflowY: "auto", padding: "22px 22px 0", display: "flex", flexDirection: "column", gap: 20 },

  msgRow:      { display: "flex", gap: 12, alignItems: "flex-start" },
  msgRowUser:  { flexDirection: "row-reverse" },
  engineAv:    { width: 30, height: 30, borderRadius: "50%", background: "rgba(124,92,252,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, color: "#A78BFA" },
  userAv:      { width: 30, height: 30, borderRadius: "50%", background: "#7C5CFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, color: "#fff" },
  bubble:      { background: "#141425", border: "1px solid #1C1C30", borderRadius: 14, borderBottomLeftRadius: 4, padding: "13px 16px", maxWidth: "100%" },
  userBubble:  { background: "#7C5CFC", borderRadius: 14, borderBottomRightRadius: 4, padding: "12px 16px", fontSize: 13, lineHeight: 1.65, color: "#fff" },

  agentTag:    { display: "inline-flex", alignItems: "center", background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.2)", borderRadius: 100, padding: "2px 9px", fontSize: 10, color: "#A78BFA", marginBottom: 9 },
  codeBlock:   { background: "rgba(0,0,0,0.4)", border: "1px solid #1C1C30", borderRadius: 7, padding: "8px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#C4B5FD", margin: "10px 0" },

  taskList:    { marginTop: 10, display: "flex", flexDirection: "column", gap: 6 },
  taskItem:    { background: "rgba(255,255,255,0.04)", border: "1px solid #1C1C30", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 },
  taskNum:     { width: 20, height: 20, borderRadius: "50%", background: "rgba(124,92,252,0.2)", color: "#A78BFA", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cogBadge:    { fontSize: 10, padding: "2px 7px", borderRadius: 100 },

  syncCard:    { marginTop: 12, background: "rgba(124,92,252,0.06)", border: "1px solid rgba(124,92,252,0.2)", borderRadius: 10, padding: "12px 14px" },
  syncCardTitle: { fontSize: 12, fontWeight: 500, marginBottom: 4 },
  syncCardDesc:  { fontSize: 11, color: "#6B6880" },
  syncActions:   { display: "flex", gap: 8, marginTop: 10 },
  syncAccept:    { background: "#7C5CFC", border: "none", borderRadius: 7, padding: "6px 14px", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: "pointer" },
  syncDecline:   { background: "none", border: "1px solid #1C1C30", borderRadius: 7, padding: "6px 14px", color: "#6B6880", fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: "pointer" },

  typingDots:  { display: "flex", gap: 4, alignItems: "center", padding: "4px 0" },
  typingDot:   { width: 6, height: 6, borderRadius: "50%", background: "#6B6880", animation: "pulse 1.2s infinite" },

  suggested:   { padding: "12px 22px 8px", display: "flex", gap: 8, flexWrap: "wrap" },
  sugChip:     { background: "rgba(255,255,255,0.04)", border: "1px solid #1C1C30", borderRadius: 100, padding: "7px 13px", fontSize: 12, color: "#6B6880", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" },

  inputArea:   { padding: "10px 22px 18px", flexShrink: 0 },
  inputWrap:   { background: "#0F0F1A", border: "1px solid #1C1C30", borderRadius: 13, display: "flex", alignItems: "flex-end", gap: 10, padding: "11px 14px" },
  attachBtn:   { width: 30, height: 30, borderRadius: 7, border: "1px solid #1C1C30", background: "none", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#6B6880", transition: "all 0.15s" },
  textarea:    { flex: 1, background: "none", border: "none", outline: "none", color: "#F0EEF8", fontFamily: "'DM Sans',sans-serif", fontSize: 14, resize: "none", minHeight: 22, maxHeight: 110, lineHeight: 1.5 },
  sendBtn:     { width: 32, height: 32, borderRadius: 8, background: "#7C5CFC", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "opacity 0.15s" },
  inputHint:   { fontSize: 11, color: "#4A4760", textAlign: "center", marginTop: 7 },
};
