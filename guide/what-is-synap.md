# What is Synap?

Synap is a **personal knowledge graph** that gives your AI tools persistent memory.

Every time you use Claude, Cursor, or any AI assistant, you start from scratch. Context from yesterday's session is gone. That brilliant insight from last week? You have to re-explain it.

Synap fixes this. Your thoughts, decisions, patterns, and insights are stored as connected nodes in a graph. When you start a new AI session, Synap surfaces relevant context automatically — your AI already knows what you know.

## How it works

```
You ←→ AI Tool ←→ Synap (MCP) ←→ Your Knowledge Graph
```

1. **Capture** — Save thoughts during AI conversations, or from voice on your phone
2. **Connect** — Synap auto-links related ideas using semantic similarity
3. **Surface** — In your next AI session, relevant context appears automatically
4. **Grow** — Your graph gets smarter over time as connections compound

## The stack

| Layer | What | Example |
|-------|------|---------|
| **AI Tools** | Where you work | Claude Code, Claude Desktop, Cursor |
| **MCP Server** | The bridge | `arx-mcp-server` — 11 tools for your AI |
| **ARX Engine** | Knowledge graph | Semantic search, auto-linking, graph traversal |
| **Storage** | Your data | Cloud (api.synap.ing) or self-hosted |

## Who it's for

- **Developers** who use AI coding tools daily and lose context between sessions
- **Researchers** tracking ideas, papers, and connections across projects
- **Knowledge workers** who think in graphs, not folders
- **Anyone** who's tired of repeating themselves to AI

## Pricing

| Tier | Price | Limits |
|------|-------|--------|
| Personal | Free | 500 thoughts, 50 searches/day |
| Pro | $9/mo | Unlimited everything |
| Enterprise | Custom | SSO, SLA, dedicated instance |

All features available on every tier. Limits are on volume, not capabilities.
