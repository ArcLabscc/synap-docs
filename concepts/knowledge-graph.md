# Knowledge Graph

## Why a graph?

Flat notes lose relationships. A decision you made in January connects to an insight from March — but in a notes app, they're just two files. In a graph, that connection is a first-class citizen you can traverse, query, and visualize.

## Structure

Your knowledge graph has two primitives:

### Thoughts (nodes)

A thought is any piece of knowledge: a decision, pattern, insight, question, or observation.

```
[DECISION] Use Knowledge Graph Over Flat Notes (2026-03-07):
Chose a graph-based knowledge structure (nodes + edges) over
traditional flat notes. Trade-off: slightly more complex capture,
but dramatically better retrieval.
```

Each thought has:
- **UUID** — Unique identifier
- **Content** — The text (with [TAG] prefix)
- **Embedding** — 768-dimensional vector for semantic search
- **Created/Updated** — Timestamps
- **Status** — Active, archived, or completed

### Edges (connections)

Edges connect thoughts with typed relationships:

```
[DECISION] Use SurrealDB  --implements-->  [PATTERN] Graph-native storage
[INSIGHT] Privacy wedge   --leads_to-->    [STRATEGY] Open-source ARX
[TASK] Add rate limiting  --blocks-->      [TASK] Launch beta
```

## How it grows

1. **Manual capture** — You tell your AI to save a thought
2. **Hebbian auto-association** — When a new thought is added, the server finds similar existing thoughts and creates `relates_to` edges automatically (cosine similarity > 0.5)
3. **AI-suggested links** — Your AI can suggest connections based on conversation context
4. **Memory consolidation** — Background processes identify orphan nodes, detect patterns, and strengthen frequently-traversed paths

## Querying

Two search modes:

- **Keyword** (`arx_search`) — Full-text search, fast and exact
- **Semantic** (`arx_similar`) — Embedding similarity, finds conceptually related content even with different wording

Graph traversal (`arx_traverse`) walks edges from any starting node, revealing the neighborhood of connected ideas.
