# Configuration

## Config file

All configuration lives in `~/.arx/config.json`:

```json
{
  "endpoint": "https://api.synap.ing",
  "api_key": "sk_your_api_key",
  "slug": "your-username"
}
```

| Field | Description | Required |
|-------|-------------|----------|
| `endpoint` | ARX server URL | Yes |
| `api_key` | Your API key (starts with `sk_`) | Yes |
| `slug` | Your username/tenant slug | Yes |

## Environment variables

The MCP server also accepts environment variables (override config file):

| Variable | Description |
|----------|-------------|
| `ARX_URL` | Server endpoint (overrides config) |
| `ARX_API_KEY` | API key (overrides config) |
| `ARX_CONFIG` | Path to config file (default: `~/.arx/config.json`) |

## Self-hosted endpoint

To point at your own ARX server instead of `api.synap.ing`:

```json
{
  "endpoint": "http://your-server:9191",
  "api_key": "sk_your_local_key",
  "slug": "admin"
}
```

See [Self-Hosting](/self-hosting/overview) for server setup instructions.

## API key management

Your API key is created during account registration and returned on login. To rotate your key:

1. Log into the Synap dashboard at `app.synap.ing`
2. Navigate to Settings > API Keys
3. Generate a new key
4. Run `synap setup` again to update all tools

::: warning
API keys are sensitive credentials. Never commit them to version control or share them publicly.
:::
