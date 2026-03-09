# Claude Code

Synap integrates deeply with Claude Code through MCP tools, slash commands, and session hooks.

## Setup

```bash
npx arx-setup
```

This adds `ARX_URL` and `ARX_API_KEY` to your `~/.claude/settings.json`. Restart Claude Code to activate.

## Using MCP tools

After setup, Claude can use your knowledge graph naturally. Just ask:

```
"What did I decide about the auth architecture?"
"Search my notes for anything about rate limiting"
"Remember this: we chose JWT over API keys for session auth"
```

Claude will automatically use the appropriate ARX tool (`arx_search`, `arx_similar`, `arx_add`, etc.).

## Plugin (optional)

For slash commands and session hooks, install the Claude Code plugin:

```
/plugin add arclabscc/arx-claude-plugin
```

This adds:

| Command | Description |
|---------|-------------|
| `/arx <query>` | Search your knowledge graph |
| `/capture <text>` | Save a thought with auto-tagging |
| `/recall <query>` | Semantic recall — find by meaning |
| `/setup` | Reconfigure ARX connection |

### Session hooks

The plugin includes a session-start hook that loads your recent thoughts into context automatically. Your AI starts every session already aware of your recent work.

### ARX Analyst agent

The plugin bundles an `arx-analyst` agent for deep graph exploration. It activates automatically when you ask about past decisions, patterns, or historical context.

## Capturing thoughts

During a Claude Code session, ask Claude to capture insights:

```
"Capture this as a decision: We're using SurrealDB for the graph store because..."
"Save this pattern: When implementing MCP tools, always validate input schemas..."
```

Claude uses the `arx_add` tool with appropriate `[TAG]` prefixes:
- `[DECISION]` — Architectural choices
- `[PATTERN]` — Reusable learnings
- `[INSIGHT]` — Key realizations
- `[TASK]` — Action items
- `[SESSION]` — Work summaries

## Tips

- **Be specific in searches** — "auth architecture decisions from last week" works better than "auth"
- **Link related thoughts** — After adding, ask Claude to find and link related nodes
- **Use semantic search** — When you remember the gist but not the words, `arx_similar` finds it
