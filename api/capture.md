# Capture & Manage

## arx_add

Add a new thought to your knowledge graph. The server auto-generates embeddings for semantic search.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `content` | string | Yes | Thought content (include [TAG] prefix) |

**Tag conventions:**
| Tag | Use for |
|-----|---------|
| `[DECISION]` | Architectural or strategic choices |
| `[PATTERN]` | Reusable learnings |
| `[INSIGHT]` | Key realizations |
| `[TASK]` | Action items |
| `[QUESTION]` | Open questions to revisit |
| `[SESSION]` | Work session summaries |
| `[RESEARCH]` | Prior art findings |

**Example prompt:** "Capture this as a decision: We chose VitePress for docs because it's markdown-native and has built-in search"

**What happens:**
1. Thought is saved with a unique UUID
2. Server generates an embedding vector (nomic-embed-text-v1.5)
3. Hebbian auto-association finds and links similar existing thoughts
4. Thought is immediately searchable via keyword and semantic search

---

## arx_update

Update an existing thought's content. The embedding is regenerated automatically.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Thought UUID |
| `content` | string | Yes | New content |

---

## arx_delete

Delete a thought and all its edges.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Thought UUID |

::: warning
Deletion is permanent. Edges connected to this thought are also removed.
:::
