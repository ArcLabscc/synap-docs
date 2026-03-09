# Privacy Architecture

## Principle

Your knowledge graph is yours. Synap is designed with **privacy by architecture** — not privacy by policy.

## How your data flows

```
Your AI Tool → MCP Server (your machine) → ARX API → Your Graph
```

- The MCP server runs on **your machine** as a local process
- It connects to the ARX API over HTTPS with your API key
- Your thoughts are stored in **your tenant's namespace** — isolated from other users
- No data is shared between tenants
- Your data is never used to train models

## Hosting options

| Option | Where data lives | Who controls it |
|--------|-----------------|-----------------|
| **Cloud** (default) | `api.synap.ing` | Arc Labs (encrypted at rest) |
| **Self-hosted** | Your server | You (full control) |

## Self-hosted mode

For maximum privacy, run the ARX server yourself. Your data never leaves your infrastructure:

```bash
# Point your config at your own server
{
  "endpoint": "http://your-server:9191",
  "api_key": "sk_your_local_key",
  "slug": "admin"
}
```

See [Self-Hosting](/self-hosting/overview) for setup instructions.

## What we collect

- **Account info** — Email, username (for authentication)
- **Usage metrics** — Request counts (for rate limiting and billing)
- **No content** — We do not read, analyze, or use your thought content

## What we don't do

- We don't train models on your data
- We don't share data between tenants
- We don't sell data to third parties
- We don't have "anonymous analytics" on thought content
