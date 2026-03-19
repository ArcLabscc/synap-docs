# CLI Reference

The `synap` command-line tool is the primary interface for managing your knowledge graph. It handles authentication, thought capture, search, graph operations, and MCP server configuration.

## Installation

```bash
curl -fsSL https://get.synap.ing | sh
```

This installs the `synap` binary to `~/.local/bin/` and runs initial setup. Make sure `~/.local/bin` is on your `PATH`.

After installation, authenticate:

```bash
synap login
```

## Authentication

### Login

```bash
synap login
```

Prompts for your email and password, then stores a JWT session token locally. You can pass your email directly:

```bash
synap login robb@example.com
```

To authenticate against a different server:

```bash
synap login --url https://your-server.example.com
```

### Register

Create a new account:

```bash
synap register
```

You'll be prompted for a display name, email, username, and password. On success, your API key is displayed once — save it.

```bash
synap register "Robb Shecter"
```

### Logout

```bash
synap logout
```

Clears stored credentials for the active profile.

### Identity

```bash
synap whoami
```

Shows your email, tenant slug, role, and enabled features.

```
  User: robb@example.com
  Tenant: robb
  Role: owner
  Admin: yes
```

### Profiles

Synap supports multiple server profiles (e.g., production, local development, staging).

List all profiles:

```bash
synap profile
```

```
Active: fly

  → fly: Production (https://api.synap.ing)
    v3: Local Dev (http://localhost:9191)
```

Switch profiles:

```bash
synap profile v3
```

```
✓ Switched to v3 — Local Dev
  URL: http://localhost:9191
```

Profile configuration is stored in `~/.arx/profiles.json`.

## Thoughts

Thoughts are the nodes in your knowledge graph. Each thought has an ID, content, type, and timestamps.

### List recent thoughts

```bash
synap list
```

Lists the 15 most recent thoughts by default. Specify a number to change the limit:

```bash
synap list 50
```

Filter by project:

```bash
synap list --project synap-cli
```

Output format:

```
  a1b2c3d4  [decision]  2026-03-18 14:30  [DECISION] Use JWT for session auth (2026-03-18): Because...
  e5f6g7h8  [thought]   2026-03-17 09:15  [INSIGHT] Semantic search outperforms BM25 for recall...

  42 thoughts
```

### Add a thought

```bash
synap add "[DECISION] Use Postgres for the graph store (2026-03-18): Better indexing support"
```

```
✓ f47ac10b-58cc-4372-a567-0e02b2c3d479
  [decision] [DECISION] Use Postgres for the graph store (2026-03-18): Better indexing...
```

The node type is inferred automatically from the `[TAG]` prefix:

| Prefix | Node Type |
|--------|-----------|
| `[SESSION]` | context |
| `[DECISION]` | decision |
| `[PATTERN]` | pattern |
| `[TASK]` | task |
| `[QUESTION]` | question |
| `[INSIGHT]` | thought |
| `[MILESTONE]` | thought |
| `[RESEARCH]` | thought |
| `[EVIDENCE]` | context |
| `[STRATEGY]` | thought |
| `[META]` | thought |
| `[CONCEPT]` | thought |
| _(no tag)_ | thought |

### Get a thought

Retrieve full details by ID (full UUID or prefix):

```bash
synap get f47ac10b-58cc-4372-a567-0e02b2c3d479
```

```
  ID: f47ac10b-58cc-4372-a567-0e02b2c3d479
  Type: decision
  Created: 2026-03-18 14:30
  Project: synap-cli
  Tags: architecture, database

[DECISION] Use Postgres for the graph store (2026-03-18): Better indexing support
for semantic search and full-text queries. SurrealDB lacked mature tooling.
```

### Update a thought

```bash
synap update f47ac10b "Updated content goes here"
```

```
✓ Updated f47ac10b-58cc-4372-a567-0e02b2c3d479
```

### Delete a thought

```bash
synap delete f47ac10b
```

```
✓ Deleted f47ac10b
```

Deleting a thought also removes all edges connected to it.

## Search

### Keyword search (BM25)

```bash
synap search "rate limiting"
```

```
  a1b2c3d4  [DECISION] Rate limiting strategy (2026-03-15): Token bucket at 60 RPM...
  e5f6g7h8  [PATTERN] API rate limiting (2026-03-10): Always return Retry-After header...

  2 results
```

BM25 search matches on exact terms. Good for finding specific keywords or phrases.

### Semantic search (hybrid)

```bash
synap similar "how should we handle API throttling"
```

```
  a1b2c3d4 (0.892)  [DECISION] Rate limiting strategy (2026-03-15): Token bucket...
  b2c3d4e5 (0.756)  [PATTERN] Backpressure in distributed systems (2026-03-12)...
  c3d4e5f6 (0.701)  [INSIGHT] Queue depth as a health signal (2026-03-08)...

  3 results
```

Semantic search finds thoughts by meaning, not just keywords. The score (0.0 to 1.0) indicates similarity. This uses embedding vectors combined with BM25 for hybrid ranking.

## Graph

### Create an edge

Connect two thoughts with a typed relationship:

```bash
synap link a1b2c3d4 e5f6g7h8 implements
```

```
✓ 9f8e7d6c  a1b2c3d4 —[implements]→ e5f6g7h8
```

Available edge types:

| Type | Meaning |
|------|---------|
| `relates_to` | General connection (default) |
| `leads_to` | Causal relationship |
| `blocks` | Dependency |
| `implements` | Realization of a concept |
| `supersedes` | Replaces an older thought |
| `references` | Citation or reference |

If no edge type is specified, `relates_to` is used.

### List edges

```bash
synap edges a1b2c3d4
```

```
  9f8e7d6c  a1b2c3d4 —[implements]→ e5f6g7h8
  1a2b3c4d  a1b2c3d4 —[relates_to]→ f6g7h8i9

  2 edges
```

### Traverse the graph

Walk the graph from a starting node, following edges up to a given depth:

```bash
synap traverse a1b2c3d4
```

Default depth is 3 hops. Specify a different depth:

```bash
synap traverse a1b2c3d4 5
```

```
  a1b2c3d4  [d0]  [DECISION] Rate limiting strategy...
  e5f6g7h8  [d1]  [PATTERN] API throttling patterns...
  b2c3d4e5  [d2]  [INSIGHT] Backpressure signals...

  3 nodes
```

The `[dN]` indicator shows the hop distance from the starting node.

### Find shortest path

Find the shortest path between two nodes in the graph:

```bash
synap path a1b2c3d4 c3d4e5f6
```

```
  → a1b2c3d4  [DECISION] Rate limiting strategy...
  → e5f6g7h8  [PATTERN] API throttling patterns...
  → c3d4e5f6  [INSIGHT] Queue depth as health signal...
```

If no path exists:

```
  No path found
```

### Reason

Assemble structured reasoning context from the graph for a given query. This performs semantic search, graph traversal, and organizes results into premise, evidence, and relationships:

```bash
synap reason "what is our auth strategy"
```

The output includes formatted context with premises, supporting evidence, relationship chains, and identified knowledge gaps.

### Find orphan nodes

List thoughts with no edges (unconnected to the graph):

```bash
synap orphans
```

Default limit is 20. Specify a different limit:

```bash
synap orphans 50
```

```
  d4e5f6g7  [thought]  [INSIGHT] Embeddings perform better with longer content...
  h8i9j0k1  [task]     [TASK] Set up monitoring dashboard...

  2 orphans
```

### Graph statistics

```bash
synap stats
```

```
  Thoughts: 347
  Edges: 892
```

### Scored thoughts

List thoughts ranked by relevance score (based on connectivity, recency, and other signals):

```bash
synap scored
```

Default limit is 20. Specify a different limit:

```bash
synap scored 10
```

```
  a1b2c3d4 (8.42)  [DECISION] Rate limiting strategy...
  e5f6g7h8 (7.19)  [PATTERN] API throttling patterns...
```

## Maintenance

### Find duplicates

Detect near-duplicate thoughts using semantic similarity:

```bash
synap dedup
```

Default similarity threshold is 0.90 (90%). Lower the threshold to find more candidates:

```bash
synap dedup 0.85
```

Returns pairs of similar thoughts as JSON for review.

### Auto-link orphans

Automatically find and connect orphan nodes to semantically similar thoughts:

```bash
synap link-orphans
```

Default similarity threshold is 0.50. Adjust it:

```bash
synap link-orphans 0.6
```

Returns a summary of created edges as JSON.

### Export

Export your knowledge graph as a MAAP bundle (JSON):

```bash
synap export
```

Default limit is 50 thoughts. Export more:

```bash
synap export 500
```

The bundle is printed to stdout. Redirect to a file:

```bash
synap export 500 > my-graph.json
```

## System

### Server status

Check the health of the connected server:

```bash
synap status
```

```
  Status: ok
  Version: 0.9.2
  Uptime: 4320m
  Auth: enabled
  Embeddings: enabled
  Postgres: connected
```

### Usage statistics

View your usage over a time period:

```bash
synap usage
```

Default period is 30 days. Specify a different window:

```bash
synap usage 7
```

```
  Period: 7 days
  Requests: 1,247
  Thoughts: 42
  Devices: 3
  Rate limit: 120 RPM
```

### API keys

List your API keys:

```bash
synap keys
```

Create a new API key:

```bash
synap keys create
```

```
✓ Created API key
  sk_live_abc123def456...
  (Save this — it won't be shown again)
```

Delete a key by ID:

```bash
synap keys delete key_abc123
```

### Sessions

List recent midbrain sessions (device connections):

```bash
synap sessions
```

Default limit is 10. Specify a different limit:

```bash
synap sessions 25
```

```
  a1b2c3d4e5f6  mac  claude-code
    Working on CLI documentation and graph traversal
  b2c3d4e5f6g7  ios  synap-ios (ended)
    Quick capture from mobile
```

### Setup

Configure MCP servers and hooks for all detected AI tools:

```bash
synap setup
```

This detects and configures:
- **Claude Code** — `~/.claude/settings.json`
- **Claude Desktop** — Application Support config
- **Cursor** — `~/.cursor/mcp.json`
- **VS Code** — `~/.vscode/mcp.json`
- **Windsurf** — `~/.windsurf/mcp.json`

It also installs:
- **CLAUDE.md instructions** — Teaches Claude how to use your knowledge graph
- **Session hooks** — Auto-loads recent context on session start, captures summaries on end

Preview changes without modifying files:

```bash
synap setup --dry-run
```

Skip specific steps:

```bash
synap setup --skip-auth
synap setup --skip-hooks
```

### MCP server

Start the MCP server directly (used by AI tools, not typically run manually):

```bash
synap mcp
```

This launches the MCP server on stdio, which AI tools connect to for knowledge graph access.

## Global Options

These flags work with any command:

| Flag | Description |
|------|-------------|
| `--project <name>` | Filter results by project name |
| `--url <url>` | Override the server URL for this command |
| `--help`, `-h` | Show the help screen |
| `--version`, `-v` | Print the version number |

## Environment Variables

The CLI and MCP server respect these environment variables:

| Variable | Description |
|----------|-------------|
| `ARX_AUTH_TOKEN` | JWT bearer token (overrides stored credentials) |
| `ARX_TOKEN` | Alias for `ARX_AUTH_TOKEN` |
| `ARX_API_KEY` | API key authentication (overrides stored credentials) |

## Common Workflows

### Daily capture

```bash
# Start of day — see what's in your graph
synap list 10
synap stats

# Capture a decision during work
synap add "[DECISION] Switch to connection pooling (2026-03-18): PgBouncer handles burst traffic better than direct connections"

# Link it to the related architecture thought
synap link <new-id> <architecture-id> implements

# End of day — find anything that needs connecting
synap orphans
synap link-orphans 0.5
```

### Research workflow

```bash
# Find everything related to a topic
synap search "authentication"
synap similar "secure token management"

# Capture research findings
synap add "[RESEARCH] OAuth 2.1 spec changes (2026-03-18): PKCE now required for all clients"

# Explore the graph around a key node
synap traverse <auth-decision-id> 4

# Find the path between two concepts
synap path <oauth-id> <session-id>
```

### Graph health

```bash
# Check overall stats
synap stats

# Find disconnected thoughts
synap orphans 50

# Auto-connect orphans above similarity threshold
synap link-orphans 0.55

# Find and review near-duplicates
synap dedup 0.88

# See your most connected/relevant thoughts
synap scored 20
```

### Assemble context for reasoning

```bash
# Pull structured context for a question
synap reason "what trade-offs did we make on the caching layer"

# This returns premises, evidence, relationships, and gaps —
# useful for understanding decision history before making new ones
```

### Multi-profile workflow

```bash
# Check which profile is active
synap profile

# Switch to local dev server
synap profile v3

# Verify connection
synap status

# Switch back to production
synap profile fly
```

### Export and backup

```bash
# Full export to file
synap export 1000 > backup-2026-03-18.json

# Quick export of recent thoughts
synap export 50 > recent.json
```
