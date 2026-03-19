# VS Code (GitHub Copilot)

VS Code supports MCP servers through GitHub Copilot's agent mode.

## Setup

Add to your VS Code settings or `.vscode/mcp.json`:

```json
{
  "servers": {
    "arx": {
      "command": "~/.local/bin/synap-mcp",
      "args": ["-y", "arx-mcp-server"],
      "env": {
        "ARX_CONFIG": "~/.arx/config.json"
      }
    }
  }
}
```

## Usage

In Copilot Chat, use agent mode (`@workspace` or chat participants) to access ARX tools. Ask Copilot to search your knowledge graph or capture insights during code reviews.

::: tip
VS Code MCP support is evolving. Check the [VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for the latest configuration format.
:::
