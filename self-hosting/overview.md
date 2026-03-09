# Self-Hosting

Run the ARX server on your own infrastructure for full control over your knowledge graph.

## Requirements

- Linux server (Ubuntu 22.04+ recommended)
- 2GB RAM minimum
- Rust toolchain (for building from source)
- SurrealDB v3

## Architecture

```
Your Machine (MCP Server) → Your Server (ARX API) → SurrealDB
```

The ARX server is a Rust binary that exposes the same API as `api.synap.ing`. Point your `~/.arx/config.json` at your server instead of the cloud.

## Quick start

::: warning Work in Progress
Self-hosting documentation is actively being developed. The ARX server source will be available at [github.com/ArcLabscc/arx-server](https://github.com/ArcLabscc/arx-server) when ready.
:::

See [Server Setup](/self-hosting/server) and [Configuration](/self-hosting/config) for detailed instructions.
