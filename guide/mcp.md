# MCP Server

Complete reference for Synap's Model Context Protocol server — the bridge between your AI tools and your knowledge graph.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard that lets AI assistants call external tools. Synap implements an MCP server (`arx-mcp`) that exposes your entire knowledge graph as a set of tools any MCP-compatible AI can use.

When you ask Claude "What did I decide about the auth architecture?", it calls `arx_search` behind the scenes. When you say "Remember this pattern", it calls `arx_add_thought`. The AI chooses the right tool automatically — you just talk naturally.

Synap's MCP server is a compiled Rust binary that connects directly to SurrealDB. No Node.js runtime, no HTTP round-trips between the binary and the database — just native performance.

## Installation

```bash
curl -fsSL https://get.synap.ing | sh
```

This installs the `synap` CLI and the `synap-mcp` binary to `~/.local/bin/`. Then configure your AI tools:

```bash
synap setup
```

The setup command detects which AI tools you have installed and configures each one automatically.

## Setup by AI tool

### Claude Code

The installer adds environment variables to `~/.claude/settings.json`:

```json
{
  "env": {
    "ARX_URL": "https://api.synap.ing",
    "ARX_API_KEY": "sk_your_api_key_here"
  }
}
```

Restart Claude Code to activate. Verify with:

```
Ask Claude: "Search my ARX for recent decisions"
```

### Claude Desktop

The installer adds the MCP server to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "arx": {
      "command": "~/.local/bin/synap-mcp",
      "env": {
        "ARX_CONFIG": "~/.arx/config.json"
      }
    }
  }
}
```

Restart Claude Desktop. The ARX tools appear under the hammer icon.

### Cursor

The installer writes to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "arx": {
      "command": "~/.local/bin/synap-mcp",
      "env": {
        "ARX_CONFIG": "~/.arx/config.json"
      }
    }
  }
}
```

Restart Cursor to activate.

### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json` or your VS Code settings:

```json
{
  "servers": {
    "arx": {
      "command": "~/.local/bin/synap-mcp",
      "env": {
        "ARX_CONFIG": "~/.arx/config.json"
      }
    }
  }
}
```

Use Copilot Chat in agent mode to access ARX tools.

### Windsurf

Add to `~/.windsurf/mcp.json`:

```json
{
  "mcpServers": {
    "arx": {
      "command": "~/.local/bin/synap-mcp",
      "env": {
        "ARX_CONFIG": "~/.arx/config.json"
      }
    }
  }
}
```

Restart Windsurf to activate.

## Tools reference

The MCP server exposes 38 tools organized into seven categories.

### Core graph operations

#### `arx_add_thought`

Capture a new thought to the knowledge graph. Automatically infers node type from content prefixes and generates a vector embedding for semantic search.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | The thought content. Prefix with `[DECISION]`, `[TASK]`, `[PATTERN]`, etc. to set node type. |
| `project` | string | No | Project to associate the thought with |

```
"Save this: [DECISION] Using JWT for session auth because it works across devices (2025-03-18)"
```

Returns the new thought's short ID and inferred type.

#### `arx_get_thought`

Get a single thought by ID with full content and metadata.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Full UUID or short prefix of the thought |

#### `arx_list_thoughts`

List recent thoughts, ordered by creation time (newest first).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum results (default: 10) |
| `project` | string | No | Filter to thoughts from this project |

#### `arx_update_thought`

Update an existing thought's content or status.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Full UUID or short prefix |
| `content` | string | No | New content |
| `status` | string | No | `active`, `archived`, or `superseded` |

#### `arx_delete_thought`

Permanently delete a thought and all its edges. Prefer archiving (setting status to `archived`) over deletion.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Full UUID or short prefix |

### Search

Four search modes, from simple keyword matching to deep reasoning assembly.

#### `arx_search`

Keyword search using BM25 ranking. Best for exact terms and known phrases.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `limit` | integer | No | Maximum results (default: 10) |

```
"Search my ARX for rate limiting"
```

#### `arx_similar`

Semantic search using AI embeddings (384-dim all-MiniLM-L6-v2). Finds thoughts by meaning, not exact words.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Concept to find similar thoughts for |
| `limit` | integer | No | Maximum results (default: 5) |
| `threshold` | number | No | Minimum similarity 0.0-1.0 (default: 0.4) |

```
"Find thoughts similar to 'authentication architecture'"
```

#### `arx_similar_to`

Find thoughts semantically similar to an existing node (by ID rather than text query).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | ID of the source thought |
| `limit` | integer | No | Maximum results (default: 5) |
| `threshold` | number | No | Minimum similarity 0.0-1.0 (default: 0.4) |

#### `arx_hybrid_search`

Combined keyword + semantic search with Reciprocal Rank Fusion. The most powerful search mode — use this when you want the best results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query (matched against both keywords and vectors) |
| `limit` | integer | No | Maximum results (default: 10) |
| `threshold` | number | No | Minimum relevance 0.0-1.0 (default: 0.3) |

#### `dialect_search`

Dialect-aware search using no-stem BM25. Preserves exact domain terms — `consideration` will not match `consider`. Use this when exact terminology matters.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `limit` | integer | No | Maximum results (default: 10) |

### Graph operations

#### `arx_link`

Create a typed connection between two thoughts.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from_id` | string | Yes | ID of the source thought (full or short prefix) |
| `to_id` | string | Yes | ID of the target thought (full or short prefix) |
| `edge_type` | string | No | Connection type (default: `relates_to`) |

**Edge types:**

| Type | Meaning |
|------|---------|
| `relates_to` | General connection |
| `leads_to` | Causal relationship |
| `blocks` | Dependency |
| `implements` | Realization of a concept |
| `supersedes` | Replaces an older thought |
| `references` | Citation |

```
"Link thought abc123 to thought def456 with type implements"
```

#### `arx_edges`

List all edges (connections) for a specific thought.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `node_id` | string | Yes | ID of the thought |

#### `arx_traverse`

Walk the graph from a starting node, following connections outward.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `node_id` | string | Yes | ID of the starting thought |
| `depth` | integer | No | How many hops to traverse (default: 2) |

```
"Traverse the graph from thought abc123 with depth 3"
```

#### `arx_path`

Find the shortest path between two thoughts in the knowledge graph.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | string | Yes | ID of the starting thought |
| `to` | string | Yes | ID of the target thought |
| `max_depth` | integer | No | Maximum search depth (default: 5, max: 10) |

#### `arx_orphans`

Find thoughts with no connections — candidates for linking or cleanup.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum orphans to return (default: 20) |

### Analysis and reasoning

#### `arx_reason`

Assemble structured reasoning context from the knowledge graph. Combines semantic search with graph traversal to build a **premise > evidence > relationships > gaps** package. Returns LLM-ready formatted context.

Use this instead of raw search when you need deep, connected context for analysis.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Natural language question or topic to reason about |
| `depth` | integer | No | Graph traversal depth from seed nodes (default: 2, max: 4) |
| `limit` | integer | No | Number of seed nodes from semantic search (default: 10) |
| `start_node` | string | No | Anchor traversal from a specific node ID |
| `max_tokens` | integer | No | Token budget for context (default: 4096) |

```
"Reason about our authentication architecture decisions and their trade-offs"
```

#### `arx_scored`

Get thoughts ranked by memory relevance — a combination of connection strength and Ebbinghaus recency decay. Surfaces the thoughts that matter most right now.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum results (default: 20) |

#### `arx_stats`

Get summary statistics about the knowledge graph (total nodes, edges, types).

*No parameters.*

#### `arx_graph_summary`

Get a rich summary of the graph topology: node counts by type, recent activity, and orphan count.

*No parameters.*

#### `arx_book`

Get portfolio-level insights — hub nodes that connect many thoughts across projects. Detects `[BOOK]` tagged thoughts and auto-detected hubs.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `min_connections` | integer | No | Minimum connections to qualify (default: 3) |
| `limit` | integer | No | Maximum insights (default: 20) |

### Graph maintenance

#### `arx_dedup`

Find duplicate thoughts by semantic similarity. Runs as a dry-run by default.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `threshold` | number | No | Similarity threshold for duplicates (default: 0.90) |
| `limit` | integer | No | Maximum duplicate pairs to process (default: 50) |

```
"Check for duplicate thoughts in my graph"
```

#### `arx_link_orphans`

Find orphan nodes and auto-link them to semantically similar nodes.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `threshold` | number | No | Similarity threshold for linking (default: 0.5) |
| `links_per_node` | integer | No | Maximum links per orphan (default: 3) |
| `limit` | integer | No | Maximum orphans to process (default: 100) |

#### `arx_export`

Export thoughts and edges as a MAAP bundle (portable format).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | No | Filter by project name |
| `limit` | integer | No | Maximum thoughts to export (default: 100) |
| `include_edges` | boolean | No | Include edge connections (default: true) |

### Provenance and audit

#### `arx_verify`

Verify the provenance of a thought — prove it existed before a given date via the CHANGEFEED audit trail.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | ID of the thought to verify |
| `as_of` | string | No | ISO 8601 timestamp to verify against |

```
"Verify that thought abc123 existed before 2025-01-01"
```

#### `arx_changes`

Show recent thought mutations from the CHANGEFEED audit trail.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `since` | string | Yes | ISO 8601 timestamp or `0` for all |
| `limit` | integer | No | Maximum changes (default: 50) |

### Identity and context

#### `arx_identity_invitation`

Load your identity context from ARX at the start of a session. Shows recent thoughts, decisions, and session history so the AI starts with awareness of your current work.

*No parameters.*

This is typically called automatically by the session-start hook, but you can invoke it manually:

```
"Load my ARX identity context"
```

### Midbrain sessions

Session tracking tools for cross-device continuity. The Midbrain layer tracks which AI sessions are running, where, and what they covered.

#### `midbrain_create_session`

Create a new session record. Called at the start of a Claude Code session to track it across devices.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | Yes | The Claude Code session ID (usually a UUID) |
| `device_type` | string | No | Device type (e.g., `linux`, `macos`) |

#### `midbrain_list_sessions`

List recent sessions.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Maximum sessions to return (default: 10) |

#### `midbrain_get_session`

Get full details of a specific session.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | Yes | The Claude Code session ID |

#### `midbrain_update_session`

Update a session's metadata — summary, slug (short name), and topics covered.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | Yes | The Claude Code session ID |
| `summary` | string | No | Brief summary of what happened |
| `slug` | string | No | Short name for the session |
| `topics` | string[] | No | Topics covered in the session |

#### `midbrain_end_session`

Mark a session as ended.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | Yes | The Claude Code session ID |

### Dialect engine

The dialect engine learns your personal language patterns — abbreviations, domain terms, typos — and builds a personal language model over time.

#### `dialect_observe`

Feed user input to the dialect engine for pattern learning. Extracts terms, phrases, and typos to build a personal language model.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | User input text to analyze and learn from |
| `session_id` | string | No | Session ID to track pattern sources |

#### `dialect_vocabulary`

Get statistics about learned dialect patterns — total patterns, unique terms, clusters, and top frequent terms.

*No parameters.*

#### `dialect_decode`

Decode text using learned patterns. Corrects typos and applies explicit mappings.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to decode through dialect patterns |

#### `dialect_map`

Create an explicit mapping from a user term to its canonical meaning.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_term` | string | Yes | What the user says (e.g., `NS`) |
| `canonical` | string | Yes | What it means (e.g., `Neural Substrate`) |
| `examples` | string[] | No | Example usages of this term |

```
"Map the abbreviation 'CMP' to 'Companion Mesh Protocol'"
```

### Sync tools

For multi-device synchronization and delta updates.

#### `sync_checkpoint`

Get the current sync checkpoint — server timestamp, thought/edge counts, version.

*No parameters.*

#### `sync_changes`

Get thoughts that changed since a timestamp. Returns delta updates for sync.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `since` | string | Yes | ISO 8601 timestamp |
| `limit` | integer | No | Maximum changes per page (default: 100) |

### Web tools

Built-in web access for verification and research without leaving the MCP context.

#### `web_search`

Search the web using Brave Search API. Requires the `BRAVE_API_KEY` environment variable.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `count` | integer | No | Number of results (default: 5, max: 20) |

#### `web_fetch`

Fetch and extract readable text from a URL.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL to fetch |
| `max_length` | integer | No | Maximum characters to return (default: 5000) |

## Node type prefixes

When adding thoughts, prefix the content to classify them:

| Prefix | Node type | Use for |
|--------|-----------|---------|
| `[DECISION]` | decision | Architectural choices and rationale |
| `[PATTERN]` | pattern | Reusable learnings confirmed across contexts |
| `[INSIGHT]` | thought | Key realizations |
| `[SESSION]` | context | Work summaries at natural breakpoints |
| `[MILESTONE]` | thought | Significant completions |
| `[TASK]` | task | Action items and TODOs |
| `[QUESTION]` | question | Open questions to revisit |
| `[RESEARCH]` | thought | Prior art findings and references |
| `[EVIDENCE]` | context | Supporting data |
| `[BOOK]` | thought | Portfolio-level hub nodes |

Always include a date in the content: `[TAG] Title (YYYY-MM-DD): Details...`

## Best practices

**Search strategy.** Start with `arx_hybrid_search` for the best results. Use `arx_search` when you know the exact keywords, `arx_similar` when you remember the concept but not the words, and `dialect_search` when exact domain terminology matters.

**Use `arx_reason` for deep context.** When you need more than a list of search results — when you need connected context with evidence and gaps identified — use `arx_reason` instead of raw search. It assembles a structured reasoning package from semantic search plus graph traversal.

**Link after adding.** After capturing a thought, find and link related nodes. This builds the graph structure that makes traversal, path-finding, and scoring work well.

**Let the AI choose tools.** You do not need to name specific tools. Say "What do I know about caching?" and the AI will pick `arx_hybrid_search` or `arx_reason` as appropriate.

**Maintain the graph.** Run `arx_orphans` periodically to find unconnected thoughts. Use `arx_link_orphans` to auto-connect them, or `arx_dedup` to find and resolve duplicates.

**Use `arx_verify` for provenance.** When you need to prove a thought existed before a certain date — for prior art, IP documentation, or audit trails — `arx_verify` checks the CHANGEFEED audit trail.

## Troubleshooting

### "No tools found" in Claude Desktop

Restart Claude Desktop after setup. Check that the MCP server config exists in `~/Library/Application Support/Claude/claude_desktop_config.json` and that the `synap-mcp` binary exists at `~/.local/bin/synap-mcp`.

### "Connection refused" errors

Verify the ARX server is reachable:

```bash
synap status
```

If using the hosted service, check that `api.synap.ing` is accessible from your network.

### Tools not appearing in Cursor

Restart Cursor completely (quit and relaunch). Verify `~/.cursor/mcp.json` contains the `arx` server entry.

### Embedding model not loading

The MCP server logs to stderr. Check for messages like `[arx-mcp-v3] Embedding model not available`. The embedding model is cached in `/tmp/arx-embed-cache` by default. Delete that directory and restart to re-download.

### Environment variable issues

The MCP server reads from `~/.arx/config.json` by default. Override with environment variables:

```bash
ARX_URL=https://api.synap.ing ARX_API_KEY=sk_xxx synap-mcp
```

Run `synap setup` to reconfigure all AI tools with current credentials.

### Checking the MCP server version

```bash
synap-mcp --version
```

Update by re-running the installer:

```bash
curl -fsSL https://get.synap.ing | sh
```
