# Semantic Search

## How it works

Every thought in your graph is converted to a 768-dimensional embedding vector using [nomic-embed-text-v1.5](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5). This model understands meaning — not just keywords.

When you search, your query is also embedded, and the server finds thoughts with the highest cosine similarity to your query vector.

## Example

You search for: *"that idea about making AI tools work together"*

This finds thoughts about:
- Cross-vendor AI coordination protocols
- MCP server architecture
- Plugin distribution strategies

Even though none of those thoughts contain the words "making AI tools work together."

## Scores

Results include a `distance` score from 0 to 1:

| Score | Meaning |
|-------|---------|
| 0.7+ | Strong match — very relevant |
| 0.5-0.7 | Related — worth reviewing |
| < 0.5 | Weak — probably not what you want |

## When to use semantic vs keyword

| Scenario | Use |
|----------|-----|
| You know the exact term | `arx_search` (keyword) |
| You remember the concept, not the words | `arx_similar` (semantic) |
| Looking for a specific tag like [DECISION] | `arx_search` (keyword) |
| Exploring related ideas broadly | `arx_similar` (semantic) |

## Auto-association

When a new thought is added, the server automatically runs a semantic search against existing thoughts. If any match with cosine similarity > 0.5, `relates_to` edges are created automatically. This is **Hebbian auto-association** — thoughts that fire together, wire together.
