# Claude Desktop

Synap connects to Claude Desktop as an MCP server, giving Claude access to your knowledge graph in every conversation.

## Setup

```bash
npx arx-setup
```

The setup CLI detects Claude Desktop and adds the MCP server config to:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Restart Claude Desktop to activate.

## Manual setup

If you prefer to configure manually, add this to your Claude Desktop config:

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

Once configured, Claude Desktop has access to all 11 ARX tools. Just talk naturally:

- "Search my knowledge graph for notes about deployment"
- "What patterns have I captured about API design?"
- "Save this thought: the key insight about caching is..."

## Verifying

After restart, check that the ARX tools appear in Claude Desktop's tool list (click the hammer icon). You should see tools starting with `arx_`.
