# MCP Tools Overview

Synap exposes 11 MCP tools through the `arx-mcp-server`. Your AI uses these tools automatically — you don't need to call them directly.

## Tools at a glance

| Tool | Description | Use when... |
|------|-------------|-------------|
| `arx_search` | Keyword search | You know the exact words |
| `arx_similar` | Semantic search | You remember the gist |
| `arx_add` | Create a thought | Capturing insights |
| `arx_get` | Get by ID | Fetching a specific node |
| `arx_update` | Edit content | Correcting or expanding |
| `arx_delete` | Remove thought | Cleaning up |
| `arx_list` | Recent thoughts | Browsing latest |
| `arx_edges` | List connections | Exploring relationships |
| `arx_link` | Create connection | Linking related ideas |
| `arx_traverse` | Walk the graph | Deep exploration |
| `arx_stats` | Graph statistics | Health check |

## How your AI uses them

You don't need to remember tool names. Just describe what you want:

| You say | Tool used |
|---------|-----------|
| "What did I decide about caching?" | `arx_search` or `arx_similar` |
| "Find things related to privacy" | `arx_similar` |
| "Remember this: we chose Rust for..." | `arx_add` |
| "Show me what connects to that idea" | `arx_edges` + `arx_traverse` |
| "Link those two thoughts together" | `arx_link` |
| "How many thoughts do I have?" | `arx_stats` |

## Authentication

The MCP server reads credentials from `~/.arx/config.json` (written by `synap setup`). Requests are authenticated via the `X-ARX-Key` header with your API key.
