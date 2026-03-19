# Quickstart

Get Synap connected in under 60 seconds.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- At least one AI tool installed (Claude Code, Claude Desktop, Cursor, or VS Code)

## Install

```bash
curl -fsSL https://get.synap.ing | sh
```

This will:
1. Prompt for your email and password (or create a new account)
2. Authenticate against `api.synap.ing`
3. Write your config to `~/.arx/config.json`
4. Detect installed AI tools and configure them automatically
5. Verify the connection

## Verify

After setup, restart your AI tool and try a search:

**In Claude Code:**
```
Ask Claude: "Search my ARX for recent decisions"
```

Claude will use the `arx_search` MCP tool automatically.

**Or use the slash command (if plugin installed):**
```
/arx recent decisions
```

## What just happened?

The setup CLI:

1. Created `~/.arx/config.json` with your API key and endpoint
2. Added `ARX_URL` and `ARX_API_KEY` to your Claude Code settings
3. Configured `arx-mcp-server` as an MCP server in Claude Desktop (if installed)
4. Did the same for Cursor (if installed)

The MCP server is installed as a compiled binary via the installer. Run `synap setup` to configure it for your AI tools.

## Next steps

- [Capture your first thought](/guide/claude-code#capturing-thoughts)
- [Understand the knowledge graph](/concepts/knowledge-graph)
- [Explore all MCP tools](/api/overview)
- [Install the iOS app](/guide/ios-app)
