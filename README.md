# Empathic Engine 🧠

> **AI-powered project management that puts team wellbeing first.**
> A multi-agent system that decomposes goals, balances cognitive load, unblocks developers, and warns you before fatigue becomes a crisis.

[![Python](https://img.shields.io/badge/Python-3.10%2B-7C5CFC?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![CrewAI](https://img.shields.io/badge/CrewAI-0.80%2B-22D3A0?style=flat-square)](https://crewai.com)
[![Groq](https://img.shields.io/badge/Groq-Llama--3.1-FFAB00?style=flat-square)](https://groq.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-C084FC?style=flat-square)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [The 5 AI Agents](#the-5-ai-agents)
- [System Architecture](#system-architecture)
- [Screens & UI](#screens--ui)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Agents](#running-the-agents)
- [API Reference](#api-reference)
- [How Agent Handshakes Work](#how-agent-handshakes-work)
- [Production Upgrade Path](#production-upgrade-path)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Empathic Engine is an **MVP AI Project Manager** built on [CrewAI](https://crewai.com) and powered by [Groq's](https://groq.com) ultra-fast inference API. It orchestrates **5 specialized AI agents** that work in sequence to manage a software project from a high-level business goal all the way through to a founder-ready executive summary — while keeping team health and burnout prevention at the centre of every decision.

### Why "Empathic"?

Most project management tools optimise for speed and throughput. Empathic Engine optimises for **sustainable velocity** — the kind that keeps great teams intact over months and years, not just through the next sprint. Every agent has a stress-aware backstory, the Matchmaker enforces a hard stress ceiling, and the Founder's Lens watches for burnout signals invisibly in the background.

---

## The 5 AI Agents

| Agent | Model | Role | Key Behaviour |
|-------|-------|------|---------------|
| **The Decomposer** | Llama 3.1 70B | Breaks high-level goals into micro-tasks (≤4h each) | Flags ⚠️ high cognitive-load tasks |
| **The Matchmaker** | Llama 3.1 70B | Assigns tasks to team members | Never assigns to anyone with stress > 7/10 |
| **The Scout** | Llama 3.1 8B | RAG-based institutional memory search | Finds who solved this before, prevents re-work |
| **The Bridge** | Llama 3.1 8B | Coordinates 10-minute Micro-Sync meetings | Triggers syncs only when a blocker is detected |
| **The Founder's Lens** | Llama 3.1 70B | Strategic summary + burnout risk alerts | 🟢/🟡/🔴 health status, 3 actionable recommendations |

### LLM Tier Strategy

- **70B (heavy reasoning)** — Decomposer, Matchmaker, Founder's Lens: tasks requiring nuanced judgment about ambiguity, human stress, and strategy.
- **8B (fast utility)** — Scout, Bridge: lookup and scheduling tasks where sub-100ms response time matters more than reasoning depth.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Web Client)                  │
│  Login · Admin Dashboard · User Dashboard · Chatbot UI   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS / WebSocket
┌────────────────────▼────────────────────────────────────┐
│               Backend Layer (FastAPI)                    │
│  API Gateway · Auth (JWT/RBAC) · Task Service            │
│  WebSocket Server · Notification Service                 │
└────────────────────┬────────────────────────────────────┘
                     │ Service calls
┌────────────────────▼────────────────────────────────────┐
│          CrewAI Orchestrator (Process.sequential)        │
│                                                          │
│  [Decomposer] → [Matchmaker] → [Scout] → [Bridge] → [Lens]│
│       context[] flows right across all agents            │
└────────────────────┬────────────────────────────────────┘
                     │ Tool calls
┌────────────────────▼────────────────────────────────────┐
│            Tools, Data & External Integrations           │
│  TeamRosterTool · KnowledgeBaseTool · CalendarTool       │
│  PostgreSQL · Redis · ChromaDB · Google Calendar · Slack │
└─────────────────────────────────────────────────────────┘
```

> See `empathic_engine_architecture.pdf` for the full visual system architecture diagram.

---

## Screens & UI

The project includes 4 HTML screens that form the user-facing layer:

| File | Screen | Description |
|------|--------|-------------|
| `screen1_login.html` | Login / Sign Up | Auth screen with role selection (Admin / Team Member) |
| `screen2_admin_dashboard.html` | Admin Dashboard | Org-wide health view, all agents status, team stress overview |
| `screen3_user_dashboard.html` | My Dashboard | Personal task board, wellness score, Micro-Sync alerts, team status |
| `screen4_chatbot.html` | Ask the Engine | Chat interface to query any agent conversationally |

### Design System

- **Fonts:** Syne (headings, bold UI) + DM Sans (body, UI text)
- **Palette:** Dark-first — `#0A0A0F` bg, `#7C5CFC` accent purple, `#22D3A0` success teal, `#FF5B5B` danger
- **Cognitive load colours:** 🟡 `#FFAB00` high load · 🟢 `#22D3A0` low load · 🟣 `#C084FC` medium load

---

## Tech Stack

### Backend & Agents
| Layer | Technology |
|-------|-----------|
| Agent Orchestration | [CrewAI](https://crewai.com) >= 0.80 |
| LLM Provider | [Groq API](https://groq.com) (free tier, ~500 tokens/s) |
| LLM Models | `llama-3.1-70b-versatile` · `llama-3.1-8b-instant` |
| LLM Integration | `crewai.LLM` class |
| API Framework | FastAPI |
| Auth | JWT + RBAC |
| Primary Database | PostgreSQL |
| Cache / State | Redis |
| Vector Store (RAG) | ChromaDB (MVP) → Pinecone (production) |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React (production) / Plain HTML (MVP screens) |
| Styling | CSS custom properties, responsive |
| Real-time | WebSocket (status updates, Micro-Sync alerts) |

### Infrastructure
| Layer | Technology |
|-------|-----------|
| Containerisation | Docker Compose (dev) → Kubernetes (prod) |
| CI/CD | GitHub Actions |
| Monitoring | Sentry + AgentOps |
| Config | `.env` + Secret Manager |

---

## Project Structure

```
empathic-engine/
├── main.py                     # CrewAI crew definition & entry point
├── requirements.txt            # Python dependencies
├── .env.template               # Environment variable template
├── README.md                   # This file
├── empathic_engine_architecture.pdf  # System architecture diagram
│
├── agents/                     # (future) Agent modules
│   ├── decomposer.py
│   ├── matchmaker.py
│   ├── scout.py
│   ├── bridge.py
│   └── founders_lens.py
│
├── tools/                      # (future) Custom CrewAI tools
│   ├── knowledge_base.py       # RAG search tool
│   ├── roster.py               # Team roster tool
│   └── calendar.py             # Micro-Sync scheduling tool
│
├── api/                        # (future) FastAPI backend
│   ├── main.py
│   ├── routers/
│   └── models/
│
└── frontend/                   # UI screens
    ├── screen1_login.html
    ├── screen2_admin_dashboard.html
    ├── screen3_user_dashboard.html
    └── screen4_chatbot.html
```

---

## Getting Started

### Prerequisites

- Python 3.10 or higher
- A free [Groq API key](https://console.groq.com/keys) (no credit card required)
- `pip` or a virtual environment manager

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/empathic-engine.git
cd empathic-engine

# 2. Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # macOS / Linux
venv\Scripts\activate         # Windows

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Set up your environment variables
cp .env.template .env
# Open .env and paste your GROQ_API_KEY
```

---

## Environment Variables

Copy `.env.template` to `.env` and fill in your values:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional — only needed if enabling CrewAI memory (memory=True)
# OPENAI_API_KEY=sk-dummy

# Optional — agent run tracing
# AGENTOPS_API_KEY=your_agentops_key
```

> **Get your free Groq key:** [console.groq.com/keys](https://console.groq.com/keys)
> Groq's free tier supports ~14,400 requests/day on Llama 3.1 models with no credit card required.

---

## Running the Agents

### Quick start — sample project

```bash
python main.py
```

This kicks off the full 5-agent pipeline against a sample project goal:

```
"Build a new RESTful API module for Dello that handles user authentication
(JWT-based), role-based access control (RBAC), and rate limiting..."
```

### Custom project goal

Edit the `PROJECT_GOAL` variable at the bottom of `main.py`:

```python
PROJECT_GOAL = "Your project description here..."
crew = build_crew(PROJECT_GOAL)
result = crew.kickoff()
```

### Expected output

The terminal will stream each agent's verbose reasoning. The final output is the Founder's Lens executive summary, structured as:

```
A) PROJECT HEALTH:  🟢 / 🟡 / 🔴
B) TEAM HEALTH:     Burnout risk flags 🚨
C) KEY BLOCKERS:    Top 2 blockers
D) STRATEGIC INSIGHT: One candid observation
E) RECOMMENDED ACTIONS: 3 bullets, actionable today
```

---

## API Reference

> Backend API is in the roadmap. The current MVP runs the agent crew as a standalone Python script.

Planned endpoints (FastAPI):

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects` | Submit a new project goal, kick off crew |
| `GET` | `/api/projects/{id}` | Get project status + agent outputs |
| `GET` | `/api/team` | Get current team roster & stress levels |
| `POST` | `/api/tasks/{id}/assign` | Manually trigger Matchmaker for a task |
| `GET` | `/api/syncs` | List all scheduled Micro-Syncs |
| `POST` | `/api/chat` | Chat with the Engine (Chatbot UI backend) |
| `GET` | `/api/founder/summary` | Get latest Founder's Lens summary |
| `WebSocket` | `/ws/dashboard` | Real-time dashboard updates |

---

## How Agent Handshakes Work

The pipeline uses CrewAI's `Process.sequential` mode with explicit `context=[]` wiring on each `Task`. When a task completes, its full output is injected into the prompt of every downstream task that lists it in `context[]`.

```
PROJECT_GOAL (string)
       │
       ▼
[1. Decomposer]  ──────────────────────────────────────────────────────────────────►
       │ task_decompose output                                                      │
       ▼                                                                            │
[2. Matchmaker]  context=[task_decompose] ─────────────────────────────────────►   │
       │ task_match output                                                      │   │
       ▼                                                                        │   │
[3. Scout]       context=[task_decompose, task_match] ─────────────────────►   │   │
       │ task_scout output                                                  │   │   │
       ▼                                                                    │   │   │
[4. Bridge]      context=[task_decompose, task_match, task_scout] ──────►  │   │   │
       │ task_bridge output                                              │  │   │   │
       ▼                                                                 │  │   │   │
[5. Founder's Lens]  context=[ALL 4 prior tasks] ◄───────────────────────────────┘
       │
       ▼
  Executive Summary
```

By the time Agent 5 runs, it has the full outputs of all four preceding agents in its context window — no explicit data serialisation needed.

---

## Production Upgrade Path

The MVP uses in-memory Python dicts for the team roster and knowledge base. Swap these three components for production:

| MVP (current) | Production replacement |
|---------------|----------------------|
| `TEAM_KNOWLEDGE_BASE` Python dict | ChromaDB / Pinecone with real embeddings |
| `TEAM_ROSTER` Python dict | HR or project management API (Linear, Jira, Notion) |
| `CalendarTool` (simulated) | Google Calendar API or Calendly API |
| `memory=False` in Crew | `memory=True` + embedding model for long-term agent memory |

Enable CrewAI memory by setting `memory=True` in `build_crew()` and providing an embedding provider:

```python
crew = Crew(
    agents=[...],
    tasks=[...],
    process=Process.sequential,
    memory=True,                        # Enable persistent memory
    embedder={
        "provider": "groq",             # or openai, huggingface
        "config": { "model": "..." }
    }
)
```

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

```bash
# Fork → clone → create branch
git checkout -b feature/your-feature-name

# Make changes, then
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a pull request
```

### Code style

- Python: follow PEP 8, use type hints where practical
- Agent backstories must maintain an empathetic, supportive tone — this is a core design constraint, not optional
- The Matchmaker's stress ceiling (`> 7/10`) must never be removed or softened

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with care by the Empathic Engine team · Powered by [CrewAI](https://crewai.com) + [Groq](https://groq.com)

*"Sustainable velocity over heroic sprints."*

</div>
