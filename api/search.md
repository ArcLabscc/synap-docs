# Search & Recall

## arx_search

Keyword search across your knowledge graph. Fast, exact matching.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search keywords |
| `limit` | number | No | Max results (default: 10) |

**Example prompt:** "Search my ARX for authentication patterns"

**Returns:** Array of matching thoughts with content, dates, and IDs.

---

## arx_similar

Semantic search — find thoughts by meaning, not just keywords. Uses embedding similarity to find conceptually related content.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Natural language description |
| `limit` | number | No | Max results (default: 10) |

**Example prompt:** "What was that idea I had about making AI remember things?"

**Returns:** Array of thoughts ranked by cosine similarity score (0-1). Higher scores = more relevant.

::: tip When to use which
- **arx_search** — You know the exact term: "SurrealDB deadlock"
- **arx_similar** — You know the concept: "that database concurrency issue we hit"
:::

---

## arx_list

List recent thoughts from your knowledge graph, ordered by creation date.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `limit` | number | No | Number of thoughts (default: 10) |

**Example prompt:** "Show me my last 5 thoughts"
