# Installation

## Automatic (recommended)

```bash
npx arx-setup
```

The setup CLI detects your AI tools and configures everything. Supports:
- Claude Code
- Claude Desktop
- Cursor

### Creating an account

When prompted, choose **(C)reate account**:

```
  Connect to ARX

  (L)ogin or (C)reate account? [L/c]: c

  Email: you@example.com
  Password: ********
  Choose a username (slug): yourname

  ✓ Account created: yourname
  ✓ Config saved to ~/.arx/config.json
  ✓ Claude Code settings.json — ARX env vars configured
  ✓ ARX server is reachable

  Setup Complete!
```

### Logging into an existing account

Choose **(L)ogin** and enter your credentials:

```
  (L)ogin or (C)reate account? [L/c]: L

  Email: you@example.com
  Password: ********

  ✓ Logged in as: yourname
```

## Manual configuration

If you prefer to configure manually:

### 1. Config file

Create `~/.arx/config.json`:

```json
{
  "endpoint": "https://api.synap.ing",
  "api_key": "sk_your_api_key_here",
  "slug": "your-username"
}
```

Set restrictive permissions:
```bash
chmod 600 ~/.arx/config.json
```

### 2. Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "env": {
    "ARX_URL": "https://api.synap.ing",
    "ARX_API_KEY": "sk_your_api_key_here"
  }
}
```

### 3. Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### 4. Cursor

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

## Multiple devices

Run `npx arx-setup` on each device. Login with the same account — all devices share the same knowledge graph.

## Updating

The MCP server runs via `npx`, which always pulls the latest version. No manual updates needed.

To update the setup CLI itself:

```bash
npx arx-setup@latest
```

## Uninstalling

1. Remove `~/.arx/` directory
2. Remove the `arx` entry from your MCP config files
3. Remove `ARX_URL` and `ARX_API_KEY` from Claude Code settings
