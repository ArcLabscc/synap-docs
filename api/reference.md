# REST API Reference

Complete reference for the Synap ARX v3 API.

**Base URL:** `https://api.synap.ing/api/v3`

---

## Authentication

All protected endpoints require one of two authentication methods.

### API Key (recommended for scripts and integrations)

Pass your key in the `X-ARX-Key` header:

```
X-ARX-Key: arx_k_your_api_key_here
```

### JWT Bearer Token

Pass a JWT token obtained from the login endpoint:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Obtaining Credentials

**API Key** — Generated during registration or via `POST /keys`. Manage keys with `GET /keys` and `DELETE /keys/:id`.

**JWT Token** — Obtain via `POST /auth/login`. Refresh with `POST /auth/refresh`. Tokens expire after 24 hours.

---

## Rate Limits

Requests are rate-limited per tenant using a token bucket algorithm. Limits are enforced per minute.

| Tier | Requests per Minute | Burst |
|------|--------------------:|------:|
| Personal | 60 | 60 |
| SMB | 600 | 600 |
| Enterprise | 6,000 | 6,000 |

Every response includes rate limit headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 60
```

When rate limited, the server returns `429 Too Many Requests` with a `Retry-After: 60` header.

---

## Error Format

All errors follow a consistent JSON structure:

```json
{
  "error": "Human-readable error message"
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation error, missing required field) |
| 401 | Unauthorized (missing or invalid credentials) |
| 403 | Forbidden (insufficient tier or permissions) |
| 404 | Resource not found |
| 409 | Conflict (duplicate slug or email during registration) |
| 429 | Rate limited |
| 500 | Internal server error |
| 502 | Bad gateway (upstream API failure, e.g. during import) |

---

## Data Models

### Thought

The core knowledge node in ARX.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (UUID) | Unique identifier |
| `content` | `string` | The thought's text content |
| `node_type` | `string` | One of: `thought`, `decision`, `question`, `task`, `code_ref`, `pattern`, `context` |
| `status` | `string` | One of: `active`, `parked`, `completed`, `archived` |
| `project` | `string?` | Optional project grouping |
| `tags` | `string[]` | User-defined tags |
| `source` | `string?` | Origin identifier (e.g. `mcp`, `ios`, `cli`) |
| `created_at` | `string` (ISO 8601) | Creation timestamp |
| `updated_at` | `string` (ISO 8601) | Last modification timestamp |
| `metadata` | `object` | Arbitrary metadata |

### Edge

A typed, weighted connection between two thoughts.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (UUID) | Unique identifier |
| `from_node` | `string` (UUID) | Source thought ID |
| `to_node` | `string` (UUID) | Target thought ID |
| `edge_type` | `string` | One of: `relates_to`, `leads_to`, `blocks`, `implements`, `supersedes`, `references` |
| `weight` | `number` | Connection strength (0.0 - 1.0, default 1.0) |
| `created_at` | `string` (ISO 8601) | Creation timestamp |

### NodeType Enum

| Value | Description |
|-------|-------------|
| `thought` | General insight or note (default) |
| `decision` | Architectural or strategic choice |
| `question` | Open question to revisit |
| `task` | Action item or TODO |
| `code_ref` | Code reference |
| `pattern` | Reusable learning confirmed across interactions |
| `context` | Session context or background information |

### EdgeType Enum

| Value | Description |
|-------|-------------|
| `relates_to` | General connection (default) |
| `leads_to` | Causal or sequential relationship |
| `blocks` | Dependency — source blocks target |
| `implements` | Target implements the concept in source |
| `supersedes` | Source replaces an older thought |
| `references` | Citation or reference link |

### PrivilegeLevel Enum (Gateway)

| Value | Description |
|-------|-------------|
| `public` | No restrictions — can be sent to external APIs |
| `internal` | Anonymize before external transmission |
| `privileged` | Must stay on-premise, local model only |
| `classified` | Air-gapped processing only, no network |

---

## Thoughts

### List Thoughts

Retrieve a paginated list of thoughts, ordered by most recent first.

```
GET /thoughts
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 25 | Maximum results to return |
| `offset` | `integer` | 0 | Number of results to skip |
| `project` | `string` | — | Filter by project |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/thoughts?limit=10" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "thoughts": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "content": "[DECISION] Use SurrealDB for graph storage (2025-03-01): ...",
      "node_type": "decision",
      "status": "active",
      "project": null,
      "tags": ["architecture"],
      "source": "mcp",
      "created_at": "2025-03-01T10:30:00Z",
      "updated_at": "2025-03-01T10:30:00Z",
      "metadata": {}
    }
  ],
  "count": 1,
  "meta": {
    "limit": 10,
    "offset": 0,
    "has_more": false
  }
}
```

---

### Create Thought

Add a new thought to the knowledge graph. The server generates vector embeddings automatically.

```
POST /thoughts
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `content` | `string` | yes | — | The thought content |
| `node_type` | `string` | no | `"thought"` | Node type enum value |
| `project` | `string` | no | — | Project grouping |
| `tags` | `string[]` | no | `[]` | Tags for classification |
| `source` | `string` | no | — | Origin identifier |
| `created_at` | `string` | no | now | ISO 8601 timestamp override |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/thoughts" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "[INSIGHT] Privacy-by-architecture is the strategic wedge (2025-03-01): Giants cannot offer this because their business models depend on data aggregation.",
    "node_type": "thought",
    "tags": ["strategy", "privacy"]
  }'
```

**Response:** The created thought object (same shape as in list response).

---

### Get Thought

Retrieve a single thought by ID.

```
GET /thoughts/:id
```

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/thoughts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:** The thought object, or `404` if not found.

---

### Update Thought

Partially update an existing thought. Only provided fields are changed. If `content` is updated, the server regenerates the vector embedding.

```
PATCH /thoughts/:id
```

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string?` | Updated content |
| `status` | `string?` | New status (`active`, `parked`, `completed`, `archived`) |
| `project` | `string?` | New project grouping |

**Example:**

```bash
curl -s -X PATCH "https://api.synap.ing/api/v3/thoughts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Response:** The updated thought object, or `404` if not found.

---

### Delete Thought

Permanently delete a thought and its associated edges.

```
DELETE /thoughts/:id
```

**Example:**

```bash
curl -s -X DELETE "https://api.synap.ing/api/v3/thoughts/a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "ok": true
}
```

---

### Update Sharing

Set cross-tenant sharing permissions for a thought.

```
PUT /thoughts/:id/sharing
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `shared_with` | `string[]` | yes | Tenant slugs to share with |

**Example:**

```bash
curl -s -X PUT "https://api.synap.ing/api/v3/thoughts/a1b2c3d4/sharing" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"shared_with": ["team-alpha", "team-beta"]}'
```

**Response:** The updated thought object.

---

## Search

### Keyword Search

BM25 full-text search across thought content.

```
GET /search
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | `string` | (required) | Search query |
| `limit` | `integer` | 25 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/search?q=privacy+architecture&limit=5" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "results": [
    {
      "id": "a1b2c3d4-...",
      "content": "...",
      "node_type": "decision",
      "score": 4.82
    }
  ],
  "count": 1
}
```

---

### Hybrid Search

Combined BM25 keyword + HNSW vector similarity search with Reciprocal Rank Fusion (RRF). The server generates embeddings from the query text if not provided.

```
POST /search/hybrid
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | `string` | yes | — | Search query text |
| `embedding` | `number[]` | no | auto-generated | 384-dim embedding vector |
| `limit` | `integer` | no | 10 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/search/hybrid" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "privacy-first architecture for personal data", "limit": 5}'
```

**Response:**

```json
{
  "results": [...],
  "count": 5,
  "method": "hybrid_rrf"
}
```

The `method` field indicates the search strategy used: `hybrid_rrf` when embeddings are available, `keyword_fallback` otherwise.

---

### Dialect Search

No-stem BM25 search that preserves exact domain terminology. Use this when standard stemming would corrupt technical terms.

```
GET /search/dialect
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | `string` | (required) | Exact search query |
| `limit` | `integer` | 25 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/search/dialect?q=MAAP+protocol&limit=10" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "results": [...],
  "count": 3,
  "method": "dialect_nostem"
}
```

---

### Advanced Search

Unified search with filters, facets, and combined keyword + vector scoring.

```
POST /search/advanced
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | `string` | yes | — | Search query text |
| `embedding` | `number[]` | no | auto-generated | 384-dim embedding vector |
| `limit` | `integer` | no | 20 | Maximum results |
| `filters` | `object` | no | `{}` | Filter constraints (see below) |

**Filters Object:**

| Field | Type | Description |
|-------|------|-------------|
| `node_types` | `string[]?` | Filter to specific node types |
| `project` | `string?` | Filter by project |
| `status` | `string?` | Filter by status |
| `date_from` | `string?` | ISO 8601 lower bound |
| `date_to` | `string?` | ISO 8601 upper bound |
| `has_edges` | `boolean?` | Only connected/unconnected thoughts |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/search/advanced" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "caching strategy",
    "limit": 10,
    "filters": {
      "node_types": ["decision", "pattern"],
      "date_from": "2025-01-01T00:00:00Z"
    }
  }'
```

**Response:**

```json
{
  "data": {
    "results": [...],
    "facets": {...},
    "total": 10
  }
}
```

---

### Search Suggestions

Autocomplete and typeahead suggestions based on partial query input.

```
GET /search/suggest
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | `string` | (required) | Partial query text |
| `limit` | `integer` | 10 | Maximum suggestions |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/search/suggest?q=priv&limit=5" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "data": {
    "suggestions": ["privacy architecture", "privilege levels", "private keys"],
    "count": 3
  }
}
```

---

## Edges

### Create Edge

Create a typed connection between two thoughts.

```
POST /edges
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `from_id` | `string` | yes | — | Source thought UUID |
| `to_id` | `string` | yes | — | Target thought UUID |
| `edge_type` | `string` | no | `"relates_to"` | Edge type enum value |
| `weight` | `number` | no | 1.0 | Connection strength (0.0 - 1.0) |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/edges" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "to_id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
    "edge_type": "implements",
    "weight": 0.9
  }'
```

**Response:**

```json
{
  "edge": {
    "id": "...",
    "from_node": "a1b2c3d4-...",
    "to_node": "f9e8d7c6-...",
    "edge_type": "implements",
    "weight": 0.9,
    "created_at": "2025-03-01T10:45:00Z"
  }
}
```

---

### List All Edges

Retrieve all edges in the graph.

```
GET /edges
```

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/edges" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "edges": [...],
  "total": 42
}
```

---

### List Edges for Thought

Retrieve all edges connected to a specific thought.

```
GET /thoughts/:id/edges
```

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/thoughts/a1b2c3d4-e5f6-7890-abcd-ef1234567890/edges" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "edges": [...]
}
```

---

### Delete Edge

Delete a specific edge by ID.

```
DELETE /edges/:id
```

The ID can be a bare UUID or a prefixed form (`relates_to:uuid`). If a bare UUID is provided, the server searches across all edge tables.

**Example:**

```bash
curl -s -X DELETE "https://api.synap.ing/api/v3/edges/a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "ok": true
}
```

---

## Graph

### Full Graph

Retrieve all thoughts and edges in a single response. Useful for rendering graph visualizations.

```
GET /graph
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 500 | Maximum thoughts |
| `offset` | `integer` | 0 | Pagination offset |
| `project` | `string` | — | Filter by project |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph?limit=100" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "thoughts": [...],
  "edges": [...],
  "thought_count": 87,
  "edge_count": 142
}
```

---

### Traverse Graph

Walk the graph from a starting node, following edges up to a specified depth.

```
POST /graph/traverse
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `start_id` | `string` | yes | — | Starting thought UUID |
| `depth` | `integer` | no | 3 | Traversal depth (max hops) |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/traverse" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"start_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "depth": 2}'
```

**Response:**

```json
{
  "nodes": [
    {
      "id": "a1b2c3d4-...",
      "content": "...",
      "node_type": "decision"
    }
  ]
}
```

---

### Find Path

Find the shortest path between two thoughts in the graph.

```
POST /graph/path
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from_id` | `string` | yes | Source thought UUID |
| `to_id` | `string` | yes | Target thought UUID |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/path" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from_id": "a1b2c3d4-...", "to_id": "f9e8d7c6-..."}'
```

**Response:**

```json
{
  "found": true,
  "path": [
    {"id": "a1b2c3d4-...", "content": "..."},
    {"id": "e5f6a7b8-...", "content": "..."},
    {"id": "f9e8d7c6-...", "content": "..."}
  ]
}
```

---

### Graph Stats

Returns aggregate statistics about the knowledge graph.

```
GET /graph/stats
```

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/stats" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "node_count": 347,
  "edge_count": 892
}
```

---

### Scored Thoughts

Retrieve thoughts ranked by a composite score of connection strength and recency.

```
GET /graph/scored
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 20 | Maximum results |
| `project` | `string` | — | Filter by project |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/scored?limit=10" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "thoughts": [
    {
      "id": "...",
      "content": "...",
      "node_type": "decision",
      "connection_strength": 0.95,
      "score": 8.7
    }
  ],
  "count": 10
}
```

---

### Orphan Thoughts

Find thoughts with no edges (unconnected nodes).

```
GET /graph/orphans
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 25 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/orphans?limit=20" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "orphans": [...],
  "count": 12,
  "meta": {
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

---

### Deduplicate

Find near-duplicate thoughts based on semantic similarity.

```
POST /graph/dedup
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `threshold` | `number` | no | 0.90 | Similarity threshold (0.0 - 1.0) |
| `limit` | `integer` | no | 50 | Maximum pairs to return |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/dedup" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"threshold": 0.85, "limit": 20}'
```

**Response:** A list of duplicate pairs with similarity scores.

---

### Link Orphans

Automatically create edges for orphaned thoughts based on semantic similarity.

```
POST /graph/link-orphans
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `limit` | `integer` | no | 100 | Maximum orphans to process |
| `threshold` | `number` | no | 0.5 | Minimum similarity to create a link |
| `links_per_node` | `integer` | no | 3 | Maximum edges per orphan |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/link-orphans" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"limit": 50, "threshold": 0.6, "links_per_node": 2}'
```

**Response:** Summary of edges created.

---

### Changes (Audit Trail)

Retrieve the CHANGEFEED audit trail for a table.

```
GET /graph/changes
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `table` | `string` | `"thought"` | Table to query changes for |
| `limit` | `integer` | 100 | Maximum changes |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/changes?table=thought&limit=50" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "changes": [...],
  "count": 50
}
```

---

### Book Insights

Portfolio-level insights from the Book Knowledge Graph — thoughts with the highest connectivity.

```
GET /graph/book
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `min_connections` | `integer` | 3 | Minimum edge count to qualify |
| `limit` | `integer` | 20 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/book?min_connections=5&limit=10" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "insights": [...],
  "count": 10
}
```

---

### Centrality

Compute degree centrality scores for all thoughts. Identifies the most connected nodes.

```
GET /graph/centrality
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 20 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/centrality?limit=10" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "data": {
    "thoughts": [...],
    "count": 10,
    "algorithm": "degree_centrality"
  }
}
```

---

### Communities

Detect topic clusters in the graph based on connectivity patterns.

```
GET /graph/communities
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `min_size` | `integer` | 2 | Minimum cluster size |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/communities?min_size=3" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "data": {
    "communities": [
      {"nodes": ["a1b2...", "c3d4..."], "label": "privacy-architecture"},
      {"nodes": ["e5f6...", "g7h8...", "i9j0..."], "label": "deployment"}
    ],
    "count": 2
  }
}
```

---

### Temporal Graph

Query the graph state within a time range.

```
GET /graph/temporal
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `from` | `string` | — | ISO 8601 lower bound |
| `to` | `string` | — | ISO 8601 upper bound |
| `limit` | `integer` | 25 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/graph/temporal?from=2025-01-01T00:00:00Z&to=2025-03-01T00:00:00Z" \
  -H "X-ARX-Key: $ARX_KEY"
```

---

## Reasoning

### Reason

Build an LLM-ready reasoning context from the knowledge graph. Performs semantic search to find premise nodes, graph traversal to gather evidence, and token budgeting to fit within limits.

```
POST /reason
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | `string` | yes | — | The reasoning query |
| `embedding` | `number[]` | no | auto-generated | Optional pre-computed embedding |
| `depth` | `integer` | no | 2 | Graph traversal depth (max 4) |
| `semantic_limit` | `integer` | no | 10 | Max premise nodes from search (max 25) |
| `max_context_tokens` | `integer` | no | 4096 | Token budget for context assembly |
| `start_node` | `string` | no | — | Anchor the reasoning from a specific thought |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/reason" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is our privacy architecture strategy?",
    "depth": 3,
    "semantic_limit": 15,
    "max_context_tokens": 8192
  }'
```

**Response:**

```json
{
  "query": "What is our privacy architecture strategy?",
  "context": {
    "premise": [
      {"id": "...", "content": "...", "node_type": "decision", "score": 0.92}
    ],
    "evidence": [
      {"id": "...", "content": "...", "node_type": "pattern"}
    ],
    "relationships": [
      {"from_id": "...", "to_id": "...", "edge_type": "implements", "weight": 1.0}
    ],
    "gaps": ["'encryption' not found in knowledge graph"]
  },
  "formatted_context": "=== KNOWLEDGE CONTEXT ===\n\n## Premise (directly relevant)\n...",
  "node_count": 12,
  "edge_count": 8,
  "approx_tokens": 3200,
  "method": "hybrid_rrf"
}
```

**Context Structure:**

| Field | Description |
|-------|-------------|
| `premise` | Directly relevant thoughts found via semantic search |
| `evidence` | Connected thoughts discovered via graph traversal |
| `relationships` | Edges between premise and evidence nodes |
| `gaps` | Query terms not found in any knowledge node |
| `formatted_context` | Pre-formatted text suitable for injection into an LLM prompt |

---

## Import

### Extract Conversations

Extract structured knowledge from raw conversation data using Claude models. Conversations are processed in batches of 5 per API call.

```
POST /import/extract
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `conversations` | `object[]` | yes | — | Array of conversation pairs |
| `quality` | `string` | no | `"balanced"` | Model quality: `fast` (Haiku), `balanced` (Sonnet), `deep` (Opus) |
| `api_key` | `string` | no | server default | Anthropic API key for extraction |

**Conversation Pair Object:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | yes | Conversation title |
| `user_message` | `string` | yes | User's message text |
| `assistant_message` | `string` | yes | Assistant's response text |
| `source` | `string` | yes | Origin identifier (e.g. `"chatgpt"`, `"claude"`) |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/import/extract" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "quality": "balanced",
    "conversations": [
      {
        "title": "Database architecture discussion",
        "user_message": "Should we use SurrealDB or PostgreSQL for graph storage?",
        "assistant_message": "SurrealDB has native graph traversal...",
        "source": "chatgpt"
      }
    ]
  }'
```

**Response:**

```json
{
  "extracted": [
    {
      "content": "[DECISION] SurrealDB chosen for graph storage: native traversal eliminates JOIN complexity",
      "node_type": "decision",
      "tags": ["database", "architecture"],
      "source_conversation": "Database architecture discussion",
      "relevance": 0.85
    }
  ],
  "stats": {
    "total_conversations": 1,
    "extracted_nodes": 1,
    "skipped": 0,
    "input_tokens": 450,
    "output_tokens": 120,
    "estimated_cost": 0.002
  }
}
```

Nodes with `relevance` below 0.3 are automatically skipped.

---

## Sessions

Sessions track Claude Code agent work sessions with device context.

### Create Session

```
POST /sessions
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | `string` | yes | Client-generated session identifier |
| `hostname` | `string` | no | Device hostname |
| `tailscale_ip` | `string` | no | Tailscale mesh IP |
| `device_type` | `string` | no | Device type identifier |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/sessions" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-2025-03-01-alpha",
    "hostname": "labs",
    "device_type": "mac"
  }'
```

**Response:**

```json
{
  "session": {
    "id": "...",
    "session_id": "session-2025-03-01-alpha",
    "hostname": "labs",
    "status": "active",
    "started_at": "2025-03-01T10:00:00Z"
  }
}
```

---

### List Sessions

```
GET /sessions
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 25 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/sessions?limit=10" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "sessions": [...],
  "count": 10
}
```

---

### Get Session

```
GET /sessions/:session_id
```

**Response:**

```json
{
  "session": { ... }
}
```

Returns `404` if the session does not exist.

---

### Update Session

Add topics, summaries, or open threads to an active session.

```
PATCH /sessions/:session_id
```

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `topics` | `string[]?` | Discussion topics covered |
| `summary` | `string?` | Session summary text |
| `open_threads` | `string[]?` | Unresolved threads |
| `slug` | `string?` | Human-readable session slug |

**Example:**

```bash
curl -s -X PATCH "https://api.synap.ing/api/v3/sessions/session-2025-03-01-alpha" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "topics": ["privacy architecture", "deployment strategy"],
    "slug": "privacy-deep-dive"
  }'
```

---

### End Session

Mark a session as completed with an optional summary.

```
POST /sessions/:session_id/end
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `summary` | `string` | no | Final session summary |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/sessions/session-2025-03-01-alpha/end" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"summary": "Defined privacy-first architecture. Decided on SurrealDB."}'
```

---

## Dialect Engine

The dialect engine learns a user's personal terminology and maps it to canonical concepts.

### Observe

Submit text for dialect analysis. The engine extracts vocabulary patterns and usage frequency.

```
POST /dialect/observe
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | `string` | yes | Text to analyze for dialect patterns |
| `session_id` | `string` | no | Associate observation with a session |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/dialect/observe" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Deploy the MAAP bundle to the mesh relay on hub"}'
```

---

### Vocabulary

Retrieve the learned dialect vocabulary for the current tenant.

```
GET /dialect/vocabulary
```

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/dialect/vocabulary" \
  -H "X-ARX-Key: $ARX_KEY"
```

---

### Decode

Translate a user's dialect text into canonical terminology.

```
POST /dialect/decode
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | `string` | yes | Dialect text to decode |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/dialect/decode" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "push the MAAP to hub"}'
```

---

### Map Term

Explicitly define a dialect mapping between a user term and its canonical meaning.

```
POST /dialect/map
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_term` | `string` | yes | The user's personal term |
| `canonical` | `string` | yes | The canonical/standard meaning |
| `examples` | `string[]` | no | Usage examples for context |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/dialect/map" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_term": "hub",
    "canonical": "infrastructure server (10.10.1.41)",
    "examples": ["deploy to hub", "hub is down"]
  }'
```

---

## Temporal Graph

Version history and thought evolution tracking.

### Create Version

Snapshot the current state of a thought before mutation.

```
POST /thoughts/:id/versions
```

**Example:**

```bash
curl -s -X POST "https://api.synap.ing/api/v3/thoughts/a1b2c3d4/versions" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "data": {
    "id": "...",
    "thought_id": "a1b2c3d4",
    "version": 1,
    "content": "...",
    "created_at": "2025-03-01T10:00:00Z"
  }
}
```

---

### List Versions

```
GET /thoughts/:id/versions
```

**Response:**

```json
{
  "data": {
    "versions": [...],
    "count": 3,
    "thought_id": "a1b2c3d4"
  }
}
```

---

### Get Specific Version

```
GET /thoughts/:id/versions/:version
```

Where `:version` is the integer version number.

---

### Supersede Thought

Create a new thought that explicitly replaces an existing one. Automatically creates a `supersedes` edge from the new thought to the old one.

```
POST /thoughts/:id/supersede
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `content` | `string` | yes | — | Content of the new thought |
| `node_type` | `string` | no | inherited | Node type for the replacement |
| `project` | `string` | no | — | Project grouping |
| `tags` | `string[]` | no | `[]` | Tags |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/thoughts/a1b2c3d4/supersede" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "[DECISION] Switched from PostgreSQL to SurrealDB (2025-03-15): Native graph traversal eliminates the need for recursive CTEs.",
    "tags": ["architecture", "database"]
  }'
```

**Response:** `201 Created` with the new thought in `data`.

---

### Thought Timeline

Full temporal view of a thought's evolution, including all versions and supersessions.

```
GET /thoughts/:id/timeline
```

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/thoughts/a1b2c3d4/timeline" \
  -H "X-ARX-Key: $ARX_KEY"
```

---

## Batch Operations

Bulk create and delete operations for high-throughput scenarios.

### Batch Create Thoughts

Create up to 100 thoughts in a single request. Embeddings are generated server-side for any thought that does not include one.

```
POST /batch/thoughts
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `thoughts` | `object[]` | yes | Array of thought inputs (max 100) |

**Thought Input Object:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `content` | `string` | yes | — | Thought content |
| `node_type` | `string` | no | `"thought"` | Node type |
| `project` | `string` | no | — | Project grouping |
| `tags` | `string[]` | no | `[]` | Tags |
| `source` | `string` | no | — | Origin identifier |
| `created_at` | `string` | no | now | ISO 8601 timestamp |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/batch/thoughts" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "thoughts": [
      {"content": "[INSIGHT] First insight", "tags": ["batch"]},
      {"content": "[INSIGHT] Second insight", "tags": ["batch"]}
    ]
  }'
```

**Response:**

```json
{
  "data": {
    "thoughts": [...],
    "count": 2
  }
}
```

---

### Batch Create Edges

Create up to 500 edges in a single request.

```
POST /batch/edges
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `edges` | `object[]` | yes | Array of edge inputs (max 500) |

**Edge Input Object:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `from_id` | `string` | yes | — | Source thought UUID |
| `to_id` | `string` | yes | — | Target thought UUID |
| `edge_type` | `string` | no | `"relates_to"` | Edge type |
| `weight` | `number` | no | 1.0 | Connection strength |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/batch/edges" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "edges": [
      {"from_id": "aaa...", "to_id": "bbb...", "edge_type": "relates_to"},
      {"from_id": "bbb...", "to_id": "ccc...", "edge_type": "leads_to"}
    ]
  }'
```

---

### Batch Delete Thoughts

Delete multiple thoughts in a single request.

```
DELETE /batch/thoughts
```

---

## Sync

Endpoints for offline-first clients that need delta synchronization.

### Sync Checkpoint

Get the current sync state — a timestamp and counts representing the latest graph state.

```
GET /sync/checkpoint
```

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/sync/checkpoint" \
  -H "X-ARX-Key: $ARX_KEY"
```

---

### Sync Changes

Retrieve thoughts modified since a given timestamp.

```
GET /sync/changes
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `since` | `string` | yes | — | ISO 8601 timestamp |
| `limit` | `integer` | no | 100 | Maximum results |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/sync/changes?since=2025-03-01T00:00:00Z&limit=50" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "thoughts": [...],
  "count": 12
}
```

---

## Audit

### Verify Provenance

Verify the tamper-evident provenance chain for a thought.

```
POST /audit/verify
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `thought_id` | `string` | yes | Thought UUID to verify |
| `as_of` | `string` | no | ISO 8601 timestamp for point-in-time verification |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/audit/verify" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"thought_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"}'
```

---

## Export

### MAAP Bundle Export

Export thoughts and edges as a MAAP (Multi-Agent ARX Protocol) bundle for cross-system transfer.

```
GET /bundles/export
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 50 | Maximum thoughts to include |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/bundles/export?limit=100" \
  -H "X-ARX-Key: $ARX_KEY"
```

---

## Enterprise

Enterprise endpoints require the `enterprise` tier. Requests from `personal` or `smb` tenants receive `403 Forbidden`.

### Accounts

#### List Accounts

```
GET /accounts
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 50 | Maximum results |
| `offset` | `integer` | 0 | Pagination offset |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/accounts?limit=20" \
  -H "X-ARX-Key: $ARX_KEY"
```

**Response:**

```json
{
  "accounts": [
    {
      "id": "...",
      "name": "Acme Corp",
      "domain": "acme.com",
      "industry": "Technology",
      "tier": "enterprise",
      "health_score": null,
      "created_at": "2025-03-01T10:00:00Z"
    }
  ],
  "count": 1
}
```

---

#### Create Account

```
POST /accounts
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | `string` | yes | — | Account name |
| `domain` | `string` | no | — | Company domain |
| `industry` | `string` | no | — | Industry vertical |
| `tier` | `string` | no | — | Account tier classification |
| `metadata` | `object` | no | `{}` | Arbitrary metadata |

**Example:**

```bash
curl -s "https://api.synap.ing/api/v3/accounts" \
  -H "X-ARX-Key: $ARX_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Corp", "domain": "acme.com", "industry": "Technology"}'
```

---

#### Get Account

```
GET /accounts/:id
```

---

#### Update Account

```
PATCH /accounts/:id
```

**Request Body:** Any subset of: `name`, `domain`, `industry`, `tier`, `health_score` (number), `metadata` (object).

---

#### Delete Account

```
DELETE /accounts/:id
```

---

#### Link Accounts

Create a relationship between two accounts.

```
POST /accounts/relate
```

---

#### Link Insight

Associate a knowledge graph thought with an account.

```
POST /accounts/insight
```

---

#### Account Graph

Each account has its own sub-graph of linked thoughts.

```
GET /accounts/:id/graph              # Full account graph
GET /accounts/:id/graph/thoughts     # List thoughts in account graph
POST /accounts/:id/graph/thoughts    # Add thought to account graph
POST /accounts/:id/graph/search      # Search within account graph
POST /accounts/:id/graph/auto-link   # Auto-link thoughts in account graph
GET /accounts/:id/graph/stats        # Account graph statistics
DELETE /accounts/:id/graph/thoughts/:thought_id  # Remove thought from account graph
```

---

### Contacts

#### List Contacts

```
GET /contacts
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 50 | Maximum results |
| `account_id` | `string` | — | Filter by account |

---

#### Create Contact

```
POST /contacts
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_id` | `string` | yes | Parent account UUID |
| `name` | `string` | yes | Contact name |
| `email` | `string` | no | Email address |
| `title` | `string` | no | Job title |
| `phone` | `string` | no | Phone number |
| `linkedin_url` | `string` | no | LinkedIn profile URL |
| `department` | `string` | no | Department |
| `source` | `string` | no | Data source |
| `source_url` | `string` | no | Source URL |
| `verified` | `boolean` | no | Whether contact is verified |
| `metadata` | `object` | no | Arbitrary metadata |

---

#### Get / Update / Delete Contact

```
GET    /contacts/:id
PATCH  /contacts/:id
DELETE /contacts/:id
```

---

### Signals

Market signals, competitive intelligence, and trigger events.

#### List Signals

```
GET /signals
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 50 | Maximum results |
| `account_id` | `string` | — | Filter by account |
| `severity` | `string` | — | Filter by severity (`low`, `medium`, `high`, `critical`) |
| `signal_type` | `string` | — | Filter by type |

---

#### Create Signal

```
POST /signals
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Signal title |
| `content` | `string` | yes | — | Signal content/details |
| `source` | `string` | yes | — | Data source |
| `signal_type` | `string` | yes | — | Signal classification |
| `account_id` | `string` | no | — | Associated account |
| `severity` | `string` | no | `"medium"` | Severity level |
| `metadata` | `object` | no | `{}` | Arbitrary metadata |

---

#### Get / Update / Delete Signal

```
GET    /signals/:id
PATCH  /signals/:id
DELETE /signals/:id
```

Update supports fields: `status`, `severity`, `title`, `content`, `confidence_score`, `matched_products`, `strategic_rationale`, `suggested_next_steps`, `approach_strategy`, `metadata`.

---

### Activities

Activity feed tracking user actions on enterprise entities.

#### List Activities

```
GET /activities
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 50 | Maximum results |
| `entity_type` | `string` | — | Filter by entity type |
| `entity_id` | `string` | — | Filter by entity ID |

---

#### Create Activity

```
POST /activities
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | `string` | yes | Action performed (e.g. `viewed`, `updated`, `created`) |
| `entity_type` | `string` | yes | Entity type (e.g. `account`, `contact`, `signal`) |
| `entity_id` | `string` | yes | Entity identifier |
| `details` | `object` | no | Action details |

---

### Opportunities

Sales pipeline and deal tracking.

#### List Opportunities

```
GET /opportunities
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `integer` | 50 | Maximum results |
| `account_id` | `string` | — | Filter by account |
| `stage` | `string` | — | Filter by stage |

---

#### Create Opportunity

```
POST /opportunities
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `account_id` | `string` | yes | — | Parent account UUID |
| `name` | `string` | yes | — | Opportunity name |
| `stage` | `string` | no | `"uap"` | Pipeline stage |
| `value` | `number` | no | — | Deal value |
| `unit_price` | `number` | no | — | Price per unit |
| `quantity` | `integer` | no | — | Unit count |
| `pxq` | `number` | no | — | Price x quantity |
| `mrr` | `number` | no | — | Monthly recurring revenue |
| `description` | `string` | no | — | Opportunity description |
| `priority` | `string` | no | — | Priority level |
| `win_probability` | `integer` | no | — | Win probability (0-100) |
| `products` | `string[]` | no | `[]` | Associated products |
| `close_date` | `string` | no | — | Expected close date (ISO 8601) |
| `source` | `string` | no | — | Lead source |

---

#### Get / Update / Delete Opportunity

```
GET    /opportunities/:id
PATCH  /opportunities/:id
DELETE /opportunities/:id
```

---

## Authentication Endpoints

These endpoints manage user accounts and API keys.

### Register

Create a new tenant with an owner account.

```
POST /auth/register
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | `string` | yes | Unique tenant slug (URL-safe) |
| `display_name` | `string` | yes | Display name |
| `email` | `string` | yes | Email address |
| `password` | `string` | yes | Password (min 8 characters) |

**Response:** Returns JWT tokens, API key, and tenant details.

---

### Login

Obtain JWT tokens with email and password.

```
POST /auth/login
```

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | `string` | yes |
| `password` | `string` | yes |

---

### Login with Apple

Authenticate via Sign in with Apple.

```
POST /auth/apple
```

---

### Refresh Token

Exchange a refresh token for new access and refresh tokens.

```
POST /auth/refresh
```

---

### Get Current User

```
GET /auth/me
```

Requires authentication. Returns the current user's profile and tenant information.

---

### Set Password

```
POST /auth/set-password
```

---

### Forgot Password

```
POST /auth/forgot-password
```

---

### Reset Password

```
POST /auth/reset-password
```

---

### Delete Account

```
DELETE /auth/delete-account
```

---

### API Keys

#### List Keys

```
GET /keys
```

#### Create Key

```
POST /keys
```

#### Revoke Key

```
DELETE /keys/:id
```

---

## WebSocket

Real-time graph events via WebSocket.

```
GET /ws
```

Connect to receive `GraphEvent` messages as thoughts and edges are created, updated, or deleted. Events include:

```json
{
  "tenant": "your-tenant-slug",
  "table": "thought",
  "action": "CREATE",
  "id": "a1b2c3d4-...",
  "data": { ... }
}
```

---

## Usage

### Get Usage Stats

```
GET /usage
```

Returns token and request usage statistics for the current tenant.
