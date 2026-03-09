# Server Configuration

::: warning Work in Progress
Configuration reference is under development. Check back soon.
:::

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SURREAL_URL` | `ws://localhost:8001` | SurrealDB connection |
| `SURREAL_USER` | `root` | SurrealDB username |
| `SURREAL_PASS` | — | SurrealDB password |
| `BIND_ADDR` | `0.0.0.0:9191` | Server listen address |
| `JWT_SECRET` | — | Secret for signing JWTs |
| `EMBEDDING_MODEL` | `nomic-embed-text-v1.5` | Model for embeddings |
