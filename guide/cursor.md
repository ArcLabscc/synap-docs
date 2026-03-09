# Cursor

Synap connects to Cursor as an MCP server via `~/.cursor/mcp.json`.

## Setup

```bash
npx arx-setup
```

The setup CLI detects Cursor and writes the MCP config automatically. Restart Cursor to activate.

## Manual setup

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "arx": {
      "command": "npx",
      "args": ["-y", "arx-mcp-server"],
      "env": {
        "ARX_CONFIG": "~/.arx/config.json"
      }
    }
  }
}
```

## Usage

Cursor's agent mode can use ARX tools to search your knowledge graph, capture insights, and traverse connections — all within your coding workflow.
