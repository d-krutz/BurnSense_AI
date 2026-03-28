// ─────────────────────────────────────────────
// EMPATHIC ENGINE — Shared Design Tokens
// Import this in every screen
// ─────────────────────────────────────────────

export const COLORS = {
  bg:       '#09090F',
  panel:    '#0F0F1A',
  panel2:   '#141425',
  border:   '#1C1C30',
  border2:  '#252540',
  accent:   '#7C5CFC',
  accent2:  '#A78BFA',
  accent3:  '#C4B5FD',
  text:     '#F0EEF8',
  muted:    '#6B6880',
  muted2:   '#4A4760',
  success:  '#10D9A0',
  warn:     '#F59E0B',
  danger:   '#F87171',
  pink:     '#EC4899',
};

export const FONTS = {
  display: "'Syne', sans-serif",
  body:    "'DM Sans', sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

// Shared global CSS — inject into your index.css or App.css
export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg:      #09090F;
  --panel:   #0F0F1A;
  --panel2:  #141425;
  --border:  #1C1C30;
  --border2: #252540;
  --accent:  #7C5CFC;
  --accent2: #A78BFA;
  --accent3: #C4B5FD;
  --text:    #F0EEF8;
  --muted:   #6B6880;
  --muted2:  #4A4760;
  --success: #10D9A0;
  --warn:    #F59E0B;
  --danger:  #F87171;
  --pink:    #EC4899;
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
  --radius-sm: 6px;
  --radius:    10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

/* Keyframes */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
`;
