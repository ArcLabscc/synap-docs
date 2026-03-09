# Server Setup

::: warning Work in Progress
Self-hosting guide is under development. Check back soon.
:::

## Overview

The ARX server is a Rust workspace with 5 crates:

| Crate | Purpose |
|-------|---------|
| `arx-server` | HTTP API server (Axum) |
| `arx-db` | SurrealDB data store |
| `arx-embed` | Embedding generation (nomic-embed-text-v1.5) |
| `arx-auth` | JWT auth + API key management |
| `arx-cli` | Command-line interface |

## Deployment

Detailed deployment instructions coming soon. The server runs as a systemd service and requires SurrealDB v3 running locally.
