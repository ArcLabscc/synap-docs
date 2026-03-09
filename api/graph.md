# Graph Traversal

## arx_edges

List all edges (connections) for a thought. Returns both incoming and outgoing connections.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Thought UUID |

**Returns:** Array of edges with source ID, target ID, edge type, and connected thought content.

---

## arx_link

Create an edge between two thoughts.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `from_id` | string | Yes | Source thought UUID |
| `to_id` | string | Yes | Target thought UUID |
| `edge_type` | string | No | Connection type (default: `relates_to`) |

**Edge types:**
| Type | Meaning |
|------|---------|
| `relates_to` | General connection |
| `leads_to` | Causal relationship (A caused B) |
| `blocks` | Dependency (A blocks B) |
| `implements` | Realization (A implements B) |
| `supersedes` | Evolution (A replaces B) |
| `references` | Citation (A mentions B) |

**Example prompt:** "Link the auth decision to the rate limiting pattern"

---

## arx_traverse

Walk the knowledge graph from a starting thought, following edges N hops deep. Returns the subgraph around a node.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | Yes | Starting thought UUID |
| `depth` | number | No | Hops to traverse (default: 3) |

**Example prompt:** "Show me everything connected to that privacy architecture decision, 2 hops out"

**Returns:** Tree structure of connected thoughts with edge types at each level.

---

## arx_stats

Get knowledge graph statistics.

**Returns:**
```json
{
  "thoughts": 2681,
  "edges": 8780,
  "health": "ok"
}
```
